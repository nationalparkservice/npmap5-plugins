import { Exception, HelperOptions, SafeString } from 'handlebars';

const safeTags = [
    'a', 'abbr', 'acronym', 'address', 'article', 'aside', 'b', 'bdi', 'bdo', 'big',
    'blockquote', 'br', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'data',
    'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em',
    'fieldset', 'figcaption', 'figure', 'font', 'footer', 'h1', 'h2', 'h3', 'h4',
    'h5', 'h6', 'header', 'hr', 'i', 'img', 'ins', 'kbd', 'legend', 'li', 'main', 'mark',
    'menu', 'menuitem', 'meter', 'nav', 'ol', 'optgroup', 'option', 'output', 'p', 'pre',
    'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'small', 'span',
    'strike', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th',
    'thead', 'time', 'tr', 'tt', 'u', 'ul', 'var', 'wbr']

/**
 * A Handlebars helper that creates an HTML element with the specified tag name and attributes,
 * sets its inner HTML to the content rendered by the helper, and returns the outer HTML of the element.
 * @param this - The context object passed to the Handlebars helper.
 * @param type - The tag name of the element to create (e.g. "div", "span", etc.).
 * @param options - The options object passed to the Handlebars helper, which contains the content to render.
 * @returns The outer HTML of the created element, including its tag name, attributes, and inner HTML content.
 */
export default function htmlElement(
    this: any,
    type: keyof HTMLElementTagNameMap,
    options: HelperOptions
): string {
    // Default to span if no tag name is provided
    if (typeof type !== 'string' && options === undefined) {
        options = type;
        type = 'span';
    }

    if (safeTags.indexOf(type) === -1) {
        throw new Exception(`htmlElement Error, type ${type} is not allowed.`)
    }

    // Create a new element with the specified tag name
    const el = document.createElement(type);

    // Set any attributes specified in the options hash on the element
    Object.entries((options.hash || {}) as { [key: string]: any }).forEach(entry => {
        el.setAttribute(...entry);
    });

    // Render the content using Handlebars and set it as the inner HTML of the element
    el.innerHTML = options.fn ? options.fn(this) : '';

    // Return the outer HTML of the element
    return new SafeString(el.outerHTML).toString();
}