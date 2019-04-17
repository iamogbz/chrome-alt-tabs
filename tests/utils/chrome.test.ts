import * as chrome from "sinon-chrome";

import {
    changeTabUrl,
    commandListener,
    createWindow,
    focusOnTab,
    focusOnWindow,
    getAllCommands,
    getAllTabsInWindow,
    getLastFocusedWindow,
    getWindowIdAfter,
    getWindowIdBefore,
    moveTabsToWindow,
    onCommand,
    selectTabs,
} from "utils/chrome";

describe("chrome", () => {
    afterEach(chrome.flush);

    const expectToHaveBeenCalledWith = (stub: any, ...args: any[]) => {
        expect(stub.withArgs(...args).calledOnce).toBe(true);
    };

    describe("commands", () => {
        it("registers listener to chome oncommand", () => {
            expect(chrome.commands.onCommand.hasListener(commandListener)).toBe(
                true,
            );
        });

        it("triggers all registered callbacks", () => {
            const mockCommand1 = "ctrl+1";
            const mockCommand2 = "ctrl+2";
            const mockCallbackA = jest.fn();
            const mockCallbackB = jest.fn();
            const mockCallbackC = jest.fn();
            onCommand(mockCommand1, mockCallbackA);
            onCommand(mockCommand1, mockCallbackB);
            onCommand(mockCommand2, mockCallbackC);
            commandListener(mockCommand1);
            expect(mockCallbackA).toHaveBeenCalledTimes(1);
            expect(mockCallbackB).toHaveBeenCalledTimes(1);
            expect(mockCallbackC).not.toHaveBeenCalled();
        });

        it("resolves to list of commands", async () => {
            const commands = ["ctrl+a", "ctrl+b"];
            chrome.commands.getAll.yields(commands);
            await getAllCommands();
            chrome.commands.getAll.flush();
        });
    });

    describe("tabs", () => {
        it("gets all tabs", async () => {
            const tabs = ["mock-tab1", "mock-tab2"];
            chrome.tabs.query.yields(tabs);
            await getAllTabsInWindow(1);
            expect(chrome.tabs.query.withArgs({ windowId: 1 }).calledOnce).toBe(
                true,
            );
            chrome.tabs.query.flush();
        });

        it("changes tab url", async () => {
            const targetUrl = "https://target.url";
            chrome.tabs.update.yields();
            await changeTabUrl(targetUrl);
            expectToHaveBeenCalledWith(chrome.tabs.update, { url: targetUrl });
        });

        it("focuses on tab", () => {
            expect(focusOnTab(10)).resolves.toBeUndefined();
            expectToHaveBeenCalledWith(chrome.tabs.update, 10, {
                active: true,
            });
        });

        it("selects tab", async () => {
            const tabIds = [8, 9, 10];
            const selectTabsPromise = selectTabs([8, 9, 10]);
            chrome.tabs.update.yield();
            await selectTabsPromise;
            tabIds.forEach(tabId =>
                expectToHaveBeenCalledWith(chrome.tabs.update, tabId, {
                    highlighted: true,
                }),
            );
        });

        it("moves tabs to window", async () => {
            const windowId = 1;
            const tabs = [8, 9, 10].map(
                (id, index) => ({ id, index, windowId } as ChromeTab),
            );
            const moveTabsPromise = moveTabsToWindow(tabs, windowId);
            chrome.tabs.move.yield();
            await moveTabsPromise;
            tabs.forEach((t, i) =>
                expectToHaveBeenCalledWith(chrome.tabs.move, t.id, {
                    index: i,
                    windowId,
                }),
            );
        });
    });

    describe("windows", () => {
        it("focuses on window", async () => {
            const windowId = 73;
            chrome.windows.update.yields();
            await focusOnWindow(windowId);
            expectToHaveBeenCalledWith(chrome.windows.update, windowId, {
                focused: true,
            });
        });

        it("gets last focused window", async () => {
            chrome.windows.getLastFocused.yields();
            await getLastFocusedWindow();
            expectToHaveBeenCalledWith(chrome.windows.getLastFocused, {});
        });

        it("creates new window", () => {
            const tabId = 11;
            expect(createWindow(tabId)).resolves.toBeUndefined();
            expectToHaveBeenCalledWith(chrome.windows.create, { tabId });
        });
    });
});
