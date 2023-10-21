import {
    Map as MaplibreMap
} from 'maplibre-gl';

export const icons = {
    'fill': `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' xml:space='preserve'%3E%3Cpath d='M20.38 17.17V4.83A2.49 2.49 0 0 0 22 2.5 2.5 2.5 0 0 0 19.5 0c-1.07 0-1.98.68-2.33 1.63H4.83A2.486 2.486 0 0 0 2.5 0 2.5 2.5 0 0 0 0 2.5c0 1.07.68 1.98 1.63 2.33v1.33C.68 6.52 0 7.43 0 8.5A2.5 2.5 0 0 0 2.5 11c1.07 0 1.98-.68 2.33-1.63h3.33c.25.67.78 1.21 1.46 1.46v6.33C8.68 17.52 8 18.43 8 19.5a2.5 2.5 0 0 0 2.5 2.5c1.07 0 1.98-.68 2.33-1.63h4.33c.36.95 1.27 1.63 2.34 1.63a2.5 2.5 0 0 0 2.5-2.5c0-1.07-.68-1.98-1.62-2.33zm-3.21 1.46h-4.33c-.25-.67-.78-1.21-1.46-1.46v-6.33C12.32 10.48 13 9.57 13 8.5A2.5 2.5 0 0 0 10.5 6c-1.07 0-1.98.68-2.33 1.63H4.83c-.25-.68-.78-1.21-1.45-1.46V4.83c.67-.25 1.21-.78 1.46-1.46h12.33c.25.67.78 1.21 1.46 1.46v12.33c-.68.26-1.21.79-1.46 1.47zM9.75 8.5c0-.41.34-.75.75-.75s.75.34.75.75-.34.75-.75.75-.75-.34-.75-.75zm9.75-6.75c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zm-17 0c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zm0 7.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm8 11c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm9 0c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75z'/%3E%3C/svg%3E`,
    'line': `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' xml:space='preserve'%3E%3Cpath d='M1 21v-3c.48 0 .94-.02 1.37-.06l.25 2.99C2.1 20.98 1.55 21 1 21zM4.82 20.59l-.7-2.92c.88-.21 1.65-.53 2.3-.94l1.61 2.53c-.92.59-2 1.04-3.21 1.33zm5.05-2.91L7.6 15.72c.5-.58.87-1.27 1.1-2.06l2.88.85c-.36 1.21-.93 2.27-1.71 3.17zm2.11-5.46-2.99-.19c0-.18.01-.36.01-.53 0-.95.08-1.81.23-2.63l2.95.56c-.12.62-.18 1.32-.18 2.07 0 .24-.01.48-.02.72zm.68-4.37L9.91 6.64c.5-1.13 1.21-2.12 2.11-2.92l1.99 2.24c-.58.52-1.02 1.14-1.35 1.89zm2.69-2.78L14 2.39c.94-.47 2.03-.83 3.22-1.06l.57 2.95c-.93.18-1.75.44-2.44.79zM19.6 4.05l-.2-3C19.9 1.02 20.44 1 21 1v3c-.49 0-.96.02-1.4.05z'/%3E%3C/svg%3E`,
    'symbol': `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' style='enable-background:new 0 0 22 22' xml:space='preserve'%3E%3Ccircle cx='11' cy='11' r='4'/%3E%3C/svg%3E`,
    'circle': `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' style='enable-background:new 0 0 22 22' xml:space='preserve'%3E%3Ccircle cx='11' cy='11' r='11'/%3E%3C/svg%3E`
} as { [key: string]: string };

