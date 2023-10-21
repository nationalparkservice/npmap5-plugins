import jsonMap from './jsonMap';
import Handlebars from "handlebars";

Handlebars.registerHelper('jsonMap', jsonMap);

describe('jsonMap', () => {
    it('should map an array to a template', () => {
        const template = "{{jsonMap this '[[value]]: [[index]]'}}";
        const data = [1, 2, 3];
        const expected = "1: 0\n2: 1\n3: 2";
        const result = Handlebars.compile(template)(data);
        expect(result).toEqual(expected);
    });

    it('should map an object to a template', () => {
        const template = "{{jsonMap this '[[key]]: [[value]]'}}";
        const data = { a: 1, b: 2, c: 3 };
        const expected = "a: 1\nb: 2\nc: 3";
        const result = Handlebars.compile(template)(data);
        expect(result).toEqual(expected);
    });

    it('should return an empty string when the input is empty', () => {
        const template = "{{jsonMap this '[[key]]: [[value]]'}}";
        const data = {};
        const expected = "";
        const result = Handlebars.compile(template)(data);
        expect(result).toEqual(expected);
    });

    it('should throw an error for invalid JSON', () => {
        const template = "{{jsonMap this '[[key]]: [[value]]'}}";
        const data = "{ a: 1, b: 2 c: 3}";  // Missing comma brace
        expect(() => Handlebars.compile(template)(data)).toThrow(SyntaxError);
    });

    it('should all some limited nesting', () => {
        const template = "{{jsonMap field '[[jsonMap value \"[[key]]: [[value]]\"]]'}}";
        const data = { "field": "[[0,1],[9,8]]" };
        const expected = "0: 0\n1: 1\n0: 9\n1: 8";
        const result = Handlebars.compile(template)(data);
        expect(result).toEqual(expected);
    });

});
