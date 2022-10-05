import { default as MapLibrary, Map as maplibreMap, PopupOptions, GeoJSONFeature, LayerSpecification, Popup } from 'maplibre-gl';
import { default as BindPopup } from './bindpopup';
declare type popupObject = {
    'header'?: string;
    'body': string | HTMLElement;
    'footer'?: string;
};
export declare type popupTemplate = string | popupObject | HTMLElement | undefined;
export declare type highlightOptions = {
    highlightColor: string;
    opacity?: number;
    layerName?: string;
    layerConfig?: LayerSpecification;
};
export declare type popupHelperOptions = PopupOptions & {
    'type'?: 'tooltip' | 'popup';
    'pointer'?: CSSStyleDeclaration['cursor'];
    'groupName'?: string;
    'primaryKeys'?: Array<string>;
    'icon'?: string;
    'tolerance'?: number;
    'context'?: HTMLElement;
    'formatter'?: (feature: QueryFeature, popupTemplate?: popupTemplate, map?: maplibreMap, activePopups?: Map<'tooltip' | 'popup', Map<string, BindPopup>>) => HTMLElement;
    'multiFormatter'?: (features: Array<QueryFeature>, popupTemplate?: popupTemplate, map?: maplibreMap, activePopups?: Map<'tooltip' | 'popup', Map<string, BindPopup>>, parentPopup?: Popup) => HTMLElement;
    'templater'?: (expression: string | Array<any>, feature: QueryFeature, map?: maplibreMap) => HTMLElement;
    'highlightFeature'?: boolean | highlightOptions;
};
export declare type genericPopupHelperOptions = Omit<popupHelperOptions, 'formatter'> & {};
export declare type QueryFeature = GeoJSONFeature & {
    layer: Omit<LayerSpecification, 'source'> & {
        source: string;
    };
    source: string;
    sourceLayer?: string | undefined;
    state: {
        [key: string]: any;
    };
};
export default class Interactive {
    private _activePopups;
    private _map;
    private _mapLibrary;
    private _activeTooltip?;
    private _activeTooltipPopup?;
    private _iconMasks;
    private _clicks;
    private _touch;
    private _genericPopup;
    constructor(mapLibrary: typeof MapLibrary, map: maplibreMap, genericPopupHelperOptions?: genericPopupHelperOptions);
    addTooltip(layerName: string, popup?: popupTemplate, options?: popupHelperOptions): true | undefined;
    removeTooltip(layerName: string): true | undefined;
    addPopup(layerName: string, popup?: popupTemplate, options?: popupHelperOptions): true | undefined;
    removePopup(layerName: string): true | undefined;
    private _add;
    private _remove;
    private _initMapListeners;
    private _click;
    private _quickHash;
    private _mousemove;
    private _getActiveFeatures;
    private _wrapCoords;
    private _getAllFeatures;
    private _dedupeFeatures;
}
export {};
