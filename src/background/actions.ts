export const MOVE_TABS = "move-tabs";
export const UNDO = "undo";

export const moveTabs = ({
  tabs,
  from,
  to = null,
}: MoveTabAction["payload"]): MoveTabAction => {
  if (!tabs || !tabs.length) {
    throw new Error(
      `Invalid Action Definition: move ${tabs} (${from} => ${to})`,
    );
  }
  return {
    payload: {
      from,
      tabs: tabs.map((t) => ({ ...t })),
      to,
    },
    type: MOVE_TABS,
  };
};

/**
 * Create action to undo last
 */
export const undo = (): Action => ({ type: UNDO });
