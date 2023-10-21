import { StyleImageInterface } from "maplibre-gl";
import { IconFunctionParams, customFunctionParams, customFunctionType } from "../types";
import { Color } from "../color";
import toStyleImage from "./to-style-image";

/**
 * Represents the parameters for the "resize" function.
 */
export interface recolorRaster extends IconFunctionParams {
    name: 'recolorRaster',
    params: {
        black: string,
        white: string,
        removeTransparency?: boolean,
        threshold?: number
    }
};

export const defaultParams: Required<recolorRaster['params']> = {
    black: 'black',
    white: 'white',
    removeTransparency: false,
    threshold: 186
}

type Params = {
    [K in keyof recolorRaster['params']]: string;
};

function convertToMonochrome(styleImage: StyleImageInterface, blackChannel: Color, whiteChannel: Color, removeTransparency: boolean, threshold: number): StyleImageInterface {
    const { width, height, data } = styleImage;
    let newImageData: number[] = []

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r, g, b, a;
            r = (data[(x * 4) + (y * (width * 4))]);
            g = (data[(x * 4) + (y * (width * 4)) + 1]);
            b = (data[(x * 4) + (y * (width * 4)) + 2]);
            a = (data[(x * 4) + (y * (width * 4)) + 3]) / 255; // RGBA colors use 0-1, but the array uses 0-255

            // Remove transparency if selected
            if (removeTransparency) a = 1;

            const pixelColor = new Color({ r, g, b, a });
            if (Color.isLight(pixelColor, threshold)) {
                newImageData.push(...whiteChannel.rgbaArray255);
            } else {
                newImageData.push(...blackChannel.rgbaArray255);
            }
        }
    }

    return {
        width,
        height,
        data: new Uint8ClampedArray(newImageData)
    };
}

/**
 * Converts given image data to a format supported by Maplibre (StyleImageInterface)
 * If the image is already in the correct format, it simply returns it.
 * For unsupported image types (like SVG), it processes the image to the supported format.
 *
 * @returns Promise that resolves to the image in the format of `StyleImageInterface`
 * @throws Error if there is an issue in processing SVG image
 */
export default (async function recolorRaster(this: customFunctionParams, params: Params): Promise<StyleImageInterface> {
    // Lets set the defaults
    const parsedParams: Required<recolorRaster['params']> = defaultParams;

    // Loop through the params and set them if we can
    // otherwise throw warnings
    Object.entries(params).forEach(([k, v]) => {
        if (parsedParams.hasOwnProperty(k)) {
            // We might be able to change it!
            if (typeof v === typeof (defaultParams as any)[k]) {
                (parsedParams as any)[k] = v;
            } else {
                console.warn('Invalid type for "' + k + '" ("' + typeof v + '") using the default "' + (defaultParams as any)[k] + '".')
            }
        } else {
            console.warn('Invalid key "' + k + '", the only accepted keys are: ' + Object.keys(defaultParams).join(', '))
        }
    });

    // First we need to make sure we have the image in the styleimage format
    const inputStyleImage = await toStyleImage.bind(this)();

    // Now that we have a style image, we can convert it to black/white
    const convertedImage = convertToMonochrome(
        inputStyleImage,
        Color.fromCssColorToRgb(parsedParams.black),
        Color.fromCssColorToRgb(parsedParams.white),
        parsedParams.removeTransparency,
        parsedParams.threshold
    );

    return convertedImage;
}) as customFunctionType;