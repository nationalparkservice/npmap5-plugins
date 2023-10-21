import { HelperOptions } from "handlebars";
/**
 * Truncates a string to a certain length, and adds an ellipsis or a given final character if truncated.
 * @param str The string to truncate.
 * @param length The maximum length of the truncated string.
 * @param finalCharacter Optional. The final character to add if truncated.
 * @param options Optional. Additional options for the Handlebars helper.
 * @returns The truncated string with the specified options and formatting.
 */
export default function truncateString(this: any, str: any, length: any, finalCharacter?: string, options?: HelperOptions): string;
