import Handlebars, { HelperOptions } from "handlebars";
import anyToArray from "../utils/anyToArray";

/**
 * A Handlebars helper function that maps JSON data to a template.
 * The function first transforms any input data into an array, and then applies
 * the provided Handlebars template to each item in the array.
 * 
 * @param {any} input - The input data to map. If this is not an array, the function will transform it into one.
 * @param {string} template - A Handlebars template string. This will be applied to each item in the array.
 * @param {HelperOptions} options - The Handlebars helper options.
 * @returns {string} A string containing the rendered template.
 */
export default function jsonMap(input: any, template: string, options: HelperOptions) {
    // Some fallbacks to deal with handlebars weirdness
    input = template === undefined && options === undefined ? [] : input;
    options = options || template || input;
    template = typeof template === 'string' ? template : '';

    // Transform the input into an array
    const array = anyToArray(input);
    const delimiter = options?.hash?.delimiter ?? '\n';

    // Map each item in the array to the template
    const result = array
        .map((item: any, index: number) => {
            // Create an augmented data object, adding some additional properties
            const augmentedData = {
                key: item?.key,
                index,
                value: item?.value ?? item,
                first: index === 0,
                last: index === array.length - 1
            };

            // Compile the template and apply it to the augmented data
            return Handlebars.compile(template.replace(/\[\[/gm, '{{').replace(/\]\]/gm, '}}'))(augmentedData);
        })
        .join(delimiter);  // Join all rendered strings into a single string with newline separators

        //console.log('DELIMITER (', delimiter, ')', options);

    // Return the result as a Handlebars SafeString
    return new Handlebars.SafeString(result).toString();
};
