import { Map } from "maplibre-gl";
import { GeoJSONMapFeature } from ".";
import { LineString, MultiLineString, MultiPolygon, Point, Polygon, Position } from 'geojson';
export declare function toPointCloud(coordinateList: Position | Position[] | Position[][] | Position[][][]): Position[];
export declare function projectCoords(coordinates: Position[], projectTo: '3857' | '4326'): Position[];
export declare function getPointInLayer(map: Map, feature: GeoJSONMapFeature): Position;
export declare function drawOutline(feature: GeoJSONMapFeature<Point | LineString | MultiLineString | Polygon | MultiPolygon>, zoom: number, bufferPixels: number, bufferSteps: number): GeoJSONMapFeature<Polygon>;
export declare function getBbox(coordinateList: Position | Position[] | Position[][] | Position[][][]): {
    l: number;
    r: number;
    t: number;
    b: number;
};
