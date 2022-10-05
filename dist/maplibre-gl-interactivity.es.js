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
            console.log('sections', sections, div);
        }).catch(e => {
            console.log('ERROR WITH DIV', e);
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
        window.feature = feature;
        let layerIcon, layerCircleSize, layerLineWidth;
        if (featureType === 'symbol') {
            layerIcon = (_a = feature.layer.layout['icon-image']) === null || _a === void 0 ? void 0 : _a.name; // TODO if this doesn't exist, just make it a circle
        }
        else if (featureType === 'circle') {
            layerCircleSize = feature.layer.paint['circle-radius'];
        }
        else if (featureType === 'line') {
            layerLineWidth = feature.layer.paint['line-width'];
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
                })
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
    const span = document.createElement('span');
    const ulElement = document.createElement('ul');
    const layers = getLayers(features, map, activePopups, parentPopup);
    // Go through the groups and create the list
    Object.keys(layers).forEach(group => {
        const liElement = document.createElement('li');
        liElement.textContent = group;
        // Build the group info
        const ulSubElement = buildGroup(layers[group], map, span);
        liElement.appendChild(ulSubElement);
        ulElement.appendChild(liElement);
    });
    span.appendChild(ulElement);
    return span;
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
        liAnchorElement.href = '';
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

class Interactive {
    constructor(mapLibrary, map, genericPopupHelperOptions = {}) {
        this._activePopups = new Map();
        this._map = map;
        this._mapLibrary = mapLibrary;
        this._activeTooltip = undefined;
        this._iconMasks = new Map();
        this._clicks = 0;
        this._touch = [];
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
        this._map.getCanvas().style.cursor = pointer;
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
            return hash.toString(36);
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

export { Interactive as default };
