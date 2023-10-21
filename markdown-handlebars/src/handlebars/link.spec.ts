import handlebars from 'handlebars';
import linkHelper from './link';

// Test with handlebars firrt
describe('link helper', () => {
    handlebars.registerHelper('link', linkHelper);
    it('should generate an anchor element with a URL and text', () => {
        const url = 'https://example.com';
        const text = 'Click me!';
        const expected = `<a href="${url}" target="_blank">${text}</a>`;
        const result = handlebars.compile('{{link url text}}', { noEscape: true })({ url, text });
        expect(result).toEqual(expected);
    });
});


describe('link', () => {
    it('should create an anchor element with the provided URL and text', () => {
        const url = 'https://example.com';
        const text = 'Click me!';
        const expectedHtml = `<a href="${url}" target="_blank">${text}</a>`;

        const result = linkHelper(url, text);

        expect(result).toEqual(expectedHtml);
    });
});