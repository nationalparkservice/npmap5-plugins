import anyToString from "../utils/anyToString";

/**
 * A function that takes in multiple arguments and returns the first non-empty string value.
 * @param args - The array of arguments to check for non-empty string values.
 * @returns The first non-empty string value found in the arguments array.
 */
export default function coalesce(...values: any[]): string {
    console.log('coalesce INPUT VALUES', values);
    const filteredValues = values
        .filter((v, i) => v && anyToString(v).length && i < values.length - 1) as string[];
    return filteredValues[0] ? anyToString(filteredValues[0]) : ''
}
