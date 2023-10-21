import join from "./join";

describe('join', () => {
    it('should join strings with a separator', () => {
        expect(join(',', 'valA', 'valB', 'valC', {} as any)).toBe('valA,valB,valC');
        expect(join(' - ', 'foo', 'bar', 'baz', {} as any)).toBe('foo - bar - baz');
        expect(join('', 'hello', {} as any)).toBe('hello');
        expect(join(',', 'abc', undefined, 'def', {} as any)).toBe('abc,def');
        expect(join(',', 'ghi', null, 'jkl', {} as any)).toBe('ghi,jkl');
        expect(join('', null, undefined, {} as any)).toBe('');
    });

    it('should handle an array as the first value', () => {
        const result = join('-', ['one', 'two', 'three'], {} as any);
        expect(result).toBe('one-two-three');
    });
});