const imageAvgLum = (imageData: ImageData, blockSize: number) => {
    // Uses a quick formula to get the rough luminace for a color, to add backgrounds behind colors

    // blockSize determines how many pixels to sample from
    // blockSize = 1 would sample all pixels
    // blockSize = 10 would sample one of every 10 pixels
    
    if (blockSize < 1) {
        throw new Error('blockSize must be greater than 0');
    }

    let avgLumAcc = 0;
    let weight = 0;
    // https://stackoverflow.com/questions/596216/formula-to-determine-perceived-brightness-of-rgb-color
    for (let i = 0; i < imageData.data.length; i += (4 * blockSize)) {
        let [R, G, B, A] = [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3]];
        avgLumAcc += (0.299 * R + 0.587 * G + 0.114 * B) * (A / 255);
        weight += (A / 255);
    }

    return Math.round(avgLumAcc / weight);
};

type rgbaColor = {
    'red': number;
    'green': number;
    'blue': number;
    'alpha': number;
};

export class colorTools {
    private _color: rgbaColor;

    constructor(color: string) {
        this._color = this._rgbaToColors(this._colorToRgba(color));
    }

    set color(color: string) {
        this._color = this._rgbaToColors(this._colorToRgba(color));
    }

    get hex() {
        const colors = [this._color.red, this._color.green, this._color.blue]
            .map(color => ('00' + color.toString(16)).slice(-2));
        return '#' + colors.join('');
    }

    set alpha(alpha: number) {
        this._color.alpha = alpha;
    }

    get alpha() {
        return this._color.alpha;
    }

    get rgbaString() {
        return `rgba(${this._color.red}, ${this._color.green}, ${this._color.blue}, ${this._color.alpha})`;
    }

    get rgba() {
        return { 'red': this._color.red, 'green': this._color.green, 'blue': this._color.blue, 'alpha': this._color.alpha };
    }

    get array() {
        return [this._color.red, this._color.green, this._color.blue, this._color.alpha]
    }

    _colorToRgba(color: string) {
        // If the color is a hex without a # before it, add the # prefix
        color = color.toLowerCase();
        if (typeof color === 'string' && color.match(/^[0-9a-f]{6}$/)) {
            color = '#' + color;
        }

        // Create an HTML canvas element and assign it the color
        // This way we support anything the browser supports
        const ctx = document.createElement('canvas').getContext('2d');
        if (!ctx) throw new Error('Color cannot be parsed');
        ctx.fillStyle = color;
        const fillStyle = ctx.fillStyle;
        let rgbaString;
        if (fillStyle.substring(0, 1) === '#') {
            // It's a hex value
            rgbaString = `rgba(${parseInt(ctx.fillStyle.substring(1, 3), 16)}, ${parseInt(ctx.fillStyle.substring(3, 5), 16)}, ${parseInt(ctx.fillStyle.substring(5, 7), 16)}, 1)`;
        } else if (fillStyle.substring(0, 4) === 'rgba') {
            rgbaString = fillStyle;
        } else {
            throw new Error('Color cannot be parsed');
        }
        return rgbaString;
    };

    _rgbaToColors(rgbaColor: string) {
        const rgbaRexExp = new RegExp('rgba\\((\\d{1,3}),(\\d{1,3}),(\\d{1,3}),(\\d?\\.?\\d){1,}\\)');
        const matches = rgbaColor.replace(/\s/g, '').match(rgbaRexExp);
        if (!matches) throw new Error('Color cannot be parsed');
        const [_, r, g, b, a] = matches;
        return { 'red': parseInt(r, 10), 'green': parseInt(g, 10), 'blue': parseInt(b, 10), 'alpha': parseFloat(a) };
    };
}

export const mapIconToImage = (iconName: string, map: MaplibreMap, iconColor?: string) => {
    const styleImage = map.style.getImage(iconName);
    if (!styleImage) throw new Error('Image not found');
    const imageData = new ImageData(Uint8ClampedArray.from(styleImage.data.data), styleImage.data.width, styleImage.data.height);
    const newImage = new imageTools();

    //newImage.pixelRatio = styleImage.pixelRatio;
    newImage.updateImageData(imageData, styleImage.pixelRatio)

    if (iconColor) {
        const color = new colorTools(iconColor);

        const mask = newImage.colorMask(color.rgbaString, imageData);
        newImage.updateImageData(mask, styleImage.pixelRatio);
    }
    return newImage;
};

