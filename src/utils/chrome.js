import { wrapIndex } from "./base";

/**
 * Bind single oncommand listener and switch based on received
 */
const listeners = {};
chrome.commands.onCommand.addListener(command => {
    (listeners[command] || []).forEach(callback => callback());
});
/**
 * Register callback to be run on specific command
 * @param {String} command activation trigger
 * @param {Function} callback to be run
 */
export const onCommand = (command, callback) => {
    if (!Object.keys(listeners).includes(command)) {
        listeners[command] = new Set();
    }
    listeners[command].add(callback);
};

/**
 * Get all registered chrome commands
 */
export const getAllCommands = () =>
    new Promise(resolve => chrome.commands.getAll(resolve));

/**
 * Change current tab location
 */
export const changeTabUrl = url =>
    new Promise(resolve => chrome.tabs.update({ url }, resolve));

/**
 * Bring window to forefront
 * @param {Number} windowId
 */
export const focusOnWindow = windowId =>
    new Promise(resolve => {
        chrome.windows.update(windowId, { focused: true }, resolve);
    });

/**
 * Focus on tab using the unique chrome id
 * @param {Number} tabId unique across multiple windows
 */
export const focusOnTab = tabId =>
    new Promise(resolve => {
        chrome.tabs.update(tabId, { active: true }, resolve);
    });

/**
 * Move tab into a window
 * @param {Number} tabId
 * @param {Number} windowId
 * @param {Number} index position in window, defaults to last
 * @returns {Promise<[Tab]>}
 */
const moveTabToWindow = (tabId, windowId, index = -1) =>
    new Promise(resolve => {
        chrome.tabs.move(tabId, { windowId, index }, resolve);
    });

/**
 * Move multiple tabs into a window restoring position if possible
 * @param {[Tab]} tabs
 * @param {Number} windowId
 * @returns {Promise<[Tab]>}
 */
export const moveTabsToWindow = (tabs, windowId) =>
    Promise.all(
        tabs.map(tab => {
            const index = tab.windowId === windowId ? tab.index : -1;
            return moveTabToWindow(tab.id, windowId, index);
        }),
    );

/**
 * Highlight supplied tab
 * @param {Number} tabId
 * @returns {Promise}
 */
const selectTab = tabId =>
    new Promise(resolve => {
        chrome.tabs.update(tabId, { highlighted: true }, resolve);
    });

/**
 * Select tabs by highlighting
 * @param {[Number]} tabIds list of tabs to select
 * @returns {Promise}
 */
export const selectTabs = tabIds => Promise.all(tabIds.map(selectTab));

/**
 * Get window last focused on
 * @returns {Promise<Window>}
 */
export const getLastFocusedWindow = () =>
    new Promise(resolve => chrome.windows.getLastFocused({}, resolve));

/**
 * Get selected tabs in specified window
 * @param {Number} windowId
 * @returns {Promise<[Tabs]>}
 */
export const getSelectedTabsInWindow = windowId =>
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
 * @param {Number} tabId tab to move into new window
 * @returns {Promise<Window>}
 */
export const createWindow = tabId =>
    new Promise(resolve => chrome.windows.create({ tabId }, resolve));

/**
 * Get all windows of matching type
 * @param  {...string} windowTypes default to ["normal"]
 * @returns {Promise<[Window]>}
 */
const getAllWindows = (...windowTypes) => {
    if (windowTypes.length === 0) {
        windowTypes.push("normal");
    }
    return new Promise(resolve => {
        chrome.windows.getAll({ windowTypes }, resolve);
    });
};

/**
 * Compare two window to determine order
 * @param {Window} windowA
 * @param {Window} windowB
 */
const compareWindowPositions = (windowA, windowB) => {
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
 * @returns {Promise<[number]>}
 */
const getSortedWindowIds = async () => {
    const windows = await getAllWindows();
    windows.sort(compareWindowPositions);
    return windows.map(({ id }) => id);
};

/**
 * Get window in the direction of the position offset from supplied window id
 * @param {Number} windowId
 * @param {Number} offset
 * @returns {Promise<{ id: Number }>}
 */
const getWindowInPositionFrom = async (windowId, offset) => {
    const windowIds = await getSortedWindowIds();
    const index = windowIds.indexOf(windowId) + offset;
    return { id: windowIds[wrapIndex({ index, size: windowIds.length })] };
};

/**
 * Get window after supplied window id
 * @param {Number} id
 * @returns {Promise<{ id: Number }>}
 */
export const getWindowAfter = id => getWindowInPositionFrom(id, 1);

/**
 * Get window before supplied window id
 * @param {Number} id
 * @returns {Promise<{ id: Number }>}
 */
export const getWindowBefore = id => getWindowInPositionFrom(id, -1);
