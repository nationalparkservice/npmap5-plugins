import toString from './anyToString';

describe('toString', () => {
    test('converts number to string', () => {
        expect(toString(123)).toBe('123');
    });

    test('converts string to string', () => {
        expect(toString('hello')).toBe('hello');
    });

    test('converts null to empty string', () => {
        expect(toString(null)).toBe('');
    });

    test('converts undefined to empty string', () => {
        expect(toString(undefined)).toBe('');
    });

    test('stringifies object', () => {
        expect(toString({ a: 1 })).toBe('{"a":1}');
    });

    test('circular JSON', () => {
        const circularJson: { [key: string]: any } = { 'a': 1 };
        circularJson.b = circularJson;
        expect(toString(circularJson)).toBe('[object Object]');
    });
});