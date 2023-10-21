'use strict';

class IconMask {
    constructor(imageName, map, options) {
        const defaultOptions = {
            'minOpacity': 0.5
        };
        this.options = { ...defaultOptions, ...options };
        // Create a mask
        const layerIcon = map.style.getImage(imageName);
        if (layerIcon && layerIcon.data) {
            this.sdf = layerIcon.sdf;
            this.width = layerIcon.data.width;
            this.height = layerIcon.data.height;
            this.layerIconData = layerIcon.data;
            this.pixelRatio = layerIcon.pixelRatio;
            this.mask = this.create();
        }
    }
    imageData() {
        if (this.layerIconData && this.height && this.width) {
            return new ImageData(Uint8ClampedArray.from(this.layerIconData.data), this.width, this.height);
        }
    }
    create(minOpacity = this.options.minOpacity) {
        if (!this.width || !this.height || !this.layerIconData)
            return [];
        const mask = [];
        const minOpacityVal = minOpacity * 100;
        for (let i = 3; i < this.layerIconData.data.length; i += 4) {
            mask.push(this.layerIconData.data[i] >= minOpacityVal);
        }
        return mask;
    }
    readCoord(x, y, tolerance = 0) {
        const checkCoord = (checkX, checkY) => {
            if (this.height &&
                this.width &&
                this.mask &&
                checkY < this.height &&
                checkX < this.width &&
                checkY >= 0 &&
                checkX >= 0) {
                if (this.mask[checkX + (checkY * this.width)]) {
                    return true;
                }
            }
        };
        if (checkCoord(x, y)) {
            return true;
        }
        if (tolerance > 0) {
            // check +-tolerance pixels
            let xOffset, yOffset, xValue, yValue;
            for (xOffset = tolerance * -1; xOffset < tolerance; xOffset++) {
                for (yOffset = tolerance * -1; yOffset < tolerance; yOffset++) {
                    xValue = x + xOffset;
                    yValue = y + yOffset;
                    if (checkCoord(xValue, yValue)) {
                        return true;
                    }
                }
            }
        }
        else {
            return false;
        }
    }
}

const icons = {
    'fill': `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' xml:space='preserve'%3E%3Cpath d='M20.38 17.17V4.83A2.49 2.49 0 0 0 22 2.5 2.5 2.5 0 0 0 19.5 0c-1.07 0-1.98.68-2.33 1.63H4.83A2.486 2.486 0 0 0 2.5 0 2.5 2.5 0 0 0 0 2.5c0 1.07.68 1.98 1.63 2.33v1.33C.68 6.52 0 7.43 0 8.5A2.5 2.5 0 0 0 2.5 11c1.07 0 1.98-.68 2.33-1.63h3.33c.25.67.78 1.21 1.46 1.46v6.33C8.68 17.52 8 18.43 8 19.5a2.5 2.5 0 0 0 2.5 2.5c1.07 0 1.98-.68 2.33-1.63h4.33c.36.95 1.27 1.63 2.34 1.63a2.5 2.5 0 0 0 2.5-2.5c0-1.07-.68-1.98-1.62-2.33zm-3.21 1.46h-4.33c-.25-.67-.78-1.21-1.46-1.46v-6.33C12.32 10.48 13 9.57 13 8.5A2.5 2.5 0 0 0 10.5 6c-1.07 0-1.98.68-2.33 1.63H4.83c-.25-.68-.78-1.21-1.45-1.46V4.83c.67-.25 1.21-.78 1.46-1.46h12.33c.25.67.78 1.21 1.46 1.46v12.33c-.68.26-1.21.79-1.46 1.47zM9.75 8.5c0-.41.34-.75.75-.75s.75.34.75.75-.34.75-.75.75-.75-.34-.75-.75zm9.75-6.75c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zm-17 0c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zm0 7.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm8 11c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm9 0c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75z'/%3E%3C/svg%3E`,
    'line': `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' xml:space='preserve'%3E%3Cpath d='M1 21v-3c.48 0 .94-.02 1.37-.06l.25 2.99C2.1 20.98 1.55 21 1 21zM4.82 20.59l-.7-2.92c.88-.21 1.65-.53 2.3-.94l1.61 2.53c-.92.59-2 1.04-3.21 1.33zm5.05-2.91L7.6 15.72c.5-.58.87-1.27 1.1-2.06l2.88.85c-.36 1.21-.93 2.27-1.71 3.17zm2.11-5.46-2.99-.19c0-.18.01-.36.01-.53 0-.95.08-1.81.23-2.63l2.95.56c-.12.62-.18 1.32-.18 2.07 0 .24-.01.48-.02.72zm.68-4.37L9.91 6.64c.5-1.13 1.21-2.12 2.11-2.92l1.99 2.24c-.58.52-1.02 1.14-1.35 1.89zm2.69-2.78L14 2.39c.94-.47 2.03-.83 3.22-1.06l.57 2.95c-.93.18-1.75.44-2.44.79zM19.6 4.05l-.2-3C19.9 1.02 20.44 1 21 1v3c-.49 0-.96.02-1.4.05z'/%3E%3C/svg%3E`,
    'symbol': `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' style='enable-background:new 0 0 22 22' xml:space='preserve'%3E%3Ccircle cx='11' cy='11' r='4'/%3E%3C/svg%3E`,
    'circle': `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' style='enable-background:new 0 0 22 22' xml:space='preserve'%3E%3Ccircle cx='11' cy='11' r='11'/%3E%3C/svg%3E`
};
const imageAvgLum = (imageData, blockSize) => {
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
class colorTools {
    constructor(color) {
        this._color = this._rgbaToColors(this._colorToRgba(color));
    }
    set color(color) {
        this._color = this._rgbaToColors(this._colorToRgba(color));
    }
    get hex() {
        const colors = [this._color.red, this._color.green, this._color.blue]
            .map(color => ('00' + color.toString(16)).slice(-2));
        return '#' + colors.join('');
    }
    set alpha(alpha) {
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
        return [this._color.red, this._color.green, this._color.blue, this._color.alpha];
    }
    _colorToRgba(color) {
        // If the color is a hex without a # before it, add the # prefix
        color = color.toLowerCase();
        if (typeof color === 'string' && color.match(/^[0-9a-f]{6}$/)) {
            color = '#' + color;
        }
        // Create an HTML canvas element and assign it the color
        // This way we support anything the browser supports
        const ctx = document.createElement('canvas').getContext('2d');
        if (!ctx)
            throw new Error('Color cannot be parsed');
        ctx.fillStyle = color;
        const fillStyle = ctx.fillStyle;
        let rgbaString;
        if (fillStyle.substring(0, 1) === '#') {
            // It's a hex value
            rgbaString = `rgba(${parseInt(ctx.fillStyle.substring(1, 3), 16)}, ${parseInt(ctx.fillStyle.substring(3, 5), 16)}, ${parseInt(ctx.fillStyle.substring(5, 7), 16)}, 1)`;
        }
        else if (fillStyle.substring(0, 4) === 'rgba') {
            rgbaString = fillStyle;
        }
        else {
            throw new Error('Color cannot be parsed');
        }
        return rgbaString;
    }
    ;
    _rgbaToColors(rgbaColor) {
        const rgbaRexExp = new RegExp('rgba\\((\\d{1,3}),(\\d{1,3}),(\\d{1,3}),(\\d?\\.?\\d){1,}\\)');
        const matches = rgbaColor.replace(/\s/g, '').match(rgbaRexExp);
        if (!matches)
            throw new Error('Color cannot be parsed');
        const [_, r, g, b, a] = matches;
        return { 'red': parseInt(r, 10), 'green': parseInt(g, 10), 'blue': parseInt(b, 10), 'alpha': parseFloat(a) };
    }
    ;
}
const mapIconToImage = (iconName, map, iconColor) => {
    const styleImage = map.style.getImage(iconName);
    if (!styleImage)
        throw new Error('Image not found');
    const imageData = new ImageData(Uint8ClampedArray.from(styleImage.data.data), styleImage.data.width, styleImage.data.height);
    const newImage = new imageTools();
    //newImage.pixelRatio = styleImage.pixelRatio;
    newImage.updateImageData(imageData, styleImage.pixelRatio);
    if (iconColor) {
        const color = new colorTools(iconColor);
        const mask = newImage.colorMask(color.rgbaString, imageData);
        newImage.updateImageData(mask, styleImage.pixelRatio);
    }
    return newImage;
};
class svgIcon {
    constructor(svg) {
        if (typeof svg === 'string') {
            this._svgUrl = svg;
        }
        else {
            this._svgUrl = this._toUrl(svg);
        }
    }
    toElement(svgString = this._svgUrl) {
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
    _toUrl(svgElement = this._svgUrl) {
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
    recolor(fillColorMap, strokeColorMap, strokeWidth) {
        const newSvg = this.toElement();
        [...newSvg.children].forEach(child => {
            const recolor = (field, colorMap) => {
                const currentColor = child.getAttribute(field);
                let newColorIdx = -1;
                let newColor = undefined;
                if (currentColor) {
                    // Replace a color (color names must match!)
                    newColorIdx = colorMap.map(c => c[0]).indexOf(currentColor);
                }
                else {
                    // Replace undefined
                    newColorIdx = colorMap.map(c => c[0]).indexOf(undefined);
                }
                if (newColorIdx > -1) {
                    newColor = colorMap[newColorIdx][1];
                    if (newColor !== undefined) {
                        const colorInfo = new colorTools(newColor);
                        child.setAttribute(field, colorInfo.hex);
                        child.setAttribute(field + '-opacity', colorInfo.alpha.toString());
                    }
                    else if (currentColor) {
                        // Only remove the color if it is defined
                        child.removeAttribute(field);
                        child.removeAttribute(field + '-opacity');
                    }
                }
            };
            if (fillColorMap)
                recolor('fill', fillColorMap);
            if (strokeColorMap)
                recolor('stroke', strokeColorMap);
            // Only add stroke width to circles
            if (strokeWidth && child.nodeName === 'circle') {
                let r = child.getAttribute('r');
                if (r) {
                    child.setAttribute('r', (parseInt(r, 10) - strokeWidth).toString());
                }
                child.setAttribute('stroke-width', strokeWidth.toString());
            }
        });
        return new svgIcon(newSvg);
    }
    async addToMap(name, map, width, height, pixelRatio = window.devicePixelRatio) {
        let data;
        try {
            data = await this.toImageData(width, height, pixelRatio);
        }
        catch (e) {
            throw e;
        }
        if (!map.hasImage(name)) {
            const pixelRatio = window.devicePixelRatio;
            map.addImage(name, data, {
                pixelRatio: pixelRatio
            });
            return true;
        }
        else {
            return false;
        }
    }
    toImageData(width, height, pixelRatio) {
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
                    const data = ctx.getImageData(0, 0, width, height);
                    res(data);
                }
                else {
                    rej('Unable to create content');
                }
            };
            svgImg.src = this.dataUrl;
        });
    }
}
class imageTools {
    constructor(img = new Image()) {
        this._img = img;
    }
    _getCanvas(height, width) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        height = canvas.height = height || this._img.naturalHeight || this._img.offsetHeight || this._img.height;
        width = canvas.width = width || this._img.naturalWidth || this._img.offsetWidth || this._img.width;
        if (ctx && canvas.height > 0 && canvas.width > 0) {
            ctx.drawImage(this._img, 0, 0, width, height);
            return canvas;
        }
        else {
            throw new Error('Unable to create content');
        }
    }
    get dataUrl() {
        const canvas = this._getCanvas();
        return canvas.toDataURL();
    }
    updateImageData(imageData, pixelRatio = window.devicePixelRatio) {
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
    _getImageData(height, width) {
        const canvas = this._getCanvas(height, width);
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            return data;
        }
        else {
            throw new Error('Unable to create content');
        }
    }
    colorMask(htmlColor, imageData = this.displayedImageData) {
        const color = (new colorTools(htmlColor)).array;
        const newImageData = [];
        for (let i = 0; i < imageData.data.length; i++) {
            const idx = i % 4;
            newImageData.push(idx === 3 ? imageData.data[i] : color[idx]);
        }
        return new ImageData(Uint8ClampedArray.from(newImageData), imageData.width, imageData.height);
    }
    ;
    setContrastingBackgroundColor(blockSize = 5) {
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
        }
        else {
            this._img.onload = setColor;
        }
    }
}

const emptyMapTemplate = {
    'container': document.createElement('div'),
    'style': {
        'version': 8,
        'glyphs': '{fontstack}/{range}.pbf',
        'sources': {
            'blank': {
                'type': 'geojson',
                'data': {
                    "type": "FeatureCollection",
                    "features": []
                }
            }
        },
        'layers': []
    }
};
class maplibreTextTemplate {
    constructor(mapLibrary) {
        this._map = new mapLibrary.Map(emptyMapTemplate);
    }
    evaluateText(expression, properties, featureState) {
        const p = document.createElement('p');
        this._evaluate(expression, properties, featureState)
            .then(sections => p.textContent = sections.map(section => section.text).join(''));
        return p;
    }
    ;
    evaluateHtml(expression, properties, featureState, map) {
        const imageList = map ? map.style._availableImages : [];
        const div = document.createElement('div');
        this._evaluate(expression, properties, featureState, undefined, imageList)
            .then(sections => {
            sections.forEach(section => div.appendChild(this._sectionToHtml(section, map)));
            //console.log('sections', sections, div);
        }).catch(e => {
            //console.error('ERROR WITH DIV', e);
        });
        return div;
    }
    ;
    _sectionToHtml(section, map) {
        const span = document.createElement('span');
        span.textContent = section.text || null;
        if (section.fontStack) {
            span.style.fontFamily = section.fontStack;
        }
        if (section.scale) {
            span.style.fontSize = (section.scale * 100) + '%';
        }
        if (section.textColor) {
            span.style.color = section.textColor;
        }
        if (map && section.image) {
            if (map.hasImage(section.image)) {
                const img = this._drawIcon(section.image, section.image, map);
                if (img) {
                    span.appendChild(img);
                }
            }
        }
        return span;
    }
    async _evaluate(expression, properties, featureState, tileId, availableImages) {
        const layerId = Math.random().toString(32).substring(2);
        this._map.addLayer({
            'id': layerId,
            'source': 'blank',
            'type': 'symbol',
            'layout': {
                'text-field': expression
            }
        });
        await new Promise(res => this._map.once('styledata', () => res()));
        const layer = this._map.getLayer(layerId);
        const sections = (layer.layout && layer.layout._values['text-field'].evaluate({ 'properties': properties, 'state': featureState }, featureState, tileId, availableImages).sections) || [];
        this._map.removeLayer(layerId);
        return sections;
    }
    _drawIcon(iconName, altText, map) {
        const image = mapIconToImage(iconName, map);
        if (altText && altText.toString) {
            image.element.title = image.element.alt = altText.toString();
        }
        return image.element;
    }
}

