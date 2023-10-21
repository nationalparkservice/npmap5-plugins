import htmlElement from "./htmlElement";

describe('htmlElement helper', () => {
    test('creates a span element with inner HTML', () => {
        const html = htmlElement('span', { fn: () => 'Hello, world!' } as any);
        expect(html).toBe('<span>Hello, world!</span>');
    });

    test('creates an element with specified tag name and attributes', () => {
        const html = htmlElement('a', {
            hash: { href: 'https://example.com', class: 'link' },
            fn: () => 'Example link',
        } as any);
        expect(html).toBe('<a href="https://example.com" class="link">Example link</a>');
    });

    test('defaults to creating a span element', () => {
        const html = (htmlElement as any)({ fn: () => 'Hello, world!' });
        expect(html).toBe('<span>Hello, world!</span>');
    });
});
