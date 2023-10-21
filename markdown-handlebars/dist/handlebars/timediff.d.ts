/**
 * Calculates the time difference between two dates in the specified time zones, in seconds.
 * @param datetime1 - The first date and time, in ISO format or as a Date object.
 * @param tz1 - The time zone of datetime1.
 * @param datetime2 - The second date and time, in ISO format or as a Date object.
 * @param tz2 - The time zone of datetime2.
 * @returns The time difference between datetime1 and datetime2, in seconds.
 */
export default function timediff(datetime1: any, tz1: string, datetime2: any, tz2: string): number;
