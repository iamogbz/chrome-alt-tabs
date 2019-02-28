import { Action, Tab } from "../types";

export const MOVE_TABS = "move-tabs";
export const UNDO = "undo";

export const moveTabs = ({
    tabs,
    from,
    to = null,
}: {
    tabs: Tab[];
    from?: number;
    to?: number;
}): Action => {
    if (!tabs || !tabs.length || !from) {
        throw new Error(`Invalid Action Definition: move ${tabs} from ${from}`);
    }
    return {
        type: MOVE_TABS,
        payload: {
            from,
            tabs: tabs.map((t: Tab) => ({ ...t })),
            to,
        },
    };
};

/**
 * Create action to undo last
 */
export const undo = (): Action => ({ type: UNDO });
