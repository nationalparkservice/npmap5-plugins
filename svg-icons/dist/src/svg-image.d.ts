import { StyleImageInterface } from "maplibre-gl";
import IconConfig from "./icon-config";
/**
 * A class representing an SVG image with various utility methods.
 */
export default class SvgImage {
    /**
     * The SVG data as a string.
     */
    svgElement: SVGElement;
    cachedData?: Uint8ClampedArray;
    /**
     * Constructs a new SvgImage instance with the given SVG data.
     *
     * @param svgData The SVG data as a string.
     */
    constructor(svgData: string | SVGElement);
    get width(): number;
    get height(): number;
    set width(width: number);
    set height(height: number);
    /**
       * Gets the dimensions (width and height) of the SVG.
       *
       * @returns An object containing the SVG dimensions, or `undefined` if the SVG does not have a width or height attribute.
       */
    getSvgDimensions(): {
        width?: number;
        height?: number;
    };
    getCurrentSvgValues(): SVGElement;
    animatedSvg(iconConfig: IconConfig, imageData: ImageData): StyleImageInterface;
    /**
     * Retrieves the image data for the SVG image with the given `ImageDetails` object.
     *
     * @param imageDetails An object containing the CSS style and dimensions of the image.
     * @returns A `Promise` that resolves to the `ImageData` of the image once it has loaded.
     */
    asImageData(iconConfig: IconConfig): Promise<ImageData>;
    asStyleImage(iconConfig: IconConfig): Promise<StyleImageInterface>;
}
