import anyToString from "../utils/anyToString";
import parseDate from "../utils/dayjs";

/**
 * Formats a datetime string in a specific timezone and format.
 *
 * @param datetime The datetime string to format.
 * @param format The format string to use.
 * @param tz The timezone string to use. Defaults to 'America/New_York'.
 * @returns The formatted datetime string.
 */
export default function datetime(datetime: any, format: string, tz?: string): string {
    if (!datetime || anyToString(datetime).length === 0) return '';

    // Get the user's timezone
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Parse The Date and Use the default timezone if a timezone is not specified
    const parsedDate = parseDate(datetime, typeof tz === 'string' ? tz : undefined);

    // Format the date string in the user's timezone using the specified format
    return parsedDate.tz(userTz).format(format);
}