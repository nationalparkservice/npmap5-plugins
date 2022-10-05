import {
    RGBAImage,
    Map as maplibreMap
} from 'maplibre-gl';

export default class IconMask {
    mask?: Array<boolean>;
    width?: number;
    height?: number;
    sdf?: boolean;
    pixelRatio?: number;
    layerIconData?: RGBAImage;
    options: {
        minOpacity: number
    };

    constructor(imageName: string, map: maplibreMap, options: {}) {
        const defaultOptions = {
            'minOpacity': 0.5
        }
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

    create(minOpacity: number = this.options.minOpacity) {
        if (!this.width || !this.height || !this.layerIconData) return [];
        const mask = [];

        const minOpacityVal = minOpacity * 100;
        for (let i = 3; i < this.layerIconData.data.length; i += 4) {
            mask.push(this.layerIconData.data[i] >= minOpacityVal)
        }

        return mask;
    }

    readCoord(x: number, y: number, tolerance: number = 0): boolean | undefined {

        const checkCoord = (checkX: number, checkY: number) => {
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
        } else {
            return false;
        }
    }
}