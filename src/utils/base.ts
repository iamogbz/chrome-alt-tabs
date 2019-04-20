const defaultLogger = (...args: any[]): void => console.log(...args); // tslint:disable-line
const errorLogger = (...args: any[]): void => console.error(...args); // tslint:disable-line

export const log = (...args: any[]): void => log.default(...args);
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
