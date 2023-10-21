import { HelperOptions } from "handlebars";
/**
 * A Handlebars helper function that maps JSON data to a template.
 * The function first transforms any input data into an array, and then applies
 * the provided Handlebars template to each item in the array.
 *
 * @param {any} input - The input data to map. If this is not an array, the function will transform it into one.
 * @param {string} template - A Handlebars template string. This will be applied to each item in the array.
 * @param {HelperOptions} options - The Handlebars helper options.
 * @returns {string} A string containing the rendered template.
 */
export default function jsonMap(input: any, template: string, options: HelperOptions): string;
