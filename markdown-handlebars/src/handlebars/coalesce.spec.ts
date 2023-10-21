import coalesce from './coalesce';

describe('defaultHelper', () => {
    it('should return the first non-empty value', () => {
        expect(coalesce(undefined, null, '', 'foo', 'bar')).toBe('foo');
        expect(coalesce('', 0, NaN, false, 'baz', 'qux')).toBe('baz');
        expect(coalesce('hello', 'world')).toBe('hello');
        expect(coalesce('', '', '', 'value', '')).toBe('value');
        expect(coalesce()).toBe('');
    });
});
