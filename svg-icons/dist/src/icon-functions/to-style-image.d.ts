import { StyleImageInterface } from "maplibre-gl";
import { IconFunctionParams, customFunctionParams } from "../types";
/**
 * Represents the parameters for the "resize" function.
 */
export interface toStyleImage extends IconFunctionParams {
    name: 'getSvg';
    params: {};
}
/**
 * Converts given image data to a format supported by Maplibre (StyleImageInterface)
 * If the image is already in the correct format, it simply returns it.
 * For unsupported image types (like SVG), it processes the image to the supported format.
 *
 * @returns Promise that resolves to the image in the format of `StyleImageInterface`
 * @throws Error if there is an issue in processing SVG image
 */
export default function toStyleImage(this: customFunctionParams): Promise<StyleImageInterface>;