class BindPopup {
    constructor(popupTemplate, options, mapLibrary) {
        const defaultOptions = {
            closeButton: true,
            closeOnClick: true,
            closeOnMove: false,
            focusAfterOpen: true,
            pointer: 'pointer',
            tolerance: 3,
            formatter: this._formatter.bind(this),
            templater: this._templater.bind(this),
            highlightFeature: false
        };
        if (options.highlightFeature) {
            const highlightObj = typeof options.highlightFeature === 'object' ?
                options.highlightFeature :
                {};
            options.highlightFeature = {
                ...{
                    highlightColor: '#00ffff',
                    opacity: undefined,
                    layerName: Math.random().toString(36).substring(2),
                    layerConfig: undefined
                },
                ...highlightObj
            };
        }
        // Set some defaults for a tooltip
        if (options.type === 'tooltip') {
            defaultOptions.anchor = 'top-left';
            defaultOptions.focusAfterOpen = false;
        }
        // If we're using the default, load the map expession template
        if (!options.formatter && !options.templater) {
            this._expressionTemplate = new maplibreTextTemplate(mapLibrary);
        }
        this.options = { ...defaultOptions, ...options };
        this.popupTemplate = popupTemplate;
        this.popup = new mapLibrary.Popup(this.options);
    }
    showing() {
        return this.popup.isOpen;
    }
    showMulti(lngLat, features, context, map, activePopups) {
        if (!this.options.multiFormatter) {
            throw new Error('No multiFormatter found');
        }
        this._show(lngLat, this.options.multiFormatter(features, this.popupTemplate, map, activePopups, this.popup), context);
    }
    show(lngLat, feature, context, map, activePopups, highlight = this.options.highlightFeature !== false) {
        this._show(lngLat, (this.options.formatter || this._formatter)(feature, this.popupTemplate, map, activePopups), context);
        if (map && highlight) {
            this.highlightFeature(feature, map);
            this.popup.on('close', _ => console.log('CLOSED'));
        }
    }
    highlightFeature(feature, map) {
        var _a;
        feature.id = feature.id || Math.floor(Math.random() * 100);
        feature.state['hover'] = true;
        //console.log('highlighting feature', feature);
        if (typeof this.options.highlightFeature !== 'object') {
            throw new Error('Invalid type of highlight layer:' + typeof this.options.highlightFeature);
        }
        const options = this.options.highlightFeature;
        const highLightColor = new colorTools(options.highlightColor);
        highLightColor.alpha = options.opacity ? options.opacity : highLightColor.alpha;
        const featureType = feature.layer.type;
        let layerIcon, layerCircleSize, layerLineWidth, layerLayout;
        if (featureType === 'symbol') {
            layerIcon = (_a = feature.layer.layout['icon-image']) === null || _a === void 0 ? void 0 : _a.name; // TODO if this doesn't exist, just make it a circle
        }
        else if (featureType === 'circle') {
            layerCircleSize = feature.layer.paint['circle-radius'];
        }
        else if (featureType === 'line') {
            layerLineWidth = feature.layer.paint['line-width'];
            layerLayout = feature.layer.layout;
        }
        const removeUndefined = (obj) => Object.keys(obj)
            .map(key => [key, obj[key]])
            .filter(v => v[1] !== undefined && v[1] !== null)
            .reduce((previous, current) => ({ ...previous, ...{ [current[0]]: current[1] } }), {});
        const featureTypeMap = {
            'circle': {
                'type': 'circle',
                'paint': removeUndefined({
                    "circle-color": highLightColor.hex,
                    "circle-radius": layerCircleSize,
                    "circle-opacity": highLightColor.alpha
                })
            },
            'fill': {
                'type': 'fill',
                'paint': removeUndefined({
                    "fill-color": highLightColor.hex,
                    "fill-opacity": highLightColor.alpha
                })
            },
            'line': {
                'type': 'line',
                'paint': removeUndefined({
                    "line-color": highLightColor.hex,
                    "line-width": layerLineWidth,
                    "line-opacity": highLightColor.alpha
                }),
                layout: removeUndefined(layerLayout || {})
            },
            'symbol': {
                'type': 'symbol',
                'layout': {
                    "icon-image": layerIcon
                },
                'paint': removeUndefined({
                    'icon-color': options.highlightColor,
                    'icon-opacity': highLightColor.alpha
                })
            },
        };
        // Get the feature type
        const data = feature.toJSON();
        // Layer Name is important
        if (!options.layerName) {
            options.layerName = Math.random().toString(36).substring(2);
        }
        // Add a new layer to the map for this feature
        map.addSource(options.layerName, {
            'type': 'geojson',
            'data': data
        });
        map.addLayer({
            ...(featureTypeMap[featureType] || featureTypeMap['circle']),
            'minzoom': 0,
            'maxzoom': 20,
            ...(options.layerConfig || {}),
            ...{
                'id': options.layerName,
                'source': options.layerName
            }
        });
        this.popup.once('close', () => {
            if (options.layerName) {
                if (map.getLayer(options.layerName))
                    map.removeLayer(options.layerName);
                if (map.getSource(options.layerName))
                    map.removeSource(options.layerName);
            }
        });
        return options.layerName;
    }
    _show(lngLat, content, context) {
        if (context instanceof HTMLElement) {
            // Add the popup to a DOM Object
            context.appendChild(content);
        }
        else {
            this.popup.setDOMContent(content);
            this.popup.setLngLat(lngLat);
            this.popup.addTo(context);
        }
    }
    _templater(exp, feature, map) {
        if (typeof exp === 'string') {
            return this._simpleTemplater(exp, feature.properties);
        }
        else if (this._expressionTemplate) {
            return this._expressionTemplate.evaluateHtml(exp, feature.properties, feature.state, map);
        }
        else {
            throw new Error('Cannot load expression template');
        }
    }
    ;
    _simpleTemplater(exp, obj) {
        const span = document.createElement('span');
        Object.keys(obj).forEach(key => {
            const re = new RegExp('{' + key + '}', 'g');
            exp = exp.replace(re, obj[key]);
        });
        span.textContent = exp;
        return span;
    }
    ;
    _formatter(feature, popupTemplate, map) {
        const templater = this.options.templater || this._templater;
        const templateToElement = (elementType, exp) => {
            const el = document.createElement(elementType);
            let content = templater(exp, feature, map);
            if (typeof content === 'string') {
                el.textContent = content;
            }
            else {
                el.appendChild(content);
            }
            return el;
        };
        const div = document.createElement('div');
        if (popupTemplate === undefined) {
            throw new Error('The default Popup Formatter requires a template');
        }
        else if (typeof popupTemplate === 'string') {
            div.appendChild(templateToElement('p', popupTemplate));
        }
        else if (popupTemplate instanceof HTMLElement) {
            div.appendChild(popupTemplate);
        }
        else {
            // Header
            if (popupTemplate.header) {
                const header = div.appendChild(templateToElement('strong', popupTemplate.header));
                div.appendChild(header);
            }
            // Body
            if (popupTemplate.body) {
                if (popupTemplate.body instanceof HTMLElement) {
                    div.appendChild(popupTemplate.body);
                }
                else {
                    const body = div.appendChild(templateToElement('div', popupTemplate.body));
                    div.appendChild(body);
                }
            }
            // Footer
            if (popupTemplate.footer) {
                const footer = div.appendChild(templateToElement('div', popupTemplate.footer));
                div.appendChild(footer);
            }
        }
        return div;
    }
}

const toCSSRgba = (rgba) => {
    if (!rgba)
        return;
    return `rgba(${Math.round(rgba.r * 255)},${Math.round(rgba.g * 255)},${Math.round(rgba.b * 255)},${rgba.a})`;
};
function formatter(features, _, map, activePopups, parentPopup) {
    if (!map || !activePopups) {
        throw new Error('activePopups is required for the default multi popup');
    }
    const div = document.createElement('div');
    div.classList.add('maplibregl-popup-content-multipopup');
    const ulElement = document.createElement('ul');
    const layers = getLayers(features, map, activePopups, parentPopup);
    // Go through the groups and create the list
    Object.keys(layers).forEach(group => {
        const liElement = document.createElement('li');
        liElement.textContent = group;
        // Build the group info
        const ulSubElement = buildGroup(layers[group], map, div);
        liElement.appendChild(ulSubElement);
        ulElement.appendChild(liElement);
    });
    div.appendChild(ulElement);
    return div;
}
const getLayers = (features, map, activePopups, parentPopup) => features.map(feature => {
    var _a, _b;
    const popup = (_a = activePopups.get('popup')) === null || _a === void 0 ? void 0 : _a.get(feature.layer.id);
    let iconColor = toCSSRgba(feature.layer.paint[feature.layer.type + '-color']) || //circle-color, fill-color, etc
        toCSSRgba(feature.layer.paint['icon-color']); //symbols have -color (and text-color, but we can ignore that)
    if (iconColor && feature.layer.paint[feature.layer.type + '-opacity'] !== undefined) {
        const newColor = new colorTools(iconColor);
        newColor.alpha = feature.layer.paint[feature.layer.type + '-opacity'];
        iconColor = newColor.rgbaString;
    }
    let iconStroke = toCSSRgba(feature.layer.paint['circle-stroke-color']) ||
        toCSSRgba(feature.layer.paint['fill-outline-color']);
    if (iconStroke && feature.layer.paint['circle-stroke-opacity'] !== undefined) {
        const newColor = new colorTools(iconStroke);
        newColor.alpha = feature.layer.paint['circle-stroke-opacity'];
        iconStroke = newColor.rgbaString;
    }
    let iconStrokeWidth = undefined;
    if (iconStroke) {
        iconStrokeWidth = feature.layer.paint['circle-stroke-width'] || 1;
    }
    const content = document.createElement('div');
    let textContent = '';
    let groupIcon; // Allow an icon to be defined in the popup config
    let symbolIcon;
    let groupName = feature.layer.id;
    if (popup) {
        // If the current layer has a popup, get its popup element, and put it in an internal div
        popup.show([0, 0], feature, content, map, undefined, false);
        // Look through that internal div and find the first child that has a text content
        // And use that textContent as the description
        textContent = [...content.children[0].children].map(child => child.textContent).filter(s => s && s.trim().length)[0] || '';
        // If there are no children inside the popup that have a text Content, use something generic
        // in this case "Symbol Feature"
        if (textContent.trim() === '') {
            textContent = feature.layer.type + ' Feature';
        }
        groupName = popup.options.groupName || groupName;
        groupIcon = popup.options.icon;
        // If the feature is a symbol, it may have an icon-image (it can also just be text), we should try to use its icon if it has one
        if (feature.layer.type === 'symbol') {
            symbolIcon = (_b = feature.layer.layout['icon-image']) === null || _b === void 0 ? void 0 : _b.name;
        }
        // bind Events to parent
        parentPopup === null || parentPopup === void 0 ? void 0 : parentPopup.on('open', (e) => popup.popup.fire('open', e));
        parentPopup === null || parentPopup === void 0 ? void 0 : parentPopup.on('close', (e) => popup.popup.fire('close', e));
    }
    return {
        'groupName': groupName,
        'groupIcon': groupIcon,
        'symbolIcon': symbolIcon,
        'popup': popup,
        'primaryKeys': popup === null || popup === void 0 ? void 0 : popup.options.primaryKeys,
        'iconColor': iconColor,
        'iconStroke': iconStroke,
        'iconStrokeWidth': iconStrokeWidth,
        'content': content,
        'textContent': textContent,
        'feature': feature
    };
}).reduce((layers, currentLayer) => {
    if (currentLayer.popup) {
        // Add this popup to the group
        layers[currentLayer.groupName] = layers[currentLayer.groupName] || [];
        layers[currentLayer.groupName].push(currentLayer);
    }
    return layers;
}, {});
const buildGroup = (group, map, parent) => {
    const ulSubElement = document.createElement('ul');
    group.forEach(layer => {
        const liSubElement = document.createElement('li');
        const liAnchorElement = document.createElement('a');
        // Deal with the image
        const imageName = layer.symbolIcon || layer.groupIcon;
        let img;
        if (imageName) {
            // There's a named image, pull it from the map
            // Will throw an error if no image found
            try {
                img = mapIconToImage(imageName, map, layer.iconColor);
            }
            catch (e) {
                img = undefined;
            }
        }
        if (!img) {
            // No image was pulled from the name, so create a generic one from an SVG
            let svg = new svgIcon(icons[layer.feature.layer.type] || icons.symbol);
            if (layer.iconColor) {
                const fillColor = new colorTools(layer.iconColor).rgbaString;
                const strokeColor = layer.iconStroke && new colorTools(layer.iconStroke).rgbaString;
                svg = svg.recolor([[undefined, fillColor]], (strokeColor && layer.feature.layer.type === 'circle') ? [[undefined, strokeColor]] : undefined, layer.iconStrokeWidth);
            }
            img = new imageTools();
            img.element.src = svg.dataUrl;
        }
        // Add a background color to the image to contrast its content
        img.setContrastingBackgroundColor(5);
        liAnchorElement.textContent = ' ' + layer.textContent; // TODO, use CSS, not a space
        liAnchorElement.href = '#';
        liAnchorElement.tabIndex = 0;
        liAnchorElement.addEventListener('click', (e) => {
            e.preventDefault();
            displaySubLayer(layer, parent, map);
        }, false);
        liSubElement.appendChild(img.element);
        liSubElement.appendChild(liAnchorElement);
        ulSubElement.appendChild(liSubElement);
    });
    return ulSubElement;
};
const displaySubLayer = (layer, parent, map) => {
    // Cache the current content
    const oldContent = [...parent.children];
    let highlightLayer;
    if (map && layer.popup.options.highlightFeature) {
        highlightLayer = layer.popup.highlightFeature(layer.feature, map);
    }
    const removeHighlight = () => {
        // Remove the highlight
        if (map && highlightLayer) {
            if (map.getLayer(highlightLayer))
                map.removeLayer(highlightLayer);
            if (map.getSource(highlightLayer))
                map.removeSource(highlightLayer);
        }
    };
    layer.popup.popup.once('close', (e) => {
        removeHighlight();
    });
    // Create the back button
    const backButton = document.createElement('a');
    backButton.href = '';
    backButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Remove the display content
        [...parent.children].forEach(child => parent.removeChild(child));
        // Add the cached content back
        oldContent.forEach(child => parent.appendChild(child));
        removeHighlight();
    }, false);
    backButton.textContent = '« Back';
    // Remove the current content
    [...parent.children].forEach(child => parent.removeChild(child));
    // Add the new content
    parent.appendChild(layer.content);
    // Add the back button
    parent.appendChild(backButton);
};

/**
 * splaytree v3.1.2
 * Fast Splay tree for Node and browser
 *
 * @author Alexander Milevski <info@w8r.name>
 * @license MIT
 * @preserve
 */

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Node = /** @class */ (function () {
    function Node(key, data) {
        this.next = null;
        this.key = key;
        this.data = data;
        this.left = null;
        this.right = null;
    }
    return Node;
}());

/* follows "An implementation of top-down splaying"
 * by D. Sleator <sleator@cs.cmu.edu> March 1992
 */
function DEFAULT_COMPARE(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}
/**
 * Simple top down splay, not requiring i to be in the tree t.
 */
function splay(i, t, comparator) {
    var N = new Node(null, null);
    var l = N;
    var r = N;
    while (true) {
        var cmp = comparator(i, t.key);
        //if (i < t.key) {
        if (cmp < 0) {
            if (t.left === null)
                break;
            //if (i < t.left.key) {
            if (comparator(i, t.left.key) < 0) {
                var y = t.left; /* rotate right */
                t.left = y.right;
                y.right = t;
                t = y;
                if (t.left === null)
                    break;
            }
            r.left = t; /* link right */
            r = t;
            t = t.left;
            //} else if (i > t.key) {
        }
        else if (cmp > 0) {
            if (t.right === null)
                break;
            //if (i > t.right.key) {
            if (comparator(i, t.right.key) > 0) {
                var y = t.right; /* rotate left */
                t.right = y.left;
                y.left = t;
                t = y;
                if (t.right === null)
                    break;
            }
            l.right = t; /* link left */
            l = t;
            t = t.right;
        }
        else
            break;
    }
    /* assemble */
    l.right = t.left;
    r.left = t.right;
    t.left = N.right;
    t.right = N.left;
    return t;
}
function insert(i, data, t, comparator) {
    var node = new Node(i, data);
    if (t === null) {
        node.left = node.right = null;
        return node;
    }
    t = splay(i, t, comparator);
    var cmp = comparator(i, t.key);
    if (cmp < 0) {
        node.left = t.left;
        node.right = t;
        t.left = null;
    }
    else if (cmp >= 0) {
        node.right = t.right;
        node.left = t;
        t.right = null;
    }
    return node;
}
function split(key, v, comparator) {
    var left = null;
    var right = null;
    if (v) {
        v = splay(key, v, comparator);
        var cmp = comparator(v.key, key);
        if (cmp === 0) {
            left = v.left;
            right = v.right;
        }
        else if (cmp < 0) {
            right = v.right;
            v.right = null;
            left = v;
        }
        else {
            left = v.left;
            v.left = null;
            right = v;
        }
    }
    return { left: left, right: right };
}
function merge(left, right, comparator) {
    if (right === null)
        return left;
    if (left === null)
        return right;
    right = splay(left.key, right, comparator);
    right.left = left;
    return right;
}
/**
 * Prints level of the tree
 */
