import { HelperOptions } from 'handlebars';

/**
 * A Handlebars helper that sets the specified properties on the current context object.
 * @param this - The current context object.
 * @param options - The options object passed to the Handlebars helper, which contains the properties to set.
 */
export default function (this: { [key: string]: any }, options: HelperOptions) {
    // Set the properties in the options hash on the current context object
    Object.entries(options.hash as typeof this).forEach(([k, v]) => {
        this[k] = v;
    });
}