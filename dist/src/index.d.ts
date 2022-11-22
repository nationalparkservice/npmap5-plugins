import { Map as MapLibraryMap, default as MapLibrary, StyleSpecification, MapEventType, ControlPosition, FillLayerSpecification } from 'maplibre-gl';
import { FeatureCollection } from 'geojson';
export type overviewMapOptions = {
    zoomLevelOffset?: number;
    watchEvents?: Array<keyof MapEventType>;
    overlayPaint?: FillLayerSpecification['paint'];
    selectionPaint?: FillLayerSpecification['paint'];
    width?: number;
    height?: number;
    position?: ControlPosition;
    style?: string | StyleSpecification;
    scrollZoom?: boolean;
    /** Amount of pixel to pan map on keypress, defaults to 10 */
    _keyboardPanStep?: number;
};
export default function OverviewMap(mapLibrary: typeof MapLibrary): {
    new (options: overviewMapOptions): {
        _overviewMap: MapLibraryMap;
        _mainMap: MapLibraryMap | undefined;
        _container: HTMLElement;
        _extent: FeatureCollection;
        _moving: boolean;
        _easingMain: boolean;
        _mapLibrary: typeof MapLibrary;
        options: Required<overviewMapOptions>;
        onAdd(map: MapLibraryMap): HTMLElement;
        onRemove(): void;
        _updateOverview(map: MapLibraryMap): void;
        _updateMain(map: MapLibraryMap): void;
        _getCenterAtPitch(map: MapLibraryMap, pitch: number, rotation: number): import("maplibre-gl").LngLat;
        _keyboardEvents: (e: KeyboardEvent) => void;
    };
};
