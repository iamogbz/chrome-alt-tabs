const prefixCommand = (command: string): string => `tabs-move-${command}`;
const commandKeys = ["out", "back", "next", "prev"];
export const COMMANDS: { [key: string]: string } = commandKeys.reduce(
  (commands, key) => ({ ...commands, [key.toUpperCase()]: prefixCommand(key) }),
  {} as Record<string, string>,
);

export const UNDO_LIMIT = 10;
