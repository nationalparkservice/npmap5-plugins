import toUpperCase from './toUpperCase';

describe('uppercase', () => {
    test('converts a string to uppercase', () => {
        expect(toUpperCase('hello world')).toBe('HELLO WORLD');
        expect(toUpperCase('AbC1@')).toBe('ABC1@');
    });
});