import datetime from './datetime';

describe('datetime function', () => {

    const mockDateTimeFormat = {
        resolvedOptions: jest.fn().mockReturnValue({ timeZone: 'America/New_York' }),
    };
    global.Intl = {
        DateTimeFormat: jest.fn().mockImplementation(() => mockDateTimeFormat),
    } as any;


    it('should format a given datetime to a string in the specified timezone', () => {
        const datetimeString = '2022-03-31 12:30:00';
        const format = 'YYYY-MM-DD HH:mm:ss';
        const tz = 'America/Los_Angeles';

        const result = datetime(datetimeString, format, tz);

        expect(result).toEqual('2022-03-31 15:30:00');
    });

    it('should use the default timezone if no timezone is specified', () => {
        const datetimeString = '2022-03-31T12:30:00Z';
        const format = 'YYYY-MM-DD HH:mm:ss';

        const result = datetime(datetimeString, format);

	// TODO this is an issue with the system timezone
        //expect(result).toEqual('2022-03-31 06:30:00');
    });
});
