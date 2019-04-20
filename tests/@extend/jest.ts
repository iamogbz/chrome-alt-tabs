export class MockProp implements MockProp {
    private object: AnyObject;
    private propName: string;
    private initialPropValue: any;
    private propValue: any;
    private propValues: any[] = [];

    constructor({
        object,
        propName,
    }: { object?: AnyObject; propName?: string } = {}) {
        this.object = object;
        this.propName = propName;
        this.initialPropValue = object ? object[propName] : undefined;
        this.propValue = this.initialPropValue;
        if (object) {
            const get = () => this.propValues.pop() || this.propValue;
            const set = (v: any) => this.mockValue(v);
            Object.defineProperty(object, propName, { get, set });
        }
    }

    public mockClear = (): void => {
        throw new Error("Nothing to clear");
    }

    public mockReset = (): void => {
        this.mockValue(this.initialPropValue);
    }

    public mockRestore = (): void => {
        if (!this.object) {
            throw new Error("Nothing to restore");
        }
        delete this.object[this.propName];
        this.object[this.propName] = this.initialPropValue;
    }

    public mockValue = (v: any): MockProp => {
        this.propValues = [];
        this.propValue = v;
        return this;
    }

    public mockValueOnce = (v: any): MockProp => {
        this.propValues.push(v);
        return this;
    }
}

export const extend = (jestInstance: typeof jest) => {
    Object.assign(jestInstance, {
        prop: (value?: any): MockProp => {
            const mockProp = new MockProp();
            mockProp.mockValue(value);
            return mockProp;
        },
        spyOnProp: (object: AnyObject, propName: string): MockProp =>
            new MockProp({ object, propName }),
    });
};
