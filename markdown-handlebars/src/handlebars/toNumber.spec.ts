import toNumber from './toNumber';

describe('convertToString', () => {
    test('should convert json to string', () => {
        const json = { 'a': 1, 'b': 2 }
        expect(toNumber(json, {} as any)).toBe(0);
    });

    test('should convert a float to a string', () => {
        expect(toNumber(65, {} as any)).toBe(65);
    });

    test('undefined should return blank', () => {
        expect(toNumber(undefined, {} as any)).toBe(0);
    });

    test('converts string to string', () => {
        expect(toNumber('hello', {} as any)).toBe(0);
    });

    test('converts string to string', () => {
        expect(toNumber('he11o', {} as any)).toBe(0);
    });

    test('converts null to default number', () => {
        expect(toNumber(null, {} as any)).toBe(0);
    });

    test('converts object to default number', () => {
        expect(toNumber({ a: 1 }, {} as any)).toBe(0);
    });
});