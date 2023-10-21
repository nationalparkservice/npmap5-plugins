import { StyleImageInterface } from "maplibre-gl";
import { IconFunctionParams, MaplibreImage, customFunctionParams } from "../types";
import SvgImage from "../svg-image";

/**
 * Represents the parameters for the "resize" function.
 */
export interface toStyleImage extends IconFunctionParams {
    name: 'getSvg',
    params: {}
};

/**
 * Converts given image data to a format supported by Maplibre (StyleImageInterface)
 * If the image is already in the correct format, it simply returns it.
 * For unsupported image types (like SVG), it processes the image to the supported format.
 *
 * @returns Promise that resolves to the image in the format of `StyleImageInterface`
 * @throws Error if there is an issue in processing SVG image
 */
export default async function toStyleImage(this: customFunctionParams): Promise<StyleImageInterface> {

    // If no image data is provided, use fallback image
    if (this.imageData === undefined) {
        this.imageData = this.config.fallbackImage;
    }
    let imageData = this.imageData as MaplibreImage;

    // Process SVG images (unsupported by maplibre)
    if (typeof imageData === "string" || imageData instanceof SVGElement) {
        if (imageData instanceof SVGElement) {
            imageData = imageData.outerHTML;
        }

        try {
            const processedImage = new SvgImage(imageData);
            imageData = await processedImage.asStyleImage(this);
        } catch (e) {
            throw e;
        }
    }

    // If image data is already a StyleImageInterface, return it as is
    if (this.plugin.getTypes.isStyleImageInterface(imageData)) {
        return imageData as StyleImageInterface;
    } else {
        // Convert other image types to StyleImageInterface using Maplibre functions
        // Create a random id for the image
        const imgKey = Array(7).fill(undefined).map(() => Math.random().toString(36).substring(2)).join('-');
        imageData = imageData as (HTMLImageElement | ImageBitmap | ImageData | { width: number; height: number; data: Uint8Array | Uint8ClampedArray; } | StyleImageInterface);

        // Add the image to the map, retrieve it in the correct format, and remove it from the map
        this.plugin.map.addImage(imgKey, imageData);
        imageData = this.plugin.map.style.imageManager.getImage(imgKey).data;
        this.plugin.map.style.imageManager.removeImage(imgKey);
        return imageData;
    }
}