const defaultLogger = (...args: any[]): void => console.log(...args); // eslint-disable-line
const errorLogger = (...args: any[]): void => console.error(...args); // eslint-disable-line

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
}): number => {
    if (index >= size) return size - index;
    if (index < 0) return size + index;
    return index;
};
