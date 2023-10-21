import { Position } from "geojson";
import polygonTools from 'polygon-clipping';
export declare const earthCircumference = 40075016.68557849;
export declare const pixelsToMeters: (px: number, zoom: number) => number;
export declare function angle(positionA: Position, positionB: Position): number;
export declare function drawPoint(startPosition: Position, angle: number, distance: number): number[];
export declare function bufferPoint(distance: number, steps: number | undefined, position: Position, prevPosition?: Position, nextPosition?: Position): number[][];
export declare const projections: {
    WebMercatortoWGS84: (x: number, y: number) => {
        lng: number;
        lat: number;
    };
    WGS84toWebMercator: (lng: number, lat: number) => {
        x: number;
        y: number;
    };
};
export declare function convexHull(positions: Position[]): number[][];
export declare const bufferLine: (line: Position[], size: number, steps?: number) => polygonTools.Ring;
export declare const quickHash: (str: string) => string;
export declare const shuffle: (length: number) => number[];
