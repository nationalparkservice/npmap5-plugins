import { Geometry } from 'geojson';
export declare class TileInfo {
    key: string;
    geojsonvtId: number;
    x: number;
    y: number;
    zoom: number;
    tileId: {
        key: string;
        overscaledZ: number;
        wrap: number;
        canonical: {
            x: number;
            y: number;
            z: number;
            key: string;
        };
    };
    constructor(x: number, y: number, zoom: number);
    asGeoJson(): Geometry;
    parent(): TileInfo | null;
    children(): [TileInfo, TileInfo, TileInfo, TileInfo];
    coordinates(epsg: '4326' | '3857'): number[][];
}
export declare class TileInfoKey extends TileInfo {
    constructor(key: string);
}
export declare class TileInfoGeoJSONVT extends TileInfo {
    constructor(id: number);
}
export declare function tilesInBbox(lngLatBbox: [number, number, number, number], zoom: number): TileInfo[];