export class svgIcon {
    _svgUrl: string; // Stored as a Uri, so it is passed by value

    constructor(svg: string | Element) {
        if (typeof svg === 'string') {
            this._svgUrl = svg;
        } else {
            this._svgUrl = this._toUrl(svg);
        }
    }

    toElement(svgString: string = this._svgUrl): Element {
        //const svgBase64Header = new RegExp('^data:image/svg+base64'); //TODO
        const svgXmlHeader = new RegExp('^data:image\/svg\\+xml,', 'i');
        const escapedChars = new RegExp('%[A-Fa-f0-9]{2,2}', 'g');
        let newString = svgString;

        if (newString.match(svgXmlHeader)) {
            newString = newString.replace(svgXmlHeader, '');
            const replaceables = newString.match(escapedChars) || [];
            newString = replaceables
                .filter((c, i, a) => i === a.indexOf(c))
                .reduce((previous, current) => {
                    const regexp = new RegExp(current, 'g');
                    return previous.replace(regexp, String.fromCharCode(parseInt(current.substring(1), 16)));
                }, newString);
        }

        const span = document.createElement('span');
        span.innerHTML = newString;
        return span.children[0];
    }

    get dataUrl() {
        return this._toUrl();
    }

    _toUrl(svgElement: Element | string = this._svgUrl): string {
        if (typeof svgElement === 'string') {
            return this._svgUrl;
        }
        // https://bl.ocks.org/jennyknuth/222825e315d45a738ed9d6e04c7a88d0
        const replaceables = ['%', '#', '{', '}', '<', '>'];
        const svgString = replaceables.reduce((previous, current) => {
            const r = new RegExp(current, 'g');
            const code = ('%' + (('00' + (current.charCodeAt(0).toString(16))).slice(-2))).toUpperCase();
            return previous.replace(r, code);
        }, svgElement.outerHTML);

        return 'data:image/svg+xml,' + svgString.replace(/"/g, '\'');
    }

    recolor(
        fillColorMap?: Array<[string | undefined, string | undefined]>,
        strokeColorMap?: Array<[string | undefined, string | undefined]>,
        strokeWidth?: number
    ): svgIcon {
        const newSvg = this.toElement();

        [...newSvg.children].forEach(child => {
            const recolor = (field: string, colorMap: Array<[string | undefined, string | undefined]>) => {
                const currentColor = child.getAttribute(field);
                let newColorIdx = -1;
                let newColor = undefined;
                if (currentColor) {
                    // Replace a color (color names must match!)
                    newColorIdx = colorMap.map(c => c[0]).indexOf(currentColor);
                } else {
                    // Replace undefined
                    newColorIdx = colorMap.map(c => c[0]).indexOf(undefined);
                }
                if (newColorIdx > -1) {
                    newColor = colorMap[newColorIdx][1];

                    if (newColor !== undefined) {
                        const colorInfo = new colorTools(newColor);

                        child.setAttribute(field, colorInfo.hex);
                        child.setAttribute(field + '-opacity', colorInfo.alpha.toString());
                    } else if (currentColor) {
                        // Only remove the color if it is defined

                        child.removeAttribute(field);
                        child.removeAttribute(field + '-opacity');
                    }
                }

            };
            if (fillColorMap) recolor('fill', fillColorMap);
            if (strokeColorMap) recolor('stroke', strokeColorMap);
            // Only add stroke width to circles
            if (strokeWidth && child.nodeName === 'circle') {
                let r = child.getAttribute('r');
                if (r) {
                    child.setAttribute('r', (parseInt(r, 10) - strokeWidth).toString());
                }
                child.setAttribute('stroke-width', strokeWidth.toString());
            }
        })
        return new svgIcon(newSvg);
    }

    async addToMap(
        name: string,
        map: MaplibreMap,
        width: number,
        height: number,
        pixelRatio: number = window.devicePixelRatio
    ): Promise<boolean> {

        let data: ImageData;
        try {
            data = await this.toImageData(width, height, pixelRatio);
        } catch (e) {
            throw e;
        }

        if (!map.hasImage(name)) {
            const pixelRatio = window.devicePixelRatio;
            map.addImage(name, data, {
                pixelRatio: pixelRatio
            });
            return true;
        } else {
            return false;
        }

    }

    toImageData(
        width: number,
        height: number,
        pixelRatio: number
    ): Promise<ImageData> {
        return new Promise((res, rej) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const svgImg = new Image();

            // Multiply the size to match the pixel ratio
            width = pixelRatio * width;
            height = pixelRatio * height;
            canvas.width = width;
            canvas.height = height;

            svgImg.onload = () => {
                if (ctx) {
                    ctx.drawImage(svgImg, 0, 0, width, height);
                    const data = ctx.getImageData(
                        0,
                        0,
                        width,
                        height
                    );
                    res(data);
                } else {
                    rej('Unable to create content')
                }
            }
            svgImg.src = this.dataUrl;
        });
    }
}

