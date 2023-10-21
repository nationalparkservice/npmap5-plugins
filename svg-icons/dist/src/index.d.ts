import type { Map as GlMap, StyleImage, StyleImageInterface, StyleImageMetadata } from 'maplibre-gl';
import { Color } from './color';
import IconConfig from './icon-config';
import { IconConfigType, MaplibreImage, SVGPluginOptions, isStyleImageInterface } from './types';
declare class SVGPlugin {
    map: GlMap;
    missingBaseImages: Map<string, Set<string>>;
    imageDataLibrary: Map<string, MaplibreImage>;
    options: SVGPluginOptions;
    static defaultImageOptions: StyleImageMetadata;
    static defaultOptions: SVGPluginOptions;
    static ColorTools: typeof Color;
    static getTypes: {
        isStyleImageInterface: typeof isStyleImageInterface;
    };
    getTypes: {
        isStyleImageInterface: typeof isStyleImageInterface;
    };
    static stringifyConfig: (iconConfig: Partial<IconConfigType>) => string;
    stringifyConfig: (iconConfig: Partial<IconConfigType>) => string;
    constructor(map: GlMap, options?: Partial<SVGPluginOptions>);
    processNewImages(imageObj: {
        [_: string]: StyleImage;
    }): void;
    addImage(imageBase: string, imageData: MaplibreImage): void;
    addMissingBaseImage(imageId: string): void;
    removeMissingBaseImage(iconConfig: IconConfig): void;
    setImageIdToFallback(iconConfig: IconConfig): Promise<StyleImageInterface | undefined>;
    updateImage(iconConfig: IconConfig, baseImageData?: MaplibreImage): Promise<StyleImageInterface | undefined>;
    _updateImage(iconConfig: IconConfig, baseImageData: MaplibreImage | undefined): Promise<StyleImageInterface | undefined>;
    prefetchImageId(imageId: string): void;
    debounce(func: () => void, wait: number): () => void;
}
export { IconConfigType, MaplibreImage, SVGPluginOptions, isStyleImageInterface, SVGPlugin };
