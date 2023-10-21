import parseDate from '../utils/dayjs';

/**
 * Parses a date string or object using the specified time zone, or the user's time zone if none is provided.
 * @param tz1 - The time zone to use for parsing the date string or object.
 * @param datetime2 - The date string or object to parse.
 * @param tz2 - Optional. The time zone to use for parsing datetime2, if it is a string.
 * @returns A Day.js object representing the parsed date and time.
 */
export function parseTime2(tz1: string, datetime2: any, tz2?: string) {
    let parsedTime;

    if (datetime2 !== undefined && typeof datetime2 !== 'object') {
        // If datetime2 is a string, parse it using tz2 or tz1 if tz2 is not provided
        if (typeof tz2 !== 'string') tz2 = tz1;
        parsedTime = parseDate(datetime2, tz2);
    } else {
        // If datetime2 is not a string or is undefined, use the user's time zone
        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        parsedTime = parseDate(new Date().toISOString(), userTz);
    }

    return parsedTime;
}

/**
 * Calculates the time difference between two dates in the specified time zones.
 * @param datetime1 - The first date and time, in ISO format or as a Date object.
 * @param tz1 - The time zone of datetime1.
 * @param datetime2 - The second date and time, in ISO format or as a Date object.
 * @param tz2 - The time zone of datetime2.
 * @returns A string representing the time difference between datetime1 and datetime2, in human-readable format.
 */
export default function timediffStr(datetime1: any, tz1: string, datetime2: any, tz2: string): string {
    // Use America/New_York as the default time zone if none is provided for tz1
    if (typeof tz1 !== 'string') tz1 = 'America/New_York';

    // Parse datetime1 using tz1
    const parsedTime = parseDate(datetime1, tz1);

    // Parse datetime2 using tz2 or tz1 if tz2 is not provided
    const parsedTime2 = parseTime2(tz1, datetime2, tz2);

    // Calculate the time difference between the two dates
    if (parsedTime.isAfter(parsedTime2)) {
        return parsedTime2.to(parsedTime);
    } else {
        return parsedTime.from(parsedTime2);
    }
}