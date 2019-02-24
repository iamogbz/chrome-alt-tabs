import {
    onCommand,
    getLastFocusedWindow,
    getSelectedTabsInWindow,
    getWindowAfter,
    getWindowBefore,
} from "../utils/chrome";
import { COMMANDS } from "./constants";
import { moveTabs, undo } from "./actions";
import handle from "./handler";

/**
 * Get the context of the current command activated
 * @returns {Promise}
 */
const getCommandContext = async () => {
    const currentWindow = await getLastFocusedWindow();
    const selectedTabs = await getSelectedTabsInWindow(currentWindow.id);
    return { currentWindow, selectedTabs };
};

/**
 * Wrap a function to be executed with the command context when activated
 * @param {Function} fn to be called with the command context
 */
const withCommandContext = async fn => {
    const {
        currentWindow: { id: windowId },
        selectedTabs,
    } = await getCommandContext();
    await fn({ windowId, selectedTabs });
};

const commandActions = [
    [
        COMMANDS.OUT,
        withCommandContext(({ windowId: from, selectedTabs: tabs }) => {
            handle(moveTabs({ tabs, from }));
        }),
    ],
    [
        COMMANDS.NEXT,
        withCommandContext(async ({ windowId: from, selectedTabs: tabs }) => {
            const { id: to } = await getWindowAfter(from);
            handle(moveTabs({ tabs, from, to }));
        }),
    ],
    [
        COMMANDS.PREV,
        withCommandContext(async ({ windowId: from, selectedTabs: tabs }) => {
            const { id: to } = await getWindowBefore(from);
            handle(moveTabs({ tabs, from, to }));
        }),
    ],
    [COMMANDS.UNDO, () => handle(undo())],
];
commandActions.forEach(args => onCommand(...args));
