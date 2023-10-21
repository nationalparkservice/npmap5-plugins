import toTitleCase from './toTitleCase';

describe('toTitleCase', () => {
    it('should convert a string to title case', () => {
        const input = 'the quick brown fox jumps over the lazy dog';
        const output = toTitleCase(input);
        expect(output).toEqual('The Quick Brown Fox Jumps Over the Lazy Dog');
    });

    it('should handle empty string input', () => {
        const input = '';
        const output = toTitleCase(input);
        expect(output).toEqual('');
    });

    it('should handle null and undefined input', () => {
        const input1 = null;
        const input2 = undefined;
        const output1 = toTitleCase(input1 as any);
        const output2 = toTitleCase(input2 as any);
        expect(output1).toEqual('');
        expect(output2).toEqual('');
    });

    it('should handle exceptions correctly', () => {
        const input = 'a tale of two cities';
        const output = toTitleCase(input);
        expect(output).toEqual('A Tale of Two Cities');
    });
});
