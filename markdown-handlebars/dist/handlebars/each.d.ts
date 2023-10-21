import { HelperOptions } from 'handlebars';
/**
 * Registers the 'each' helper function for the given Handlebars instance.
 * @param this The Handlebars this instance.
 * @param ctx The context object or value to iterate over.
 * @param options The Handlebars helper options, including the main template function and the inverse function.
 * @returns A string containing the result of applying the template function to the context object or value.
 */
export default function (this: any, ctx: any, options: HelperOptions): string;
