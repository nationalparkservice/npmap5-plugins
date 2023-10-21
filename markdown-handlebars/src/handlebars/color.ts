import { HelperOptions } from "handlebars";

/**
 * A Handlebars helper function that wraps the passed content with a <span> element
 * styled with a given color.
 * @param color The color to apply to the <span> element.
 * @param options The Handlebars helper options object.
 * @returns A string containing the HTML for the wrapped content.
 */
export default function color(
    this: any,
    color: string,
    options: HelperOptions
): string {
    // Create a new <span> element and set its color style property
    const span = document.createElement('span');
    span.style.color = color;

    // Render the content using Handlebars and set it as the inner HTML of the <span> element
    span.innerHTML = options.fn ? options.fn(this) : '';

    // Return the outer HTML of the <span> element
    return span.outerHTML;
}