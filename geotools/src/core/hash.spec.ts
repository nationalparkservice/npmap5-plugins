import quickHash from './hash';

describe('quickHash', () => {
    it('should return the same hash for the same string', () => {
        const str = 'Hello World';
        const hash1 = quickHash(str);
        const hash2 = quickHash(str);
        expect(hash1).toEqual(hash2);
    });

    it('should return different hashes for different strings', () => {
        const str1 = 'Hello World';
        const str2 = 'Hello World!';
        const hash1 = quickHash(str1);
        const hash2 = quickHash(str2);
        expect(hash1).not.toEqual(hash2);
    });

    it('should return a non-empty string', () => {
        const str = 'Hello World';
        const hash = quickHash(str);
        expect(hash).not.toEqual('');
    });

    it('should return a hash of length less than or equal to 7', () => {
        const str = 'Hello World';
        const hash = quickHash(str);
        expect(hash.length).toBeLessThanOrEqual(7);
    });
});
