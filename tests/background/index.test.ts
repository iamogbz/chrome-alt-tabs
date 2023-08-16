import * as chrome from "sinon-chrome";

import { commandActions, commandListener } from "background";
import { moveTabs, undo } from "background/actions";
import { COMMANDS } from "background/constants";
import * as handlers from "background/handler";
import * as chromeUtils from "utils/chrome";

const mockTabs = [11, 22, 33].map((id) => ({ id }) as ChromeTab);
const selectedTabs = mockTabs.slice(1);
const mockWindow = { id: 1 } as ChromeWindow;

const handleActionSpy = jest
  .spyOn(handlers, "handleAction")
  .mockResolvedValue();
jest.spyOn(chromeUtils, "getAllTabsInWindow").mockResolvedValue(mockTabs);
jest.spyOn(chromeUtils, "getLastFocusedWindow").mockResolvedValue(mockWindow);
const selectedTabsSpy = jest
  .spyOn(chromeUtils, "getSelectedTabsInWindow")
  .mockResolvedValue(selectedTabs);
jest.spyOn(chromeUtils, "getWindowIdAfter").mockResolvedValue(100);
jest.spyOn(chromeUtils, "getWindowIdBefore").mockResolvedValue(99);

describe("background", () => {
  afterEach(jest.clearAllMocks);
  afterAll(jest.restoreAllMocks);

  it("registers listener to chome oncommand", () => {
    expect(chrome.commands.onCommand.hasListener(commandListener)).toBe(true);
  });

  const expectedArgs = {
    [COMMANDS.OUT]: {
      some: moveTabs({ tabs: selectedTabs, from: 1 }),
    },
    [COMMANDS.NEXT]: {
      all: moveTabs({ tabs: mockTabs, from: 1, to: 100 }),
      some: moveTabs({ tabs: selectedTabs, from: 1, to: 100 }),
    },
    [COMMANDS.PREV]: {
      all: moveTabs({ tabs: mockTabs, from: 1, to: 99 }),
      some: moveTabs({ tabs: selectedTabs, from: 1, to: 99 }),
    },
    [COMMANDS.BACK]: { all: undo(), some: undo() },
  };

  it.each(Object.values(COMMANDS).map((v) => [v]))(
    "correctly handles action for '%s'",
    async (command) => {
      const commandSpy = jest.spyOn(commandActions, command);
      await commandListener(command);
      expect(commandSpy).toHaveBeenCalledTimes(1);
      const expected = expectedArgs[command].some;
      expect(handleActionSpy).toHaveBeenCalledWith(expected);
      commandSpy.mockRestore();
    },
  );

  it.each(Object.values(COMMANDS).map((v) => [v]))(
    "correctly handles action for '%s' when all tabs selected",
    async (command) => {
      const commandSpy = jest.spyOn(commandActions, command);
      selectedTabsSpy.mockResolvedValueOnce(mockTabs);
      await commandListener(command);
      expect(commandSpy).toHaveBeenCalledTimes(1);
      const expected = expectedArgs[command].all;
      if (!expected) {
        expect(handleActionSpy).not.toHaveBeenCalled();
      } else {
        expect(handleActionSpy).toHaveBeenCalledWith(expected);
      }
      commandSpy.mockRestore();
    },
  );

  it("handles undefined action", async () => {
    await commandListener("undefined-command");
    expect(handleActionSpy).not.toHaveBeenCalled();
  });
});
