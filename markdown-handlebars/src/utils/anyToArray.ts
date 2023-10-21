import anyToString from "./anyToString";
import toKeyValueArray from "./toKeyValueArray";

/**
 * Converts any input value into an array. 
 * If the input is an object or a JSON string, it will be converted into a key-value array.
 * If the input is a non-object, non-array value, it will be returned as an array with a single element.
 *
 * @param {any} value - The input value to convert.
 * @throws {Error} If a JSON string is malformed and can't be parsed.
 * @returns {Array<key: string | number, value: any>} An array representing the key (or index) and value
 */
export default function anyToArray(value: any): Array<{ key: string | number, value: any }> {
    // Get the value as a string
    const strValue = anyToString(value);

    // If it's empty, return a blank array
    if (strValue.length === 0) return [];

    // Check if the value is a JSON string
    const isJson = /^(\{.*\}|\[.*\])$/.test(strValue);

    // Initialize the return array
    const returnArray = [];

    try {
        // If the value is JSON or an object
        if (isJson) {
            // Attempt to parse it
            const json = JSON.parse(strValue);

            // Convert the JSON object into a key-value array
            const keyValueArray = toKeyValueArray(json) || [];

            // Push each key-value pair to the return array
            keyValueArray.map(([k, v]) => returnArray.push({ key: k, value: v }));
        } else {
            // If the value is not an object, push it to the return array
            returnArray.push({ key: 0, value: value });
        }
    } catch (e) {
        // If JSON parsing fails, throw the error
        throw e as Error;
    }

    // Return the final array
    return returnArray;
}