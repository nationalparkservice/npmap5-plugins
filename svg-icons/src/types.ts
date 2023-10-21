import { StyleImageInterface, StyleImageMetadata } from "maplibre-gl";
import IconConfig from "./icon-config";

export type MaplibreImage = HTMLOrSVGImageElement | ImageBitmap | ImageData | {
    width: number;
    height: number;
    data: Uint8Array | Uint8ClampedArray;
} | StyleImageInterface | string;
export type customFunctionParams = IconConfig & { imageData?: MaplibreImage };
export type customFunctionType = (this: customFunctionParams, params: { [key: string]: any }) => Promise<MaplibreImage>;

export interface SVGPluginOptions {
    fallbackImage: MaplibreImage,
    imageOptions: StyleImageMetadata,
    fallbackFunctions: Array<FunctionType<IconFunctionParams>> | undefined,
    customFunctions: {
        [key: string]: customFunctionType
    }
}

/**
 * Represents the base type for all function parameters.
 */
export interface IconFunctionParams {
    [key: string]: any;
}


/**
 * Represents the parameters for the "crop" function.
 */
export interface GetIcon extends IconFunctionParams {
    name: string
}

/**
 * Represents a custom function to apply to the image.
 */
export interface FunctionType<T extends IconFunctionParams> {
    /**
     * The name of the function.
     */
    name: string;

    /**
     * The parameters for the function.
     */
    params: T;
}

/**
 * Represents the configuration for image manipulation operations.
 */
export interface IconConfigType extends Omit<SVGPluginOptions, 'customFunctions'> {
    /**
     * The base image to be used in image manipulation operations.
     */
    baseImageId?: string;

    /**
     * An array of functions to apply to the image.
     * Example: { name: 'resize', params: { width: 200, height: 100 } }
     */
    functions?: Array<FunctionType<IconFunctionParams>>;
}

export function isStyleImageInterface(value: any): boolean {
    // Check if value is an object
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    // Check the properties of StyleImageInterface
    return (
        typeof value.width === 'number' &&
        typeof value.height === 'number' &&
        (value.data instanceof Uint8Array || value.data instanceof Uint8ClampedArray) &&
        (typeof value.render === 'undefined' || typeof value.render === 'function') &&
        (typeof value.onAdd === 'undefined' || typeof value.onAdd === 'function') &&
        (typeof value.onRemove === 'undefined' || typeof value.onRemove === 'function')
    );
};
