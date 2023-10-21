import { esriGeometryType, Multipoint, Point, Polygon, Polyline } from "arcgis-rest-api";
import { esriExtent, esriFeatureServiceResponse, esriJSONTranform, esriQuantizationParameters } from "../types/arcgisRestTypes";
export declare const webMercatorCodes: string[];
export declare function getEsriBoundingBox(lngLatBbox: [number, number, number, number]): esriExtent;
export declare function quantizationParameters(tileZoomLevel: number, tileSize?: number): esriQuantizationParameters;
export declare function mergeRings(ringsX: number[][], ringsY: number[][], srid: string): number[][][];
export declare function deZigZag(values: number[], splits: number[], scale: number, initialOffset: number, upperLeftOrigin: boolean): number[][];
export declare class DeZigZagJSON {
    features: esriFeatureServiceResponse['features'];
    transform: esriJSONTranform;
    geometryType: esriGeometryType;
    srid: string;
    constructor(features: esriFeatureServiceResponse['features'], transform: esriJSONTranform, geometryType: esriGeometryType);
    convert(): Promise<{
        attributes: {
            [key: string]: string;
        };
        geometry: Point | Polyline | Polygon | Multipoint;
    }[]>;
    convertGeometry(geometry: esriFeatureServiceResponse['features'][0]['geometry']): Point | Polyline | Polygon | Multipoint;
}
