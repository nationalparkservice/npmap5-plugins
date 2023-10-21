import regexpMatch from "./regexpMatch";

// Jest tests for the regexpMatch function
describe('regexpMatch', () => {
    test('returns the matched substrings for a valid regular expression', () => {
        const result = regexpMatch('hello world', '/l+/');
        expect(Array.from(result as any)).toEqual(['ll']);
    });

    test('returns null if no match was found', () => {
        const result = regexpMatch('hello world', '/foo/');
        expect(result).toBeNull();
    });

    test('throws an error if the regular expression is invalid', () => {
        expect(() => regexpMatch('hello world', '/')).toThrowError('Invalid regular expression: /');
        expect(() => regexpMatch('hello world', '(/')).toThrowError('Invalid regular expression: (/');
    });
});
