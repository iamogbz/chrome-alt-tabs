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
const getCommandContext = async (): Promise<{
    currentWindow: ChromeWindow;
    selectedTabs: ChromeTab[];
}> => {
    const currentWindow = await getLastFocusedWindow();
    const selectedTabs = await getSelectedTabsInWindow(currentWindow.id);
    return { currentWindow, selectedTabs };
};

/**
 * Wrap a function to be executed with the command context when activated
 * @param {Function} fn to be called with the command context
 */
const withCommandContext = (fn: (...args: any[]) => void) => async () => {
    const {
        currentWindow: { id: windowId },
        selectedTabs,
    } = await getCommandContext();
    return fn({ windowId, selectedTabs });
};

const commandActions = {
    [COMMANDS.OUT]: withCommandContext(({ windowId, selectedTabs }) => {
        const from = windowId as number;
        const tabs = selectedTabs as ChromeTab[];
        handle(moveTabs({ tabs, from }));
    }),
    [COMMANDS.NEXT]: withCommandContext(
        async ({ windowId: from, selectedTabs: tabs }) => {
            const { id: to } = await getWindowAfter(from);
            handle(moveTabs({ tabs, from, to }));
        },
    ),
    [COMMANDS.PREV]: withCommandContext(
        async ({ windowId: from, selectedTabs: tabs }) => {
            const { id: to } = await getWindowBefore(from);
            handle(moveTabs({ tabs, from, to }));
        },
    ),
    [COMMANDS.BACK]: () => handle(undo()),
};
Object.keys(commandActions).forEach(type =>
    onCommand(type, commandActions[type]),
);
