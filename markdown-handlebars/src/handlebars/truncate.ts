import { escapeExpression, HelperOptions, SafeString } from "handlebars";
import anyToNumber from "../utils/anyToNumber";
import { getStyleStr } from "../utils/cssStyleToString";
import htmlElement from "./htmlElement";

/**
 * Truncates a string to a certain length, and adds an ellipsis or a given final character if truncated.
 * @param str The string to truncate.
 * @param length The maximum length of the truncated string.
 * @param finalCharacter Optional. The final character to add if truncated.
 * @param options Optional. Additional options for the Handlebars helper.
 * @returns The truncated string with the specified options and formatting.
 */
export default function truncateString(
    this: any,
    str: any,
    length: any,
    finalCharacter?: string,
    options?: HelperOptions
): string {
    // Check if finalCharacter is missing and options is the final parameter
    if (typeof finalCharacter === 'object') {
        options = finalCharacter as any as HelperOptions;
        finalCharacter = undefined;
    }

    // Determine the length of the string based on the parameter type
    if (!isNaN(anyToNumber(length, NaN))) {
        length = `${anyToNumber(length)}px`;
    }

    const spanStyle: string = getStyleStr({
        display: 'inline-block',
        maxWidth: length,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        verticalAlign: 'middle',
        textOverflow: finalCharacter ? `"${finalCharacter}"` : 'ellipsis'
    });

    // Create a new <span> element with specified styling
    return htmlElement.call(
        this,
        'span',
        {
            ...options,
            hash: { 'style': spanStyle },
            fn: () => escapeExpression(str)
        } as HelperOptions);
}