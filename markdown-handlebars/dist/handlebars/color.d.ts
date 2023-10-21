import { HelperOptions } from "handlebars";
/**
 * A Handlebars helper function that wraps the passed content with a <span> element
 * styled with a given color.
 * @param color The color to apply to the <span> element.
 * @param options The Handlebars helper options object.
 * @returns A string containing the HTML for the wrapped content.
 */
export default function color(this: any, color: string, options: HelperOptions): string;
