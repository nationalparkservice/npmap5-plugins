import { HelperOptions } from "handlebars";
import table from './table'; // replace with your actual path

describe('table function', () => {
    const options: HelperOptions = {
        hash: {},
        fn: jest.fn(),
        inverse: jest.fn(),
        data: null,
    };

    it('should return an empty table if no rows', () => {
        const result = (table as any)(options);
        expect(result).toBe(`<table></table>`);
    });

    it('should return a table with one row if the data field has one row', () => {
        options.data = { feature: { properties: { 'test': 'value' } } };
        const result = (table as any)(options);
        expect(result).toBe(`<table><tr><td style="font-weight: 700;">test</td><td>value</td></tr></table>`);
    });

    it('should return a table with one row if one row is passed', () => {
        const result = table({ 'test': 'value' }, options);
        expect(result).toBe(`<table><tr><td style="font-weight: 700;">test</td><td>value</td></tr></table>`);
    });

    it('should return a table with one row if one row is passed', () => {
        const result = table({ 'test': [1, 2, 3], 'test2': ["a","b","c"], }, options);
        expect(result).toBe(`<table><tr><td style="font-weight: 700;">test</td><td><ol><li>1</li><li>2</li><li>3</li></ol></td></tr>
<tr><td style="font-weight: 700;">test2</td><td><ol><li>a</li><li>b</li><li>c</li></ol></td></tr></table>`);
    });

});