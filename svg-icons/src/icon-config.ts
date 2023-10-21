import { StyleImageInterface } from "maplibre-gl";
import { SVGPlugin } from ".";
import toStyleImage from "./icon-functions/to-style-image";
import { FunctionType, IconConfigType, IconFunctionParams, MaplibreImage } from "./types";

export default class IconConfig {
    config: IconConfigType;
    private _originalId: string
    plugin: SVGPlugin;
    imageData?: MaplibreImage;

    constructor(config: IconConfigType | string, plugin: SVGPlugin) {
        // Read the config
        if (typeof config === 'string') {
            this._originalId = config;
            try {
                config = JSON.parse(decodeURIComponent(config)) as IconConfigType;
            } catch (e) {
                // It's probably not JSON, add it as a missing base image
                config = {
                    ...plugin.options,
                    baseImageId: undefined
                }
            }
        } else {
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

    async execute(baseImageData: MaplibreImage | undefined): Promise<StyleImageInterface> {
        const config = this.config;
        let finalResult: MaplibreImage | undefined;
        let functions: FunctionType<IconFunctionParams>[] = [];

        if (config.baseImageId && baseImageData === undefined) {
            // It is looking for an id, and that id doesn't exist, apply the default image
            baseImageData = config.fallbackImage;

            // Use the fallback functions if any are specified
            functions = this.config.fallbackFunctions || this.config.functions || [];
        } else {
            functions = this.config.functions || [];
        }

        // Loop through all the functions
        finalResult = await functions.reduce(async (previousPromise, currentItem) => {
            const previousResult = await previousPromise;
            const fn = this.plugin.options.customFunctions[currentItem.name];
            if (!fn) {
                console.warn('Image processing function missing: ' + currentItem.name);
                return
            }
            // Always pass the default image if there is the base image is undefined
            const result = await fn.bind({ ...this, imageData: previousResult || config.fallbackImage })(currentItem.params);
            return result;
        }, Promise.resolve(baseImageData));

        return await toStyleImage.bind({ ...this, imageData: (finalResult || config.fallbackImage) })();
    }
}