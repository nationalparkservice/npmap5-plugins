import { IconFunctionParams, customFunctionType } from "../types";
/**
 * Interface for the applyCss function parameters
 */
export interface ApplyCssParams extends IconFunctionParams {
    name: 'applyCss';
    params: {
        [CssStyleProperty in keyof CSSStyleDeclaration]: string;
    };
}
/**
 * The applyCss function applies a set of CSS properties to an SVG image.
 * If the image data is not in SVG format, a warning will be logged and the original image data will be returned.
 * @param this - The context object, expected to be of type customFunctionParams.
 * @param params - An object mapping CSS property names to their values.
 * @returns A Promise that resolves to the processed image data, or the original image data if processing was not possible.
 */
declare const _default: customFunctionType;
export default _default;
