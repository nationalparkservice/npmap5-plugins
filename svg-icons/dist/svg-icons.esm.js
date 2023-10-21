/**
 * Class representing a color with RGBA values.
 */
class Color {
    /**
     * Create a new Color object.
     * @param rgba An object containing RGBA values { r, g, b, a }.
     */
    constructor(rgba) {
        this.rgbaObj = rgba;
    }
    /**
     * Create a Color object from RGB values.
     * @param rgb An object containing RGB values { r, g, b }.
     * @returns A Color object with the corresponding RGBA values and an alpha of 1.
     */
    static fromRgb(rgb) {
        const { r, g, b } = rgb;
        return new Color({ r, b, g, a: 1 });
    }
    static isLight(color, threshold = 186) {
        // https://stackoverflow.com/questions/946544/good-text-foreground-color-for-a-given-background-color/946734#946734
        return ((color.r * 0.299 + color.g * 0.587 + color.b * 0.114) > threshold);
    }
    get isLight() {
        return Color.isLight(this);
    }
    /**
     * Calculate the contrast color between two CSS color strings.
     * @param colorA First CSS color string.
     * @param colorB Second CSS color string.
     * @returns A Color object with the contrasting color.
     */
    static contrastColor(colorA, colorB) {
        let colorBIsLight = false;
        if (colorA === 'auto' && colorB !== 'auto') {
            colorBIsLight = Color.fromCssColorToRgb(colorB).isLight;
        }
        return colorBIsLight ? Color.fromRgb({ 'r': 0, 'g': 0, 'b': 0 }) : Color.fromRgb({ 'r': 255, 'g': 255, 'b': 255 });
    }
    ;
    /**
     * Converts any CSS color string to an RGB color.
     *
     * @param cssColor The CSS color string.
     * @returns A Color object with the corresponding RGBA values.
     */
    static fromCssColorToRgb(cssColor) {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        // Get the 2D rendering context
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return new Color({ r: 0, g: 0, b: 0, a: 0 });
        }
        // Set the fillStyle to the input color and fill a single pixel
        ctx.fillStyle = cssColor;
        ctx.fillRect(0, 0, 1, 1);
        // Get the color of the single pixel
        const imageData = ctx.getImageData(0, 0, 1, 1);
        const [r, g, b, a] = imageData.data;
        return new Color({ r, g, b, a: Math.round(a / 255) });
    }
    get r() {
        return this.rgbaObj.r;
    }
    get g() {
        return this.rgbaObj.g;
    }
    get b() {
        return this.rgbaObj.b;
    }
    get a() {
        return this.rgbaObj.a;
    }
    set r(r) {
        this.rgbaObj.r = r;
    }
    set g(g) {
        this.rgbaObj.g = g;
    }
    set b(b) {
        this.rgbaObj.b = b;
    }
    set a(a) {
        this.rgbaObj.a = a;
    }
    /**
     * Converts the color to rgba.
     *
     * @returns A string containing the rgba(r,g,b,a) values.
     */
    get rgba() {
        const { r, g, b, a } = this.rgbaObj;
        return `rgba(${r},${g},${b},${a})`;
    }
    /**
     * Converts the color to rgba.
     *
     * @returns An array containing the rgba(r,g,b,a) values.
     */
    get rgbaArray() {
        const { r, g, b, a } = this.rgbaObj;
        return [r, g, b, a];
    }
    /**
     * Converts the color to rgba.
     *
     * @returns An array containing the rgba(r,g,b,a) values, with the a in the range from 0-255.
     */
    get rgbaArray255() {
        const { r, g, b, a } = this.rgbaObj;
        return [r, g, b, Math.round(a * 255)];
    }
    /**
     * Converts the color to hex.
     *
     * @returns A string containing the #RRGGBBAA values.
     */
    get hex() {
        let [r, g, b, a] = this.rgbaArray255;
        // Helper function to convert a single channel value to a two-digit hexadecimal string
        const toHex = (value) => value.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
    }
}

