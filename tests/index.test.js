import { helloWorld } from "../src";

describe("entry", () => {
    it("runs a test", () => {
        expect(helloWorld()).toMatchSnapshot();
    });
});
