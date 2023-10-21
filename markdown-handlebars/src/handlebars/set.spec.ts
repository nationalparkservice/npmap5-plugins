import set from "./set";

// Jest tests for the helper function
describe('set helper', () => {
    test('sets properties on the current context object', () => {
        const context = {};
        const options = { hash: { foo: 'bar', bar: 123 } };
        set.call(context, options as any);
        expect(context).toEqual({ foo: 'bar', bar: 123 });
    });

    test('should modify properties that already exist on the current context object if a newer value is available', () => {
        const context = { foo: 'qux', bar: 456 };
        const options = { hash: { foo: 'bar', bar: 123 } };
        set.call(context, options as any);
        expect(context).toEqual({ foo: 'bar', bar: 123 });
    });
});