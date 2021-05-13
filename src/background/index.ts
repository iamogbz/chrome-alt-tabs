import "crx-livereload";

import {
  getAllTabsInWindow,
  getLastFocusedWindow,
  getSelectedTabsInWindow,
  getWindowIdAfter,
  getWindowIdBefore,
  onCommand,
} from "utils/chrome";
import { moveTabs, undo } from "./actions";
import { COMMANDS } from "./constants";
import { handleAction } from "./handler";

/**
 * Get the context of the current command activated
 */
const getCommandContext = async (): Promise<{
  currentWindow: ChromeWindow;
  selectedTabs: ChromeTab[];
  allTabs: ChromeTab[];
}> => {
  const currentWindow = await getLastFocusedWindow();
  const [allTabs, selectedTabs] = await Promise.all([
    getAllTabsInWindow(currentWindow.id),
    getSelectedTabsInWindow(currentWindow.id),
  ]);
  return { currentWindow, selectedTabs, allTabs };
};

/**
 * Wrap a function to be executed with the command context when activated
 */
const withCommandContext =
  (
    fn: (arg: {
      windowId: number;
      selectedTabs: ChromeTab[];
      isAllTabsSelected: boolean;
    }) => void
  ) =>
  async () => {
    const { currentWindow, selectedTabs, allTabs } = await getCommandContext();
    const isAllTabsSelected = selectedTabs.length === allTabs.length;
    return fn({ windowId: currentWindow.id, selectedTabs, isAllTabsSelected });
  };

export const commandActions = {
  [COMMANDS.OUT]: withCommandContext(
    async ({ windowId, selectedTabs: tabs, isAllTabsSelected }) => {
      if (isAllTabsSelected) return;
      await handleAction(moveTabs({ tabs, from: windowId }));
    }
  ),
  [COMMANDS.NEXT]: withCommandContext(
    async ({ windowId, selectedTabs: tabs }) => {
      const from = windowId;
      const to = await getWindowIdAfter(from);
      await handleAction(moveTabs({ tabs, from, to }));
    }
  ),
  [COMMANDS.PREV]: withCommandContext(
    async ({ windowId, selectedTabs: tabs }) => {
      const from = windowId;
      const to = await getWindowIdBefore(from);
      await handleAction(moveTabs({ tabs, from, to }));
    }
  ),
  [COMMANDS.BACK]: async (): Promise<void> => {
    await handleAction(undo());
  },
};
const noop = (): void => undefined;
export const commandListener = (command: string): void =>
  (commandActions[command] || noop)();
onCommand(commandListener);
