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
    cachedData?: Uint8ClampedArray

    /**
     * Constructs a new SvgImage instance with the given SVG data.
     * 
     * @param svgData The SVG data as a string.
     */
    constructor(svgData: string | SVGElement) {
        if (typeof svgData === 'string') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = svgData;
            let svgElement = tempDiv.querySelector('svg');
            if (svgElement) {
                this.svgElement = svgElement;
            } else {
                throw new Error('Not a valid SVG');
            }
        } else {
            this.svgElement = svgData;
        }
    }

    get width(): number {
        const widthCss = this.svgElement.style.width;
        const widthCssNum = widthCss ? Number(widthCss.replace(/[^0-9-]+/g, '')) : undefined;
        const widthStr = this.svgElement.getAttribute('width');
        const widthNum = widthStr ? Number(widthStr.replace(/[^0-9-]+/g, '')) : undefined;
        return widthCssNum ?? widthNum ?? this.svgElement.getBoundingClientRect().width;
    }
    get height(): number {
        const heightCss = this.svgElement.style.height;
        const heightCssNum = heightCss ? Number(heightCss.replace(/[^0-9-]+/g, '')) : undefined;
        const heightStr = this.svgElement.getAttribute('height');
        const heightNum = heightStr ? Number(heightStr.replace(/[^0-9-]+/g, '')) : undefined;
        return heightCssNum ?? heightNum ?? this.svgElement.getBoundingClientRect().height;
    }
    set width(width: number) {
        this.svgElement.setAttribute('width', width.toString() + 'px');
    }
    set height(height: number) {
        this.svgElement.setAttribute('height', height.toString() + 'px');
    }

    /**
       * Gets the dimensions (width and height) of the SVG.
       * 
       * @returns An object containing the SVG dimensions, or `undefined` if the SVG does not have a width or height attribute.
       */
    getSvgDimensions(): { width?: number, height?: number } {
        // Get the SVG element and extract the width and height attributes
        const svgElement = this.svgElement
        const widthStr = svgElement?.getAttribute('width');
        const heightStr = svgElement?.getAttribute('height');

        const width = widthStr ? Number(widthStr.replace(/[^0-9-]+/g, '')) : undefined;
        const height = heightStr ? Number(heightStr.replace(/[^0-9-]+/g, '')) : undefined;

        return { width, height };
    }

    getCurrentSvgValues(): SVGElement {
        const animateElements = ['animate', 'animateTransform', 'animateMotion', 'animateColor', 'set', 'discard'];
        const newSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        [...this.svgElement.attributes].forEach(({ name, value }) => newSvg.setAttribute(name, value));

        const queue = [...this.svgElement.children].map(child => ({ 'parent': newSvg, 'child': child }));

        while (queue.length > 0) {
            const { parent, child } = queue.shift() as any;
            let newChild: any;

            if (child.nodeType === Node.ELEMENT_NODE) {
                if (animateElements.indexOf(child.tagName) === -1) {
                    newChild = document.createElementNS("http://www.w3.org/2000/svg", child.tagName);
                    [...child.attributes].forEach(({ name, value }) => {
                        const animVal = child[name]?.animVal;
                        const newValue = animVal !== undefined
                            ? (animVal.value !== undefined ? animVal.value : value)
                            : value;
                        newChild.setAttribute(name, newValue);
                    });
                    if (child.firstChild?.nodeValue) {
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

    animatedSvg(iconConfig: IconConfig, imageData: ImageData) {
        const that = this;
        let dataCache = imageData.data;
        let animated = true;
        let stopped = false;


        const styleImage: StyleImageInterface = {
            width: imageData.width,
            height: imageData.height,
            data: imageData.data,
            onAdd: function () {
                // Add the svg to the document so we can get its animation
                iconConfig.plugin.map._canvasContainer.appendChild(that.svgElement);

                const animationElements = Array.from(that.svgElement.getElementsByTagName("animate"));

                // Create a Promise for each animation element
                const animationPromises = animationElements.map((animation): Promise<void> => {
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
                that.svgElement.remove()
            },
            render: function () {
                // Once the animation is done, stop rendering
                if (!animated && stopped) return false;
                const img = new Image();

                const canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                const context = canvas.getContext('2d') as CanvasRenderingContext2D;

                const svgString = new XMLSerializer().serializeToString(that.getCurrentSvgValues.bind(that)());
                const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                const svgURL = URL.createObjectURL(svgBlob);

                const imageLoadPromise = new Promise<void>((res, rej) => {
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

                this.data = dataCache as Uint8ClampedArray;

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
        }
        return styleImage;
    }

    /**
     * Retrieves the image data for the SVG image with the given `ImageDetails` object.
     * 
     * @param imageDetails An object containing the CSS style and dimensions of the image.
     * @returns A `Promise` that resolves to the `ImageData` of the image once it has loaded.
     */
    async asImageData(iconConfig: IconConfig): Promise<ImageData> {

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
        const imageLoadPromise = new Promise<void>((res, rej) => {
            img.onload = () => res();
            img.onerror = (e) => rej(e);
        });

        img.src = svgURL;


        // Wait for the image to load
        try {
            await imageLoadPromise;
        } catch (e) {
            throw e;
        } finally {
            URL.revokeObjectURL(svgURL);
        }

        // Create a hidden canvas element
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        // Draw the image onto the canvas
        const ctx = canvas.getContext("2d");

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Retrieve the ImageData from the canvas
        const imageData = (ctx as CanvasRenderingContext2D).getImageData(0, 0, canvas.width, canvas.height);

        return imageData;
    }

    async asStyleImage(iconConfig: IconConfig): Promise<StyleImageInterface> {
        const animateElements = ['animate', 'animateTransform', 'animateMotion', 'animateColor', 'set', 'discard'];
        const isAnimated = animateElements.reduce((a, c) => a || this.svgElement.getElementsByTagName(c).length > 0, false);
        const imageData = await this.asImageData(iconConfig);
        if (isAnimated) {
            return this.animatedSvg(iconConfig, imageData);
        } else {
            return imageData;
        }
    }
}
