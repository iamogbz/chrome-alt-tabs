import * as mockProps from "jest-mock-props";
mockProps.extend(jest);

import { moveTabs, undo } from "background/actions";
import * as constants from "background/constants";
import { handleAction } from "background/handler";
import { log } from "utils/base";
import * as chromeUtils from "utils/chrome";

const undoLimitSpy = jest.spyOnProp(constants, "UNDO_LIMIT").mockValue(1);
jest.spyOn(log, "error").mockImplementation(jest.fn());
const createWindowSpy = jest
    .spyOn(chromeUtils, "createWindow")
    .mockResolvedValue(null);
jest.spyOn(chromeUtils, "focusOnTab").mockResolvedValue(null);
jest.spyOn(chromeUtils, "focusOnWindow").mockResolvedValue(null);
const moveTabsToWindowSpy = jest
    .spyOn(chromeUtils, "moveTabsToWindow")
    .mockResolvedValue(null);
jest.spyOn(chromeUtils, "selectTabs").mockResolvedValue(null);

describe("handler", () => {
    const sourceWindowId = 1;
    const targetWindowId = 2;
    const activeTabId = 11;
    const tabIds = [33, 22, activeTabId];
    const mockTabs = tabIds.map(id => ({ id, active: false } as ChromeTab));
    const mockTabsActive = mockTabs.map(tab => ({
        ...tab,
        active: tab.id === activeTabId,
    }));

    beforeEach(jest.clearAllMocks);
    afterAll(jest.restoreAllMocks);

    it("is a noop without an action", async () => {
        await handleAction(null);
    });

    it("safely handles unknown action", async () => {
        await handleAction({ type: "unknown-action-type" });
    });

    it("performs move to existing window", async () => {
        const moveAction = moveTabs({
            from: sourceWindowId,
            tabs: mockTabs,
            to: targetWindowId,
        });
        await handleAction(moveAction);
        expect(moveTabsToWindowSpy).toHaveBeenCalledWith(
            mockTabs,
            targetWindowId,
        );
        expect(chromeUtils.focusOnTab).toHaveBeenCalledWith(tabIds[0]);
        expect(chromeUtils.selectTabs).toHaveBeenCalledWith(tabIds);
        expect(chromeUtils.focusOnWindow).toHaveBeenCalledWith(targetWindowId);
    });

    it("performs move to newly created window", async () => {
        const newWindowId = 99;
        const moveAction = moveTabs({
            from: sourceWindowId,
            tabs: mockTabs,
        });
        createWindowSpy.mockResolvedValueOnce({
            id: newWindowId,
        } as ChromeWindow);
        await handleAction(moveAction);
        expect(createWindowSpy).toHaveBeenCalledWith(null);
        expect(moveTabsToWindowSpy).toHaveBeenCalledWith(mockTabs, newWindowId);
        expect(chromeUtils.focusOnTab).toHaveBeenCalledWith(tabIds[0]);
        expect(chromeUtils.selectTabs).toHaveBeenCalledWith(tabIds);
        expect(chromeUtils.focusOnWindow).toHaveBeenCalledWith(newWindowId);
    });

    it("focuses on first tab if no tabs moved were active", async () => {
        const newWindowId = 99;
        const moveAction = moveTabs({
            from: sourceWindowId,
            tabs: mockTabsActive,
        });
        createWindowSpy.mockResolvedValueOnce({
            id: newWindowId,
        } as ChromeWindow);
        await handleAction(moveAction);
        expect(createWindowSpy).toHaveBeenCalledWith(activeTabId);
        expect(moveTabsToWindowSpy).toHaveBeenCalledWith(
            mockTabsActive,
            newWindowId,
        );
        expect(chromeUtils.focusOnTab).toHaveBeenCalledWith(activeTabId);
        expect(chromeUtils.selectTabs).toHaveBeenCalledWith(tabIds);
        expect(chromeUtils.focusOnWindow).toHaveBeenCalledWith(newWindowId);
    });

    it("logs error and does not fail if move tabs can not complete", async () => {
        const moveAction = moveTabs({
            from: sourceWindowId,
            tabs: mockTabs,
            to: targetWindowId,
        });
        const mockError = new Error("move failed");
        moveTabsToWindowSpy.mockRejectedValueOnce(mockError);
        await handleAction(moveAction);
        expect(moveTabsToWindowSpy).toHaveBeenCalledWith(
            mockTabs,
            targetWindowId,
        );
        expect(log.error).toHaveBeenCalledWith(mockError);
        expect(chromeUtils.focusOnTab).toHaveBeenCalledWith(tabIds[0]);
        expect(chromeUtils.selectTabs).toHaveBeenCalledWith(tabIds);
        expect(chromeUtils.focusOnWindow).toHaveBeenCalledWith(targetWindowId);
    });

    it("undoes last action", async () => {
        const moveAction = moveTabs({
            from: sourceWindowId,
            tabs: mockTabs,
            to: targetWindowId,
        });
        await handleAction(moveAction).then(() => handleAction(undo()));
        expect(moveTabsToWindowSpy).toHaveBeenCalledTimes(2);
        expect(moveTabsToWindowSpy).toHaveBeenLastCalledWith(
            mockTabs,
            sourceWindowId,
        );
        expect(chromeUtils.focusOnTab).toHaveBeenCalledTimes(2);
        expect(chromeUtils.focusOnTab).toHaveBeenLastCalledWith(tabIds[0]);
        expect(chromeUtils.selectTabs).toHaveBeenCalledTimes(2);
        expect(chromeUtils.selectTabs).toHaveBeenLastCalledWith(tabIds);
        expect(chromeUtils.focusOnWindow).toHaveBeenCalledTimes(2);
        expect(chromeUtils.focusOnWindow).toHaveBeenLastCalledWith(
            sourceWindowId,
        );
    });

    it("undoes only up to limit", async () => {
        undoLimitSpy.mockValue(2);
        const moveAction = moveTabs({
            from: sourceWindowId,
            tabs: mockTabs,
            to: targetWindowId,
        });
        const doMove = () => handleAction(moveAction);
        const undoMove = () => handleAction(undo());
        await doMove()
            .then(doMove)
            .then(doMove);
        expect(moveTabsToWindowSpy).toHaveBeenCalledTimes(3);
        expect(moveTabsToWindowSpy).toHaveBeenLastCalledWith(
            mockTabs,
            targetWindowId,
        );
        expect(chromeUtils.focusOnTab).toHaveBeenLastCalledWith(tabIds[0]);
        moveTabsToWindowSpy.mockClear();
        await undoMove()
            .then(undoMove)
            .then(undoMove);
        expect(moveTabsToWindowSpy).toHaveBeenCalledTimes(2);
        expect(moveTabsToWindowSpy).toHaveBeenLastCalledWith(
            mockTabs,
            sourceWindowId,
        );
        undoLimitSpy.mockReset();
    });
});
