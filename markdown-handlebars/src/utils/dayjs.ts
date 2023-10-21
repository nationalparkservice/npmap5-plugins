import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';

/**
 * Parses a datetime string and returns a Day.js object with the specified timezone.
 * @param datetime - The datetime string to parse.
 * @param tz - The timezone to convert the datetime string to (default: America/New_York).
 * @returns A Day.js object representing the parsed datetime string in the specified timezone.
 */
const parseDate = (datetime: string, tz: string = 'America/New_York'): dayjs.Dayjs => {
    // Configure dayjs to use UTC and timezone plugins
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(relativeTime);

    // Parse the datetime string and convert it to the specified timezone
    const parsedDate = dayjs(datetime);
    const parsedDateTz = parsedDate.tz(tz, true);

    return parsedDateTz;
};

export default parseDate;