/**
 * A class representing an SVG image with various utility methods.
 */
class SvgImage {
    /**
     * Constructs a new SvgImage instance with the given SVG data.
     *
     * @param svgData The SVG data as a string.
     */
    constructor(svgData) {
        if (typeof svgData === 'string') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = svgData;
            let svgElement = tempDiv.querySelector('svg');
            if (svgElement) {
                this.svgElement = svgElement;
            }
            else {
                throw new Error('Not a valid SVG');
            }
        }
        else {
            this.svgElement = svgData;
        }
    }
    get width() {
        var _a;
        const widthCss = this.svgElement.style.width;
        const widthCssNum = widthCss ? Number(widthCss.replace(/[^0-9-]+/g, '')) : undefined;
        const widthStr = this.svgElement.getAttribute('width');
        const widthNum = widthStr ? Number(widthStr.replace(/[^0-9-]+/g, '')) : undefined;
        return (_a = widthCssNum !== null && widthCssNum !== void 0 ? widthCssNum : widthNum) !== null && _a !== void 0 ? _a : this.svgElement.getBoundingClientRect().width;
    }
    get height() {
        var _a;
        const heightCss = this.svgElement.style.height;
        const heightCssNum = heightCss ? Number(heightCss.replace(/[^0-9-]+/g, '')) : undefined;
        const heightStr = this.svgElement.getAttribute('height');
        const heightNum = heightStr ? Number(heightStr.replace(/[^0-9-]+/g, '')) : undefined;
        return (_a = heightCssNum !== null && heightCssNum !== void 0 ? heightCssNum : heightNum) !== null && _a !== void 0 ? _a : this.svgElement.getBoundingClientRect().height;
    }
    set width(width) {
        this.svgElement.setAttribute('width', width.toString() + 'px');
    }
    set height(height) {
        this.svgElement.setAttribute('height', height.toString() + 'px');
    }
    /**
       * Gets the dimensions (width and height) of the SVG.
       *
       * @returns An object containing the SVG dimensions, or `undefined` if the SVG does not have a width or height attribute.
       */
    getSvgDimensions() {
        // Get the SVG element and extract the width and height attributes
        const svgElement = this.svgElement;
        const widthStr = svgElement === null || svgElement === void 0 ? void 0 : svgElement.getAttribute('width');
        const heightStr = svgElement === null || svgElement === void 0 ? void 0 : svgElement.getAttribute('height');
        const width = widthStr ? Number(widthStr.replace(/[^0-9-]+/g, '')) : undefined;
        const height = heightStr ? Number(heightStr.replace(/[^0-9-]+/g, '')) : undefined;
        return { width, height };
    }
    getCurrentSvgValues() {
        var _a;
        const animateElements = ['animate', 'animateTransform', 'animateMotion', 'animateColor', 'set', 'discard'];
        const newSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        [...this.svgElement.attributes].forEach(({ name, value }) => newSvg.setAttribute(name, value));
        const queue = [...this.svgElement.children].map(child => ({ 'parent': newSvg, 'child': child }));
        while (queue.length > 0) {
            const { parent, child } = queue.shift();
            let newChild;
            if (child.nodeType === Node.ELEMENT_NODE) {
                if (animateElements.indexOf(child.tagName) === -1) {
                    newChild = document.createElementNS("http://www.w3.org/2000/svg", child.tagName);
                    [...child.attributes].forEach(({ name, value }) => {
                        var _a;
                        const animVal = (_a = child[name]) === null || _a === void 0 ? void 0 : _a.animVal;
                        const newValue = animVal !== undefined
                            ? (animVal.value !== undefined ? animVal.value : value)
                            : value;
                        newChild.setAttribute(name, newValue);
                    });
                    if ((_a = child.firstChild) === null || _a === void 0 ? void 0 : _a.nodeValue) {
                        newChild.textContent = child.firstChild.nodeValue;
                    }
                    const style = window.getComputedStyle(child);
                    for (let i = 0; i < style.length; i++) {
                        let prop = style[i];
                        newChild.style[prop] = style.getPropertyValue(prop);
                    }
                }
            }
            if (newChild) {
                parent.appendChild(newChild);
                if (child.children && child.children.length) {
                    queue.push(...[...child.children].map(child2 => ({ 'parent': newChild, 'child': child2 })));
                }
            }
        }
        return newSvg;
    }
    animatedSvg(iconConfig, imageData) {
        const that = this;
        let dataCache = imageData.data;
        let animated = true;
        let stopped = false;
        const styleImage = {
            width: imageData.width,
            height: imageData.height,
            data: imageData.data,
            onAdd: function () {
                // Add the svg to the document so we can get its animation
                iconConfig.plugin.map._canvasContainer.appendChild(that.svgElement);
                const animationElements = Array.from(that.svgElement.getElementsByTagName("animate"));
                // Create a Promise for each animation element
                const animationPromises = animationElements.map((animation) => {
                    return new Promise((resolve) => {
                        animation.addEventListener("endEvent", () => {
                            resolve();
                        }, false);
                    });
                });
                // Use Promise.all to wait for all animations to complete
                Promise.all(animationPromises).then(() => {
                    animated = false;
                });
            },
            onRemove: () => {
                that.svgElement.remove();
            },
            render: function () {
                // Once the animation is done, stop rendering
                if (!animated && stopped)
                    return false;
                const img = new Image();
                const canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                const context = canvas.getContext('2d');
                const svgString = new XMLSerializer().serializeToString(that.getCurrentSvgValues.bind(that)());
                const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                const svgURL = URL.createObjectURL(svgBlob);
                const imageLoadPromise = new Promise((res, rej) => {
                    img.onload = () => res();
                    img.onerror = (e) => rej(e);
                });
                img.src = svgURL;
                imageLoadPromise.then(() => {
                    URL.revokeObjectURL(svgURL);
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                    dataCache = context.getImageData(0, 0, canvas.width, canvas.height).data;
                }).catch((e) => {
                    URL.revokeObjectURL(svgURL);
                    throw e;
                });
                this.data = dataCache;
                // Allows the frame to get painted on last time (the get the default frame)
                if (!animated && stopped) {
                    stopped = true;
                    this.onRemove && this.onRemove();
                }
                // continuously repaint the map, resulting in the smooth animation of the dot
                iconConfig.plugin.map.triggerRepaint();
                // return `true` to let the map know that the image was updated
                return true;
            }
        };
        return styleImage;
    }
    /**
     * Retrieves the image data for the SVG image with the given `ImageDetails` object.
     *
     * @param imageDetails An object containing the CSS style and dimensions of the image.
     * @returns A `Promise` that resolves to the `ImageData` of the image once it has loaded.
     */
    async asImageData(iconConfig) {
        let { height, width } = this;
        // Scale the image to the pixel Ratio
        width *= iconConfig.config.imageOptions.pixelRatio;
        height *= iconConfig.config.imageOptions.pixelRatio;
        // Create an Image object with the SVG data as its source
        const img = new Image();
        const svgString = new XMLSerializer().serializeToString(this.svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const svgURL = URL.createObjectURL(svgBlob);
        // Create a promise to handle the image loading event
        const imageLoadPromise = new Promise((res, rej) => {
            img.onload = () => res();
            img.onerror = (e) => rej(e);
        });
        img.src = svgURL;
        // Wait for the image to load
        try {
            await imageLoadPromise;
        }
        catch (e) {
            throw e;
        }
        finally {
            URL.revokeObjectURL(svgURL);
        }
        // Create a hidden canvas element
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        // Draw the image onto the canvas
        const ctx = canvas.getContext("2d");
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Retrieve the ImageData from the canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return imageData;
    }
    async asStyleImage(iconConfig) {
        const animateElements = ['animate', 'animateTransform', 'animateMotion', 'animateColor', 'set', 'discard'];
        const isAnimated = animateElements.reduce((a, c) => a || this.svgElement.getElementsByTagName(c).length > 0, false);
        const imageData = await this.asImageData(iconConfig);
        if (isAnimated) {
            return this.animatedSvg(iconConfig, imageData);
        }
        else {
            return imageData;
        }
    }
}

