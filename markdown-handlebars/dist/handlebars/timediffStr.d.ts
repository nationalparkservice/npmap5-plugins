/**
 * Parses a date string or object using the specified time zone, or the user's time zone if none is provided.
 * @param tz1 - The time zone to use for parsing the date string or object.
 * @param datetime2 - The date string or object to parse.
 * @param tz2 - Optional. The time zone to use for parsing datetime2, if it is a string.
 * @returns A Day.js object representing the parsed date and time.
 */
export declare function parseTime2(tz1: string, datetime2: any, tz2?: string): import("dayjs").Dayjs;
/**
 * Calculates the time difference between two dates in the specified time zones.
 * @param datetime1 - The first date and time, in ISO format or as a Date object.
 * @param tz1 - The time zone of datetime1.
 * @param datetime2 - The second date and time, in ISO format or as a Date object.
 * @param tz2 - The time zone of datetime2.
 * @returns A string representing the time difference between datetime1 and datetime2, in human-readable format.
 */
export default function timediffStr(datetime1: any, tz1: string, datetime2: any, tz2: string): string;
