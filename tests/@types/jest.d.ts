declare interface MockProp {
    mockClear(): void;
    mockReset(): void;
    mockRestore(): void;
    mockValue(v: any): MockProp;
    mockValueOnce(v: any): MockProp;
}

// tslint:disable-next-line
declare namespace jest {
    const prop: (value?: any) => MockProp;
    const spyOnProp: (object: AnyObject, propName: string) => MockProp;
}
