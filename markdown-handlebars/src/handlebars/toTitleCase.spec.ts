import toTitleCase from './toTitleCase';

describe('toTitleCase', () => {
    test('converts a string to title case', () => {
        expect(toTitleCase('hello world')).toEqual('Hello World');
        expect(toTitleCase('AnOTHER exAMple TO TrY')).toEqual('Another Example to Try');
        expect(toTitleCase('SHOUTING')).toEqual('Shouting');
    });
});