import anyToString from "../utils/anyToString";

/**
 * Converts a string to lower case.
 * @param str - The string to convert to lower case.
 * @returns The lower case string.
 */
export default function toLowerCase(str: string): string {
    return anyToString(str).toLowerCase();
}