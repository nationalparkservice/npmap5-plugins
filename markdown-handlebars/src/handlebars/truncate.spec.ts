import truncate from './truncate';

describe('truncateString', () => {
    it('should truncate the string to a specified length', () => {
        const str = 'This is a test string.';
        const length = '50px';
        const truncated = truncate(str, length);

        expect(truncated).toEqual(`<span style="display:inline-block;max-width:${length};white-space:nowrap;overflow:hidden;vertical-align:middle;text-overflow:ellipsis">${str}</span>`);
    });

    it('should add the final character if truncated', () => {
        const str = 'This is a test string.';
        const length = '50';
        const finalCharacter = '!';
        const truncated = truncate(str, length, finalCharacter);

        expect(truncated).toEqual(`<span style="display:inline-block;max-width:${length}px;white-space:nowrap;overflow:hidden;vertical-align:middle;text-overflow:&quot;${finalCharacter}&quot;">${str}</span>`);
    });

    it('should add the final character if truncated', () => {
        const str = 'This is a test string.';
        const length = 20;
        const finalCharacter = '!';
        const truncated = truncate(str, length, finalCharacter);

        expect(truncated).toEqual(`<span style="display:inline-block;max-width:20px;white-space:nowrap;overflow:hidden;vertical-align:middle;text-overflow:&quot;${finalCharacter}&quot;">${str}</span>`);
    });

    it('should return the full string if length is not specified', () => {
        const str = 'This is a test string.';
        const truncated = truncate(str, 'none');
        expect(truncated).toEqual(`<span style="display:inline-block;max-width:none;white-space:nowrap;overflow:hidden;vertical-align:middle;text-overflow:ellipsis">${str}</span>`);
    });

    it('should handle percent length', () => {
        const str = 'This is a test string.';
        const length = '50%';
        const truncated = truncate(str, length);
        expect(truncated).toEqual(`<span style="display:inline-block;max-width:50%;white-space:nowrap;overflow:hidden;vertical-align:middle;text-overflow:ellipsis">${str}</span>`);
    });
});