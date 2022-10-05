import { Map as MaplibreMap } from 'maplibre-gl';
export declare const icons: {
    [key: string]: string;
};
export declare class colorTools {
    private _color;
    constructor(color: string);
    set color(color: string);
    get hex(): string;
    set alpha(alpha: number);
    get alpha(): number;
    get rgbaString(): string;
    get rgba(): {
        red: number;
        green: number;
        blue: number;
        alpha: number;
    };
    get array(): number[];
    _colorToRgba(color: string): string;
    _rgbaToColors(rgbaColor: string): {
        red: number;
        green: number;
        blue: number;
        alpha: number;
    };
}
export declare const mapIconToImage: (iconName: string, map: MaplibreMap, iconColor?: string | undefined) => imageTools;
export declare class svgIcon {
    _svgUrl: string;
    constructor(svg: string | Element);
    toElement(svgString?: string): Element;
    get dataUrl(): string;
    _toUrl(svgElement?: Element | string): string;
    recolor(fillColorMap?: Array<[string | undefined, string | undefined]>, strokeColorMap?: Array<[string | undefined, string | undefined]>, strokeWidth?: number): svgIcon;
    addToMap(name: string, map: MaplibreMap, width: number, height: number, pixelRatio?: number): Promise<boolean>;
    toImageData(width: number, height: number, pixelRatio: number): Promise<ImageData>;
}
export declare class imageTools {
    _img: HTMLImageElement;
    constructor(img?: HTMLImageElement);
    _getCanvas(height?: number, width?: number): HTMLCanvasElement;
    get dataUrl(): string;
    updateImageData(imageData: ImageData, pixelRatio?: number): void;
    get displayedImageData(): ImageData;
    get element(): HTMLImageElement;
    _getImageData(height?: number, width?: number): ImageData;
    colorMask(htmlColor: string, imageData?: ImageData): ImageData;
    setContrastingBackgroundColor(blockSize?: number): void;
}
