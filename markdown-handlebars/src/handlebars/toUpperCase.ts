import anyToString from "../utils/anyToString";

/**
 * Converts a string to uppercase.
 * @param str The string to convert.
 * @returns The string in uppercase.
 */
export default function toUpperCase(str: string): string {
    return anyToString(str).toUpperCase();
};
