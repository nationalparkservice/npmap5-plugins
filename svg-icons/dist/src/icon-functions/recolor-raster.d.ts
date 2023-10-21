import { IconFunctionParams, customFunctionType } from "../types";
/**
 * Represents the parameters for the "resize" function.
 */
export interface recolorRaster extends IconFunctionParams {
    name: 'recolorRaster';
    params: {
        black: string;
        white: string;
        removeTransparency?: boolean;
        threshold?: number;
    };
}
export declare const defaultParams: Required<recolorRaster['params']>;
/**
 * Converts given image data to a format supported by Maplibre (StyleImageInterface)
 * If the image is already in the correct format, it simply returns it.
 * For unsupported image types (like SVG), it processes the image to the supported format.
 *
 * @returns Promise that resolves to the image in the format of `StyleImageInterface`
 * @throws Error if there is an issue in processing SVG image
 */
declare const _default: customFunctionType;
export default _default;
