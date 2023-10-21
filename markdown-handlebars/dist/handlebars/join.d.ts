/**
 * A Handlebars helper function to join strings with a provided separator.
 *
 * @param {string} separator - The separator to use between string elements during the join operation.
 * @param {...Array<string | undefined | null>} values - The string values to join.
 * @returns {string} - The resulting string after joining the input values with the provided separator.
 */
export default function join(separator: string, ...values: Array<string | undefined | null> | [any[]]): string;
