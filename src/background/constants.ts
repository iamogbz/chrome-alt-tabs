const prefixCommand = (command: string): string => `tabs-move-${command}`;
const commandKeys = ["out", "back", "next", "prev"];
export const COMMANDS: { [key: string]: string } = commandKeys.reduce(
    (commands: string[], key: string) =>
        Object.assign(commands, { [key.toUpperCase()]: prefixCommand(key) }),
    {},
);

export const UNDO_LIMIT: number = 10;
