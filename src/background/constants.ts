const prefixCommand = command => `tabs-move-${command}`;
const commandKeys = ["out", "back", "next", "prev"];
export const COMMANDS = commandKeys.reduce(
    (commands, key) =>
        Object.assign(commands, { [key.toUpperCase()]: prefixCommand(key) }),
    {},
);

export const UNDO_LIMIT = 10;
