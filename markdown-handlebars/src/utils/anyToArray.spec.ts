import anyToArray from './anyToArray';

describe('anyToArray function', () => {
    it('should handle JSON object string', () => {
        const input = '{"a":1,"b":2,"c":3}';
        const expected = [{ key: 'a', value: 1 }, { key: 'b', value: 2 }, { key: 'c', value: 3 }];
        expect(anyToArray(input)).toEqual(expected);
    });

    it('should handle JSON array string', () => {
        const input = '["a","b","c"]';
        const expected = [{ 'key': 0, 'value': 'a' }, { 'key': 1, 'value': 'b' }, { 'key': 2, 'value': 'c' }];
        expect(anyToArray(input)).toEqual(expected);
    });

    it('should handle non-JSON strings', () => {
        const input = 'not a json string';
        const expected = [{ 'key': 0, 'value': 'not a json string' }];
        expect(anyToArray(input)).toEqual(expected);
    });

    it('should handle non-JSON numbers', () => {
        const input = 0;
        const expected = [{ 'key': 0, 'value': 0 }];
        expect(anyToArray(input)).toEqual(expected);
    });

    it('should throw an error for invalid JSON', () => {
        const input = '{"a":1,"b":2"c":3}'; // Missing comma
        expect(() => anyToArray(input)).toThrow(Error);
    });
});