function printRow(root, prefix, isTail, out, printNode) {
    if (root) {
        out("" + prefix + (isTail ? '└── ' : '├── ') + printNode(root) + "\n");
        var indent = prefix + (isTail ? '    ' : '│   ');
        if (root.left)
            printRow(root.left, indent, false, out, printNode);
        if (root.right)
            printRow(root.right, indent, true, out, printNode);
    }
}
var Tree = /** @class */ (function () {
    function Tree(comparator) {
        if (comparator === void 0) { comparator = DEFAULT_COMPARE; }
        this._root = null;
        this._size = 0;
        this._comparator = comparator;
    }
    /**
     * Inserts a key, allows duplicates
     */
    Tree.prototype.insert = function (key, data) {
        this._size++;
        return this._root = insert(key, data, this._root, this._comparator);
    };
    /**
     * Adds a key, if it is not present in the tree
     */
    Tree.prototype.add = function (key, data) {
        var node = new Node(key, data);
        if (this._root === null) {
            node.left = node.right = null;
            this._size++;
            this._root = node;
        }
        var comparator = this._comparator;
        var t = splay(key, this._root, comparator);
        var cmp = comparator(key, t.key);
        if (cmp === 0)
            this._root = t;
        else {
            if (cmp < 0) {
                node.left = t.left;
                node.right = t;
                t.left = null;
            }
            else if (cmp > 0) {
                node.right = t.right;
                node.left = t;
                t.right = null;
            }
            this._size++;
            this._root = node;
        }
        return this._root;
    };
    /**
     * @param  {Key} key
     * @return {Node|null}
     */
    Tree.prototype.remove = function (key) {
        this._root = this._remove(key, this._root, this._comparator);
    };
    /**
     * Deletes i from the tree if it's there
     */
    Tree.prototype._remove = function (i, t, comparator) {
        var x;
        if (t === null)
            return null;
        t = splay(i, t, comparator);
        var cmp = comparator(i, t.key);
        if (cmp === 0) { /* found it */
            if (t.left === null) {
                x = t.right;
            }
            else {
                x = splay(i, t.left, comparator);
                x.right = t.right;
            }
            this._size--;
            return x;
        }
        return t; /* It wasn't there */
    };
    /**
     * Removes and returns the node with smallest key
     */
    Tree.prototype.pop = function () {
        var node = this._root;
        if (node) {
            while (node.left)
                node = node.left;
            this._root = splay(node.key, this._root, this._comparator);
            this._root = this._remove(node.key, this._root, this._comparator);
            return { key: node.key, data: node.data };
        }
        return null;
    };
    /**
     * Find without splaying
     */
    Tree.prototype.findStatic = function (key) {
        var current = this._root;
        var compare = this._comparator;
        while (current) {
            var cmp = compare(key, current.key);
            if (cmp === 0)
                return current;
            else if (cmp < 0)
                current = current.left;
            else
                current = current.right;
        }
        return null;
    };
    Tree.prototype.find = function (key) {
        if (this._root) {
            this._root = splay(key, this._root, this._comparator);
            if (this._comparator(key, this._root.key) !== 0)
                return null;
        }
        return this._root;
    };
    Tree.prototype.contains = function (key) {
        var current = this._root;
        var compare = this._comparator;
        while (current) {
            var cmp = compare(key, current.key);
            if (cmp === 0)
                return true;
            else if (cmp < 0)
                current = current.left;
            else
                current = current.right;
        }
        return false;
    };
    Tree.prototype.forEach = function (visitor, ctx) {
        var current = this._root;
        var Q = []; /* Initialize stack s */
        var done = false;
        while (!done) {
            if (current !== null) {
                Q.push(current);
                current = current.left;
            }
            else {
                if (Q.length !== 0) {
                    current = Q.pop();
                    visitor.call(ctx, current);
                    current = current.right;
                }
                else
                    done = true;
            }
        }
        return this;
    };
    /**
     * Walk key range from `low` to `high`. Stops if `fn` returns a value.
     */
    Tree.prototype.range = function (low, high, fn, ctx) {
        var Q = [];
        var compare = this._comparator;
        var node = this._root;
        var cmp;
        while (Q.length !== 0 || node) {
            if (node) {
                Q.push(node);
                node = node.left;
            }
            else {
                node = Q.pop();
                cmp = compare(node.key, high);
                if (cmp > 0) {
                    break;
                }
                else if (compare(node.key, low) >= 0) {
                    if (fn.call(ctx, node))
                        return this; // stop if smth is returned
                }
                node = node.right;
            }
        }
        return this;
    };
    /**
     * Returns array of keys
     */
    Tree.prototype.keys = function () {
        var keys = [];
        this.forEach(function (_a) {
            var key = _a.key;
            return keys.push(key);
        });
        return keys;
    };
    /**
     * Returns array of all the data in the nodes
     */
    Tree.prototype.values = function () {
        var values = [];
        this.forEach(function (_a) {
            var data = _a.data;
            return values.push(data);
        });
        return values;
    };
    Tree.prototype.min = function () {
        if (this._root)
            return this.minNode(this._root).key;
        return null;
    };
    Tree.prototype.max = function () {
        if (this._root)
            return this.maxNode(this._root).key;
        return null;
    };
    Tree.prototype.minNode = function (t) {
        if (t === void 0) { t = this._root; }
        if (t)
            while (t.left)
                t = t.left;
        return t;
    };
    Tree.prototype.maxNode = function (t) {
        if (t === void 0) { t = this._root; }
        if (t)
            while (t.right)
                t = t.right;
        return t;
    };
    /**
     * Returns node at given index
     */
    Tree.prototype.at = function (index) {
        var current = this._root;
        var done = false;
        var i = 0;
        var Q = [];
        while (!done) {
            if (current) {
                Q.push(current);
                current = current.left;
            }
            else {
                if (Q.length > 0) {
                    current = Q.pop();
                    if (i === index)
                        return current;
                    i++;
                    current = current.right;
                }
                else
                    done = true;
            }
        }
        return null;
    };
    Tree.prototype.next = function (d) {
        var root = this._root;
        var successor = null;
        if (d.right) {
            successor = d.right;
            while (successor.left)
                successor = successor.left;
            return successor;
        }
        var comparator = this._comparator;
        while (root) {
            var cmp = comparator(d.key, root.key);
            if (cmp === 0)
                break;
            else if (cmp < 0) {
                successor = root;
                root = root.left;
            }
            else
                root = root.right;
        }
        return successor;
    };
    Tree.prototype.prev = function (d) {
        var root = this._root;
        var predecessor = null;
        if (d.left !== null) {
            predecessor = d.left;
            while (predecessor.right)
                predecessor = predecessor.right;
            return predecessor;
        }
        var comparator = this._comparator;
        while (root) {
            var cmp = comparator(d.key, root.key);
            if (cmp === 0)
                break;
            else if (cmp < 0)
                root = root.left;
            else {
                predecessor = root;
                root = root.right;
            }
        }
        return predecessor;
    };
    Tree.prototype.clear = function () {
        this._root = null;
        this._size = 0;
        return this;
    };
    Tree.prototype.toList = function () {
        return toList(this._root);
    };
    /**
     * Bulk-load items. Both array have to be same size
     */
    Tree.prototype.load = function (keys, values, presort) {
        if (values === void 0) { values = []; }
        if (presort === void 0) { presort = false; }
        var size = keys.length;
        var comparator = this._comparator;
        // sort if needed
        if (presort)
            sort(keys, values, 0, size - 1, comparator);
        if (this._root === null) { // empty tree
            this._root = loadRecursive(keys, values, 0, size);
            this._size = size;
        }
        else { // that re-builds the whole tree from two in-order traversals
            var mergedList = mergeLists(this.toList(), createList(keys, values), comparator);
            size = this._size + size;
            this._root = sortedListToBST({ head: mergedList }, 0, size);
        }
        return this;
    };
    Tree.prototype.isEmpty = function () { return this._root === null; };
    Object.defineProperty(Tree.prototype, "size", {
        get: function () { return this._size; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "root", {
        get: function () { return this._root; },
        enumerable: true,
        configurable: true
    });
    Tree.prototype.toString = function (printNode) {
        if (printNode === void 0) { printNode = function (n) { return String(n.key); }; }
        var out = [];
        printRow(this._root, '', true, function (v) { return out.push(v); }, printNode);
        return out.join('');
    };
    Tree.prototype.update = function (key, newKey, newData) {
        var comparator = this._comparator;
        var _a = split(key, this._root, comparator), left = _a.left, right = _a.right;
        if (comparator(key, newKey) < 0) {
            right = insert(newKey, newData, right, comparator);
        }
        else {
            left = insert(newKey, newData, left, comparator);
        }
        this._root = merge(left, right, comparator);
    };
    Tree.prototype.split = function (key) {
        return split(key, this._root, this._comparator);
    };
    Tree.prototype[Symbol.iterator] = function () {
        var current, Q, done;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    current = this._root;
                    Q = [];
                    done = false;
                    _a.label = 1;
                case 1:
                    if (!!done) return [3 /*break*/, 6];
                    if (!(current !== null)) return [3 /*break*/, 2];
                    Q.push(current);
                    current = current.left;
                    return [3 /*break*/, 5];
                case 2:
                    if (!(Q.length !== 0)) return [3 /*break*/, 4];
                    current = Q.pop();
                    return [4 /*yield*/, current];
                case 3:
                    _a.sent();
                    current = current.right;
                    return [3 /*break*/, 5];
                case 4:
                    done = true;
                    _a.label = 5;
                case 5: return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    };
    return Tree;
}());
function loadRecursive(keys, values, start, end) {
    var size = end - start;
    if (size > 0) {
        var middle = start + Math.floor(size / 2);
        var key = keys[middle];
        var data = values[middle];
        var node = new Node(key, data);
        node.left = loadRecursive(keys, values, start, middle);
        node.right = loadRecursive(keys, values, middle + 1, end);
        return node;
    }
    return null;
}
function createList(keys, values) {
    var head = new Node(null, null);
    var p = head;
    for (var i = 0; i < keys.length; i++) {
        p = p.next = new Node(keys[i], values[i]);
    }
    p.next = null;
    return head.next;
}
function toList(root) {
    var current = root;
    var Q = [];
    var done = false;
    var head = new Node(null, null);
    var p = head;
    while (!done) {
        if (current) {
            Q.push(current);
            current = current.left;
        }
        else {
            if (Q.length > 0) {
                current = p = p.next = Q.pop();
                current = current.right;
            }
            else
                done = true;
        }
    }
    p.next = null; // that'll work even if the tree was empty
    return head.next;
}
function sortedListToBST(list, start, end) {
    var size = end - start;
    if (size > 0) {
        var middle = start + Math.floor(size / 2);
        var left = sortedListToBST(list, start, middle);
        var root = list.head;
        root.left = left;
        list.head = list.head.next;
        root.right = sortedListToBST(list, middle + 1, end);
        return root;
    }
    return null;
}
function mergeLists(l1, l2, compare) {
    var head = new Node(null, null); // dummy
    var p = head;
    var p1 = l1;
    var p2 = l2;
    while (p1 !== null && p2 !== null) {
        if (compare(p1.key, p2.key) < 0) {
            p.next = p1;
            p1 = p1.next;
        }
        else {
            p.next = p2;
            p2 = p2.next;
        }
        p = p.next;
    }
    if (p1 !== null) {
        p.next = p1;
    }
    else if (p2 !== null) {
        p.next = p2;
    }
    return head.next;
}
function sort(keys, values, left, right, compare) {
    if (left >= right)
        return;
    var pivot = keys[(left + right) >> 1];
    var i = left - 1;
    var j = right + 1;
    while (true) {
        do
            i++;
        while (compare(keys[i], pivot) < 0);
        do
            j--;
        while (compare(keys[j], pivot) > 0);
        if (i >= j)
            break;
        var tmp = keys[i];
        keys[i] = keys[j];
        keys[j] = tmp;
        tmp = values[i];
        values[i] = values[j];
        values[j] = tmp;
    }
    sort(keys, values, left, j, compare);
    sort(keys, values, j + 1, right, compare);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/**
 * A bounding box has the format:
 *
 *  { ll: { x: xmin, y: ymin }, ur: { x: xmax, y: ymax } }
 *
 */
var isInBbox = function isInBbox(bbox, point) {
  return bbox.ll.x <= point.x && point.x <= bbox.ur.x && bbox.ll.y <= point.y && point.y <= bbox.ur.y;
};
/* Returns either null, or a bbox (aka an ordered pair of points)
 * If there is only one point of overlap, a bbox with identical points
 * will be returned */

var getBboxOverlap = function getBboxOverlap(b1, b2) {
  // check if the bboxes overlap at all
  if (b2.ur.x < b1.ll.x || b1.ur.x < b2.ll.x || b2.ur.y < b1.ll.y || b1.ur.y < b2.ll.y) return null; // find the middle two X values

  var lowerX = b1.ll.x < b2.ll.x ? b2.ll.x : b1.ll.x;
  var upperX = b1.ur.x < b2.ur.x ? b1.ur.x : b2.ur.x; // find the middle two Y values

  var lowerY = b1.ll.y < b2.ll.y ? b2.ll.y : b1.ll.y;
  var upperY = b1.ur.y < b2.ur.y ? b1.ur.y : b2.ur.y; // put those middle values together to get the overlap

  return {
    ll: {
      x: lowerX,
      y: lowerY
    },
    ur: {
      x: upperX,
      y: upperY
    }
  };
};

/* Javascript doesn't do integer math. Everything is
 * floating point with percision Number.EPSILON.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
 */
var epsilon = Number.EPSILON; // IE Polyfill

if (epsilon === undefined) epsilon = Math.pow(2, -52);
var EPSILON_SQ = epsilon * epsilon;
/* FLP comparator */

var cmp = function cmp(a, b) {
  // check if they're both 0
  if (-epsilon < a && a < epsilon) {
    if (-epsilon < b && b < epsilon) {
      return 0;
    }
  } // check if they're flp equal


  var ab = a - b;

  if (ab * ab < EPSILON_SQ * a * b) {
    return 0;
  } // normal comparison


  return a < b ? -1 : 1;
};

/**
 * This class rounds incoming values sufficiently so that
 * floating points problems are, for the most part, avoided.
 *
 * Incoming points are have their x & y values tested against
 * all previously seen x & y values. If either is 'too close'
 * to a previously seen value, it's value is 'snapped' to the
 * previously seen value.
 *
 * All points should be rounded by this class before being
 * stored in any data structures in the rest of this algorithm.
 */

var PtRounder = /*#__PURE__*/function () {
  function PtRounder() {
    _classCallCheck(this, PtRounder);

    this.reset();
  }

  _createClass(PtRounder, [{
    key: "reset",
    value: function reset() {
      this.xRounder = new CoordRounder();
      this.yRounder = new CoordRounder();
    }
  }, {
    key: "round",
    value: function round(x, y) {
      return {
        x: this.xRounder.round(x),
        y: this.yRounder.round(y)
      };
    }
  }]);

  return PtRounder;
}();

var CoordRounder = /*#__PURE__*/function () {
  function CoordRounder() {
    _classCallCheck(this, CoordRounder);

    this.tree = new Tree(); // preseed with 0 so we don't end up with values < Number.EPSILON

    this.round(0);
  } // Note: this can rounds input values backwards or forwards.
  //       You might ask, why not restrict this to just rounding
  //       forwards? Wouldn't that allow left endpoints to always
  //       remain left endpoints during splitting (never change to
  //       right). No - it wouldn't, because we snap intersections
  //       to endpoints (to establish independence from the segment
  //       angle for t-intersections).


  _createClass(CoordRounder, [{
    key: "round",
    value: function round(coord) {
      var node = this.tree.add(coord);
      var prevNode = this.tree.prev(node);

      if (prevNode !== null && cmp(node.key, prevNode.key) === 0) {
        this.tree.remove(coord);
        return prevNode.key;
      }

      var nextNode = this.tree.next(node);

      if (nextNode !== null && cmp(node.key, nextNode.key) === 0) {
        this.tree.remove(coord);
        return nextNode.key;
      }

      return coord;
    }
  }]);

  return CoordRounder;
}(); // singleton available by import


var rounder = new PtRounder();

/* Cross Product of two vectors with first point at origin */

var crossProduct = function crossProduct(a, b) {
  return a.x * b.y - a.y * b.x;
};
/* Dot Product of two vectors with first point at origin */

var dotProduct = function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y;
};
/* Comparator for two vectors with same starting point */

var compareVectorAngles = function compareVectorAngles(basePt, endPt1, endPt2) {
  var v1 = {
    x: endPt1.x - basePt.x,
    y: endPt1.y - basePt.y
  };
  var v2 = {
    x: endPt2.x - basePt.x,
    y: endPt2.y - basePt.y
  };
  var kross = crossProduct(v1, v2);
  return cmp(kross, 0);
};
var length = function length(v) {
  return Math.sqrt(dotProduct(v, v));
};
/* Get the sine of the angle from pShared -> pAngle to pShaed -> pBase */

var sineOfAngle = function sineOfAngle(pShared, pBase, pAngle) {
  var vBase = {
    x: pBase.x - pShared.x,
    y: pBase.y - pShared.y
  };
  var vAngle = {
    x: pAngle.x - pShared.x,
    y: pAngle.y - pShared.y
  };
  return crossProduct(vAngle, vBase) / length(vAngle) / length(vBase);
};
/* Get the cosine of the angle from pShared -> pAngle to pShaed -> pBase */

var cosineOfAngle = function cosineOfAngle(pShared, pBase, pAngle) {
  var vBase = {
    x: pBase.x - pShared.x,
    y: pBase.y - pShared.y
  };
  var vAngle = {
    x: pAngle.x - pShared.x,
    y: pAngle.y - pShared.y
  };
  return dotProduct(vAngle, vBase) / length(vAngle) / length(vBase);
};
/* Get the x coordinate where the given line (defined by a point and vector)
 * crosses the horizontal line with the given y coordiante.
 * In the case of parrallel lines (including overlapping ones) returns null. */

var horizontalIntersection = function horizontalIntersection(pt, v, y) {
  if (v.y === 0) return null;
  return {
    x: pt.x + v.x / v.y * (y - pt.y),
    y: y
  };
};
/* Get the y coordinate where the given line (defined by a point and vector)
 * crosses the vertical line with the given x coordiante.
 * In the case of parrallel lines (including overlapping ones) returns null. */

var verticalIntersection = function verticalIntersection(pt, v, x) {
  if (v.x === 0) return null;
  return {
    x: x,
    y: pt.y + v.y / v.x * (x - pt.x)
  };
};
/* Get the intersection of two lines, each defined by a base point and a vector.
 * In the case of parrallel lines (including overlapping ones) returns null. */

var intersection = function intersection(pt1, v1, pt2, v2) {
  // take some shortcuts for vertical and horizontal lines
  // this also ensures we don't calculate an intersection and then discover
  // it's actually outside the bounding box of the line
  if (v1.x === 0) return verticalIntersection(pt2, v2, pt1.x);
  if (v2.x === 0) return verticalIntersection(pt1, v1, pt2.x);
  if (v1.y === 0) return horizontalIntersection(pt2, v2, pt1.y);
  if (v2.y === 0) return horizontalIntersection(pt1, v1, pt2.y); // General case for non-overlapping segments.
  // This algorithm is based on Schneider and Eberly.
  // http://www.cimec.org.ar/~ncalvo/Schneider_Eberly.pdf - pg 244

  var kross = crossProduct(v1, v2);
  if (kross == 0) return null;
  var ve = {
    x: pt2.x - pt1.x,
    y: pt2.y - pt1.y
  };
  var d1 = crossProduct(ve, v1) / kross;
  var d2 = crossProduct(ve, v2) / kross; // take the average of the two calculations to minimize rounding error

  var x1 = pt1.x + d2 * v1.x,
      x2 = pt2.x + d1 * v2.x;
  var y1 = pt1.y + d2 * v1.y,
      y2 = pt2.y + d1 * v2.y;
  var x = (x1 + x2) / 2;
  var y = (y1 + y2) / 2;
  return {
    x: x,
    y: y
  };
};

var SweepEvent = /*#__PURE__*/function () {
  _createClass(SweepEvent, null, [{
    key: "compare",
    // for ordering sweep events in the sweep event queue
    value: function compare(a, b) {
      // favor event with a point that the sweep line hits first
      var ptCmp = SweepEvent.comparePoints(a.point, b.point);
      if (ptCmp !== 0) return ptCmp; // the points are the same, so link them if needed

      if (a.point !== b.point) a.link(b); // favor right events over left

      if (a.isLeft !== b.isLeft) return a.isLeft ? 1 : -1; // we have two matching left or right endpoints
      // ordering of this case is the same as for their segments

      return Segment.compare(a.segment, b.segment);
    } // for ordering points in sweep line order

  }, {
    key: "comparePoints",
    value: function comparePoints(aPt, bPt) {
      if (aPt.x < bPt.x) return -1;
      if (aPt.x > bPt.x) return 1;
      if (aPt.y < bPt.y) return -1;
      if (aPt.y > bPt.y) return 1;
      return 0;
    } // Warning: 'point' input will be modified and re-used (for performance)

  }]);

  function SweepEvent(point, isLeft) {
    _classCallCheck(this, SweepEvent);

    if (point.events === undefined) point.events = [this];else point.events.push(this);
    this.point = point;
    this.isLeft = isLeft; // this.segment, this.otherSE set by factory
  }

  _createClass(SweepEvent, [{
    key: "link",
    value: function link(other) {
      if (other.point === this.point) {
        throw new Error('Tried to link already linked events');
      }

      var otherEvents = other.point.events;

      for (var i = 0, iMax = otherEvents.length; i < iMax; i++) {
        var evt = otherEvents[i];
        this.point.events.push(evt);
        evt.point = this.point;
      }

      this.checkForConsuming();
    }
    /* Do a pass over our linked events and check to see if any pair
     * of segments match, and should be consumed. */

  }, {
    key: "checkForConsuming",
    value: function checkForConsuming() {
      // FIXME: The loops in this method run O(n^2) => no good.
      //        Maintain little ordered sweep event trees?
      //        Can we maintaining an ordering that avoids the need
      //        for the re-sorting with getLeftmostComparator in geom-out?
      // Compare each pair of events to see if other events also match
      var numEvents = this.point.events.length;

      for (var i = 0; i < numEvents; i++) {
        var evt1 = this.point.events[i];
        if (evt1.segment.consumedBy !== undefined) continue;

        for (var j = i + 1; j < numEvents; j++) {
          var evt2 = this.point.events[j];
          if (evt2.consumedBy !== undefined) continue;
          if (evt1.otherSE.point.events !== evt2.otherSE.point.events) continue;
          evt1.segment.consume(evt2.segment);
        }
      }
    }
  }, {
    key: "getAvailableLinkedEvents",
    value: function getAvailableLinkedEvents() {
      // point.events is always of length 2 or greater
      var events = [];

      for (var i = 0, iMax = this.point.events.length; i < iMax; i++) {
        var evt = this.point.events[i];

        if (evt !== this && !evt.segment.ringOut && evt.segment.isInResult()) {
          events.push(evt);
        }
      }

      return events;
    }
    /**
     * Returns a comparator function for sorting linked events that will
     * favor the event that will give us the smallest left-side angle.
     * All ring construction starts as low as possible heading to the right,
     * so by always turning left as sharp as possible we'll get polygons
     * without uncessary loops & holes.
     *
     * The comparator function has a compute cache such that it avoids
     * re-computing already-computed values.
     */

  }, {
    key: "getLeftmostComparator",
    value: function getLeftmostComparator(baseEvent) {
      var _this = this;

      var cache = new Map();

      var fillCache = function fillCache(linkedEvent) {
        var nextEvent = linkedEvent.otherSE;
        cache.set(linkedEvent, {
          sine: sineOfAngle(_this.point, baseEvent.point, nextEvent.point),
          cosine: cosineOfAngle(_this.point, baseEvent.point, nextEvent.point)
        });
      };

      return function (a, b) {
        if (!cache.has(a)) fillCache(a);
        if (!cache.has(b)) fillCache(b);

        var _cache$get = cache.get(a),
            asine = _cache$get.sine,
            acosine = _cache$get.cosine;

        var _cache$get2 = cache.get(b),
            bsine = _cache$get2.sine,
            bcosine = _cache$get2.cosine; // both on or above x-axis


        if (asine >= 0 && bsine >= 0) {
          if (acosine < bcosine) return 1;
          if (acosine > bcosine) return -1;
          return 0;
        } // both below x-axis


        if (asine < 0 && bsine < 0) {
          if (acosine < bcosine) return -1;
          if (acosine > bcosine) return 1;
          return 0;
        } // one above x-axis, one below


        if (bsine < asine) return -1;
        if (bsine > asine) return 1;
        return 0;
      };
    }
  }]);

  return SweepEvent;
}();

// segments and sweep events when all else is identical

var segmentId = 0;

var Segment = /*#__PURE__*/function () {
  _createClass(Segment, null, [{
    key: "compare",

    /* This compare() function is for ordering segments in the sweep
     * line tree, and does so according to the following criteria:
     *
     * Consider the vertical line that lies an infinestimal step to the
     * right of the right-more of the two left endpoints of the input
     * segments. Imagine slowly moving a point up from negative infinity
     * in the increasing y direction. Which of the two segments will that
     * point intersect first? That segment comes 'before' the other one.
     *
     * If neither segment would be intersected by such a line, (if one
     * or more of the segments are vertical) then the line to be considered
     * is directly on the right-more of the two left inputs.
     */
    value: function compare(a, b) {
      var alx = a.leftSE.point.x;
      var blx = b.leftSE.point.x;
      var arx = a.rightSE.point.x;
      var brx = b.rightSE.point.x; // check if they're even in the same vertical plane

      if (brx < alx) return 1;
      if (arx < blx) return -1;
      var aly = a.leftSE.point.y;
      var bly = b.leftSE.point.y;
      var ary = a.rightSE.point.y;
      var bry = b.rightSE.point.y; // is left endpoint of segment B the right-more?

      if (alx < blx) {
        // are the two segments in the same horizontal plane?
        if (bly < aly && bly < ary) return 1;
        if (bly > aly && bly > ary) return -1; // is the B left endpoint colinear to segment A?

        var aCmpBLeft = a.comparePoint(b.leftSE.point);
        if (aCmpBLeft < 0) return 1;
        if (aCmpBLeft > 0) return -1; // is the A right endpoint colinear to segment B ?

        var bCmpARight = b.comparePoint(a.rightSE.point);
        if (bCmpARight !== 0) return bCmpARight; // colinear segments, consider the one with left-more
        // left endpoint to be first (arbitrary?)

        return -1;
      } // is left endpoint of segment A the right-more?


      if (alx > blx) {
        if (aly < bly && aly < bry) return -1;
        if (aly > bly && aly > bry) return 1; // is the A left endpoint colinear to segment B?

        var bCmpALeft = b.comparePoint(a.leftSE.point);
        if (bCmpALeft !== 0) return bCmpALeft; // is the B right endpoint colinear to segment A?

        var aCmpBRight = a.comparePoint(b.rightSE.point);
        if (aCmpBRight < 0) return 1;
        if (aCmpBRight > 0) return -1; // colinear segments, consider the one with left-more
        // left endpoint to be first (arbitrary?)

        return 1;
      } // if we get here, the two left endpoints are in the same
      // vertical plane, ie alx === blx
      // consider the lower left-endpoint to come first


      if (aly < bly) return -1;
      if (aly > bly) return 1; // left endpoints are identical
      // check for colinearity by using the left-more right endpoint
      // is the A right endpoint more left-more?

      if (arx < brx) {
        var _bCmpARight = b.comparePoint(a.rightSE.point);

        if (_bCmpARight !== 0) return _bCmpARight;
      } // is the B right endpoint more left-more?


      if (arx > brx) {
        var _aCmpBRight = a.comparePoint(b.rightSE.point);

        if (_aCmpBRight < 0) return 1;
        if (_aCmpBRight > 0) return -1;
      }

      if (arx !== brx) {
        // are these two [almost] vertical segments with opposite orientation?
        // if so, the one with the lower right endpoint comes first
        var ay = ary - aly;
        var ax = arx - alx;
        var by = bry - bly;
        var bx = brx - blx;
        if (ay > ax && by < bx) return 1;
        if (ay < ax && by > bx) return -1;
      } // we have colinear segments with matching orientation
      // consider the one with more left-more right endpoint to be first


      if (arx > brx) return 1;
      if (arx < brx) return -1; // if we get here, two two right endpoints are in the same
      // vertical plane, ie arx === brx
      // consider the lower right-endpoint to come first

      if (ary < bry) return -1;
      if (ary > bry) return 1; // right endpoints identical as well, so the segments are idential
      // fall back on creation order as consistent tie-breaker

      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1; // identical segment, ie a === b

      return 0;
    }
    /* Warning: a reference to ringWindings input will be stored,
     *  and possibly will be later modified */

  }]);

  function Segment(leftSE, rightSE, rings, windings) {
    _classCallCheck(this, Segment);

    this.id = ++segmentId;
    this.leftSE = leftSE;
    leftSE.segment = this;
    leftSE.otherSE = rightSE;
    this.rightSE = rightSE;
    rightSE.segment = this;
    rightSE.otherSE = leftSE;
    this.rings = rings;
    this.windings = windings; // left unset for performance, set later in algorithm
    // this.ringOut, this.consumedBy, this.prev
  }

  _createClass(Segment, [{
    key: "replaceRightSE",

    /* When a segment is split, the rightSE is replaced with a new sweep event */
    value: function replaceRightSE(newRightSE) {
      this.rightSE = newRightSE;
      this.rightSE.segment = this;
      this.rightSE.otherSE = this.leftSE;
      this.leftSE.otherSE = this.rightSE;
    }
  }, {
    key: "bbox",
    value: function bbox() {
      var y1 = this.leftSE.point.y;
      var y2 = this.rightSE.point.y;
      return {
        ll: {
          x: this.leftSE.point.x,
          y: y1 < y2 ? y1 : y2
        },
        ur: {
          x: this.rightSE.point.x,
          y: y1 > y2 ? y1 : y2
        }
      };
    }
    /* A vector from the left point to the right */

  }, {
    key: "vector",
    value: function vector() {
      return {
        x: this.rightSE.point.x - this.leftSE.point.x,
        y: this.rightSE.point.y - this.leftSE.point.y
      };
    }
  }, {
    key: "isAnEndpoint",
    value: function isAnEndpoint(pt) {
      return pt.x === this.leftSE.point.x && pt.y === this.leftSE.point.y || pt.x === this.rightSE.point.x && pt.y === this.rightSE.point.y;
    }
    /* Compare this segment with a point.
     *
     * A point P is considered to be colinear to a segment if there
     * exists a distance D such that if we travel along the segment
     * from one * endpoint towards the other a distance D, we find
     * ourselves at point P.
     *
     * Return value indicates:
     *
     *   1: point lies above the segment (to the left of vertical)
     *   0: point is colinear to segment
     *  -1: point lies below the segment (to the right of vertical)
     */

  }, {
    key: "comparePoint",
    value: function comparePoint(point) {
      if (this.isAnEndpoint(point)) return 0;
      var lPt = this.leftSE.point;
      var rPt = this.rightSE.point;
      var v = this.vector(); // Exactly vertical segments.

      if (lPt.x === rPt.x) {
        if (point.x === lPt.x) return 0;
        return point.x < lPt.x ? 1 : -1;
      } // Nearly vertical segments with an intersection.
      // Check to see where a point on the line with matching Y coordinate is.


      var yDist = (point.y - lPt.y) / v.y;
      var xFromYDist = lPt.x + yDist * v.x;
      if (point.x === xFromYDist) return 0; // General case.
      // Check to see where a point on the line with matching X coordinate is.

      var xDist = (point.x - lPt.x) / v.x;
      var yFromXDist = lPt.y + xDist * v.y;
      if (point.y === yFromXDist) return 0;
      return point.y < yFromXDist ? -1 : 1;
    }
    /**
     * Given another segment, returns the first non-trivial intersection
     * between the two segments (in terms of sweep line ordering), if it exists.
     *
     * A 'non-trivial' intersection is one that will cause one or both of the
     * segments to be split(). As such, 'trivial' vs. 'non-trivial' intersection:
     *
     *   * endpoint of segA with endpoint of segB --> trivial
     *   * endpoint of segA with point along segB --> non-trivial
     *   * endpoint of segB with point along segA --> non-trivial
     *   * point along segA with point along segB --> non-trivial
     *
     * If no non-trivial intersection exists, return null
     * Else, return null.
     */

  }, {
    key: "getIntersection",
    value: function getIntersection(other) {
      // If bboxes don't overlap, there can't be any intersections
      var tBbox = this.bbox();
      var oBbox = other.bbox();
      var bboxOverlap = getBboxOverlap(tBbox, oBbox);
      if (bboxOverlap === null) return null; // We first check to see if the endpoints can be considered intersections.
      // This will 'snap' intersections to endpoints if possible, and will
      // handle cases of colinearity.

      var tlp = this.leftSE.point;
      var trp = this.rightSE.point;
      var olp = other.leftSE.point;
      var orp = other.rightSE.point; // does each endpoint touch the other segment?
      // note that we restrict the 'touching' definition to only allow segments
      // to touch endpoints that lie forward from where we are in the sweep line pass

      var touchesOtherLSE = isInBbox(tBbox, olp) && this.comparePoint(olp) === 0;
      var touchesThisLSE = isInBbox(oBbox, tlp) && other.comparePoint(tlp) === 0;
      var touchesOtherRSE = isInBbox(tBbox, orp) && this.comparePoint(orp) === 0;
      var touchesThisRSE = isInBbox(oBbox, trp) && other.comparePoint(trp) === 0; // do left endpoints match?

      if (touchesThisLSE && touchesOtherLSE) {
        // these two cases are for colinear segments with matching left
        // endpoints, and one segment being longer than the other
        if (touchesThisRSE && !touchesOtherRSE) return trp;
        if (!touchesThisRSE && touchesOtherRSE) return orp; // either the two segments match exactly (two trival intersections)
        // or just on their left endpoint (one trivial intersection

        return null;
      } // does this left endpoint matches (other doesn't)


      if (touchesThisLSE) {
        // check for segments that just intersect on opposing endpoints
        if (touchesOtherRSE) {
          if (tlp.x === orp.x && tlp.y === orp.y) return null;
        } // t-intersection on left endpoint


        return tlp;
      } // does other left endpoint matches (this doesn't)


      if (touchesOtherLSE) {
        // check for segments that just intersect on opposing endpoints
        if (touchesThisRSE) {
          if (trp.x === olp.x && trp.y === olp.y) return null;
        } // t-intersection on left endpoint


        return olp;
      } // trivial intersection on right endpoints


      if (touchesThisRSE && touchesOtherRSE) return null; // t-intersections on just one right endpoint

      if (touchesThisRSE) return trp;
      if (touchesOtherRSE) return orp; // None of our endpoints intersect. Look for a general intersection between
      // infinite lines laid over the segments

      var pt = intersection(tlp, this.vector(), olp, other.vector()); // are the segments parrallel? Note that if they were colinear with overlap,
      // they would have an endpoint intersection and that case was already handled above

      if (pt === null) return null; // is the intersection found between the lines not on the segments?

      if (!isInBbox(bboxOverlap, pt)) return null; // round the the computed point if needed

      return rounder.round(pt.x, pt.y);
    }
    /**
     * Split the given segment into multiple segments on the given points.
     *  * Each existing segment will retain its leftSE and a new rightSE will be
     *    generated for it.
     *  * A new segment will be generated which will adopt the original segment's
     *    rightSE, and a new leftSE will be generated for it.
     *  * If there are more than two points given to split on, new segments
     *    in the middle will be generated with new leftSE and rightSE's.
     *  * An array of the newly generated SweepEvents will be returned.
     *
     * Warning: input array of points is modified
     */

  }, {
    key: "split",
    value: function split(point) {
      var newEvents = [];
      var alreadyLinked = point.events !== undefined;
      var newLeftSE = new SweepEvent(point, true);
      var newRightSE = new SweepEvent(point, false);
      var oldRightSE = this.rightSE;
      this.replaceRightSE(newRightSE);
      newEvents.push(newRightSE);
      newEvents.push(newLeftSE);
      var newSeg = new Segment(newLeftSE, oldRightSE, this.rings.slice(), this.windings.slice()); // when splitting a nearly vertical downward-facing segment,
      // sometimes one of the resulting new segments is vertical, in which
      // case its left and right events may need to be swapped

      if (SweepEvent.comparePoints(newSeg.leftSE.point, newSeg.rightSE.point) > 0) {
        newSeg.swapEvents();
      }

      if (SweepEvent.comparePoints(this.leftSE.point, this.rightSE.point) > 0) {
        this.swapEvents();
      } // in the point we just used to create new sweep events with was already
      // linked to other events, we need to check if either of the affected
      // segments should be consumed


      if (alreadyLinked) {
        newLeftSE.checkForConsuming();
        newRightSE.checkForConsuming();
      }

      return newEvents;
    }
    /* Swap which event is left and right */

  }, {
    key: "swapEvents",
    value: function swapEvents() {
      var tmpEvt = this.rightSE;
      this.rightSE = this.leftSE;
      this.leftSE = tmpEvt;
      this.leftSE.isLeft = true;
      this.rightSE.isLeft = false;

      for (var i = 0, iMax = this.windings.length; i < iMax; i++) {
        this.windings[i] *= -1;
      }
    }
    /* Consume another segment. We take their rings under our wing
     * and mark them as consumed. Use for perfectly overlapping segments */

  }, {
    key: "consume",
    value: function consume(other) {
      var consumer = this;
      var consumee = other;

      while (consumer.consumedBy) {
        consumer = consumer.consumedBy;
      }

      while (consumee.consumedBy) {
        consumee = consumee.consumedBy;
      }

      var cmp = Segment.compare(consumer, consumee);
      if (cmp === 0) return; // already consumed
      // the winner of the consumption is the earlier segment
      // according to sweep line ordering

      if (cmp > 0) {
        var tmp = consumer;
        consumer = consumee;
        consumee = tmp;
      } // make sure a segment doesn't consume it's prev


      if (consumer.prev === consumee) {
        var _tmp = consumer;
        consumer = consumee;
        consumee = _tmp;
      }

      for (var i = 0, iMax = consumee.rings.length; i < iMax; i++) {
        var ring = consumee.rings[i];
        var winding = consumee.windings[i];
        var index = consumer.rings.indexOf(ring);

        if (index === -1) {
          consumer.rings.push(ring);
          consumer.windings.push(winding);
        } else consumer.windings[index] += winding;
      }

      consumee.rings = null;
      consumee.windings = null;
      consumee.consumedBy = consumer; // mark sweep events consumed as to maintain ordering in sweep event queue

      consumee.leftSE.consumedBy = consumer.leftSE;
      consumee.rightSE.consumedBy = consumer.rightSE;
    }
    /* The first segment previous segment chain that is in the result */

  }, {
    key: "prevInResult",
    value: function prevInResult() {
      if (this._prevInResult !== undefined) return this._prevInResult;
      if (!this.prev) this._prevInResult = null;else if (this.prev.isInResult()) this._prevInResult = this.prev;else this._prevInResult = this.prev.prevInResult();
      return this._prevInResult;
    }
  }, {
    key: "beforeState",
    value: function beforeState() {
      if (this._beforeState !== undefined) return this._beforeState;
      if (!this.prev) this._beforeState = {
        rings: [],
        windings: [],
        multiPolys: []
      };else {
        var seg = this.prev.consumedBy || this.prev;
        this._beforeState = seg.afterState();
      }
      return this._beforeState;
    }
  }, {
    key: "afterState",
    value: function afterState() {
      if (this._afterState !== undefined) return this._afterState;
      var beforeState = this.beforeState();
      this._afterState = {
        rings: beforeState.rings.slice(0),
        windings: beforeState.windings.slice(0),
        multiPolys: []
      };
      var ringsAfter = this._afterState.rings;
      var windingsAfter = this._afterState.windings;
      var mpsAfter = this._afterState.multiPolys; // calculate ringsAfter, windingsAfter

      for (var i = 0, iMax = this.rings.length; i < iMax; i++) {
        var ring = this.rings[i];
        var winding = this.windings[i];
        var index = ringsAfter.indexOf(ring);

        if (index === -1) {
          ringsAfter.push(ring);
          windingsAfter.push(winding);
        } else windingsAfter[index] += winding;
      } // calcualte polysAfter


      var polysAfter = [];
      var polysExclude = [];

      for (var _i = 0, _iMax = ringsAfter.length; _i < _iMax; _i++) {
        if (windingsAfter[_i] === 0) continue; // non-zero rule

        var _ring = ringsAfter[_i];
        var poly = _ring.poly;
        if (polysExclude.indexOf(poly) !== -1) continue;
        if (_ring.isExterior) polysAfter.push(poly);else {
          if (polysExclude.indexOf(poly) === -1) polysExclude.push(poly);

          var _index = polysAfter.indexOf(_ring.poly);

          if (_index !== -1) polysAfter.splice(_index, 1);
        }
      } // calculate multiPolysAfter


      for (var _i2 = 0, _iMax2 = polysAfter.length; _i2 < _iMax2; _i2++) {
        var mp = polysAfter[_i2].multiPoly;
        if (mpsAfter.indexOf(mp) === -1) mpsAfter.push(mp);
      }

      return this._afterState;
    }
    /* Is this segment part of the final result? */

  }, {
    key: "isInResult",
    value: function isInResult() {
      // if we've been consumed, we're not in the result
      if (this.consumedBy) return false;
      if (this._isInResult !== undefined) return this._isInResult;
      var mpsBefore = this.beforeState().multiPolys;
      var mpsAfter = this.afterState().multiPolys;

      switch (operation.type) {
        case 'union':
          {
            // UNION - included iff:
            //  * On one side of us there is 0 poly interiors AND
            //  * On the other side there is 1 or more.
            var noBefores = mpsBefore.length === 0;
            var noAfters = mpsAfter.length === 0;
            this._isInResult = noBefores !== noAfters;
            break;
          }

        case 'intersection':
          {
            // INTERSECTION - included iff:
            //  * on one side of us all multipolys are rep. with poly interiors AND
            //  * on the other side of us, not all multipolys are repsented
            //    with poly interiors
            var least;
            var most;

            if (mpsBefore.length < mpsAfter.length) {
              least = mpsBefore.length;
              most = mpsAfter.length;
            } else {
              least = mpsAfter.length;
              most = mpsBefore.length;
            }

            this._isInResult = most === operation.numMultiPolys && least < most;
            break;
          }

        case 'xor':
          {
            // XOR - included iff:
            //  * the difference between the number of multipolys represented
            //    with poly interiors on our two sides is an odd number
            var diff = Math.abs(mpsBefore.length - mpsAfter.length);
            this._isInResult = diff % 2 === 1;
            break;
          }

        case 'difference':
          {
            // DIFFERENCE included iff:
            //  * on exactly one side, we have just the subject
            var isJustSubject = function isJustSubject(mps) {
              return mps.length === 1 && mps[0].isSubject;
            };

            this._isInResult = isJustSubject(mpsBefore) !== isJustSubject(mpsAfter);
            break;
          }

        default:
          throw new Error("Unrecognized operation type found ".concat(operation.type));
      }

      return this._isInResult;
    }
  }], [{
    key: "fromRing",
    value: function fromRing(pt1, pt2, ring) {
      var leftPt, rightPt, winding; // ordering the two points according to sweep line ordering

      var cmpPts = SweepEvent.comparePoints(pt1, pt2);

      if (cmpPts < 0) {
        leftPt = pt1;
        rightPt = pt2;
        winding = 1;
      } else if (cmpPts > 0) {
        leftPt = pt2;
        rightPt = pt1;
        winding = -1;
      } else throw new Error("Tried to create degenerate segment at [".concat(pt1.x, ", ").concat(pt1.y, "]"));

      var leftSE = new SweepEvent(leftPt, true);
      var rightSE = new SweepEvent(rightPt, false);
      return new Segment(leftSE, rightSE, [ring], [winding]);
    }
  }]);

  return Segment;
}();

var RingIn = /*#__PURE__*/function () {
  function RingIn(geomRing, poly, isExterior) {
    _classCallCheck(this, RingIn);

    if (!Array.isArray(geomRing) || geomRing.length === 0) {
      throw new Error('Input geometry is not a valid Polygon or MultiPolygon');
    }

    this.poly = poly;
    this.isExterior = isExterior;
    this.segments = [];

    if (typeof geomRing[0][0] !== 'number' || typeof geomRing[0][1] !== 'number') {
      throw new Error('Input geometry is not a valid Polygon or MultiPolygon');
    }

    var firstPoint = rounder.round(geomRing[0][0], geomRing[0][1]);
    this.bbox = {
      ll: {
        x: firstPoint.x,
        y: firstPoint.y
      },
      ur: {
        x: firstPoint.x,
        y: firstPoint.y
      }
    };
    var prevPoint = firstPoint;

    for (var i = 1, iMax = geomRing.length; i < iMax; i++) {
      if (typeof geomRing[i][0] !== 'number' || typeof geomRing[i][1] !== 'number') {
        throw new Error('Input geometry is not a valid Polygon or MultiPolygon');
      }

      var point = rounder.round(geomRing[i][0], geomRing[i][1]); // skip repeated points

      if (point.x === prevPoint.x && point.y === prevPoint.y) continue;
      this.segments.push(Segment.fromRing(prevPoint, point, this));
      if (point.x < this.bbox.ll.x) this.bbox.ll.x = point.x;
      if (point.y < this.bbox.ll.y) this.bbox.ll.y = point.y;
      if (point.x > this.bbox.ur.x) this.bbox.ur.x = point.x;
      if (point.y > this.bbox.ur.y) this.bbox.ur.y = point.y;
      prevPoint = point;
    } // add segment from last to first if last is not the same as first


    if (firstPoint.x !== prevPoint.x || firstPoint.y !== prevPoint.y) {
      this.segments.push(Segment.fromRing(prevPoint, firstPoint, this));
    }
  }

  _createClass(RingIn, [{
    key: "getSweepEvents",
    value: function getSweepEvents() {
      var sweepEvents = [];

      for (var i = 0, iMax = this.segments.length; i < iMax; i++) {
        var segment = this.segments[i];
        sweepEvents.push(segment.leftSE);
        sweepEvents.push(segment.rightSE);
      }

      return sweepEvents;
    }
  }]);

  return RingIn;
}();
var PolyIn = /*#__PURE__*/function () {
  function PolyIn(geomPoly, multiPoly) {
    _classCallCheck(this, PolyIn);

    if (!Array.isArray(geomPoly)) {
      throw new Error('Input geometry is not a valid Polygon or MultiPolygon');
    }

    this.exteriorRing = new RingIn(geomPoly[0], this, true); // copy by value

    this.bbox = {
      ll: {
        x: this.exteriorRing.bbox.ll.x,
        y: this.exteriorRing.bbox.ll.y
      },
      ur: {
        x: this.exteriorRing.bbox.ur.x,
        y: this.exteriorRing.bbox.ur.y
      }
    };
    this.interiorRings = [];

    for (var i = 1, iMax = geomPoly.length; i < iMax; i++) {
      var ring = new RingIn(geomPoly[i], this, false);
      if (ring.bbox.ll.x < this.bbox.ll.x) this.bbox.ll.x = ring.bbox.ll.x;
      if (ring.bbox.ll.y < this.bbox.ll.y) this.bbox.ll.y = ring.bbox.ll.y;
      if (ring.bbox.ur.x > this.bbox.ur.x) this.bbox.ur.x = ring.bbox.ur.x;
      if (ring.bbox.ur.y > this.bbox.ur.y) this.bbox.ur.y = ring.bbox.ur.y;
      this.interiorRings.push(ring);
    }

    this.multiPoly = multiPoly;
  }

  _createClass(PolyIn, [{
    key: "getSweepEvents",
    value: function getSweepEvents() {
      var sweepEvents = this.exteriorRing.getSweepEvents();

      for (var i = 0, iMax = this.interiorRings.length; i < iMax; i++) {
        var ringSweepEvents = this.interiorRings[i].getSweepEvents();

        for (var j = 0, jMax = ringSweepEvents.length; j < jMax; j++) {
          sweepEvents.push(ringSweepEvents[j]);
        }
      }

      return sweepEvents;
    }
  }]);

  return PolyIn;
}();
var MultiPolyIn = /*#__PURE__*/function () {
  function MultiPolyIn(geom, isSubject) {
    _classCallCheck(this, MultiPolyIn);

    if (!Array.isArray(geom)) {
      throw new Error('Input geometry is not a valid Polygon or MultiPolygon');
    }

    try {
      // if the input looks like a polygon, convert it to a multipolygon
      if (typeof geom[0][0][0] === 'number') geom = [geom];
    } catch (ex) {// The input is either malformed or has empty arrays.
      // In either case, it will be handled later on.
    }

    this.polys = [];
    this.bbox = {
      ll: {
        x: Number.POSITIVE_INFINITY,
        y: Number.POSITIVE_INFINITY
      },
      ur: {
        x: Number.NEGATIVE_INFINITY,
        y: Number.NEGATIVE_INFINITY
      }
    };

    for (var i = 0, iMax = geom.length; i < iMax; i++) {
      var poly = new PolyIn(geom[i], this);
      if (poly.bbox.ll.x < this.bbox.ll.x) this.bbox.ll.x = poly.bbox.ll.x;
      if (poly.bbox.ll.y < this.bbox.ll.y) this.bbox.ll.y = poly.bbox.ll.y;
      if (poly.bbox.ur.x > this.bbox.ur.x) this.bbox.ur.x = poly.bbox.ur.x;
      if (poly.bbox.ur.y > this.bbox.ur.y) this.bbox.ur.y = poly.bbox.ur.y;
      this.polys.push(poly);
    }

    this.isSubject = isSubject;
  }

  _createClass(MultiPolyIn, [{
    key: "getSweepEvents",
    value: function getSweepEvents() {
      var sweepEvents = [];

      for (var i = 0, iMax = this.polys.length; i < iMax; i++) {
        var polySweepEvents = this.polys[i].getSweepEvents();

        for (var j = 0, jMax = polySweepEvents.length; j < jMax; j++) {
          sweepEvents.push(polySweepEvents[j]);
        }
      }

      return sweepEvents;
    }
  }]);

  return MultiPolyIn;
}();

var RingOut = /*#__PURE__*/function () {
  _createClass(RingOut, null, [{
    key: "factory",

    /* Given the segments from the sweep line pass, compute & return a series
     * of closed rings from all the segments marked to be part of the result */
    value: function factory(allSegments) {
      var ringsOut = [];

      for (var i = 0, iMax = allSegments.length; i < iMax; i++) {
        var segment = allSegments[i];
        if (!segment.isInResult() || segment.ringOut) continue;
        var prevEvent = null;
        var event = segment.leftSE;
        var nextEvent = segment.rightSE;
        var events = [event];
        var startingPoint = event.point;
        var intersectionLEs = [];
        /* Walk the chain of linked events to form a closed ring */

        while (true) {
          prevEvent = event;
          event = nextEvent;
          events.push(event);
          /* Is the ring complete? */

          if (event.point === startingPoint) break;

          while (true) {
            var availableLEs = event.getAvailableLinkedEvents();
            /* Did we hit a dead end? This shouldn't happen. Indicates some earlier
             * part of the algorithm malfunctioned... please file a bug report. */

            if (availableLEs.length === 0) {
              var firstPt = events[0].point;
              var lastPt = events[events.length - 1].point;
              throw new Error("Unable to complete output ring starting at [".concat(firstPt.x, ",") + " ".concat(firstPt.y, "]. Last matching segment found ends at") + " [".concat(lastPt.x, ", ").concat(lastPt.y, "]."));
            }
            /* Only one way to go, so cotinue on the path */


            if (availableLEs.length === 1) {
              nextEvent = availableLEs[0].otherSE;
              break;
            }
            /* We must have an intersection. Check for a completed loop */


            var indexLE = null;

            for (var j = 0, jMax = intersectionLEs.length; j < jMax; j++) {
              if (intersectionLEs[j].point === event.point) {
                indexLE = j;
                break;
              }
            }
            /* Found a completed loop. Cut that off and make a ring */


            if (indexLE !== null) {
              var intersectionLE = intersectionLEs.splice(indexLE)[0];
              var ringEvents = events.splice(intersectionLE.index);
              ringEvents.unshift(ringEvents[0].otherSE);
              ringsOut.push(new RingOut(ringEvents.reverse()));
              continue;
            }
            /* register the intersection */


            intersectionLEs.push({
              index: events.length,
              point: event.point
            });
            /* Choose the left-most option to continue the walk */

            var comparator = event.getLeftmostComparator(prevEvent);
            nextEvent = availableLEs.sort(comparator)[0].otherSE;
            break;
          }
        }

        ringsOut.push(new RingOut(events));
      }

      return ringsOut;
    }
  }]);

  function RingOut(events) {
    _classCallCheck(this, RingOut);

    this.events = events;

    for (var i = 0, iMax = events.length; i < iMax; i++) {
      events[i].segment.ringOut = this;
    }

    this.poly = null;
  }

  _createClass(RingOut, [{
    key: "getGeom",
    value: function getGeom() {
      // Remove superfluous points (ie extra points along a straight line),
      var prevPt = this.events[0].point;
      var points = [prevPt];

      for (var i = 1, iMax = this.events.length - 1; i < iMax; i++) {
        var _pt = this.events[i].point;
        var _nextPt = this.events[i + 1].point;
        if (compareVectorAngles(_pt, prevPt, _nextPt) === 0) continue;
        points.push(_pt);
        prevPt = _pt;
      } // ring was all (within rounding error of angle calc) colinear points


      if (points.length === 1) return null; // check if the starting point is necessary

      var pt = points[0];
      var nextPt = points[1];
      if (compareVectorAngles(pt, prevPt, nextPt) === 0) points.shift();
      points.push(points[0]);
      var step = this.isExteriorRing() ? 1 : -1;
      var iStart = this.isExteriorRing() ? 0 : points.length - 1;
      var iEnd = this.isExteriorRing() ? points.length : -1;
      var orderedPoints = [];

      for (var _i = iStart; _i != iEnd; _i += step) {
        orderedPoints.push([points[_i].x, points[_i].y]);
      }

      return orderedPoints;
    }
  }, {
    key: "isExteriorRing",
    value: function isExteriorRing() {
      if (this._isExteriorRing === undefined) {
        var enclosing = this.enclosingRing();
        this._isExteriorRing = enclosing ? !enclosing.isExteriorRing() : true;
      }

      return this._isExteriorRing;
    }
  }, {
    key: "enclosingRing",
    value: function enclosingRing() {
      if (this._enclosingRing === undefined) {
        this._enclosingRing = this._calcEnclosingRing();
      }

      return this._enclosingRing;
    }
    /* Returns the ring that encloses this one, if any */

  }, {
    key: "_calcEnclosingRing",
    value: function _calcEnclosingRing() {
      // start with the ealier sweep line event so that the prevSeg
      // chain doesn't lead us inside of a loop of ours
      var leftMostEvt = this.events[0];

      for (var i = 1, iMax = this.events.length; i < iMax; i++) {
        var evt = this.events[i];
        if (SweepEvent.compare(leftMostEvt, evt) > 0) leftMostEvt = evt;
      }

      var prevSeg = leftMostEvt.segment.prevInResult();
      var prevPrevSeg = prevSeg ? prevSeg.prevInResult() : null;

      while (true) {
        // no segment found, thus no ring can enclose us
        if (!prevSeg) return null; // no segments below prev segment found, thus the ring of the prev
        // segment must loop back around and enclose us

        if (!prevPrevSeg) return prevSeg.ringOut; // if the two segments are of different rings, the ring of the prev
        // segment must either loop around us or the ring of the prev prev
        // seg, which would make us and the ring of the prev peers

        if (prevPrevSeg.ringOut !== prevSeg.ringOut) {
          if (prevPrevSeg.ringOut.enclosingRing() !== prevSeg.ringOut) {
            return prevSeg.ringOut;
          } else return prevSeg.ringOut.enclosingRing();
        } // two segments are from the same ring, so this was a penisula
        // of that ring. iterate downward, keep searching


        prevSeg = prevPrevSeg.prevInResult();
        prevPrevSeg = prevSeg ? prevSeg.prevInResult() : null;
      }
    }
  }]);

  return RingOut;
}();
var PolyOut = /*#__PURE__*/function () {
  function PolyOut(exteriorRing) {
    _classCallCheck(this, PolyOut);

    this.exteriorRing = exteriorRing;
    exteriorRing.poly = this;
    this.interiorRings = [];
  }

  _createClass(PolyOut, [{
    key: "addInterior",
    value: function addInterior(ring) {
      this.interiorRings.push(ring);
      ring.poly = this;
    }
  }, {
    key: "getGeom",
    value: function getGeom() {
      var geom = [this.exteriorRing.getGeom()]; // exterior ring was all (within rounding error of angle calc) colinear points

      if (geom[0] === null) return null;

      for (var i = 0, iMax = this.interiorRings.length; i < iMax; i++) {
        var ringGeom = this.interiorRings[i].getGeom(); // interior ring was all (within rounding error of angle calc) colinear points

        if (ringGeom === null) continue;
        geom.push(ringGeom);
      }

      return geom;
    }
  }]);

  return PolyOut;
}();
var MultiPolyOut = /*#__PURE__*/function () {
  function MultiPolyOut(rings) {
    _classCallCheck(this, MultiPolyOut);

    this.rings = rings;
    this.polys = this._composePolys(rings);
  }

  _createClass(MultiPolyOut, [{
    key: "getGeom",
    value: function getGeom() {
      var geom = [];

      for (var i = 0, iMax = this.polys.length; i < iMax; i++) {
        var polyGeom = this.polys[i].getGeom(); // exterior ring was all (within rounding error of angle calc) colinear points

        if (polyGeom === null) continue;
        geom.push(polyGeom);
      }

      return geom;
    }
  }, {
    key: "_composePolys",
    value: function _composePolys(rings) {
      var polys = [];

      for (var i = 0, iMax = rings.length; i < iMax; i++) {
        var ring = rings[i];
        if (ring.poly) continue;
        if (ring.isExteriorRing()) polys.push(new PolyOut(ring));else {
          var enclosingRing = ring.enclosingRing();
          if (!enclosingRing.poly) polys.push(new PolyOut(enclosingRing));
          enclosingRing.poly.addInterior(ring);
        }
      }

      return polys;
    }
  }]);

  return MultiPolyOut;
}();

/**
 * NOTE:  We must be careful not to change any segments while
 *        they are in the SplayTree. AFAIK, there's no way to tell
 *        the tree to rebalance itself - thus before splitting
 *        a segment that's in the tree, we remove it from the tree,
 *        do the split, then re-insert it. (Even though splitting a
 *        segment *shouldn't* change its correct position in the
 *        sweep line tree, the reality is because of rounding errors,
 *        it sometimes does.)
 */

var SweepLine = /*#__PURE__*/function () {
  function SweepLine(queue) {
    var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Segment.compare;

    _classCallCheck(this, SweepLine);

    this.queue = queue;
    this.tree = new Tree(comparator);
    this.segments = [];
  }

  _createClass(SweepLine, [{
    key: "process",
    value: function process(event) {
      var segment = event.segment;
      var newEvents = []; // if we've already been consumed by another segment,
      // clean up our body parts and get out

      if (event.consumedBy) {
        if (event.isLeft) this.queue.remove(event.otherSE);else this.tree.remove(segment);
        return newEvents;
      }

      var node = event.isLeft ? this.tree.insert(segment) : this.tree.find(segment);
      if (!node) throw new Error("Unable to find segment #".concat(segment.id, " ") + "[".concat(segment.leftSE.point.x, ", ").concat(segment.leftSE.point.y, "] -> ") + "[".concat(segment.rightSE.point.x, ", ").concat(segment.rightSE.point.y, "] ") + 'in SweepLine tree. Please submit a bug report.');
      var prevNode = node;
      var nextNode = node;
      var prevSeg = undefined;
      var nextSeg = undefined; // skip consumed segments still in tree

      while (prevSeg === undefined) {
        prevNode = this.tree.prev(prevNode);
        if (prevNode === null) prevSeg = null;else if (prevNode.key.consumedBy === undefined) prevSeg = prevNode.key;
      } // skip consumed segments still in tree


      while (nextSeg === undefined) {
        nextNode = this.tree.next(nextNode);
        if (nextNode === null) nextSeg = null;else if (nextNode.key.consumedBy === undefined) nextSeg = nextNode.key;
      }

      if (event.isLeft) {
        // Check for intersections against the previous segment in the sweep line
        var prevMySplitter = null;

        if (prevSeg) {
          var prevInter = prevSeg.getIntersection(segment);

          if (prevInter !== null) {
            if (!segment.isAnEndpoint(prevInter)) prevMySplitter = prevInter;

            if (!prevSeg.isAnEndpoint(prevInter)) {
              var newEventsFromSplit = this._splitSafely(prevSeg, prevInter);

              for (var i = 0, iMax = newEventsFromSplit.length; i < iMax; i++) {
                newEvents.push(newEventsFromSplit[i]);
              }
            }
          }
        } // Check for intersections against the next segment in the sweep line


        var nextMySplitter = null;

        if (nextSeg) {
          var nextInter = nextSeg.getIntersection(segment);

          if (nextInter !== null) {
            if (!segment.isAnEndpoint(nextInter)) nextMySplitter = nextInter;

            if (!nextSeg.isAnEndpoint(nextInter)) {
              var _newEventsFromSplit = this._splitSafely(nextSeg, nextInter);

              for (var _i = 0, _iMax = _newEventsFromSplit.length; _i < _iMax; _i++) {
                newEvents.push(_newEventsFromSplit[_i]);
              }
            }
          }
        } // For simplicity, even if we find more than one intersection we only
        // spilt on the 'earliest' (sweep-line style) of the intersections.
        // The other intersection will be handled in a future process().


        if (prevMySplitter !== null || nextMySplitter !== null) {
          var mySplitter = null;
          if (prevMySplitter === null) mySplitter = nextMySplitter;else if (nextMySplitter === null) mySplitter = prevMySplitter;else {
            var cmpSplitters = SweepEvent.comparePoints(prevMySplitter, nextMySplitter);
            mySplitter = cmpSplitters <= 0 ? prevMySplitter : nextMySplitter;
          } // Rounding errors can cause changes in ordering,
          // so remove afected segments and right sweep events before splitting

          this.queue.remove(segment.rightSE);
          newEvents.push(segment.rightSE);

          var _newEventsFromSplit2 = segment.split(mySplitter);

          for (var _i2 = 0, _iMax2 = _newEventsFromSplit2.length; _i2 < _iMax2; _i2++) {
            newEvents.push(_newEventsFromSplit2[_i2]);
          }
        }

        if (newEvents.length > 0) {
          // We found some intersections, so re-do the current event to
          // make sure sweep line ordering is totally consistent for later
          // use with the segment 'prev' pointers
          this.tree.remove(segment);
          newEvents.push(event);
        } else {
          // done with left event
          this.segments.push(segment);
          segment.prev = prevSeg;
        }
      } else {
        // event.isRight
        // since we're about to be removed from the sweep line, check for
        // intersections between our previous and next segments
        if (prevSeg && nextSeg) {
          var inter = prevSeg.getIntersection(nextSeg);

          if (inter !== null) {
            if (!prevSeg.isAnEndpoint(inter)) {
              var _newEventsFromSplit3 = this._splitSafely(prevSeg, inter);

              for (var _i3 = 0, _iMax3 = _newEventsFromSplit3.length; _i3 < _iMax3; _i3++) {
                newEvents.push(_newEventsFromSplit3[_i3]);
              }
            }

            if (!nextSeg.isAnEndpoint(inter)) {
              var _newEventsFromSplit4 = this._splitSafely(nextSeg, inter);

              for (var _i4 = 0, _iMax4 = _newEventsFromSplit4.length; _i4 < _iMax4; _i4++) {
                newEvents.push(_newEventsFromSplit4[_i4]);
              }
            }
          }
        }

        this.tree.remove(segment);
      }

      return newEvents;
    }
    /* Safely split a segment that is currently in the datastructures
     * IE - a segment other than the one that is currently being processed. */

  }, {
    key: "_splitSafely",
    value: function _splitSafely(seg, pt) {
      // Rounding errors can cause changes in ordering,
      // so remove afected segments and right sweep events before splitting
      // removeNode() doesn't work, so have re-find the seg
      // https://github.com/w8r/splay-tree/pull/5
      this.tree.remove(seg);
      var rightSE = seg.rightSE;
      this.queue.remove(rightSE);
      var newEvents = seg.split(pt);
      newEvents.push(rightSE); // splitting can trigger consumption

      if (seg.consumedBy === undefined) this.tree.insert(seg);
      return newEvents;
    }
  }]);

  return SweepLine;
}();

var POLYGON_CLIPPING_MAX_QUEUE_SIZE = typeof process !== 'undefined' && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1000000;
var POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS = typeof process !== 'undefined' && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1000000;
var Operation = /*#__PURE__*/function () {
  function Operation() {
    _classCallCheck(this, Operation);
  }

  _createClass(Operation, [{
    key: "run",
    value: function run(type, geom, moreGeoms) {
      operation.type = type;
      rounder.reset();
      /* Convert inputs to MultiPoly objects */

      var multipolys = [new MultiPolyIn(geom, true)];

      for (var i = 0, iMax = moreGeoms.length; i < iMax; i++) {
        multipolys.push(new MultiPolyIn(moreGeoms[i], false));
      }

      operation.numMultiPolys = multipolys.length;
      /* BBox optimization for difference operation
       * If the bbox of a multipolygon that's part of the clipping doesn't
       * intersect the bbox of the subject at all, we can just drop that
       * multiploygon. */

      if (operation.type === 'difference') {
        // in place removal
        var subject = multipolys[0];
        var _i = 1;

        while (_i < multipolys.length) {
          if (getBboxOverlap(multipolys[_i].bbox, subject.bbox) !== null) _i++;else multipolys.splice(_i, 1);
        }
      }
      /* BBox optimization for intersection operation
       * If we can find any pair of multipolygons whose bbox does not overlap,
       * then the result will be empty. */


      if (operation.type === 'intersection') {
        // TODO: this is O(n^2) in number of polygons. By sorting the bboxes,
        //       it could be optimized to O(n * ln(n))
        for (var _i2 = 0, _iMax = multipolys.length; _i2 < _iMax; _i2++) {
          var mpA = multipolys[_i2];

          for (var j = _i2 + 1, jMax = multipolys.length; j < jMax; j++) {
            if (getBboxOverlap(mpA.bbox, multipolys[j].bbox) === null) return [];
          }
        }
      }
      /* Put segment endpoints in a priority queue */


      var queue = new Tree(SweepEvent.compare);

      for (var _i3 = 0, _iMax2 = multipolys.length; _i3 < _iMax2; _i3++) {
        var sweepEvents = multipolys[_i3].getSweepEvents();

        for (var _j = 0, _jMax = sweepEvents.length; _j < _jMax; _j++) {
          queue.insert(sweepEvents[_j]);

          if (queue.size > POLYGON_CLIPPING_MAX_QUEUE_SIZE) {
            // prevents an infinite loop, an otherwise common manifestation of bugs
            throw new Error('Infinite loop when putting segment endpoints in a priority queue ' + '(queue size too big). Please file a bug report.');
          }
        }
      }
      /* Pass the sweep line over those endpoints */


      var sweepLine = new SweepLine(queue);
      var prevQueueSize = queue.size;
      var node = queue.pop();

      while (node) {
        var evt = node.key;

        if (queue.size === prevQueueSize) {
          // prevents an infinite loop, an otherwise common manifestation of bugs
          var seg = evt.segment;
          throw new Error("Unable to pop() ".concat(evt.isLeft ? 'left' : 'right', " SweepEvent ") + "[".concat(evt.point.x, ", ").concat(evt.point.y, "] from segment #").concat(seg.id, " ") + "[".concat(seg.leftSE.point.x, ", ").concat(seg.leftSE.point.y, "] -> ") + "[".concat(seg.rightSE.point.x, ", ").concat(seg.rightSE.point.y, "] from queue. ") + 'Please file a bug report.');
        }

        if (queue.size > POLYGON_CLIPPING_MAX_QUEUE_SIZE) {
          // prevents an infinite loop, an otherwise common manifestation of bugs
          throw new Error('Infinite loop when passing sweep line over endpoints ' + '(queue size too big). Please file a bug report.');
        }

        if (sweepLine.segments.length > POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS) {
          // prevents an infinite loop, an otherwise common manifestation of bugs
          throw new Error('Infinite loop when passing sweep line over endpoints ' + '(too many sweep line segments). Please file a bug report.');
        }

        var newEvents = sweepLine.process(evt);

        for (var _i4 = 0, _iMax3 = newEvents.length; _i4 < _iMax3; _i4++) {
          var _evt = newEvents[_i4];
          if (_evt.consumedBy === undefined) queue.insert(_evt);
        }

        prevQueueSize = queue.size;
        node = queue.pop();
      } // free some memory we don't need anymore


      rounder.reset();
      /* Collect and compile segments we're keeping into a multipolygon */

      var ringsOut = RingOut.factory(sweepLine.segments);
      var result = new MultiPolyOut(ringsOut);
      return result.getGeom();
    }
  }]);

  return Operation;
}(); // singleton available by import

var operation = new Operation();

const earthCircumference = 40075016.68557849;
const pixelsToMeters = (px, zoom) => px * (earthCircumference / (256 * 1 << zoom));
function angle(positionA, positionB) {
    return Math.atan2(positionB[1] - positionA[1], positionB[0] - positionA[0]);
}
function drawPoint(startPosition, angle, distance) {
    return [
        Math.cos(angle) * distance + startPosition[0],
        Math.sin(angle) * distance + startPosition[1]
    ];
}
function bufferPoint(distance, steps = 8, position, prevPosition, nextPosition) {
    // draws a clockwise arc around pointX (position) from pointA (prevPosition) to pointA (nextPosition) at a distance of (length) with (steps) points
    // Determine a "plane" based on the line between the prev point and the next, if either prev or next is undefined, use the current
    // That means if both are undefined, it'll treat the position as a point
    const plane = angle(prevPosition || position, nextPosition || position);
    const stepSize = (2 / steps) * Math.PI;
    const points = new Array(steps).fill(0).map((_, idx) => {
        const ptAngle = (plane + (stepSize * (idx + 1))) % (2 * Math.PI);
        return drawPoint(position, ptAngle, distance)
            .map(v => Math.round(v)); // Round to the nearest meter
    });
    return points;
}
const projections = {
    WebMercatortoWGS84: (x, y) => {
        // Convert the lat lng
        const wgsLng = x * 180 / (earthCircumference / 2);
        // thanks magichim @ github for the correction
        const wgsLat = Math.atan(Math.exp(y * Math.PI / (earthCircumference / 2))) * 360 / Math.PI - 90;
        return { lng: wgsLng, lat: wgsLat };
    },
    WGS84toWebMercator: (lng, lat) => {
        // Calculate the web mercator X and Y
        // https://gist.github.com/onderaltintas/6649521
        const wmx = lng * (earthCircumference / 2) / 180;
        let wmy = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
        wmy = wmy * (earthCircumference / 2) / 180;
        return { x: wmx, y: wmy };
    }
};
//https://github.com/nayuki/Nayuki-web-published-code/blob/master/convex-hull-algorithm/convex-hull.ts
// //////////////////
function makeHull(points) {
    let newPoints = points.slice();
    newPoints.sort(POINT_COMPARATOR);
    return makeHullPresorted(newPoints);
}
// Returns the convex hull, assuming that each points[i] <= points[i + 1]. Runs in O(n) time.
function makeHullPresorted(points) {
    if (points.length <= 1)
        return points.slice();
    // Andrew's monotone chain algorithm. Positive y coordinates correspond to "up"
    // as per the mathematical convention, instead of "down" as per the computer
    // graphics convention. This doesn't affect the correctness of the result.
    let upperHull = [];
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        while (upperHull.length >= 2) {
            const q = upperHull[upperHull.length - 1];
            const r = upperHull[upperHull.length - 2];
            if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x))
                upperHull.pop();
            else
                break;
        }
        upperHull.push(p);
    }
    upperHull.pop();
    let lowerHull = [];
    for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        while (lowerHull.length >= 2) {
            const q = lowerHull[lowerHull.length - 1];
            const r = lowerHull[lowerHull.length - 2];
            if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x))
                lowerHull.pop();
            else
                break;
        }
        lowerHull.push(p);
    }
    lowerHull.pop();
    if (upperHull.length == 1 && lowerHull.length == 1 && upperHull[0].x == lowerHull[0].x && upperHull[0].y == lowerHull[0].y)
        return upperHull;
    else
        return [...upperHull, ...lowerHull];
}
function POINT_COMPARATOR(a, b) {
    if (a.x < b.x)
        return -1;
    else if (a.x > b.x)
        return +1;
    else if (a.y < b.y)
        return -1;
    else if (a.y > b.y)
        return +1;
    else
        return 0;
}
// //////////////////
function convexHull(positions) {
    const points = positions.map(pos => ({ 'x': pos[0], 'y': pos[1] }));
    return makeHull(points).map(pnt => [pnt.x, pnt.y]);
}
const quickHash = (str) => {
    // https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        let chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Uint32Array.from([hash])[0].toString(36);
};
const shuffle = (length) => {
    //https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    var array = (new Array(length)).fill('').map((_, i) => i);
    /*
    for i from n−1 downto 1 do
        j ← random integer such that 0 ≤ j ≤ i
        exchange a[j] and a[i]
    */
    for (let i = length - 1; i > 0; i--) {
        let newIdx = Math.floor(Math.random() * (i + 1));
        let oldValue = array[newIdx];
        array[newIdx] = array[i];
        array[i] = oldValue;
    }
    return array;
};
// Test: shuffle(100).sort((a,b) => a - b).map((v, i) => v===i).reduce((a,c) => a && c, true)

