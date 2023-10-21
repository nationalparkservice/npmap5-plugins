import toString from "./anyToString";

/**
 * Convert a string to title case, with exceptions for certain words.
 * @param str The string to convert.
 * @returns The converted string.
 */
const defaultExceptions = [
    'a',
    'an',
    'and',
    'at',
    'but',
    'by',
    'for',
    'in',
    'nor',
    'of',
    'on',
    'or',
    'so',
    'the',
    'to',
    'up',
    'yet',
];
export default function toTitleCase(str: string | any, exceptions: Array<string> = defaultExceptions): string {
    str = toString(str);
    const words = str.toLowerCase().split(' ');
    const result = [];

    for (let i = 0; i < words.length; i++) {
        const word = words[i];

        if (i === 0 || !exceptions.includes(word)) {
            result.push(word.charAt(0).toUpperCase() + word.slice(1));
        } else {
            result.push(word);
        }
    }
    return result.join(' ');
}