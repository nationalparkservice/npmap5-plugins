import json from "./json";
/**
 * Jest test to verify the behavior of the json helper function.
 */
describe('json', () => {
    it('should extract and convert JSON values', () => {
        const mockJson = '{"key": "value"}';
        const mockContext = {
            'json': mockJson,
        };
        const exp = 'json.key';
        expect(json.call(mockContext, exp)).toEqual('value');
    });
});