import parseDate from '../utils/dayjs';
import { parseTime2 } from './timediffStr';

/**
 * Calculates the time difference between two dates in the specified time zones, in seconds.
 * @param datetime1 - The first date and time, in ISO format or as a Date object.
 * @param tz1 - The time zone of datetime1.
 * @param datetime2 - The second date and time, in ISO format or as a Date object.
 * @param tz2 - The time zone of datetime2.
 * @returns The time difference between datetime1 and datetime2, in seconds.
 */
export default function timediff(datetime1: any, tz1: string, datetime2: any, tz2: string): number {
    // Use America/New_York as the default time zone if none is provided for tz1
    if (typeof tz1 !== 'string') tz1 = 'America/New_York';

    // Parse datetime1 using tz1
    const parsedTime1 = parseDate(datetime1, tz1);

    // Parse datetime2 using tz2 or tz1 if tz2 is not provided
    const parsedTime2 = parseTime2(tz1, datetime2, tz2);

    // Calculate the time difference between the two dates in seconds
    return parsedTime1.diff(parsedTime2, 'seconds');
}