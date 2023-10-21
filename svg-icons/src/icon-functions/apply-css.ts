import { IconFunctionParams, MaplibreImage, customFunctionParams, customFunctionType } from "../types";
import SvgImage from "../svg-image";

/**
 * Interface for the applyCss function parameters
 */
export interface ApplyCssParams extends IconFunctionParams {
    name: 'applyCss',
    params: {
        [CssStyleProperty in keyof CSSStyleDeclaration]: string
    }
};

/**
 * Type for the CSS parameters
 */
type Params = {
    [CssStyleProperty in keyof ApplyCssParams['params']]: string;
};

/**
 * The applyCss function applies a set of CSS properties to an SVG image.
 * If the image data is not in SVG format, a warning will be logged and the original image data will be returned.
 * @param this - The context object, expected to be of type customFunctionParams.
 * @param params - An object mapping CSS property names to their values.
 * @returns A Promise that resolves to the processed image data, or the original image data if processing was not possible.
 */
export default (async function applyCss(this: customFunctionParams, params: Params): Promise<MaplibreImage | undefined> {
    // Assume that imageData is of type MaplibreImage
    let imageData = this.imageData;

    // Check if imageData is a string or an SVGElement (unsupported by maplibre)
    if (typeof imageData === "string" || imageData instanceof SVGElement) {
        // If imageData is an SVGElement, convert it to a string
        if (imageData instanceof SVGElement) {
            imageData = imageData.outerHTML;
        }

        try {
            // Create a new SvgImage object
            const svgImage = new SvgImage(imageData);
            // Apply the CSS properties to the SVG element
            Object.entries(params).forEach(([k, v]) => svgImage.svgElement.style[k as any] = v);
            // Convert the SvgImage object to an ImageData object
            return svgImage.svgElement.outerHTML; //.asStyleImage(this);
        } catch (e) {
            // If there was an error processing the SVG image, log a warning and return the original image data
            console.warn('SVG Image was not able to be processed, css could not be applied');
            console.error(e);
            return this.imageData;
        }
    } else {
        // If imageData is not an SVG image, log a warning and return the original image data
        console.warn('ImageData passed to the applyCss function is not in SVG format, css cannot be applied');
        return this.imageData;
    }
}) as customFunctionType