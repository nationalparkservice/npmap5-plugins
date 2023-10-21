import { Exception } from "handlebars";

/**
 * Replaces all occurrences of a regular expression in a string with a specified replacement.
 * @param str - The string to search for matches.
 * @param exp - The regular expression to search for.
 * @param replacement - The replacement string to use.
 * @returns The input string with all matches of the regular expression replaced with the replacement string.
 * @throws An error if the regular expression is invalid.
 */
export default function regexpReplace(str: string, exp: string, replacement: string): string {
    // Ensure that the replacement value is a string
    replacement = typeof replacement === 'string' ? replacement : '';
  
    // Extract the pattern and flags from the regular expression
    const [, pattern, flags] = exp.match(/^\/(.+)\/(\w*)$/) || [];
  
    // Throw an error if the pattern is empty or if the regular expression is invalid
    if (!pattern) {
      throw new Exception(`Invalid regular expression: ${exp}`);
    }
  
    // Create a new regular expression object with the extracted pattern and flags
    const regexp = new RegExp(pattern, flags);
  
    // Replace all matches of the regular expression in the input string with the replacement value
    return str.replace(regexp, replacement);
  }