function toPointCloud(coordinateList) {
    // Normalize all positions to Position[][][]
    if (typeof coordinateList[0] === 'number') {
        coordinateList = [[[coordinateList]]];
    }
    if (typeof coordinateList[0][0] === 'number') {
        coordinateList = [coordinateList];
    }
    if (typeof coordinateList[0][0][0] === 'number') {
        coordinateList = [coordinateList];
    }
    // Now that everything is normalized, put it into a big list
    const coordCloud = coordinateList
        .reduce((a, c) => [...a, ...c], [])
        .reduce((a, c) => [...a, ...c], []);
    return coordCloud;
}
function projectCoords(coordinates, projectTo) {
    return (coordinates).map((pos) => {
        if (projectTo === '3857') {
            const coord = projections.WGS84toWebMercator(pos[0], pos[1]);
            return [coord.x, coord.y];
        }
        else {
            const coord = projections.WebMercatortoWGS84(pos[0], pos[1]);
            return [coord.lng, coord.lat];
        }
    });
}
function getPointInLayer(map, feature) {
    const canvas = map.getCanvas();
    const max = { x: canvas.width, y: canvas.height };
    const itemHash = (item) => quickHash(JSON.stringify({
        'properties': item.properties,
        'layer': item.layer,
        'geometry': item.geometry || item._geometry
    }));
    const currentFeatureHash = itemHash(feature);
    const coordinates = toPointCloud(feature.geometry.coordinates);
    // Start with the first point
    let pointInLayer = coordinates[0];
    // Check if the point is on the screen
    // Shuffle the points to increase chances that we'll find a match
    const shuffledIndexes = shuffle(coordinates.length);
    for (let i = 0; i < coordinates.length; i++) {
        //Project the point to screen coords
        const testPosition = shuffledIndexes[i];
        const pt = map.project(coordinates[testPosition]);
        if (pt.x >= 0 && pt.x <= max.x && pt.y >= 0 && pt.y <= max.y) {
            const features = map.queryRenderedFeatures(pt);
            if (features[0] && currentFeatureHash === itemHash(features[0])) {
                pointInLayer = coordinates[testPosition];
                break;
            }
        }
    }
    // It should be good enough to just use that point
    // TODO, what if it's not?
    return pointInLayer;
}
function drawOutline(feature, zoom, bufferPixels, bufferSteps) {
    const bufferMeters = pixelsToMeters(bufferPixels, zoom);
    // Project the line into 3857
    let highlightArea;
    //if (feature.geometry.type === 'LineString') {
    //    const projectedLine = this._projectCoords(feature.geometry.coordinates, '3857');
    //    highlightArea = bufferLine(projectedLine, bufferMeters, bufferSteps);
    //} else {
    const pointCloud = toPointCloud(feature.geometry.coordinates);
    const projectedCloud = projectCoords(pointCloud, '3857');
    const bufferedCloud = projectedCloud
        .map((point, idx) => bufferPoint(bufferMeters, bufferSteps, point, projectedCloud[idx - 1], projectedCloud[idx + 1]))
        .reduce((a, c) => [...a, ...c], []);
    highlightArea = convexHull(bufferedCloud);
    //}
    return {
        type: feature.type,
        'layer': feature.layer,
        'properties': {},
        geometry: {
            'type': 'Polygon',
            'coordinates': [projectCoords(highlightArea, '4326')]
        }
    };
}
function getBbox(coordinateList) {
    let bounds = { l: -Infinity, r: Infinity, t: -Infinity, b: Infinity };
    const coordCloud = toPointCloud(coordinateList);
    // Find the bbox
    for (let i = 0; i < coordCloud.length; i++) {
        bounds.l = (bounds.l > coordCloud[i][0]) ? bounds.l : coordCloud[i][0];
        bounds.r = (bounds.r < coordCloud[i][0]) ? bounds.r : coordCloud[i][0];
        bounds.t = (bounds.t > coordCloud[i][1]) ? bounds.t : coordCloud[i][1];
        bounds.b = (bounds.b < coordCloud[i][1]) ? bounds.b : coordCloud[i][1];
    }
    return bounds;
}

