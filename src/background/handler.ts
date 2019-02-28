import { Action, ActionHandler, Tab } from "../types";
import { log } from "../utils/base";
import {
    createWindow,
    focusOnTab,
    focusOnWindow,
    moveTabsToWindow,
    selectTabs,
} from "../utils/chrome";
import { UNDO_LIMIT } from "./constants";
import { MOVE_TABS, UNDO, moveTabs } from "./actions";

const noop = () => {};
const actionLog: Action[] = [];
const actionHandlers: { [type: string]: ActionHandler } = {};

/**
 * Handle move action
 */
const doMove = async ({ payload: { tabs, to } }: Action): Promise<boolean> => {
    const tabIds: number[] = [];
    let activeTab: number = null;
    tabs.forEach(({ id, active }: Tab) => {
        if (active) activeTab = id;
        tabIds.push(id);
    });
    const windowId: number = to || (await createWindow(activeTab)).id;
    await moveTabsToWindow(tabs, windowId).catch(e => log.error(e));
    await focusOnTab(activeTab || tabIds[0]);
    await selectTabs(tabIds);
    await focusOnWindow(windowId);
    return true;
};

/**
 * Undo the move action
 */
doMove.undo = async ({ payload: { from, tabs } }: Action): Promise<boolean> => {
    await doMove(moveTabs({ tabs, to: from }));
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
 */
export default async function(action: Action): Promise<void> {
    if (!action) return;
    const canUndo = await (actionHandlers[action.type] || noop)(action);
    if (canUndo) actionLog.push(action);
    if (actionLog.length > UNDO_LIMIT) actionLog.shift();
}
