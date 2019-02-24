const defaultLogger = (...args) => console.log(...args); // eslint-disable-line
const errorLogger = (...args) => console.error(...args); // eslint-disable-line

export const log = (...args) => log.default(...args);
log.default = defaultLogger;
log.error = errorLogger;

/**
 * Wrap index around a specified size
 * @param {{ index: Number, size: Number}} params
 * @returns {Number}
 */
export const wrapIndex = ({ index, size }) => {
    if (index >= size) return size - index;
    if (index < 0) return size + index;
    return index;
};
