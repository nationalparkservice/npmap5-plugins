import { HelperOptions } from "handlebars";
/**
 * Generates a nested HTML list (ul or ol) from a JSON string or object.
 *
 * @param input - The JSON string or object to convert to a list.
 * @param options - The Handlebars options object. If options.hash.ul is true, all lists will be unordered.
 * @returns {HTMLElement | undefined} - The root element of the generated HTML list, or undefined if the input is null, undefined, or an empty string.
 */
export default function jsonAsList(input: string | any, options: HelperOptions): HTMLElement | undefined;
