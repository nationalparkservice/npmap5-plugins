import is from './is';
import * as Handlebars from 'handlebars';

// Register the 'is' helper function
Handlebars.registerHelper('is', is);

describe('is', () => {
    it('should return trueValue when the condition is true', () => {
        const template = Handlebars.compile('{{is true "yes" "no"}}');
        const result = template({});
        expect(result).toBe('yes');
    });

    it('should return falseValue when the condition is false', () => {
        const template = Handlebars.compile('{{is false "yes" "no"}}');
        const result = template({});
        expect(result).toBe('no');
    });

    it('should return empty string for trueValue when only the condition is provided and it is true', () => {
        const template = Handlebars.compile('{{is true}}');
        const result = template({});
        expect(result).toBe('');
    });

    it('should return empty string for falseValue when only the condition is provided and it is false', () => {
        const template = Handlebars.compile('{{is false}}');
        const result = template({});
        expect(result).toBe('');
    });

    it('should return trueValue when condition is true and only trueValue is provided', () => {
        const template = Handlebars.compile('{{is true "only-yes"}}');
        const result = template({});
        expect(result).toBe('only-yes');
    });

    it('should return empty string when condition is false and only trueValue is provided', () => {
        const template = Handlebars.compile('{{is false "only-yes"}}');
        const result = template({});
        expect(result).toBe('');
    });

    it('should return empty string when only options are provided', () => {
        const template = Handlebars.compile('{{is}}');
        const result = template({});
        expect(result).toBe('');
    });
});
