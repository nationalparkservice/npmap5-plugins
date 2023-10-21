import { Map, MapGeoJSONFeature } from "maplibre-gl";
import { AccessibilityOptions, GeoJSONMapFeature } from ".";
import { LineString, MultiLineString, MultiPolygon, Point, Polygon } from 'geojson';
export default class SvgMarker {
    _map: Map;
    _options: Required<AccessibilityOptions>;
    constructor(map: Map, options: Required<AccessibilityOptions>);
    createSvg(feature: MapGeoJSONFeature, tabIndex: number): SVGPolygonElement | undefined;
    pointMarker(feature: GeoJSONMapFeature<Point>, tabIndex: number): SVGPolygonElement;
    lineMarker(feature: GeoJSONMapFeature<LineString | MultiLineString>, tabIndex: number): SVGPolygonElement | undefined;
    polygonMarker(feature: GeoJSONMapFeature<Polygon | MultiPolygon>, tabIndex: number, originalFeature?: GeoJSONMapFeature<Polygon | MultiPolygon | Point | MultiLineString | LineString>, options?: Partial<AccessibilityOptions>): SVGPolygonElement;
    simulateMouseEffects(element: SVGPolygonElement, feature: GeoJSONMapFeature<Polygon | MultiPolygon | Point | MultiLineString | LineString>): void;
    simulateHover(element: SVGPolygonElement, layerId: string, interactivePoint: [number, number]): void;
    simulateClick(element: SVGPolygonElement, layerId: string, interactivePoint: [number, number]): void;
}
