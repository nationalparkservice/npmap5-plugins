import toKeyValueArray from "./toKeyValueArray";

describe('toKeyValueArray', () => {
    it('should convert an array to an array of key-value pairs', () => {
        expect(toKeyValueArray(['a', 'b', 'c'])).toEqual([[0, 'a'], [1, 'b'], [2, 'c']]);
    });

    it('should convert a Set to an array of key-value pairs with the same values for keys and values', () => {
        const set = new Set(['a', 'b', 'c']);
        expect(toKeyValueArray(set)).toEqual([['a', 'a'], ['b', 'b'], ['c', 'c']]);
    });

    it('should convert a Map to an array of key-value pairs', () => {
        const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
        expect(toKeyValueArray(map)).toEqual([['a', 1], ['b', 2], ['c', 3]]);
    });

    it('should convert an object to an array of key-value pairs', () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(toKeyValueArray(obj)).toEqual([['a', 1], ['b', 2], ['c', 3]]);
    });

    it('should return undefined for unsupported types', () => {
        expect(toKeyValueArray(123 as any)).toBeUndefined();
        expect(toKeyValueArray(null as any)).toBeUndefined();
        expect(toKeyValueArray(undefined as any)).toBeUndefined();
    });
});