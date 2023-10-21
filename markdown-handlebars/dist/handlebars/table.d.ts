import { HelperOptions } from "handlebars";
/**
 * This function takes an object or a string that can be parsed into an object,
 * and generates an HTML table with each key-value pair represented as a row in the table.
 *
 * @param rows - The input string or object that will be turned into an HTML table.
 * @param options - The Handlebars helper options.
 * @returns A string representing an HTML table.
 */
export default function table(rows: string | Record<string, unknown>, options: HelperOptions): string;
