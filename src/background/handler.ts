import { log } from "../utils/base";
import {
    createWindow,
    focusOnTab,
    focusOnWindow,
    moveTabsToWindow,
    selectTabs,
} from "../utils/chrome";
import { MOVE_TABS, UNDO, moveTabs } from "./actions";
import { UNDO_LIMIT } from "./constants";

const actionLog: Action[] = [];
const noActionOp = async (_: Action) => false;
const doActionHandlers: { [type: string]: ActionHandler } = {};
const undoActionHandlers: { [type: string]: ActionHandler } = {};

/**
 * Handle move action
 */
doActionHandlers[MOVE_TABS] = async (action: Action): Promise<boolean> => {
    const {
        payload: { tabs, to },
    } = action;
    const tabIds: number[] = [];
    let activeTab: number = null;
    tabs.forEach(({ id, active }: ChromeTab) => {
        if (active) activeTab = id;
        tabIds.push(id);
    });
    const windowId: number = to || (await createWindow(activeTab)).id;
    action.payload.to = windowId;
    await moveTabsToWindow(tabs, windowId).catch(e => log.error(e));
    await focusOnTab(activeTab || tabIds[0]);
    await selectTabs(tabIds);
    await focusOnWindow(windowId);
    return true;
};

/**
 * Undo the move action
 */
undoActionHandlers[MOVE_TABS] = async ({
    payload: { to, from, tabs },
}: Action): Promise<boolean> => {
    await doActionHandlers[MOVE_TABS](moveTabs({ from: to, tabs, to: from }));
    return false;
};

/**
 * Undo last action in the log
 */
doActionHandlers[UNDO] = async () => {
    const lastAction = actionLog.pop() || ({} as Action);
    const undoHandler = undoActionHandlers[lastAction.type] || noActionOp;
    await undoHandler(lastAction);
    return false;
};

/**
 * Execute action and store in log for undo if possible
 */
export const handleAction = async (action: Action): Promise<void> => {
    if (!action) return;
    const canUndo = await (doActionHandlers[action.type] || noActionOp)(action);
    if (canUndo) actionLog.push(action);
    if (actionLog.length > UNDO_LIMIT) actionLog.shift();
};
