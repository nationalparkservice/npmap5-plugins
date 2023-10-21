import { HelperOptions } from 'handlebars';
/**
 * A Handlebars helper that creates an HTML element with the specified tag name and attributes,
 * sets its inner HTML to the content rendered by the helper, and returns the outer HTML of the element.
 * @param this - The context object passed to the Handlebars helper.
 * @param type - The tag name of the element to create (e.g. "div", "span", etc.).
 * @param options - The options object passed to the Handlebars helper, which contains the content to render.
 * @returns The outer HTML of the created element, including its tag name, attributes, and inner HTML content.
 */
export default function htmlElement(this: any, type: keyof HTMLElementTagNameMap, options: HelperOptions): string;
