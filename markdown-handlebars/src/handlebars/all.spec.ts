import all from "./all";

describe('all', () => {
    it('returns "true" when all arguments are truthy', () => {
        expect(all('test', 123, true)).toBe('true');
    });

    it('returns "" when there is a 0', () => {
        expect(all('test', 0, true)).toBe('');
    });

    it('returns "" when there is a ""', () => {
        expect(all('test', '', true)).toBe('');
    });

    it('returns "" when there is a false', () => {
        expect(all('test', '', false)).toBe('');
    });

    it('returns "" when no arguments are provided', () => {
        expect(all()).toBe('');
    });
});