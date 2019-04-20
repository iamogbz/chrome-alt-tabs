import { log, wrapIndex } from "utils/base";

describe("log", (): void => {
    const consoleLogSpy = jest.spyOn(console, "log");
    const consoleErrorSpy = jest.spyOn(console, "error");
    const defaultLogSpy = jest.spyOn(log, "default");

    beforeEach(jest.clearAllMocks);

    it("calls default logger", (): void => {
        const args = [1, "two", "3"];
        log(...args);
        expect(defaultLogSpy).toHaveBeenCalledWith(...args);
    });

    it("prints to default console", (): void => {
        const args = [2, "three", "4"];
        log.default(...args);
        expect(consoleLogSpy).toHaveBeenCalledWith(...args);
    });

    it("prints to error console", (): void => {
        const args = [3, "four", "5"];
        log.error(...args);
        expect(consoleErrorSpy).toHaveBeenCalledWith(...args);
    });
});

describe("wrapIndex", () => {
    it.each([[1, 7, 1], [1, 1, 0], [-2, 3, 1], [-7, 4, 1], [7, 2, 1]])(
        "returns correctly wrapped index for index [%s] in size (%s)",
        (index, size, expected) => {
            expect(wrapIndex({ index, size })).toEqual(expected);
        },
    );
});
