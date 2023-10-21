import { HelperOptions } from "handlebars";
import { Map } from "maplibre-gl";

const handleArgs = (iconName: string, ...args: any[]): { altText: string, options: HelperOptions } => {
    const isOptions = (arg: any): arg is HelperOptions => typeof arg === 'object' && 'data' in arg;

    let altText, size, options;

    args.forEach(arg => {
        if (isOptions(arg)) {
            options = arg;
        } else if (typeof arg === 'string') {
            altText = arg;
        }
    });

    return { altText: (altText || iconName), options: options! };  // The '!' asserts that options will be defined.
}

/**
 * Returns the HTML string for an icon image.
 * @param iconName The name of the icon image.
 * @param altText Optional alternate text for the image.
 * @param size Optional size of the image in pixels.
 * @returns The HTML string for the icon image.
 */
export default function icon(iconName: string, ...args: any[]): string {
    const { altText, options } = handleArgs(iconName, ...args);
    const map = options.data.map as Map;

    // Look for the image in the style
    const styleImage = map.style.getImage(iconName);
    const { data } = styleImage || {};

    if (data) {
        const imageData = new ImageData(Uint8ClampedArray.from(data.data as any), data.width, data.height);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = imageData.width;
        canvas.height = imageData.height;
        ctx?.putImageData(imageData, 0, 0);

        const image = new Image();
        image.src = canvas.toDataURL();
        image.classList.add('maplibre-icon');
        image.title = image.alt = altText.toString();

        // Resize for retina
        const screenPixelDensity = window.devicePixelRatio || 1;
        image.style.width = `${canvas.width / screenPixelDensity}px`;
        image.style.height = `${canvas.height / screenPixelDensity}px`;

        return image.outerHTML;
    }

    // Return an empty string if the image data is not found
    return '';
}