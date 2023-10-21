import split from './split';
import { HelperOptions } from 'handlebars';

describe('split', () => {
    const options = {
        fn: () => { },
        inverse: () => { },
        hash: {},
    } as any as HelperOptions;

    it('should split a string into an array based on a comma by default', () => {
        const str = 'a,b,c';
        expect(split(str, options)).toEqual(['a', 'b', 'c']);
    });

    it('should split a string into an array based on the provided delimiter', () => {
        const str = 'a-b-c';
        options.hash.delimiter = '-';
        expect(split(str, options)).toEqual(['a', 'b', 'c']);
    });

    it('should convert non-string inputs into strings before splitting', () => {
        const nonStringInput = 123;
        options.hash.delimiter = '';
        expect(split(nonStringInput as any, options)).toEqual(['1', '2', '3']);
    });
});