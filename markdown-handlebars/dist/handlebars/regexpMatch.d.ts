/**
 * Searches a string for a regular expression match and returns the result.
 * @param str - The string to search for a match.
 * @param exp - The regular expression to search for.
 * @returns An array of matched substrings, or null if no match was found.
 * @throws An error if the regular expression is invalid.
 */
export default function regexpMatch(str: string, exp: string): RegExpMatchArray | null;
