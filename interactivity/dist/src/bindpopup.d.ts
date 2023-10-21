import { Popup, default as MapLibrary, Map as MaplibreMap, LngLatLike } from 'maplibre-gl';
import { popupTemplate, popupHelperOptions, QueryFeature } from '.';
export default class BindPopup {
    options: popupHelperOptions;
    popup: Popup;
    popupTemplate?: popupTemplate;
    private _expressionTemplate?;
    constructor(popupTemplate: popupTemplate, options: popupHelperOptions, mapLibrary: typeof MapLibrary);
    showing(): () => boolean;
    showMulti(lngLat: LngLatLike, features: Array<QueryFeature>, context: MaplibreMap | HTMLElement, map?: MaplibreMap, activePopups?: Map<'tooltip' | 'popup', Map<string, BindPopup>>): void;
    show(lngLat: LngLatLike, feature: QueryFeature, context: MaplibreMap | HTMLElement, map?: MaplibreMap, activePopups?: Map<'tooltip' | 'popup', Map<string, BindPopup>>, highlight?: boolean): void;
    highlightFeature(feature: QueryFeature, map: MaplibreMap): string;
    private _show;
    private _templater;
    private _simpleTemplater;
    private _formatter;
}
