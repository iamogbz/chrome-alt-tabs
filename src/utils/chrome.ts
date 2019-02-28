import { Tab, Window } from "../types";
import { wrapIndex } from "./base";

/**
 * Bind single oncommand listener and switch based on received
 */
const listeners: { [key: string]: Set<Function> } = {};
chrome.commands.onCommand.addListener(command => {
    (listeners[command] || []).forEach((callback: Function) => callback());
});

/**
 * Register callback to be run on specific command
 */
export const onCommand = (command: string, callback: Function): void => {
    if (!Object.keys(listeners).includes(command)) {
        listeners[command] = new Set();
    }
    listeners[command].add(callback);
};

/**
 * Get all registered chrome commands
 */
export const getAllCommands = (): Promise<chrome.commands.Command[]> =>
    new Promise(resolve => chrome.commands.getAll(resolve));

/**
 * Change current tab location
 */
export const changeTabUrl = (url: string): Promise<Tab> =>
    new Promise(resolve => chrome.tabs.update({ url }, resolve));

/**
 * Bring window to forefront
 */
export const focusOnWindow = (windowId: number) =>
    new Promise(resolve => {
        chrome.windows.update(windowId, { focused: true }, resolve);
    });

/**
 * Focus on tab using unique id; will highlight the tab by default
 */
export const focusOnTab = (tabId: number): Promise<Tab> =>
    new Promise(resolve => {
        chrome.tabs.update(tabId, { active: true }, resolve);
    });

/**
 * Move tab into a window
 */
const moveTabToWindow = (
    tabId: number,
    windowId: number,
    index: number = -1,
): Promise<Tab> =>
    new Promise(resolve => {
        chrome.tabs.move(tabId, { windowId, index }, resolve);
    });

/**
 * Move multiple tabs into a window restoring position if possible
 */
export const moveTabsToWindow = (
    tabs: Tab[],
    windowId: number,
): Promise<Tab[]> =>
    Promise.all(
        tabs.map(tab => {
            const index = tab.windowId === windowId ? tab.index : -1;
            return moveTabToWindow(tab.id, windowId, index);
        }),
    );

/**
 * Highlight supplied tab
 */
const selectTab = (tabId: number): Promise<Tab> =>
    new Promise(resolve => {
        chrome.tabs.update(tabId, { highlighted: true }, resolve);
    });

/**
 * Select tabs by highlighting
 */
export const selectTabs = (tabIds: number[]): Promise<Tab[]> =>
    Promise.all(tabIds.map(selectTab));

/**
 * Get window last focused on
 */
export const getLastFocusedWindow = (): Promise<Window> =>
    new Promise(resolve => chrome.windows.getLastFocused({}, resolve));

/**
 * Get selected tabs in specified window
 */
export const getSelectedTabsInWindow = (windowId: number): Promise<Tab[]> =>
    new Promise(resolve =>
        chrome.tabs.query(
            {
                highlighted: true,
                windowId,
            },
            resolve,
        ),
    );

/**
 * Create window from existing tab
 */
export const createWindow = (tabId: number): Promise<Window> =>
    new Promise(resolve => chrome.windows.create({ tabId }, resolve));

/**
 * Get all windows of matching type, default to ["normal"]
 */
const getAllWindows = (...windowTypes: string[]): Promise<Window[]> => {
    if (windowTypes.length === 0) {
        windowTypes.push("normal");
    }
    return new Promise(resolve => {
        chrome.windows.getAll({ windowTypes }, resolve);
    });
};

/**
 * Compare two window to determine order
 */
const compareWindowPositions = (windowA: Window, windowB: Window) => {
    const props = ["left", "top", "width", "height", "id"];
    while (props.length) {
        const prop = props.pop();
        const valueA = windowA[prop];
        const valueB = windowB[prop];
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
    return windows.map(({ id }) => id);
};

/**
 * Get window in the direction of the position offset from supplied window id
 */
const getWindowInPositionFrom = async (
    windowId: number,
    offset: number,
): Promise<{ id: number }> => {
    const windowIds = await getSortedWindowIds();
    const index = windowIds.indexOf(windowId) + offset;
    return { id: windowIds[wrapIndex({ index, size: windowIds.length })] };
};

/**
 * Get window after supplied window id
 */
export const getWindowAfter = (id: number): Promise<{ id: number }> =>
    getWindowInPositionFrom(id, 1);

/**
 * Get window before supplied window id
 */
export const getWindowBefore = (id: number): Promise<{ id: number }> =>
    getWindowInPositionFrom(id, -1);
