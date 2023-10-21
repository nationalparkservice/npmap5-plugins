import toString from './toString';

describe('convertToString', () => {
    test('should convert json to string', () => {
        const json = { 'a': 1, 'b': 2 }
        expect(toString(json, {} as any)).toBe(JSON.stringify(json));
    });

    test('should convert a float to a string', () => {
        expect(toString(65, {} as any)).toBe('65');
    });

    test('undefined should return blank', () => {
        expect(toString(undefined, {} as any)).toBe('');
    });
});