class SvgMarker {
    constructor(map, options) {
        this._map = map;
        this._options = options;
    }
    createSvg(feature, tabIndex) {
        let polygon = undefined;
        // Create different markers for different types of shapes
        if (feature.geometry.type === 'Point') {
            polygon = this.pointMarker(feature, tabIndex);
        }
        else if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
            polygon = this.lineMarker(feature, tabIndex);
        }
        else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
            polygon = this.polygonMarker(feature, tabIndex);
        }
        if (polygon) {
            polygon.style.fill = 'rgba(0,0,0,0)';
        }
        return polygon;
    }
    pointMarker(feature, tabIndex) {
        const { bufferPixels, bufferSteps } = this._options;
        let pointBufferPixels = bufferPixels;
        const screenPoint = this._map.project(feature.geometry.coordinates);
        let bufferedCoords = bufferPoint(pointBufferPixels, bufferSteps, [screenPoint.x, screenPoint.y]);
        if (feature.layer.paint && feature.layer.paint['circle-radius']) {
            pointBufferPixels = feature.layer.paint['circle-radius'] + (bufferPixels / 2);
        }
        bufferedCoords = bufferPoint(pointBufferPixels, bufferSteps, [screenPoint.x, screenPoint.y]);
        // TODO text can be made accessible as well
        //} else {
        //    // Symbol
        //    if (feature.layer.layout) {
        //        if ((feature.layer.layout as any)['text-field']) {
        //            const width = ((feature.layer.layout as any)['text-field'].toString()).length * 8;
        //            bufferedCoords = bufferLine([[screenPoint.x - (width / 2), screenPoint.y], [screenPoint.x + (width / 2), screenPoint.y]], 25, 16);
        //            (window as any).feat = feature;
        //        }
        //    }
        //}
        const bufferedCoords4326 = bufferedCoords
            .map(pt => this._map.unproject(pt))
            .filter(pt => pt !== undefined)
            .map(pt => [pt === null || pt === void 0 ? void 0 : pt.lng, pt === null || pt === void 0 ? void 0 : pt.lat]);
        const pointAsPolygon = {
            'type': 'Feature',
            'properties': feature.properties,
            'layer': feature.layer,
            geometry: {
                'type': 'Polygon',
                'coordinates': [bufferedCoords4326]
            }
        };
        return this.polygonMarker(pointAsPolygon, tabIndex, feature, { drawFeature: true });
    }
    lineMarker(feature, tabIndex) {
        // Buffers the line and makes it into a polygon
        if (!this._map)
            return;
        let lineAsPolygon;
        // Since we're buffering the line, we'll need to specify the first point to mimic click and mouseover
        /*const interactivePoint = (feature.geometry.type === 'LineString' ?
            this._getPointInLayer(feature.geometry.coordinates, feature) :
            this._getPointInLayer(this._toPointCloud(feature.geometry.coordinates), feature));*/
        // If there is no best point for hover, just use the first point for the click
        /*const clickPoint = interactivePoint || (feature.geometry.type === 'LineString' ?
            feature.geometry.coordinates[0] :
            feature.geometry.coordinates[0][0]);*/
        if (this._options.drawFeature === true) {
            lineAsPolygon = drawOutline(feature, this._map.getZoom(), this._options.bufferPixels, this._options.bufferSteps);
        }
        else {
            // Just return it as if it were a Polygon / Multipolygon
            // Maybe just send a bbox?
            lineAsPolygon = {
                'type': 'Feature',
                'properties': feature.properties,
                'layer': feature.layer,
                geometry: feature.geometry.type === 'LineString' ? {
                    'type': 'Polygon',
                    'coordinates': [feature.geometry.coordinates]
                } : {
                    'type': 'MultiPolygon',
                    'coordinates': [feature.geometry.coordinates]
                }
            };
        }
        return this.polygonMarker(lineAsPolygon, tabIndex, feature);
    }
    polygonMarker(feature, tabIndex, originalFeature = feature, options = {}) {
        // Find the first point in the geometry, or use an external one
        //interactivePoint = interactivePoint ||
        //    this._getPointInLayer(this._toPointCloud(feature.geometry.coordinates), feature);
        const { bufferPixels, bufferSteps, labelField, drawFeature } = { ...this._options, ...options };
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const prjList = toPointCloud(feature.geometry.coordinates)
            .map(coord => (this._map).project(coord));
        let points = '';
        if (drawFeature === true) {
            // Draw a circle around the whole multipolygon (maybe this won't work it's zoomed too much?)
            if (feature.geometry.type === 'MultiPolygon') {
                // TODO: I don't think this would work?
                feature = drawOutline(feature, this._map.getZoom(), bufferPixels, bufferSteps);
            }
            points = prjList.map(xy => [xy.x, xy.y]).join(',');
        }
        else {
            // Just a rect
            const bounds = getBbox(prjList.map(xy => [xy.x, xy.y]));
            // Define the corners of the rectangle based on bounds
            let topLeft = `${bounds.l},${bounds.t}`;
            let topRight = `${bounds.r},${bounds.t}`;
            let bottomRight = `${bounds.r},${bounds.b}`;
            let bottomLeft = `${bounds.l},${bounds.b}`;
            // Set the points attribute of the polygon
            points = `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;
        }
        polygon.setAttribute('points', points);
        this.simulateMouseEffects(polygon, originalFeature);
        let label = undefined;
        if (typeof labelField === 'function') {
            label = labelField(feature);
        }
        else if (labelField !== undefined) {
            label = feature.properties && feature.properties[labelField];
        }
        if (label) {
            polygon.tabIndex = tabIndex; // TODO right now it'll only get a tab index if it has a label?
            polygon.ariaLabel = label;
            polygon.ariaLabel ? polygon.alt = polygon.ariaLabel : true;
        }
        return polygon;
    }
    simulateMouseEffects(element, feature) {
        const { simulateHover, simulateClick } = this._options;
        const layerId = feature.layer.id;
        const interactivePoint = getPointInLayer(this._map, feature);
        if (simulateHover || true)
            this.simulateHover(element, layerId, interactivePoint);
        if (simulateClick)
            this.simulateClick(element, layerId, interactivePoint);
    }
    simulateHover(element, layerId, interactivePoint) {
        element.onfocus = (event) => {
            const screenPoint = this._map.project(interactivePoint);
            this._map.fire('mousemove', {
                point: screenPoint,
                lngLat: { lng: interactivePoint[0], lat: interactivePoint[1] },
                type: "mousemove",
                layerId: layerId,
                _defaultPrevented: false,
                originalEvent: { ...event, clientX: screenPoint.x, clientY: screenPoint.y }
            });
        };
        element.onblur = (event) => {
            if (!this._map)
                return;
            const antipode = interactivePoint.map(x => x * -1);
            const offScreenPoint = this._map.project(antipode);
            this._map.fire('mousemove', {
                point: offScreenPoint,
                lngLat: { lng: antipode[0], lat: antipode[1] },
                type: "mousemove",
                layerId: layerId,
                _defaultPrevented: false,
                originalEvent: { ...event, clientX: offScreenPoint.x, clientY: offScreenPoint.y }
            });
        };
    }
    simulateClick(element, layerId, interactivePoint) {
        element.onkeydown = (event) => {
            const screenPoint = this._map.project(interactivePoint);
            const acceptableKeys = ['Enter', 'Space', 'NumpadEnter'];
            if (acceptableKeys.indexOf(event.code) > -1) {
                this._map.fire('click', {
                    point: screenPoint,
                    lngLat: { lng: interactivePoint[0], lat: interactivePoint[1] },
                    type: "click",
                    layerId: layerId,
                    _defaultPrevented: false,
                    originalEvent: { ...event, clientX: screenPoint.x, clientY: screenPoint.y }
                });
            }
        };
    }
}

class Accessibility {
    /**
     * Constructs the Accessibility object.
     *
     * @param mapLibrary - The maplibre library used to render the map.
     * @param defaultOptions - Default options for accessibility features.
     */
    constructor(mapLibrary, defaultOptions) {
        this._waitTimes = {};
        this._container = document.createElement('span');
        //_bufferFn?: () => any;
        this._currentFeatureHash = '';
        this.layerOptions = {};
        // Reference to the map library
        this._mapLibrary = mapLibrary;
        // Use the maplibre Event emitter to manage events
        this._events = new mapLibrary.Evented();
        // Create an SVG element that will be used to enhance accessibility
        this._svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // Create a marker for the overlay
        const markerElement = document.createElement('div');
        this._overlay = new this._mapLibrary.Marker(markerElement);
        // Merge the provided default options with the existing default options
        this._defaultOptions = { ...Accessibility.DefaultOptions, ...defaultOptions };
    }
    addLayer(layerName, options) {
        // Set defaults
        if (options.labelField === undefined) {
            throw new Error('A label name is required for the Accessibility Control');
        }
        this.layerOptions[layerName] = { ...this._defaultOptions, ...options };
    }
    removeLayer(layerName) {
        delete this.layerOptions[layerName];
    }
    addTo(map) {
        this.onAdd(map);
    }
    remove() {
        this.onRemove();
    }
    onAdd(map) {
        this._map = map;
        this._initMapListeners();
        // Since it's a plugin, it needs to return a container, but we don't need one, so it's just a blank container
        return this._container;
    }
    onRemove() {
        this._clear();
        this._initMapListeners(false);
        delete this._map;
    }
    _clear() {
        if (!this._map)
            return;
        this._waitTimes = {}; // Clear all waits, since we cleared the map
        while (this._svg.firstChild) {
            this._svg.removeChild(this._svg.firstChild);
        }
        this._overlay.remove(); // Remove the marker
    }
    _addFeatures() {
        if (!this._map)
            return;
        // Query the features out of the map in any of the layers that are specified
        const features = this._map.queryRenderedFeatures(undefined, { 'layers': Object.keys(this.layerOptions) });
        //let features = [];
        // Store a hash about the current features so we know if they've updated
        // We only update the accessibility layer if the features are new (to ignore state and style changes)
        const featureHash = this._featureHash(features);
        //console.log('HASH', featureHash);
        if (this._currentFeatureHash !== featureHash) {
            this._currentFeatureHash = featureHash;
            this._clear(); // Remove the old markers
            this._drawOverlay(); // Draw a new marker
            // TODO dedup?
            // TODO remove offscreen markers?
            const loadingMarkers = features.map(this._addMarker.bind(this));
            // Once all the markers are added, fire an event
            Promise.all(loadingMarkers)
                .then(markers => this._events.fire('markersLoaded', markers));
        }
    }
    _featureHash(features) {
        var _a, _b;
        if (!Array.isArray(features))
            features = [features];
        // Make this small to prevent memory issues
        return quickHash(features.map(f => quickHash((f._vectorTileFeature._geometry || 0).toString())).join() + ((_a = this._map) === null || _a === void 0 ? void 0 : _a.getZoom()) + ((_b = this._map) === null || _b === void 0 ? void 0 : _b.getCenter()));
        /*return quickHash(JSON.stringify(features.map(f => ({
            ...f,
            state: {}, // Ignore State Changes
            layer: {
                ...f.layer,
                'layout': {}, // Ignore Changes to layout
                'paint': {} // Ignore Changes to Paint
            },
            'zoom': this._map?.getZoom(),
            'center': this._map?.getCenter()
        }))));*/
    }
    _addMarker(feature, idx) {
        if (!this._map)
            return;
        const tabIndex = idx + 1;
        const layerOptions = this.layerOptions[feature.layer.id];
        // Create the marker
        const marker = new SvgMarker(this._map, layerOptions);
        // Create the marker
        let polygon = marker.createSvg(feature, tabIndex);
        if (polygon !== undefined) {
            this._svg.appendChild(polygon);
        }
        return polygon;
    }
    _waitEvent(name, waitTime = 500) {
        // Uses listeners as a debouncer
        this._waitTimes[name] = (this._waitTimes[name] || 0) + waitTime;
        setTimeout(() => {
            if (this._waitTimes[name] !== undefined) {
                this._waitTimes[name] = this._waitTimes[name] - waitTime;
                if (this._waitTimes[name] <= 0) {
                    this._waitTimes[name] = 0; // Reset the time to 0
                    this._events.fire(name);
                }
            }
        }, waitTime);
    }
    _drawOverlay() {
        if (!this._map)
            return;
        // Create a canvas over the whole map
        const canvas = this._map.getCanvas();
        // Update SVG
        const svg = this._svg;
        svg.setAttribute('width', canvas.style.width);
        svg.setAttribute('height', canvas.style.height);
        // Create rectangle element FOR TESTING
        //////////////////////////////////////////////////////
        // TESTING SECTION
        //let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        //rect.setAttribute('width', canvas.style.width);
        //rect.setAttribute('height', canvas.style.height);
        //rect.style.fill = 'rgba(255,0,0,0.1)';
        // Append rectangle to SVG
        //svg.appendChild(rect);
        // TESTING SECTION
        //////////////////////////////////////////////////////
        // Add the canvas and the imageMap
        // Create the Div element
        const markerElement = document.createElement('div');
        markerElement.style.width = svg.style.width;
        markerElement.style.height = svg.style.height;
        markerElement.style.pointerEvents = 'none';
        this._svg.style.display = 'inline';
        markerElement.appendChild(svg);
        this._overlay = new this._mapLibrary.Marker({ 'element': markerElement });
        // Set initial point
        this._overlay.setLngLat(this._map.getCenter());
        this._overlay.setOffset([0, 3]); //TODO why is this 3?
        this._overlay.addTo(this._map);
        return this._overlay;
    }
    _initMapListeners(enable = true) {
        if (!this._map)
            return;
        const enabled = enable ? 'on' : 'off';
        this._map[enabled]('movestart', _ => this._svg.style.display = 'none');
        // Moveend & Render
        // Query all map features and draw the accessibilty items
        const isMoving = () => {
            if ((this._map && !this._map.isMoving())) {
                this._waitEvent('addFeatures');
            }
        };
        this._events[enabled]('addFeatures', () => { this._addFeatures(); });
        this._map[enabled]('moveend', _ => isMoving());
        this._map[enabled]('render', _ => isMoving());
    }
}
Accessibility.DefaultOptions = {
    'labelField': 'name',
    'drawFeature': false,
    'bufferPixels': 5,
    'bufferSteps': 8,
    'simulateHover': true,
    'simulateClick': true
};

class Interactive {
    constructor(mapLibrary, map, genericPopupHelperOptions = {}) {
        this._activePopups = new Map();
        this._map = map;
        this._mapLibrary = mapLibrary;
        this._activeTooltip = undefined;
        this._iconMasks = new Map();
        this._clicks = 0;
        this._touch = [];
        this._accessibility = new Accessibility(mapLibrary, { 'labelField': 'name' });
        this._accessibility.addTo(map);
        // Add the generic popup
        const defaultPopupHelperOptions = {
            type: 'popup',
            multiFormatter: formatter
        };
        this._genericPopup = new BindPopup(undefined, { ...defaultPopupHelperOptions, ...genericPopupHelperOptions }, mapLibrary);
        this._initMapListeners();
        window.MMAAPP = map;
    }
    // Helpers for tooltip
    addTooltip(layerName, popup, options) {
        const tooltipDefaultOptions = {
            focusAfterOpen: false,
            closeButton: false,
            type: 'tooltip'
        };
        options = { ...tooltipDefaultOptions, ...options };
        return this._add(layerName, popup, options);
    }
    removeTooltip(layerName) {
        return this._remove(layerName, 'tooltip');
    }
    // Helpers for Popups
    addPopup(layerName, popup, options) {
        return this._add(layerName, popup, { ...{ 'type': 'popup' }, ...options });
    }
    removePopup(layerName) {
        return this._remove(layerName, 'popup');
    }
    // Helpers for Accessibility
    addAccessibility(layerName, options) {
        return this._accessibility.addLayer(layerName, options);
    }
    removeAccessibility(layerName) {
        return this._accessibility.removeLayer(layerName);
    }
    // The add / remove functions for popup and tooltips
    _add(layerName, popup, options) {
        if (options.type === undefined) {
            throw new Error(`The _add function requires a type (popup or tooltup)`);
        }
        if (!this._activePopups.get(options.type))
            this._activePopups.set(options.type, new Map());
        const interactiveMap = this._activePopups.get(options.type);
        if (interactiveMap) {
            let interactiveFeature = interactiveMap.get(layerName);
            if (interactiveFeature) {
                throw new Error(`Layer ${layerName} already has a ${options.type}, remove the other ${options.type} first`);
            }
            else {
                interactiveFeature = new BindPopup(popup, options, this._mapLibrary);
                interactiveMap.set(layerName, interactiveFeature);
            }
            return true;
        }
    }
    _remove(layerName, type) {
        if (!this._activePopups.get(type))
            this._activePopups.set(type, new Map());
        const interactiveMap = this._activePopups.get(type);
        if (interactiveMap) {
            const layerPopup = interactiveMap.get(layerName);
            if (layerPopup) {
                interactiveMap.delete(layerName);
            }
            else {
                throw new Error(`Layer ${layerName} does not have a ${type}.`);
            }
            return true;
        }
    }
    _initMapListeners() {
        // CLICK
        this._map.on('click', e => {
            this._clicks += 1;
            // Wait to make sure it wasn't a double click
            setTimeout(() => {
                if (this._clicks === 1) {
                    this._click(e);
                }
                this._clicks = 0;
            }, 200);
        });
        // Mouseover
        this._map.on('mousemove', e => {
            // The touchstart event happens before the mousemove, this avoids those events from causing a mouseover
            // This will only disable mousemove in the exact area of the touch event (+-3pixel)
            // and only for 800ms, so that devices with both touch and mouse still work properly
            const touchDistance = 3;
            if (e.originalEvent.button !== 2) { // Ignore mouseover while rotating
                let match = this._touch.filter(p => {
                    const a = e.point.x - p[0];
                    const b = e.point.y - p[1];
                    const c = Math.sqrt(a * a + b * b);
                    return c < touchDistance;
                }).length > 0;
                if (!match) {
                    this._mousemove(e);
                }
            }
        });
        // Prevent mouseover on touchstart
        this._map.on('touchstart', e => {
            // Block mousemoves at this point for 800ms
            this._touch.push([e.point.x, e.point.y]);
            setTimeout(() => {
                // Reset it back after 800ms
                this._touch = this._touch.filter(p => e.point.x !== p[0] && e.point.x !== p[1]);
            }, 800);
        });
        // Close tooltip on right click
        this._map.on('mousedown', e => {
            var _a, _b;
            // Remove tooltips on right click
            if (e.originalEvent.button === 2) {
                if (this._activeTooltip) {
                    const tooltip = (_b = (_a = this._activePopups.get('tooltip')) === null || _a === void 0 ? void 0 : _a.get(this._activeTooltip)) === null || _b === void 0 ? void 0 : _b.popup;
                    if (tooltip) {
                        tooltip.remove();
                    }
                }
            }
        });
    }
    _click(e) {
        var _a;
        // Get the features
        const { featuresUnderMouse, popupLayers } = this._getActiveFeatures(e.point);
        const popupFeatures = this._dedupeFeatures(featuresUnderMouse
            .filter(feature => popupLayers.indexOf(feature.layer.id) > -1), 'popup');
        // Show the popup(s)
        if (popupFeatures.length > 1) {
            const context = this._map; //TODO
            this._genericPopup.showMulti(e.lngLat, popupFeatures, context, this._map, this._activePopups);
            // Clear tooltips when mousing over the popup
            this._genericPopup.popup._container.addEventListener('mouseenter', () => this._mousemove());
        }
        else if (popupFeatures.length === 1) {
            // Only one matching popup, show it!
            const popupFeature = popupFeatures[0];
            const coordinates = this._wrapCoords(e, (popupFeature.geometry.type === 'Point') ?
                popupFeature.geometry.coordinates.slice() :
                [e.lngLat.lng, e.lngLat.lat]);
            const popup = (_a = this._activePopups.get('popup')) === null || _a === void 0 ? void 0 : _a.get(popupFeature.layer.id);
            // Populate the popup and set its coordinates
            // based on the feature found.
            if (popup) {
                const context = popup.options.context || this._map; //TODO
                popup.show(coordinates, popupFeature, context, this._map);
                // Clear tooltips when mousing over the popup
                popup.popup._container.addEventListener('mouseenter', () => this._mousemove());
            }
        }
    }
    _quickHash(str) {
        // https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
        let hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(32);
    }
    _mousemove(e) {
        var _a;
        // Send in a undefined event to clear the tooltips
        if (!e) {
            if (this._activeTooltipPopup) {
                this._activeTooltipPopup.popup.remove();
            }
            return;
        }
        // Get the features
        const { featuresUnderMouse, popupLayers, tooltipLayers } = this._getActiveFeatures(e.point);
        let defaultPointer = 'pointer';
        // The pointer changes for popups only
        const pointer = featuresUnderMouse
            .filter(feature => popupLayers.indexOf(feature.layer.id) > -1)
            .map(feature => { var _a, _b; return ((_b = (_a = this._activePopups.get('popup')) === null || _a === void 0 ? void 0 : _a.get(feature.layer.id)) === null || _b === void 0 ? void 0 : _b.options.pointer) || defaultPointer; })[0] || '';
        const currPointer = this._map.getCanvas().getAttribute('style');
        if (pointer !== currPointer) {
            //console.log('SWITCHING TO ', pointer);
            this._map.getCanvas().style.cursor = pointer;
        }
        // Show the tooltip
        const tooltipFeature = this._dedupeFeatures(featuresUnderMouse
            .filter(feature => tooltipLayers.indexOf(feature.layer.id) > -1), 'tooltip')[0];
        const tooltipFeatureHash = tooltipFeature && this._quickHash(JSON.stringify(tooltipFeature.toJSON()));
        // Remove any existing tooltips that aren't this one
        if (this._activeTooltip && this._activeTooltip !== tooltipFeatureHash) {
            if (this._activeTooltipPopup) {
                this._activeTooltipPopup.popup.remove();
            }
        }
        // Show the tooltip
        if (tooltipFeature && this._activeTooltip !== tooltipFeatureHash) {
            // Copy coordinates array.
            const coordinates = this._wrapCoords(e, (tooltipFeature.geometry.type === 'Point') ?
                tooltipFeature.geometry.coordinates.slice() :
                [e.lngLat.lng, e.lngLat.lat]);
            const tooltip = (_a = this._activePopups.get('tooltip')) === null || _a === void 0 ? void 0 : _a.get(tooltipFeature.layer.id);
            if (tooltip) {
                this._activeTooltip = tooltipFeatureHash;
                this._activeTooltipPopup = tooltip;
                const context = tooltip.options.context || this._map;
                tooltip.show(coordinates, tooltipFeature, context, this._map);
                if (tooltipFeature.geometry.type !== 'Point' && e.originalEvent.type === 'mousemove') { // TODO options?
                    tooltip.popup.trackPointer();
                }
                // Remove the tooltip from the active variable when it gets removed
                tooltip.popup.once('close', () => {
                    this._activeTooltip = undefined;
                    this._activeTooltipPopup = undefined;
                });
            }
        }
    }
    _getActiveFeatures(pixelPoint) {
        var _a, _b;
        const popupLayers = [...(((_a = this._activePopups.get('popup')) === null || _a === void 0 ? void 0 : _a.keys()) || [])];
        const tooltipLayers = [...(((_b = this._activePopups.get('tooltip')) === null || _b === void 0 ? void 0 : _b.keys()) || [])];
        const activeLayers = [
            ...popupLayers,
            ...tooltipLayers
        ].filter((layerName, idx, a) => {
            return a.indexOf(layerName) === idx;
        });
        const featuresUnderMouse = this._getAllFeatures(pixelPoint, 3 /*TODO options*/, activeLayers);
        return {
            'featuresUnderMouse': featuresUnderMouse,
            'popupLayers': popupLayers,
            'tooltipLayers': tooltipLayers,
            'activeLayers': activeLayers
        };
    }
    ;
    _wrapCoords(e, coordinates) {
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        return { 'lng': coordinates[0], 'lat': coordinates[1] };
    }
    _getAllFeatures(pixelPoint, tolerance, clickableLayerNames) {
        // Get the  clicked point and make a bbox with it +/- a tolerance
        const bbox = [
            [pixelPoint.x - tolerance, pixelPoint.y - tolerance],
            [pixelPoint.x + tolerance, pixelPoint.y + tolerance]
        ];
        // Find all features in that bbox
        const features = this._map.queryRenderedFeatures(bbox, {
            layers: clickableLayerNames.map(layer => layer).filter(id => Object.keys(this._map.style._layers).indexOf(id) > -1)
        }).filter((feature) => {
            if (feature.layer.type === 'symbol') {
                // Don't return a mouse over in a transparent area
                // TODO option?
                const layer = this._map.getLayer(feature.layer.id);
                if (!layer)
                    return false;
                const iconName = layer.layout._values['icon-image'].evaluate(feature, feature.state, null, this._map.style._availableImages).name;
                const icon = this._map.style.getImage(iconName);
                let mask = this._iconMasks.get(iconName);
                if (!mask) {
                    mask = new IconMask(iconName, this._map, {});
                    this._iconMasks.set(iconName, mask);
                }
                if (icon && mask) {
                    var pixelRatio = icon.pixelRatio || 1;
                    var featureCenter;
                    if (Array.isArray(feature.geometry.coordinates[0])) {
                        // Deal with lines and polygons being displayed as symbols
                        featureCenter = this._map.project(feature.geometry.coordinates[0]);
                    }
                    else {
                        featureCenter = this._map.project(feature.geometry.coordinates);
                    }
                    var iconTopLeft = [featureCenter.x - icon.data.width / 2 / pixelRatio, featureCenter.y - icon.data.height / 2 / pixelRatio];
                    var clickInIcon = [
                        Math.floor((pixelPoint.x - iconTopLeft[0]) * pixelRatio),
                        Math.floor((pixelPoint.y - iconTopLeft[1]) * pixelRatio)
                    ];
                    var codeAtCoord = mask.readCoord(clickInIcon[0], clickInIcon[1], 3);
                    return codeAtCoord;
                }
                else {
                    return true;
                }
            }
            else {
                return true;
            }
        }).filter((feature) => {
            // TODO filter out features with different tolerances
            return true;
        });
        return features;
    }
    _dedupeFeatures(features, type = 'popup') {
        const uniqueFeatures = {};
        // Add this somewhere else, map?
        const generateKey = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                let chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return new Uint32Array([hash])[0].toString(36);
        };
        features.forEach(feature => {
            var _a, _b;
            const primaryKeys = ((_b = (_a = this._activePopups.get(type)) === null || _a === void 0 ? void 0 : _a.get(feature.layer.id)) === null || _b === void 0 ? void 0 : _b.options.primaryKeys) || [];
            let compareString = feature.layer.id;
            if (primaryKeys.length) {
                compareString += JSON.stringify(Object.keys(feature.properties)
                    .filter(key => primaryKeys.indexOf(key) > -1)
                    .map(key => [key, feature.properties[key]])
                    .reduce((a, c) => ({ ...a, ...{ [c[0]]: c[1] } }), {}));
            }
            else {
                compareString += JSON.stringify(feature.properties);
            }
            const featureKey = generateKey(compareString);
            if (uniqueFeatures[featureKey]) {
                // Merge Geometries?
                const baseGeometry = uniqueFeatures[featureKey].geometry;
                if (baseGeometry.type === 'Point' || baseGeometry.type === 'LineString' || baseGeometry.type === 'Polygon') {
                    // Make into a multi!
                    baseGeometry.type = 'Multi' + baseGeometry.type;
                    baseGeometry.coordinates = [baseGeometry.coordinates];
                }
                if (baseGeometry.type === 'MultiPoint' || baseGeometry.type === 'MultiLineString' || baseGeometry.type === 'MultiPolygon') {
                    if (feature.geometry.type === baseGeometry.type.replace(/^Multi/g, '')) {
                        // TODO clean this up
                        baseGeometry.coordinates.push(feature.geometry.coordinates);
                        uniqueFeatures[featureKey].geometry = baseGeometry;
                    }
                }
            }
            else {
                uniqueFeatures[featureKey] = feature;
            }
        });
        return Object.keys(uniqueFeatures)
            .map(key => uniqueFeatures[key]);
    }
    ;
}

module.exports = Interactive;
