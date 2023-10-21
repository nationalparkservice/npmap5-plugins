import Handlebars, { HelperOptions } from "handlebars";
import { QueryFeature } from "..";

/**
 * Handlebars helper function to extract data from a maplibre feature and use it in a provided template.
 *
 * @remarks
 * This helper function is designed to integrate Maplibre data with Handlebars templating.
 * The feature data is passed in the options object under the key `feature`.
 *
 * @example
 * ```hbs
 * {{feature "{{source}}" }}
 * ```
 *
 * @param handlebarsExpression - A string representing the Handlebars expression
 * @param options - The options object automatically provided by Handlebars when invoking a helper.
 * @returns The rendered template string after applying the Maplibre feature data.
 */
export default function feature(handlebarsExpression: string, options: HelperOptions): string | object {
    const featureData = (options.data?.feature || {}) as QueryFeature;
    return Handlebars.compile(handlebarsExpression)(featureData);
}