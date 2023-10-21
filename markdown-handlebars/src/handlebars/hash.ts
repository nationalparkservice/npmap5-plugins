import { HelperOptions } from "handlebars";

/**
 * Builds a JSON object from the input arguments and returns its string representation.
 *
 * @param {HelperOptions} options - The handlebars options object, which contains the hash.
 * @returns { [key: string]: unknown }  A JSON object built from the input arguments.
 */
export default function hash(options: HelperOptions): { [key: string]: unknown } {
    // Grab the hash from options
    return Object.entries(options.hash || {})
        .reverse() // For some reason handlebars reverses the order
        .reduce((a, [k, v]) => ({ ...a, ...{ [k]: v } }), {})
}