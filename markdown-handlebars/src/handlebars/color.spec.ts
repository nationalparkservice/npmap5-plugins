
import color from "./color";
/**
 * A Jest test suite for the color function.
 */
describe('color', () => {
    // Define a test case for a simple use of the helper
    it('should wrap the text in a <span> element with the given color', () => {
        const rendered = color.call({ text: 'Hello' }, 'red', {
            fn: (context: any) => context.text,
        } as any);
        expect(rendered).toBe('<span style="color: red;">Hello</span>');
    });

    // Define a test case for a more complex use of the helper with Handlebars expressions
    it('should render Handlebars expressions in the wrapped text', () => {
        const rendered = color.call({ text: 'Hello', name: 'John' }, 'blue', {
            fn: (context: any) => `Hello, ${context.name}!`,
        } as any);
        expect(rendered).toBe('<span style="color: blue;">Hello, John!</span>');
    });
});

