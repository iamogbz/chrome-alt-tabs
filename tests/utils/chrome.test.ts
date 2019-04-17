import * as chrome from "sinon-chrome";

import {
    changeTabUrl,
    commandListener,
    focusOnTab,
    getAllCommands,
    getAllTabsInWindow,
    moveTabsToWindow,
    onCommand,
    selectTabs,
} from "utils/chrome";

describe("chrome", () => {
    afterAll(chrome.flush);

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

        it("resolves to list of commands", () => {
            const commands = ["ctrl+a", "ctrl+b"];
            chrome.commands.getAll.yields(commands);
            expect(getAllCommands()).resolves.toEqual(commands);
            chrome.commands.getAll.flush();
        });
    });

    describe("tabs", () => {
        it("gets all tabs", () => {
            const tabs = ["mock-tab1", "mock-tab2"];
            chrome.tabs.query.yields(tabs);
            expect(getAllTabsInWindow(1)).resolves.toEqual(tabs);
            expect(chrome.tabs.query.withArgs({ windowId: 1 }).calledOnce).toBe(
                true,
            );
            chrome.tabs.query.flush();
        });

        it("changes tab url", () => {
            const targetUrl = "https://target.url";
            expect(changeTabUrl(targetUrl)).resolves.toBeUndefined();
            expectToHaveBeenCalledWith(chrome.tabs.update, { url: targetUrl });
        });

        it("focuses on tab", () => {
            expect(focusOnTab(10)).resolves.toBeUndefined();
            expectToHaveBeenCalledWith(chrome.tabs.update, 10, {
                active: true,
            });
        });

        it("selects tab", () => {
            const tabIds = [8, 9, 10];
            expect(selectTabs([8, 9, 10])).resolves.toBeUndefined();
            tabIds.forEach(tabId =>
                expectToHaveBeenCalledWith(chrome.tabs.update, tabId, {
                    highlighted: true,
                }),
            );
        });

        it("moves tabs to window", () => {
            const windowId = 1;
            const tabs = [8, 9, 10].map(
                (id, index) => ({ id, index, windowId } as ChromeTab),
            );
            expect(moveTabsToWindow(tabs, windowId)).resolves.toBeUndefined();
            tabs.forEach(t =>
                expectToHaveBeenCalledWith(chrome.tabs.update, t.id, {
                    highlighted: true,
                }),
            );
        });
    });

});
