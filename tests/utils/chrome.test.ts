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
    getSelectedTabsInWindow,
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
            commandListener("no-binding");
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
            const windowId = 1;
            const tabs = ["mock-tab1", "mock-tab2"];
            const args = { windowId };
            chrome.tabs.query.withArgs(args).yields(tabs);
            await getAllTabsInWindow(windowId);
            expectToHaveBeenCalledWith(chrome.tabs.query, args);
        });

        it("gets selected tabs", async () => {
            const windowId = 2;
            const tabs = ["mock-tab3", "mock-tab4"];
            const args = { windowId, highlighted: true };
            chrome.tabs.query.withArgs(args).yields(tabs);
            await getSelectedTabsInWindow(windowId);
            expectToHaveBeenCalledWith(chrome.tabs.query, args);
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

        it("moves tabs to window keeps index", async () => {
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

        it("moves tabs to window places tabs at end", async () => {
            const windowId = 1;
            const tabs = [8, 9, 10].map(
                (id, index) => ({ id, index, windowId: 2 } as ChromeTab),
            );
            const moveTabsPromise = moveTabsToWindow(tabs, windowId);
            chrome.tabs.move.yield();
            await moveTabsPromise;
            tabs.forEach(t =>
                expectToHaveBeenCalledWith(chrome.tabs.move, t.id, {
                    index: -1,
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

        describe("positioning", () => {
            const mockWindows = [
                { id: 6, top: 400, left: 400, width: 720, height: 560 },
                { id: 1, top: 400, left: 400, width: 720, height: 560 },
                { id: 5, top: 400, left: 400, width: 640, height: 560 },
                { id: 2, top: 400, left: 400, width: 640, height: 480 },
                { id: 4, top: 400, left: 300, width: 640, height: 480 },
                { id: 3, top: 300, left: 300, width: 640, height: 480 },
                {},
            ];
            const order = [[6, 1], [1, 5], [5, 2], [2, 4], [4, 3], [3, 6]];

            beforeEach(() =>
                chrome.windows.getAll
                    .withArgs({ windowTypes: ["normal"] })
                    .yields(mockWindows),
            );
            afterEach(chrome.windows.getAll.flush);

            it.each(order)(
                "gets window before index %i",
                async (index, expected) => {
                    expect(await getWindowIdBefore(index)).toEqual(expected);
                },
            );

            it.each(order.map(([a, b]) => [b, a]))(
                "gets window after index %i",
                async (index, expected) => {
                    expect(await getWindowIdAfter(index)).toEqual(expected);
                },
            );
        });
    });
});
