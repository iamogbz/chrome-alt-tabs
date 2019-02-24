import {
    createWindow,
    focusOnTab,
    focusOnWindow,
    moveTabsToWindow,
    selectTabs,
} from "../utils/chrome";
import { UNDO_LIMIT } from "./constants";
import { MOVE_TABS, UNDO } from "./actions";

const noop = () => {};
const actionLog = [];
const actionHandlers = {};

/**
 * Handle move action
 * @param {{}} action
 * @returns {Promise<Boolean>}
 */
// TODO: save tab indexes
const doMove = async ({ tabs, to }) => {
    const tabIds = [];
    let activeTab = null;
    tabs.forEach(({ id, active }) => {
        if (active) activeTab = id;
        tabIds.push(id);
    });
    const windowId = to || (await createWindow(activeTab)).id;
    await moveTabsToWindow(tabIds, windowId).catch(e => console.warn(e));
    if (activeTab) await focusOnTab(activeTab);
    await selectTabs(tabIds);
    await focusOnWindow(windowId);
    return true;
};

/**
 * Undo the move action
 * @param {{}} action
 * @returns {Promise<Boolean>}
 */
doMove.undo = async ({ from, tabs, to }) => {
    await doMove({ from: to, tabs, to: from });
    return false;
};

/**
 * Undo last action in the log
 */
const undo = async () => {
    const lastAction = actionLog.pop();
    const handler = (lastAction && actionHandlers[lastAction.type]) || noop;
    if (typeof handler.undo === "function") {
        await handler.undo(lastAction);
    }
    return false;
};

// Map action types to handlers
Object.assign(actionHandlers, {
    [MOVE_TABS]: doMove,
    [UNDO]: undo,
});

/**
 * Execute action and store in log for undo if possible
 * @param {[{}]} action
 */
export default async function(action) {
    if (!action) return;
    const canUndo = await (actionHandlers[action.type] || noop)(action);
    if (canUndo) actionLog.push(action);
    if (actionLog.length > UNDO_LIMIT) actionLog.shift();
}