/**
 * Converts given image data to a format supported by Maplibre (StyleImageInterface)
 * If the image is already in the correct format, it simply returns it.
 * For unsupported image types (like SVG), it processes the image to the supported format.
 *
 * @returns Promise that resolves to the image in the format of `StyleImageInterface`
 * @throws Error if there is an issue in processing SVG image
 */
async function toStyleImage() {
    // If no image data is provided, use fallback image
    if (this.imageData === undefined) {
        this.imageData = this.config.fallbackImage;
    }
    let imageData = this.imageData;
    // Process SVG images (unsupported by maplibre)
    if (typeof imageData === "string" || imageData instanceof SVGElement) {
        if (imageData instanceof SVGElement) {
            imageData = imageData.outerHTML;
        }
        try {
            const processedImage = new SvgImage(imageData);
            imageData = await processedImage.asStyleImage(this);
        }
        catch (e) {
            throw e;
        }
    }
    // If image data is already a StyleImageInterface, return it as is
    if (this.plugin.getTypes.isStyleImageInterface(imageData)) {
        return imageData;
    }
    else {
        // Convert other image types to StyleImageInterface using Maplibre functions
        // Create a random id for the image
        const imgKey = Array(7).fill(undefined).map(() => Math.random().toString(36).substring(2)).join('-');
        imageData = imageData;
        // Add the image to the map, retrieve it in the correct format, and remove it from the map
        this.plugin.map.addImage(imgKey, imageData);
        imageData = this.plugin.map.style.imageManager.getImage(imgKey).data;
        this.plugin.map.style.imageManager.removeImage(imgKey);
        return imageData;
    }
}

