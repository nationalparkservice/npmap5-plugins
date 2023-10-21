import { Exception } from "handlebars";

/**
 * Searches a string for a regular expression match and returns the result.
 * @param str - The string to search for a match.
 * @param exp - The regular expression to search for.
 * @returns An array of matched substrings, or null if no match was found.
 * @throws An error if the regular expression is invalid.
 */
export default function regexpMatch(str: string, exp: string): RegExpMatchArray | null {
    // Extract the pattern and flags from the regular expression
    const [, pattern, flags] = exp.match(/^\/(.+)\/(\w*)$/) || [];

    // Throw an exception if the pattern is empty or if the regular expression is invalid
    if (!pattern) {
        throw new Exception(`Invalid regular expression: ${exp}`);
    }

    // Create a new regular expression object with the extracted pattern and flags
    const regexp = new RegExp(pattern, flags);

    // Search the input string for a match with the regular expression
    return str.match(regexp);
}
