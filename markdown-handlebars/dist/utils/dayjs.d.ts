import dayjs from 'dayjs';
/**
 * Parses a datetime string and returns a Day.js object with the specified timezone.
 * @param datetime - The datetime string to parse.
 * @param tz - The timezone to convert the datetime string to (default: America/New_York).
 * @returns A Day.js object representing the parsed datetime string in the specified timezone.
 */
declare const parseDate: (datetime: string, tz?: string) => dayjs.Dayjs;
export default parseDate;
