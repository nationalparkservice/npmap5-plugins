import { HelperOptions } from "handlebars";
import anyToString from "../utils/anyToString";

/**
 * Converts an value to a string.
 * @param value - The value to convert to a string.
 * @returns The integer value of the string.
 */
export default function convertToString(value: any, options: HelperOptions): string {
    return options && anyToString(value);
}