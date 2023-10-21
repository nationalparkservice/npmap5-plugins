import regexpReplace from "./regexpReplace";

// Jest tests for the regexpReplace function
describe('regexpReplace', () => {
    test('replaces all matches of a regular expression in a string', () => {
        const result = regexpReplace('hello world', '/l/g', 'x');
        expect(result).toBe('hexxo worxd');
    });

    test('does not replace non-matching substrings in the input string', () => {
        const result = regexpReplace('hello world', '/other/g', 'anything');
        expect(result).toBe('hello world');
    });

    test('throws an error if the regular expression is invalid', () => {
        expect(() => regexpReplace('hello world', '/', '')).toThrowError('Invalid regular expression: /');
        expect(() => regexpReplace('hello world', '(/', '')).toThrowError('Invalid regular expression: (/');
    });
});