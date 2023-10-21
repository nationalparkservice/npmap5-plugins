import type {
    Map as GlMap, MapDataEvent, StyleImage, StyleImageInterface, StyleImageMetadata
} from 'maplibre-gl';
import { Color } from './color';
import IconConfig from './icon-config';
import applyCss from './icon-functions/apply-css';
import recolorRaster from './icon-functions/recolor-raster';
import toStyleImage from './icon-functions/to-style-image';
import replaceValues from './icon-functions/replace-values';

import { IconConfigType, MaplibreImage, SVGPluginOptions, isStyleImageInterface } from './types';

const smallDotSvg = `
<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
  <circle cx="5" cy="5" r="5" fill="currentColor"/>
</svg>`;

class SVGPlugin {
    map: GlMap;

    // Maintains a list of images that were missing so we added the default image
    missingBaseImages: Map<string, Set<string>> = new Map();
    imageDataLibrary: Map<string, MaplibreImage> = new Map();
    options: SVGPluginOptions;

    static defaultImageOptions: StyleImageMetadata = {
        pixelRatio: window.devicePixelRatio,
        sdf: false,
        stretchX: undefined,
        stretchY: undefined,
        content: undefined,
    };

    static defaultOptions: SVGPluginOptions = {
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

    static ColorTools: typeof Color = Color;
    static getTypes = {
        isStyleImageInterface
    };
    getTypes = SVGPlugin.getTypes;

    static stringifyConfig = (iconConfig: Partial<IconConfigType>): string => {
        // Escape any brackets added by the user, so we can use the mustache functions to pull data in
        const replacer = function (_: string, value: any) {
            if (typeof value === "string" && value.includes("{") && value.includes("}")) {
                return value.replace(/{/g, '\\{').replace(/}/g, '\\}');
            }
            return value;
        }

        // Stringify with replacer function, then encode
        let encoded = encodeURIComponent(JSON.stringify(iconConfig, replacer));

        // Unescape brackets after encoding
        return encoded.replace(/%5C%5C%7B/g, '{').replace(/%5C%5C%7D/g, '}');
    }

    stringifyConfig = SVGPlugin.stringifyConfig


    constructor(map: GlMap, options: Partial<SVGPluginOptions> = {}) {
        this.map = map;
        this.options = { ...SVGPlugin.defaultOptions, ...options };

        // Subscribe to the missing images function
        map.on('styleimagemissing', (e) => this.addMissingBaseImage(e.id));

        // Subscribe to new data to see when images come in
        const debouncedProcessNewImages = this.debounce(() => {
            this.processNewImages(map.style.imageManager.images);
        }, 10)
        map.on('data', (mapDataEvent: MapDataEvent & Object) => {
            if (mapDataEvent.dataType === 'style') {
                // New style data came in! Maybe it'll fix the broken images?
                // This can happen a whole lot, so let's debounce it
                debouncedProcessNewImages();
            }
        });
    }

    processNewImages(imageObj: {
        [_: string]: StyleImage;
    }) {
        const updatedMissingImages = (Object.entries(imageObj)).filter(([k]) => this.missingBaseImages.has(k));
        updatedMissingImages.forEach(([k, v]) => {
            // TODO, do we even update JSON images?
            this.addImage(k, v.data);
        });
    }

    addImage(imageBase: string, imageData: MaplibreImage) {
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
                })
            })
    }

    addMissingBaseImage(imageId: string) {
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
            this.missingBaseImages.get(baseImageId)?.add(imageId)
        }


        // parse out the image name
        const baseImageData = baseImageId && this.imageDataLibrary.get(baseImageId);

        if (baseImageData || baseImageId === undefined) {
            // We have the base for this image, so we can re-render it!
            this.updateImage(iconConfig, baseImageData);
        } else {
            // We don't have the base image, so we can apply the fallback
            // if the missing image is using SDF, then our image needs to be SDF (it would convert it automatically, but throw an error if we don't)
            this.setImageIdToFallback(iconConfig);
        }
    }

    removeMissingBaseImage(iconConfig: IconConfig) {
        // Check if the missing image base is in the map
        const baseImageId = iconConfig.config.baseImageId;
        if (baseImageId) {
            if (this.missingBaseImages.has(baseImageId)) {
                const baseEntry = this.missingBaseImages.get(baseImageId);
                if (baseEntry) {
                    baseEntry.delete(iconConfig.imageId);
                    if (baseEntry.size === 0) {
                        this.missingBaseImages.delete(baseImageId)
                    }
                }
            }
        }
    }

    setImageIdToFallback(iconConfig: IconConfig): Promise<StyleImageInterface | undefined> {
        return this._updateImage(iconConfig, undefined);
    }

    async updateImage(iconConfig: IconConfig, baseImageData?: MaplibreImage): Promise<StyleImageInterface | undefined> {
        const styleImage = await this._updateImage(iconConfig, baseImageData);
        if (styleImage) this.removeMissingBaseImage(iconConfig);
        return styleImage;
    }

    async _updateImage(iconConfig: IconConfig, baseImageData: MaplibreImage | undefined): Promise<StyleImageInterface | undefined> {

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
        } catch (e) {
            //console.log('IMAGE', iconConfig);
            console.error('Error loading image', e);
            return;
        }
    }

    prefetchImageId(imageId: string) {
        this.map.style.fire(new Event('styleimagemissing', { id: imageId } as any));
    }

    debounce(func: () => void, wait: number) {
        let timeoutId: NodeJS.Timeout | null = null;

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

};

export { IconConfigType, MaplibreImage, SVGPluginOptions, isStyleImageInterface, SVGPlugin };
