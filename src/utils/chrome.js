/**
 * Bind single oncommand listener and switch based on received
 */
const listeners = {};
chrome.commands.onCommand.addListener(command =>
    (listeners[command] || []).forEach(callback => callback()),
);
/**
 * Register callback to be run on specific command
 * @param {string} command activation trigger
 * @param {Function} callback to be run
 */
export const onCommand = (command, callback) => {
    if (!Object.keys(listeners).includes(command)) {
        listeners[command] = new Set();
    }
    listeners[command].add(callback);
};

/**
 * Bring window to forefront
 * @param {number} windowId
 */
export const focusOnWindow = windowId =>
    chrome.windows.update(windowId, { focused: true });

/**
 * Focus on tab using the unique chrome id
 * @param {int} tabId unique across multiple windows
 */
export const focusOnTab = tabId => chrome.tabs.update(tabId, { active: true });

/**
 * Move tab into a window
 * @param {[number]} tabIds
 * @param {number} windowId
 * @param {number} index position in window, defaults to last
 */
export const moveTabsToWindow = (tabIds, windowId, index = -1) =>
    chrome.tabs.move(tabIds, { windowId, index });

/**
 * Select tabs by highlighting
 * @param {[number]} tabIds list of tabs to select
 */
export const selectTabs = tabIds =>
    tabIds.forEach(id => chrome.tabs.update(id, { highlighted: true }));

/**
 * Get window last focused on
 * @returns {Promise<Window>}
 */
export const getLastFocusedWindow = () =>
    new Promise(resolve => chrome.windows.getLastFocused({}, resolve));

/**
 * Get selected tabs in specified window
 * @param {number} windowId
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
 * Get all windows of matching type
 * @param  {...string} windowTypes default to ["normal"]
 * @returns {Promise<[Window]>}
 */
export const getAllWindows = (...windowTypes) => {
    if (windowTypes.length === 0) {
        windowTypes.push("normal");
    }
    return new Promise(resolve => {
        chrome.windows.getAll({ windowTypes }, resolve);
    });
};

/**
 * Create window from existing tab
 * @param {number} tabId tab to move into new window
 * @returns {Promise<Window>}
 */
export const createWindow = tabId =>
    new Promise(resolve => chrome.windows.create({ tabId }, resolve));
