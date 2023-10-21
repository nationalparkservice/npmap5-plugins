/**
 * Converts any input value into an array.
 * If the input is an object or a JSON string, it will be converted into a key-value array.
 * If the input is a non-object, non-array value, it will be returned as an array with a single element.
 *
 * @param {any} value - The input value to convert.
 * @throws {Error} If a JSON string is malformed and can't be parsed.
 * @returns {Array<key: string | number, value: any>} An array representing the key (or index) and value
 */
export default function anyToArray(value: any): Array<{
    key: string | number;
    value: any;
}>;
