import { default as MapLibrary, Map as maplibreMap, PopupOptions, GeoJSONFeature, LayerSpecification, Popup, DataDrivenPropertyValueSpecification } from 'maplibre-gl';
import { default as BindPopup } from './bindpopup';
import { AccessibilityOptions } from './accessibility';
export type popupObject = {
    'header'?: string;
    'body': string | HTMLElement;
    'footer'?: string;
};
export type popupTemplate = string | popupObject | HTMLElement | undefined;
export type highlightOptions = {
    highlightColor: string;
    opacity?: number;
    layerName?: string;
    layerConfig?: LayerSpecification;
};
export type popupHelperOptions = PopupOptions & {
    'type'?: 'tooltip' | 'popup';
    'pointer'?: CSSStyleDeclaration['cursor'];
    'groupName'?: string;
    'primaryKeys'?: Array<string>;
    'icon'?: string;
    'tolerance'?: number;
    'context'?: HTMLElement;
    'formatter'?: (feature: QueryFeature, popupTemplate?: popupTemplate, map?: maplibreMap, activePopups?: Map<'tooltip' | 'popup', Map<string, BindPopup>>) => HTMLElement;
    'multiFormatter'?: (features: Array<QueryFeature>, popupTemplate?: popupTemplate, map?: maplibreMap, activePopups?: Map<'tooltip' | 'popup', Map<string, BindPopup>>, parentPopup?: Popup) => HTMLElement;
    'templater'?: (expression: DataDrivenPropertyValueSpecification<string>, feature: QueryFeature, map?: maplibreMap) => HTMLElement;
    'highlightFeature'?: boolean | highlightOptions;
};
export type genericPopupHelperOptions = Omit<popupHelperOptions, 'formatter'> & {};
export type QueryFeature = GeoJSONFeature & {
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
    private _accessibility;
    constructor(mapLibrary: typeof MapLibrary, map: maplibreMap, genericPopupHelperOptions?: genericPopupHelperOptions);
    addTooltip(layerName: string, popup?: popupTemplate, options?: popupHelperOptions): true | undefined;
    removeTooltip(layerName: string): true | undefined;
    addPopup(layerName: string, popup?: popupTemplate, options?: popupHelperOptions): true | undefined;
    removePopup(layerName: string): true | undefined;
    addAccessibility(layerName: string, options: AccessibilityOptions): void;
    removeAccessibility(layerName: string): void;
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
