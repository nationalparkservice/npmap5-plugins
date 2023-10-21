import anyToNumber from './anyToNumber';

describe('toNumber', () => {
    test('converts string number to number', () => {
        expect(anyToNumber('23423.23')).toBe(23423.23);
    });

    test('converts number to number', () => {
        expect(anyToNumber(865.45)).toBe(865.45);
    });

    test('converts string to string', () => {
        expect(anyToNumber('hello')).toBe(0);
    });

    test('converts string to string', () => {
        expect(anyToNumber('he11o')).toBe(0);
    });

    test('converts null to default number', () => {
        expect(anyToNumber(null)).toBe(0);
    });

    test('converts undefined to default number', () => {
        expect(anyToNumber(undefined, 10)).toBe(10);
    });

    test('converts object to default number', () => {
        expect(anyToNumber({ a: 1 })).toBe(0);
    });
});