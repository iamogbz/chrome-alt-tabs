import { wrapIndex } from "./base";

/**
 * Register callback to be run on command received
 */
export const onCommand = (callback: (command: string) => unknown): void =>
  chrome.commands.onCommand.addListener(callback);

/**
 * Get all registered chrome commands
 */
export const getAllCommands = (): Promise<chrome.commands.Command[]> =>
  new Promise((resolve) => chrome.commands.getAll(resolve));

/**
 * Change current tab location
 */
export const changeTabUrl = (url: string): Promise<ChromeTab> =>
  new Promise((resolve) => chrome.tabs.update({ url }, resolve));

/**
 * Bring window to forefront
 */
export const focusOnWindow = (windowId: number): Promise<unknown> =>
  new Promise((resolve) => {
    chrome.windows.update(windowId, { focused: true }, resolve);
  });

/**
 * Focus on tab using unique id; will highlight the tab by default
 */
export const focusOnTab = (tabId: number): Promise<ChromeTab> =>
  new Promise((resolve) => {
    chrome.tabs.update(tabId, { active: true }, resolve);
  });

/**
 * Move tab into a window
 */
const moveTabToWindow = (
  tabId: number,
  windowId: number,
  index = -1
): Promise<ChromeTab> =>
  new Promise((resolve) => {
    chrome.tabs.move(tabId, { windowId, index }, resolve);
  });

/**
 * Move multiple tabs into a window restoring position if possible
 */
export const moveTabsToWindow = (
  tabs: ChromeTab[],
  windowId: number
): Promise<ChromeTab[]> =>
  Promise.all(
    tabs.map((tab) => {
      const index = tab.windowId === windowId ? tab.index : -1;
      return moveTabToWindow(tab.id, windowId, index);
    })
  );

/**
 * Highlight supplied tab
 */
const selectTab = (tabId: number): Promise<ChromeTab> =>
  new Promise((resolve) => {
    chrome.tabs.update(tabId, { highlighted: true }, resolve);
  });

/**
 * Select tabs by highlighting
 */
export const selectTabs = (tabIds: number[]): Promise<ChromeTab[]> =>
  Promise.all(tabIds.map(selectTab));

/**
 * Get window last focused on
 */
export const getLastFocusedWindow = (): Promise<ChromeWindow> =>
  new Promise((resolve) => chrome.windows.getLastFocused({}, resolve));

/**
 * Query chrome tabs api
 */
const queryTabs = (queryInfo: chrome.tabs.QueryInfo): Promise<ChromeTab[]> =>
  new Promise((resolve) => chrome.tabs.query(queryInfo, resolve));

/**
 * Get all tabs in specified window
 */
export const getAllTabsInWindow = (windowId: number): Promise<ChromeTab[]> =>
  queryTabs({ windowId });

/**
 * Get selected tabs in specified window
 */
export const getSelectedTabsInWindow = (
  windowId: number
): Promise<ChromeTab[]> =>
  queryTabs({
    highlighted: true,
    windowId,
  });

/**
 * Create window from existing tab
 */
export const createWindow = (tabId: number): Promise<ChromeWindow> =>
  new Promise((resolve) => chrome.windows.create({ tabId }, resolve));

/**
 * Get all windows of matching type, default to ["normal"]
 */
export const getAllWindows = (
  ...windowTypes: string[]
): Promise<ChromeWindow[]> => {
  if (windowTypes.length === 0) {
    windowTypes.push("normal");
  }
  return new Promise((resolve) => {
    chrome.windows.getAll({ windowTypes }, resolve);
  });
};

/**
 * Compare two window to determine order
 */
const compareWindowPositions = (
  windowA: ChromeWindow,
  windowB: ChromeWindow
): number => {
  const props = ["left", "top", "width", "height", "id"] as const;
  for (const prop of props) {
    const valueA: number = windowA[prop];
    const valueB: number = windowB[prop];
    if (valueA !== undefined && valueB !== undefined && valueA !== valueB) {
      return valueA - valueB;
    }
  }
  return 0;
};

/**
 * Get all window ids sorted
 */
const getSortedWindowIds = async (): Promise<number[]> => {
  const windows = await getAllWindows();
  windows.sort(compareWindowPositions);
  return windows.map(({ id }) => id).filter((id) => id);
};

/**
 * Get window in the direction of the position offset from supplied window id
 */
const getWindowInPositionFrom = async (
  windowId: number,
  offset: number
): Promise<number> => {
  const windowIds = await getSortedWindowIds();
  const index = windowIds.indexOf(windowId) + offset;
  return windowIds[wrapIndex({ index, size: windowIds.length })];
};

/**
 * Get window after supplied window id
 */
export const getWindowIdAfter = (id: number): Promise<number> =>
  getWindowInPositionFrom(id, 1);

/**
 * Get window before supplied window id
 */
export const getWindowIdBefore = (id: number): Promise<number> =>
  getWindowInPositionFrom(id, -1);
