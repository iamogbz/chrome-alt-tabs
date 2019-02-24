export const log = (...args) => console.error(...args); // eslint-disable-line

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
