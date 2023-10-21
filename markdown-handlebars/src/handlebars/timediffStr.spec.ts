import timediffStr from "./timediffStr";

// Jest tests for the timediff function
describe('timediffStr', () => {
    test('returns the time difference between two dates in human-readable format', () => {
        const result = timediffStr('2022-01-01T00:00:00Z', 'UTC', '2021-12-31T00:00:00Z', 'UTC');
        expect(result).toBe('in a day');
    });

    test('defaults to using America/New_York as the time zone for datetime1', () => {
        const result = (timediffStr as any)('2021-12-31T00:00:00Z', undefined, '2022-01-01T00:00:00Z', 'UTC');
        expect(result).toBe('19 hours ago');
    });
});