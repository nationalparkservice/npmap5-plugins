import timediff from "./timediff";

// Jest tests for the timediff function
describe('timediff', () => {
    test('returns the time difference between two dates in seconds', () => {
        const result = timediff('2022-01-01T00:00:00Z', 'UTC', '2021-12-31T00:00:00Z', 'UTC');
        expect(result).toBe(86400);
    });

    test('defaults to using America/New_York as the time zone for datetime1', () => {
        const result = (timediff as any)('2021-12-31T00:00:00Z', undefined, '2022-01-01T00:00:00Z', 'UTC');
        expect(result).toBe(-68400);
    });
});
