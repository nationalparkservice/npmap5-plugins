import Handlebars from 'handlebars';
import each from './each';

describe('eachHelper', () => {
    const handlebars = Handlebars.create();
    handlebars.registerHelper('each', each);

    it('should work with arrays', () => {
        const template = handlebars.compile('{{#each array}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}');
        const result = template({ array: [1, 2, 3] });
        expect(result).toEqual('1, 2, 3');
    });

    it('should work with objects', () => {
        const template = handlebars.compile('{{#each obj}}{{@key}}: {{this}}{{#unless @last}}, {{/unless}}{{/each}}');
        const result = template({ obj: { a: 1, b: 2, c: 3 } });
        expect(result).toEqual('a: 1, b: 2, c: 3');
    });

    it('should work with empty arrays', () => {
        const template = handlebars.compile('{{#each array}}Not empty{{else}}Empty{{/each}}');
        const result = template({ array: [] });
        expect(result).toEqual('Empty');
    });

    it('should work with empty objects', () => {
        const template = handlebars.compile('{{#each obj}}Not empty{{else}}Empty{{/each}}');
        const result = template({ obj: {} });
        expect(result).toEqual('Empty');
    });

    it('should throw an error when no iterator is passed', () => {
        const template = handlebars.compile('{{#each}}{{/each}}');
        expect(() => (template as any)()).toThrow('Must pass iterator to #each');
    });
});
