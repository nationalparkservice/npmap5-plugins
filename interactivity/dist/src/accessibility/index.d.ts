import { Feature, Geometry } from 'geojson';
import { Evented, Map as maplibreMap, Marker, default as MapLibrary, MapGeoJSONFeature } from 'maplibre-gl';
export type GeoJSONMapFeature<G extends Geometry | null = Geometry> = Feature<G> & {
    'layer': MapGeoJSONFeature['layer'];
};
/**
 * AccessibilityOptions interface, offering various settings for feature accessibility.
 */
export interface AccessibilityOptions {
    /**
     * The field to use for the label.
     * It can be a string or a function that receives a GeoJSONMapFeature and returns a string.
     */
    'labelField': string | ((feature: GeoJSONMapFeature) => string);
    /**
     * Determines whether a line is drawn around the feature.
     * If false, a bounding box will be created.
     */
    'drawFeature'?: boolean;
    /**
     * Specifies the size of the line buffer in screen pixels.
     */
    'bufferPixels'?: number;
    /**
     * Determines the number of points in the buffer circle.
     * Defaults to 8 if not specified.
     */
    'bufferSteps'?: number;
    /**
     * Simulates the mouseover event on focus.
     * It can be a boolean or a function that receives a GeoJSONMapFeature.
     */
    'simulateHover'?: boolean | ((feature: GeoJSONMapFeature) => void);
    /**
     * Simulates the mouseclick event on space, enter, or numpad enter.
     * It can be a boolean or a function that receives a GeoJSONMapFeature.
     */
    'simulateClick'?: boolean | ((feature: GeoJSONMapFeature) => void);
}
export default class Accessibility {
    _map?: maplibreMap;
    _events: Evented;
    _waitTimes: {
        [key: string]: number;
    };
    _mapLibrary: typeof MapLibrary;
    _container: HTMLElement;
    _currentFeatureHash: string;
    _svg: SVGSVGElement;
    _overlay: Marker;
    _defaultOptions: AccessibilityOptions;
    layerOptions: {
        [key: string]: Required<AccessibilityOptions>;
    };
    static DefaultOptions: AccessibilityOptions;
    /**
     * Constructs the Accessibility object.
     *
     * @param mapLibrary - The maplibre library used to render the map.
     * @param defaultOptions - Default options for accessibility features.
     */
    constructor(mapLibrary: typeof MapLibrary, defaultOptions: Partial<AccessibilityOptions>);
    addLayer(layerName: string, options: AccessibilityOptions): void;
    removeLayer(layerName: string): void;
    addTo(map: maplibreMap): void;
    remove(): void;
    onAdd(map: maplibreMap): HTMLElement;
    onRemove(): void;
    _clear(): void;
    _addFeatures(): void;
    _featureHash(features: MapGeoJSONFeature | MapGeoJSONFeature[]): string;
    _addMarker(feature: MapGeoJSONFeature, idx: number): SVGPolygonElement | undefined;
    _waitEvent(name: string, waitTime?: number): void;
    _drawOverlay(): Marker | undefined;
    _initMapListeners(enable?: boolean): void;
}
