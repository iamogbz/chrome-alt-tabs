const defaultLogger = (...args: unknown[]): void => console.log(...args); // eslint-disable-line no-console
const errorLogger = (...args: unknown[]): void => console.error(...args); // eslint-disable-line no-console

export const log = (...args: unknown[]): void => log.default(...args);
log.default = defaultLogger;
log.error = errorLogger;

/**
 * Wrap index around a specified size
 */
export const wrapIndex = ({
  index,
  size,
}: {
  index: number;
  size: number;
}): number => (index < 0 ? size : 0) + (index % size);
