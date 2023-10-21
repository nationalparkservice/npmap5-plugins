/**
 * Generates a simple hash value for a string.
 *
 * @param str The input string.
 * @returns A hash value as a string.
 */
export default function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash &= hash; // Convert to 32bit integer
    }
    return new Uint32Array([hash])[0].toString(36);
};