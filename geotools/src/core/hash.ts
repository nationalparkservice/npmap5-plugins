/**
 * Generates a quick hash of a string.
 * @link https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 *
 * This function is a JavaScript implementation of Java's String `hashCode` method.
 * It generates a hash by iterating over each character of the input string and
 * updating the hash value accordingly.
 *
 * @param str - The input string to be hashed.
 * @returns The hash value of the input string.
 *
 * @example
 * ```typescript
 * const hash = quickHash('Hello World');
 * console.log(hash); // Output: a3b3
 * ```
 */
export default function quickHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Uint32Array.from([hash])[0].toString(36);
};