class IconConfig {
    constructor(config, plugin) {
        // Read the config
        if (typeof config === 'string') {
            this._originalId = config;
            try {
                config = JSON.parse(decodeURIComponent(config));
            }
            catch (e) {
                // It's probably not JSON, add it as a missing base image
                config = {
                    ...plugin.options,
                    baseImageId: undefined
                };
            }
        }
        else {
            this._originalId = plugin.stringifyConfig(config);
        }
        // Apply the defaults
        this.config = {
            ...plugin.options,
            ...config,
            imageOptions: {
                ...plugin.options.imageOptions,
                ...config.imageOptions,
            }
        };
        this.plugin = plugin;
    }
    get imageId() {
        return this._originalId;
    }
    async execute(baseImageData) {
        const config = this.config;
        let finalResult;
        let functions = [];
        if (config.baseImageId && baseImageData === undefined) {
            // It is looking for an id, and that id doesn't exist, apply the default image
            baseImageData = config.fallbackImage;
            // Use the fallback functions if any are specified
            functions = this.config.fallbackFunctions || this.config.functions || [];
        }
        else {
            functions = this.config.functions || [];
        }
        // Loop through all the functions
        finalResult = await functions.reduce(async (previousPromise, currentItem) => {
            const previousResult = await previousPromise;
            const fn = this.plugin.options.customFunctions[currentItem.name];
            if (!fn) {
                console.warn('Image processing function missing: ' + currentItem.name);
                return;
            }
            // Always pass the default image if there is the base image is undefined
            const result = await fn.bind({ ...this, imageData: previousResult || config.fallbackImage })(currentItem.params);
            return result;
        }, Promise.resolve(baseImageData));
        return await toStyleImage.bind({ ...this, imageData: (finalResult || config.fallbackImage) })();
    }
}

/**
 * The applyCss function applies a set of CSS properties to an SVG image.
 * If the image data is not in SVG format, a warning will be logged and the original image data will be returned.
 * @param this - The context object, expected to be of type customFunctionParams.
 * @param params - An object mapping CSS property names to their values.
 * @returns A Promise that resolves to the processed image data, or the original image data if processing was not possible.
 */
