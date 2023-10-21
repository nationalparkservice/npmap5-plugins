import toLowerCase from './toLowerCase';

describe('toLowerCase', () => {
    test('converts a string to lower case', () => {
        expect(toLowerCase('Hello World')).toEqual('hello world');
        expect(toLowerCase('AnOTHER exAMple')).toEqual('another example');
        expect(toLowerCase('SHOUTING')).toEqual('shouting');
    });
});