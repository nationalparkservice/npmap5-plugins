import { RGBAImage, Map as maplibreMap } from 'maplibre-gl';
export default class IconMask {
    mask?: Array<boolean>;
    width?: number;
    height?: number;
    sdf?: boolean;
    pixelRatio?: number;
    layerIconData?: RGBAImage;
    options: {
        minOpacity: number;
    };
    constructor(imageName: string, map: maplibreMap, options: {});
    imageData(): ImageData | undefined;
    create(minOpacity?: number): boolean[];
    readCoord(x: number, y: number, tolerance?: number): boolean | undefined;
}
