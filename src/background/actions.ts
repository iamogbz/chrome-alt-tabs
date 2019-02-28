export const MOVE_TABS = "move-tabs";
export const UNDO = "undo";

/**
 * Create move tab action
 * @param {[Tab]} tabs list of Tabs
 * @param {Number} from Window Id
 * @param {Number} to Window Id
 */
export const moveTabs = ({ tabs, from, to = null }) => {
    if (!tabs || !tabs.length || !from) {
        throw new Error(`Invalid Action Definition: move ${tabs} from ${from}`);
    }
    return {
        type: MOVE_TABS,
        from,
        tabs: tabs.map(t => ({ ...t })),
        to,
    };
};

/**
 * Create action to undo last
 */
export const undo = () => ({ type: UNDO });
