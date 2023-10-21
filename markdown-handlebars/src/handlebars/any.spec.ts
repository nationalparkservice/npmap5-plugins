import any from "./any";

describe('anyHasLength', () => {
    it('returns true if any argument has a length greater than zero', () => {
        expect(any('', 'abc', [], null)).toBe(true);
    });

    it('returns false if all arguments have a length of zero', () => {
        expect(any('', undefined, null)).toBe(false);
    });

    it('returns true if there is an empty array', () => {
        expect(any('', [], null)).toBe(true);
    });
});