export class imageTools {
    _img: HTMLImageElement;

    constructor(img = new Image()) {
        this._img = img;
    }

    _getCanvas(height?: number, width?: number) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        height = canvas.height = height || this._img.naturalHeight || this._img.offsetHeight || this._img.height;
        width = canvas.width = width || this._img.naturalWidth || this._img.offsetWidth || this._img.width;

        if (ctx && canvas.height > 0 && canvas.width > 0) {
            ctx.drawImage(this._img, 0, 0, width, height);

            return canvas;
        } else {
            throw new Error('Unable to create content');
        }
    }

    get dataUrl() {
        const canvas = this._getCanvas();
        return canvas.toDataURL();
    }

    updateImageData(imageData: ImageData, pixelRatio = window.devicePixelRatio) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = imageData.width;
        canvas.height = imageData.height;

        if (ctx) {
            ctx.putImageData(imageData, 0, 0);
            this._img.width = imageData.width / pixelRatio;
            this._img.height = imageData.height / pixelRatio;
            this._img.src = canvas.toDataURL();
        }
    }

    get displayedImageData() {
        return this._getImageData();
    }

    get element() {
        return this._img;
    }

    _getImageData(height?: number, width?: number) {
        const canvas = this._getCanvas(height, width);
        const ctx = canvas.getContext('2d');

        if (ctx) {
            const data = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );
            return data;
        } else {
            throw new Error('Unable to create content');
        }
    }

    colorMask(htmlColor: string, imageData = this.displayedImageData) {
        const color = (new colorTools(htmlColor)).array;
        const newImageData = [];
        for (let i = 0; i < imageData.data.length; i++) {
            const idx = i % 4;
            newImageData.push(idx === 3 ? imageData.data[i] : color[idx]);
        }
        return new ImageData(Uint8ClampedArray.from(newImageData), imageData.width, imageData.height);
    };


    setContrastingBackgroundColor(blockSize: number = 5) {
        // blockSize determines how many pixels to sample from
        // Blocksize = 1 would sample all pixels
        // Blocksize = 10 would sample one of every 10 pixels
        const setColor = () => {
            const imageData = this.displayedImageData;
            const averageLux = imageData ? imageAvgLum(imageData, blockSize) : 0; // default to 0, black
            const bgColor = averageLux < (255 / 2) ? 255 : 0;
            this._img.style.backgroundColor = `rgba(${bgColor},${bgColor},${bgColor},1)`;
            return this;
        };

        // If the image is already loaded, set the color, otherwise wait for it
        if (this._img.complete) {
            setColor();
        } else {
            this._img.onload = setColor;
        }
    }
};