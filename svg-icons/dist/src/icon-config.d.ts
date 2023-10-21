import { StyleImageInterface } from "maplibre-gl";
import { SVGPlugin } from ".";
import { IconConfigType, MaplibreImage } from "./types";
export default class IconConfig {
    config: IconConfigType;
    private _originalId;
    plugin: SVGPlugin;
    imageData?: MaplibreImage;
    constructor(config: IconConfigType | string, plugin: SVGPlugin);
    get imageId(): string;
    execute(baseImageData: MaplibreImage | undefined): Promise<StyleImageInterface>;
}