var applyCss = (async function applyCss(params) {
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
            Object.entries(params).forEach(([k, v]) => svgImage.svgElement.style[k] = v);
            // Convert the SvgImage object to an ImageData object
            return svgImage.svgElement.outerHTML; //.asStyleImage(this);
        }
        catch (e) {
            // If there was an error processing the SVG image, log a warning and return the original image data
            console.warn('SVG Image was not able to be processed, css could not be applied');
            console.error(e);
            return this.imageData;
        }
    }
    else {
        // If imageData is not an SVG image, log a warning and return the original image data
        console.warn('ImageData passed to the applyCss function is not in SVG format, css cannot be applied');
        return this.imageData;
    }
});

const defaultParams = {
    black: 'black',
    white: 'white',
    removeTransparency: false,
    threshold: 186
};
function convertToMonochrome(styleImage, blackChannel, whiteChannel, removeTransparency, threshold) {
    const { width, height, data } = styleImage;
    let newImageData = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r, g, b, a;
            r = (data[(x * 4) + (y * (width * 4))]);
            g = (data[(x * 4) + (y * (width * 4)) + 1]);
            b = (data[(x * 4) + (y * (width * 4)) + 2]);
            a = (data[(x * 4) + (y * (width * 4)) + 3]) / 255; // RGBA colors use 0-1, but the array uses 0-255
            // Remove transparency if selected
            if (removeTransparency)
                a = 1;
            const pixelColor = new Color({ r, g, b, a });
            if (Color.isLight(pixelColor, threshold)) {
                newImageData.push(...whiteChannel.rgbaArray255);
            }
            else {
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
var recolorRaster = (async function recolorRaster(params) {
    // Lets set the defaults
    const parsedParams = defaultParams;
    // Loop through the params and set them if we can
    // otherwise throw warnings
    Object.entries(params).forEach(([k, v]) => {
        if (parsedParams.hasOwnProperty(k)) {
            // We might be able to change it!
            if (typeof v === typeof defaultParams[k]) {
                parsedParams[k] = v;
            }
            else {
                console.warn('Invalid type for "' + k + '" ("' + typeof v + '") using the default "' + defaultParams[k] + '".');
            }
        }
        else {
            console.warn('Invalid key "' + k + '", the only accepted keys are: ' + Object.keys(defaultParams).join(', '));
        }
    });
    // First we need to make sure we have the image in the styleimage format
    const inputStyleImage = await toStyleImage.bind(this)();
    // Now that we have a style image, we can convert it to black/white
    const convertedImage = convertToMonochrome(inputStyleImage, Color.fromCssColorToRgb(parsedParams.black), Color.fromCssColorToRgb(parsedParams.white), parsedParams.removeTransparency, parsedParams.threshold);
    return convertedImage;
});

var replaceValues = (async function replaceValues(params) {
    var _a;
    // Assume that imageData is of type MaplibreImage
    let imageData = this.imageData;
    // Check if imageData is a string or an SVGElement
    if (typeof imageData === "string" || imageData instanceof SVGElement) {
        // If imageData is an SVGElement, convert it to a string
        if (imageData instanceof SVGElement) {
            imageData = imageData.outerHTML;
        }
        const replacer = (value) => value.replace(/\{(.+?)\}/g, (match, param) => {
            return params[param] || match;
        });
        try {
            // Create a new SvgImage object
            const svgImage = new SvgImage(imageData);
            // Drill down through the SVG and replace all mustache values with the params
            let elements = [svgImage.svgElement];
            while (elements.length > 0) {
                const el = elements.pop();
                if (el) {
                    // Replace the text 
                    if ((_a = el.firstChild) === null || _a === void 0 ? void 0 : _a.nodeValue) {
                        el.firstChild.nodeValue = replacer(el.firstChild.nodeValue);
                    }
                    // Loop through all the attributes
                    [...(el === null || el === void 0 ? void 0 : el.attributes) || []].forEach(attr => {
                        let newValue = replacer(attr.value);
                        if (newValue !== attr.value) {
                            el.setAttribute(attr.name, newValue);
                        }
                        // add all of its children
                        elements.push(...[...el.children]);
                    });
                }
            }
            // Convert the SvgImage object to an ImageData / StyleImage object
            return svgImage.svgElement.outerHTML; //.asStyleImage(this);
        }
        catch (e) {
            // If there was an error processing the SVG image, log a warning and return the original image data
            console.warn('SVG Image was not able to be processed, could not replace values');
            console.error(e);
            return this.imageData;
        }
    }
    else {
        // If imageData is not an SVG image, log a warning and return the original image data
        console.warn('ImageData passed to the replaceValues function is not in SVG format, css could not replace values');
        return this.imageData;
    }
});

function isStyleImageInterface(value) {
    // Check if value is an object
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    // Check the properties of StyleImageInterface
    return (typeof value.width === 'number' &&
        typeof value.height === 'number' &&
        (value.data instanceof Uint8Array || value.data instanceof Uint8ClampedArray) &&
        (typeof value.render === 'undefined' || typeof value.render === 'function') &&
        (typeof value.onAdd === 'undefined' || typeof value.onAdd === 'function') &&
        (typeof value.onRemove === 'undefined' || typeof value.onRemove === 'function'));
}

const smallDotSvg = `
<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
  <circle cx="5" cy="5" r="5" fill="currentColor"/>
</svg>`;
class SVGPlugin {
    constructor(map, options = {}) {
        // Maintains a list of images that were missing so we added the default image
        this.missingBaseImages = new Map();
        this.imageDataLibrary = new Map();
        this.getTypes = SVGPlugin.getTypes;
        this.stringifyConfig = SVGPlugin.stringifyConfig;
        this.map = map;
        this.options = { ...SVGPlugin.defaultOptions, ...options };
        // Subscribe to the missing images function
        map.on('styleimagemissing', (e) => this.addMissingBaseImage(e.id));
        // Subscribe to new data to see when images come in
        const debouncedProcessNewImages = this.debounce(() => {
            this.processNewImages(map.style.imageManager.images);
        }, 10);
        map.on('data', (mapDataEvent) => {
            if (mapDataEvent.dataType === 'style') {
                // New style data came in! Maybe it'll fix the broken images?
                // This can happen a whole lot, so let's debounce it
                debouncedProcessNewImages();
            }
        });
    }
    processNewImages(imageObj) {
        const updatedMissingImages = (Object.entries(imageObj)).filter(([k]) => this.missingBaseImages.has(k));
        updatedMissingImages.forEach(([k, v]) => {
            // TODO, do we even update JSON images?
            this.addImage(k, v.data);
        });
    }
    addImage(imageBase, imageData) {
        // TODO check if we already have this image (do we need to, since we're updating it anyway)
        this.imageDataLibrary.set(imageBase, imageData);
        // Update the image
        const baseConfig = new IconConfig(imageBase, this);
        this.updateImage(baseConfig, imageData);
        // Update any images depending on it
        Array.from(this.missingBaseImages)
            .filter(([k]) => k === imageBase)
            .forEach(([, v]) => {
            Array.from(v).forEach(imageId => {
                const iconConfig = new IconConfig(imageId, this);
                this.updateImage(iconConfig, imageData);
            });
        });
    }
    addMissingBaseImage(imageId) {
        var _a;
        // We have a missing image, lets turn it into a config
        const iconConfig = new IconConfig(imageId, this);
        const { baseImageId, imageOptions } = iconConfig.config;
        // Immediately give everything a blank image
        // This also prevents the warning message
        const blankImage = { width: 0, height: 0, data: new Uint8Array() };
        this.map.addImage(imageId, blankImage, { sdf: imageOptions.sdf });
        // If it's referring to a base image add it to the missing base images set
        if (baseImageId) {
            // Check if the missing image base is in out map
            if (!this.missingBaseImages.has(baseImageId)) {
                this.missingBaseImages.set(baseImageId, new Set());
            }
            (_a = this.missingBaseImages.get(baseImageId)) === null || _a === void 0 ? void 0 : _a.add(imageId);
        }
        // parse out the image name
        const baseImageData = baseImageId && this.imageDataLibrary.get(baseImageId);
        if (baseImageData || baseImageId === undefined) {
            // We have the base for this image, so we can re-render it!
            this.updateImage(iconConfig, baseImageData);
        }
        else {
            // We don't have the base image, so we can apply the fallback
            // if the missing image is using SDF, then our image needs to be SDF (it would convert it automatically, but throw an error if we don't)
            this.setImageIdToFallback(iconConfig);
        }
    }
    removeMissingBaseImage(iconConfig) {
        // Check if the missing image base is in the map
        const baseImageId = iconConfig.config.baseImageId;
        if (baseImageId) {
            if (this.missingBaseImages.has(baseImageId)) {
                const baseEntry = this.missingBaseImages.get(baseImageId);
                if (baseEntry) {
                    baseEntry.delete(iconConfig.imageId);
                    if (baseEntry.size === 0) {
                        this.missingBaseImages.delete(baseImageId);
                    }
                }
            }
        }
    }
    setImageIdToFallback(iconConfig) {
        return this._updateImage(iconConfig, undefined);
    }
    async updateImage(iconConfig, baseImageData) {
        const styleImage = await this._updateImage(iconConfig, baseImageData);
        if (styleImage)
            this.removeMissingBaseImage(iconConfig);
        return styleImage;
    }
    async _updateImage(iconConfig, baseImageData) {
        try {
            const styleImage = await iconConfig.execute(baseImageData);
            //console.log('styleImage', iconConfig, styleImage);
            if (this.map.hasImage(iconConfig.imageId)) {
                this.map.removeImage(iconConfig.imageId);
            }
            this.map.addImage(iconConfig.imageId, styleImage, iconConfig.config.imageOptions);
            const { version, data, ...maplibreImage } = this.map.style.getImage(iconConfig.imageId);
            // Convert it back to a StyleImageInterface
            return {
                ...maplibreImage,
                data: data.data,
                height: data.height,
                width: data.width
            };
        }
        catch (e) {
            //console.log('IMAGE', iconConfig);
            console.error('Error loading image', e);
            return;
        }
    }
    prefetchImageId(imageId) {
        this.map.style.fire(new Event('styleimagemissing', { id: imageId }));
    }
    debounce(func, wait) {
        let timeoutId = null;
        return function () {
            const later = () => {
                timeoutId = null;
                func();
            };
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(later, wait);
        };
    }
}
SVGPlugin.defaultImageOptions = {
    pixelRatio: window.devicePixelRatio,
    sdf: false,
    stretchX: undefined,
    stretchY: undefined,
    content: undefined,
};
SVGPlugin.defaultOptions = {
    fallbackImage: smallDotSvg,
    imageOptions: SVGPlugin.defaultImageOptions,
    fallbackFunctions: undefined,
    customFunctions: {
        applyCss,
        recolorRaster,
        toStyleImage,
        replaceValues
    }
};
SVGPlugin.ColorTools = Color;
SVGPlugin.getTypes = {
    isStyleImageInterface
};
SVGPlugin.stringifyConfig = (iconConfig) => {
    // Escape any brackets added by the user, so we can use the mustache functions to pull data in
    const replacer = function (_, value) {
        if (typeof value === "string" && value.includes("{") && value.includes("}")) {
            return value.replace(/{/g, '\\{').replace(/}/g, '\\}');
        }
        return value;
    };
    // Stringify with replacer function, then encode
    let encoded = encodeURIComponent(JSON.stringify(iconConfig, replacer));
    // Unescape brackets after encoding
    return encoded.replace(/%5C%5C%7B/g, '{').replace(/%5C%5C%7D/g, '}');
};

export { SVGPlugin, isStyleImageInterface };
