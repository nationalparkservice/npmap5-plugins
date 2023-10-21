import { HelperOptions } from 'handlebars';
import jsonAsList from './jsonAsList';

const mockOptions: HelperOptions = {
    fn: () => { return '' },
    inverse: () => { return '' },
    hash: {}
};

describe('jsonAsList', () => {
    it('creates an ordered list element from a JSON object', () => {
        const json = ['Item 1', 'Item 2', 'Item 3'];

        const expectedOutput = '<ol><li>Item 1</li><li>Item 2</li><li>Item 3</li></ol>';
        const actualOutput = jsonAsList(json, mockOptions);
        expect(actualOutput && actualOutput.outerHTML).toBe(expectedOutput);
    });
});

describe('jsonAsList no UL', () => {
    it('creates an unordered list element from a JSON object', () => {
        const json = ['Item 1', 'Item 2', 'Item 3'];

        const expectedOutput = '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>';
        const actualOutput = jsonAsList(json, { ...mockOptions, hash: { ul: true } });
        expect(actualOutput && actualOutput.outerHTML).toBe(expectedOutput);
    });
});


describe('jsonAsList with empty values removed', () => {
    it('creates an unordered list element from a JSON object', () => {
        const json = ['Item 1', 'Item 2', , '', 'Item 4'];

        const expectedOutput = '<ol><li>Item 1</li><li>Item 2</li><li>Item 4</li></ol>';
        const actualOutput = jsonAsList(json, mockOptions);
        expect(actualOutput && actualOutput.outerHTML).toBe(expectedOutput);
    });
});

describe('jsonAsList with no values', () => {
    it('creates an unordered list element from a JSON object', () => {

        const expectedOutput = undefined;
        const actualOutput = jsonAsList([], mockOptions);
        expect(actualOutput).toBe(expectedOutput);
    });
});

describe('string as json as List', () => {
    it('creates an ordered list element from a JSON object', () => {
        const json = JSON.stringify({
            'one': 'Item 1',
            'two': 'Item 2',
            'three': 'Item 3'
        });

        const expectedOutput = '<ul><li>one: Item 1</li><li>two: Item 2</li><li>three: Item 3</li></ul>';
        const actualOutput = jsonAsList(json, mockOptions);
        expect(actualOutput && actualOutput.outerHTML).toBe(expectedOutput);
    });
});

describe('string as json as List', () => {
    it('creates an ordered list element from a JSON object', () => {
        const json = JSON.stringify({
            'test': [0, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        });

        const expectedOutput = '<ul><li>test: <ol><li>0</li><li>9</li><li>8</li><li>7</li><li>6</li><li>5</li><li>4</li><li>3</li><li>2</li><li>1</li></ol></li></ul>';
        const actualOutput = jsonAsList(json, mockOptions);
        expect(actualOutput && actualOutput.outerHTML).toBe(expectedOutput);
    });
});