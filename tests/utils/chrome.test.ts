import * as chrome from "sinon-chrome";

import { commandListener, onCommand } from "utils/chrome";

describe("chrome", () => {
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
    });
});
