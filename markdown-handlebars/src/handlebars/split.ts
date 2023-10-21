import { HelperOptions } from "handlebars";
import anyToString from "../utils/anyToString";

/**
 * Split a string into an array based on a delimiter.
 *
 * @param str - The string to be split.
 * @param options - The handlebars options object, which contains the hash.
 * @returns {string[]} - The resulting array after splitting the string.
 */
export default function split(str: string, options: HelperOptions): string[] | '' {
    str = anyToString(str);
    const delimiter = options.hash.delimiter ?? ",";
    const split = str.split(delimiter);
    return split.filter(v => v.length).length ? split : '';
}