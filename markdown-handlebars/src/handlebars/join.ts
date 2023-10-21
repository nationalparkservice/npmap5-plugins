import { HelperDelegate } from "handlebars";
import anyToString from "../utils/anyToString";

/**
 * A Handlebars helper function to join strings with a provided separator.
 *
 * @param {string} separator - The separator to use between string elements during the join operation.
 * @param {...Array<string | undefined | null>} values - The string values to join.
 * @returns {string} - The resulting string after joining the input values with the provided separator.
 */
export default function join(separator: string, ...values: Array<string | undefined | null> | [any[]]): string {
    values.pop(); // Remove the options Object
    // If there's only one argument and it's an array, use its values instead
    if (values.length === 1 && Array.isArray(values[0])) {
        values = values[0];
    }

    // Filter out empty strings and undefined/null values, and convert everything else to string
    const filteredValues = values.map(anyToString).filter(v => v.length) as string[];

    // Join the filtered values with the provided separator
    return filteredValues.join(separator);
};