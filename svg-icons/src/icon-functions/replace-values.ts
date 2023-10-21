import { IconFunctionParams, MaplibreImage, customFunctionParams, customFunctionType } from "../types";
import SvgImage from "../svg-image";


export interface ReplaceValues extends IconFunctionParams {
    name: 'replaceValues',
    params: {
        [key: string]: string
    }
};

export default (async function replaceValues(this: customFunctionParams, params: ReplaceValues['params']): Promise<MaplibreImage | undefined> {
    // Assume that imageData is of type MaplibreImage
    let imageData = this.imageData as MaplibreImage;

    // Check if imageData is a string or an SVGElement
    if (typeof imageData === "string" || imageData instanceof SVGElement) {
        // If imageData is an SVGElement, convert it to a string
        if (imageData instanceof SVGElement) {
            imageData = imageData.outerHTML;
        }

        const replacer = (value: string) => value.replace(/\{(.+?)\}/g, (match, param) => {
            return params[param] || match;
        });

        try {
            // Create a new SvgImage object
            const svgImage = new SvgImage(imageData);
            // Drill down through the SVG and replace all mustache values with the params
            let elements: Element[] = [svgImage.svgElement];
            while (elements.length > 0) {
                const el = elements.pop();
                if (el) {
                    // Replace the text 
                    if (el.firstChild?.nodeValue) {
                        el.firstChild.nodeValue = replacer(el.firstChild.nodeValue);
                    }

                    // Loop through all the attributes
                    [...el?.attributes || []].forEach(attr => {
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
        } catch (e) {
            // If there was an error processing the SVG image, log a warning and return the original image data
            console.warn('SVG Image was not able to be processed, could not replace values');
            console.error(e);
            return this.imageData;
        }
    } else {
        // If imageData is not an SVG image, log a warning and return the original image data
        console.warn('ImageData passed to the replaceValues function is not in SVG format, css could not replace values');
        return this.imageData;
    }
}) as customFunctionType