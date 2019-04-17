import { moveTabs, undo } from "background/actions";
import { handleAction } from "background/handler";
import { log } from "utils/base";
import * as chromeUtils from "utils/chrome";

const createWindowSpy = jest
    .spyOn(chromeUtils, "createWindow")
    .mockResolvedValue(null);
jest.spyOn(chromeUtils, "focusOnTab").mockResolvedValue(null);
jest.spyOn(chromeUtils, "focusOnWindow").mockResolvedValue(null);
jest.spyOn(chromeUtils, "moveTabsToWindow").mockResolvedValue(null);
jest.spyOn(chromeUtils, "selectTabs").mockResolvedValue(null);

describe("handler", () => {
    const sourceWindowId = 1;
    const targetWindowId = 2;
    const activeTabId = 11;
    const tabIds = [activeTabId, 22, 33];
    const mockTabs = tabIds.map(
        id => ({ id, active: id === activeTabId } as ChromeTab),
    );

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
        expect(chromeUtils.moveTabsToWindow).toHaveBeenCalledWith(
            mockTabs,
            targetWindowId,
        );
        expect(chromeUtils.focusOnTab).toHaveBeenCalledWith(activeTabId);
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
        expect(createWindowSpy).toHaveBeenCalledWith(activeTabId);
        expect(chromeUtils.moveTabsToWindow).toHaveBeenCalledWith(
            mockTabs,
            newWindowId,
        );
        expect(chromeUtils.focusOnTab).toHaveBeenCalledWith(activeTabId);
        expect(chromeUtils.selectTabs).toHaveBeenCalledWith(tabIds);
        expect(chromeUtils.focusOnWindow).toHaveBeenCalledWith(newWindowId);
    });
});
