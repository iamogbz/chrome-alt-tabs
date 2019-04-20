import { moveTabs, undo } from "background/actions";

describe("actions", () => {
    describe("move tabs", () => {
        const tabIds = [33, 22, 11];
        const mockTabs = tabIds.map(id => ({ id } as ChromeTab));

        it("creates valid action with no target", () => {
            expect(moveTabs({ tabs: mockTabs, from: 1 })).toMatchSnapshot();
        });

        it("creates valid action with no source", () => {
            expect(moveTabs({ tabs: mockTabs, to: 2 })).toMatchSnapshot();
        });

        it.each([null, undefined, []].map(v => [v]))(
            "fails to create invalid action for tabs:%s",
            async tabs => {
                expect(() => {
                    moveTabs({ tabs, from: 1, to: 2 });
                }).toThrowErrorMatchingSnapshot();
            },
        );
    });

    describe("undo", () => {
        it("creates valid action", () => {
            expect(undo()).toMatchSnapshot();
        });
    });
});
