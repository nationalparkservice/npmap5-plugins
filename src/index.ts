import {
    default as MapLibrary,
    Map as maplibreMap,
    PopupOptions,
    GeoJSONFeature,
    LayerSpecification,
    MapMouseEvent,
    LngLatLike,
    Popup,
    PointLike
} from 'maplibre-gl';

import { default as IconMask } from './iconMask'
import { default as BindPopup } from './bindpopup';
import { default as multiFormatter } from './defaultMultiPopup';
import { Position } from 'geojson';

type popupObject = {
    'header'?: string,
    'body': string | HTMLElement,
    'footer'?: string
};

export type popupTemplate = string | popupObject | HTMLElement | undefined;

export type highlightOptions = {
    highlightColor: string,
    opacity?: number,
    layerName?: string,
    layerConfig?: LayerSpecification
}

export type popupHelperOptions = PopupOptions & {
    'type'?: 'tooltip' | 'popup';
    'pointer'?: CSSStyleDeclaration['cursor'],
    'groupName'?: string,
    'primaryKeys'?: Array<string>, // Merge all features with these matching keys, none requires all keys to be unique
    'icon'?: string, //map icon
    'tolerance'?: number, //TODO this doesn't work yet
    'context'?: HTMLElement,
    // Takes the information from the query feature and converts it into an element for the popup
    'formatter'?: (feature: QueryFeature, popupTemplate?: popupTemplate, map?: maplibreMap, activePopups?: Map<'tooltip' | 'popup', Map<string, BindPopup>>) => HTMLElement,
    'multiFormatter'?: (features: Array<QueryFeature>, popupTemplate?: popupTemplate, map?: maplibreMap, activePopups?: Map<'tooltip' | 'popup', Map<string, BindPopup>>, parentPopup?: Popup) => HTMLElement,
    // If the default formatter is being used, you can switch out the templater
    // The default templater uses either the bracket formulas '{name}' or the expression features used for text-field in maplibre
    'templater'?: (expression: string | Array<any>, feature: QueryFeature, map?: maplibreMap) => HTMLElement,
    'highlightFeature'?: boolean | highlightOptions //Adds a highlight on the map, todo, add more options
};

export type genericPopupHelperOptions = Omit<popupHelperOptions, 'formatter'> & {
};

// This comes from maplibre-gl/src/util/vectortile_to_geojson, but we define it ourselves for better compatibility
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
    private _activePopups: Map<'tooltip' | 'popup', Map<string, BindPopup>>;
    private _map: maplibreMap;
    private _mapLibrary: typeof MapLibrary;
    private _activeTooltip?: string;
    private _activeTooltipPopup?: BindPopup;
    private _iconMasks: Map<string, IconMask>;
    private _clicks: number; // Used to fix issues with double click
    private _touch: Array<[number, number]>; // Used to prevent a mouseover on touchscreens
    private _genericPopup: BindPopup;

    constructor(mapLibrary: typeof MapLibrary, map: maplibreMap, genericPopupHelperOptions: genericPopupHelperOptions = {}) {
        this._activePopups = new Map();
        this._map = map;
        this._mapLibrary = mapLibrary;
        this._activeTooltip = undefined;
        this._iconMasks = new Map();
        this._clicks = 0;
        this._touch = [];

        // Add the generic popup
        const defaultPopupHelperOptions: genericPopupHelperOptions = {
            type: 'popup',
            multiFormatter: multiFormatter
        };

        this._genericPopup = new BindPopup(undefined, { ...defaultPopupHelperOptions, ...genericPopupHelperOptions }, mapLibrary);

        this._initMapListeners();
        (window as any).MMAAPP = map;
    }

    // Helpers for tooltip
    addTooltip(layerName: string, popup?: popupTemplate, options?: popupHelperOptions) {
        const tooltipDefaultOptions: popupHelperOptions = {
            focusAfterOpen: false,
            closeButton: false,
            type: 'tooltip'
        };
        options = { ...tooltipDefaultOptions, ...options };
        return this._add(layerName, popup, options);
    }
    removeTooltip(layerName: string) {
        return this._remove(layerName, 'tooltip');
    }

    // Helpers for Popups
    addPopup(layerName: string, popup?: popupTemplate, options?: popupHelperOptions) {
        return this._add(layerName, popup, { ...{ 'type': 'popup' }, ...options });
    }
    removePopup(layerName: string) {
        return this._remove(layerName, 'popup');
    }

    // The add / remove functions for popup and tooltips

    private _add(layerName: string, popup: popupTemplate | undefined, options: popupHelperOptions) {
        if (options.type === undefined) {
            throw new Error(`The _add function requires a type (popup or tooltup)`);
        }
        if (!this._activePopups.get(options.type)) this._activePopups.set(options.type, new Map());
        const interactiveMap = this._activePopups.get(options.type);
        if (interactiveMap) {
            let interactiveFeature = interactiveMap.get(layerName);
            if (interactiveFeature) {
                throw new Error(`Layer ${layerName} already has a ${options.type}, remove the other ${options.type} first`);
            } else {
                interactiveFeature = new BindPopup(popup, options, this._mapLibrary);
                interactiveMap.set(layerName, interactiveFeature);
            }
            return true;
        }
    }

    private _remove(layerName: string, type: 'tooltip' | 'popup') {
        if (!this._activePopups.get(type)) this._activePopups.set(type, new Map());
        const interactiveMap = this._activePopups.get(type);
        if (interactiveMap) {
            const layerPopup = interactiveMap.get(layerName);
            if (layerPopup) {
                interactiveMap.delete(layerName);
            } else {
                throw new Error(`Layer ${layerName} does not have a ${type}.`);
            }
            return true;
        }
    }

    private _initMapListeners() {
        // CLICK
        this._map.on('click', e => {
            this._clicks += 1;
            // Wait to make sure it wasn't a double click
            setTimeout(() => {
                if (this._clicks === 1) {
                    this._click(e);
                }
                this._clicks = 0;
            }, 200);
        });

        // Mouseover
        this._map.on('mousemove', e => {
            // The touchstart event happens before the mousemove, this avoids those events from causing a mouseover
            // This will only disable mousemove in the exact area of the touch event (+-3pixel)
            // and only for 800ms, so that devices with both touch and mouse still work properly
            const touchDistance = 3;
            if (e.originalEvent.button !== 2) { // Ignore mouseover while rotating
                let match = this._touch.filter(p => {
                    const a = e.point.x - p[0];
                    const b = e.point.y - p[1];
                    const c = Math.sqrt(a * a + b * b);
                    return c < touchDistance;
                }).length > 0;
                if (!match) {
                    this._mousemove(e);
                }
            }
        });

        // Prevent mouseover on touchstart
        this._map.on('touchstart', e => {
            // Block mousemoves at this point for 800ms
            this._touch.push([e.point.x, e.point.y])
            setTimeout(() => {
                // Reset it back after 800ms
                this._touch = this._touch.filter(p => e.point.x !== p[0] && e.point.x !== p[1]);
            }, 800);
        });

        // Close tooltip on right click
        this._map.on('mousedown', e => {
            // Remove tooltips on right click
            if (e.originalEvent.button === 2) {
                if (this._activeTooltip) {
                    const tooltip = this._activePopups.get('tooltip')?.get(this._activeTooltip)?.popup;
                    if (tooltip) {
                        tooltip.remove();
                    }
                }
            }
        });
    }

    private _click(e: MapMouseEvent & Object) {
        // Get the features
        const { featuresUnderMouse, popupLayers } = this._getActiveFeatures(e.point);

        const popupFeatures = this._dedupeFeatures(featuresUnderMouse
            .filter(feature => popupLayers.indexOf(feature.layer.id) > -1), 'popup');

        // Show the popup(s)
        if (popupFeatures.length > 1) {
            const context = this._map; //TODO
            this._genericPopup.showMulti(e.lngLat, popupFeatures, context, this._map, this._activePopups);
            // Clear tooltips when mousing over the popup
            this._genericPopup.popup._container.addEventListener('mouseenter', () => this._mousemove());

        } else if (popupFeatures.length === 1) {
            // Only one matching popup, show it!
            const popupFeature = popupFeatures[0];
            const coordinates = this._wrapCoords(e,
                (popupFeature.geometry.type === 'Point') ?
                    popupFeature.geometry.coordinates.slice() as [number, number] :
                    [e.lngLat.lng, e.lngLat.lat]
            );

            const popup = this._activePopups.get('popup')?.get(popupFeature.layer.id);
            // Populate the popup and set its coordinates
            // based on the feature found.
            if (popup) {
                const context = popup.options.context || this._map; //TODO
                popup.show(coordinates, popupFeature, context, this._map);
                // Clear tooltips when mousing over the popup
                popup.popup._container.addEventListener('mouseenter', () => this._mousemove());
            }
        }
    }

    private _quickHash(str: string) {
        // https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
        let hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(32);
    }

    private _mousemove(e?: MapMouseEvent & Object) {

        // Send in a undefined event to clear the tooltips
        if (!e) {
            if (this._activeTooltipPopup) {
                this._activeTooltipPopup.popup.remove();
            }
            return;
        }

        // Get the features
        const { featuresUnderMouse, popupLayers, tooltipLayers } = this._getActiveFeatures(e.point);
        let defaultPointer = 'pointer';

        // The pointer changes for popups only
        const pointer = featuresUnderMouse
            .filter(feature => popupLayers.indexOf(feature.layer.id) > -1)
            .map(feature => this._activePopups.get('popup')?.get(feature.layer.id)?.options.pointer || defaultPointer)[0] || '';
        this._map.getCanvas().style.cursor = pointer;

        // Show the tooltip
        const tooltipFeature = this._dedupeFeatures(featuresUnderMouse
            .filter(feature => tooltipLayers.indexOf(feature.layer.id) > -1), 'tooltip')[0];

        const tooltipFeatureHash = tooltipFeature && this._quickHash(JSON.stringify(tooltipFeature.toJSON()));

        // Remove any existing tooltips that aren't this one
        if (this._activeTooltip && this._activeTooltip !== tooltipFeatureHash) {
            if (this._activeTooltipPopup) {
                this._activeTooltipPopup.popup.remove();
            }
        }

        // Show the tooltip
        if (tooltipFeature && this._activeTooltip !== tooltipFeatureHash) {
            // Copy coordinates array.
            const coordinates = this._wrapCoords(e,
                (tooltipFeature.geometry.type === 'Point') ?
                    tooltipFeature.geometry.coordinates.slice() as [number, number] :
                    [e.lngLat.lng, e.lngLat.lat]
            );

            const tooltip = this._activePopups.get('tooltip')?.get(tooltipFeature.layer.id);
            if (tooltip) {
                this._activeTooltip = tooltipFeatureHash;
                this._activeTooltipPopup = tooltip;
                const context = tooltip.options.context || this._map;
                tooltip.show(coordinates, tooltipFeature, context, this._map);
                if (tooltipFeature.geometry.type !== 'Point' && e.originalEvent.type === 'mousemove') { // TODO options?
                    tooltip.popup.trackPointer();
                }
                // Remove the tooltip from the active variable when it gets removed
                tooltip.popup.once('close', () => {
                    this._activeTooltip = undefined;
                    this._activeTooltipPopup = undefined
                });
            }
        }
    }

    private _getActiveFeatures(pixelPoint: { 'x': number, 'y': number }) {
        e
        const popupLayers = [...(this._activePopups.get('popup')?.keys() || [])];
        const tooltipLayers = [...(this._activePopups.get('tooltip')?.keys() || [])];
        const activeLayers = [
            ...popupLayers,
            ...tooltipLayers
        ].filter((layerName, idx, a) => {
            return a.indexOf(layerName) === idx;
        });

        const featuresUnderMouse = this._getAllFeatures(pixelPoint, 3 /*TODO options*/, activeLayers);
        return {
            'featuresUnderMouse': featuresUnderMouse,
            'popupLayers': popupLayers,
            'tooltipLayers': tooltipLayers,
            'activeLayers': activeLayers
        };

    };

    private _wrapCoords(e: MapMouseEvent & Object, coordinates: [number, number]): LngLatLike {
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        return { 'lng': coordinates[0], 'lat': coordinates[1] };
    }

    private _getAllFeatures(pixelPoint: { 'x': number, 'y': number }, tolerance: number, clickableLayerNames: Array<string>) {

        // Get the  clicked point and make a bbox with it +/- a tolerance
        const bbox = [
            [pixelPoint.x - tolerance, pixelPoint.y - tolerance],
            [pixelPoint.x + tolerance, pixelPoint.y + tolerance]
        ] as [PointLike, PointLike];

        // Find all features in that bbox
        const features = this._map.queryRenderedFeatures(bbox, {
            layers: clickableLayerNames.map(layer => layer).filter(id => Object.keys(this._map.style._layers).indexOf(id) > -1)
        }).filter((feature: QueryFeature) => {
            if (feature.layer.type === 'symbol') {
                // Don't return a mouse over in a transparent area
                // TODO option?
                const layer = this._map.getLayer(feature.layer.id);
                const iconName = (layer.layout as any)._values['icon-image'].evaluate(feature, feature.state, null, this._map.style._availableImages).name;
                const icon = this._map.style.getImage(iconName);
                let mask = this._iconMasks.get(iconName);
                if (!mask) {
                    mask = new IconMask(iconName, this._map, {});
                    this._iconMasks.set(iconName, mask);
                }
                if (icon && mask) {
                    var pixelRatio = icon.pixelRatio || 1;
                    var featureCenter;
                    if (Array.isArray((feature.geometry as any).coordinates[0])) {
                        // Deal with lines and polygons being displayed as symbols
                        featureCenter = this._map.project((feature.geometry as any).coordinates[0]);
                    } else {
                        featureCenter = this._map.project((feature.geometry as any).coordinates);
                    }
                    var iconTopLeft = [featureCenter.x - icon.data.width / 2 / pixelRatio, featureCenter.y - icon.data.height / 2 / pixelRatio];
                    var clickInIcon = [
                        Math.floor((pixelPoint.x - iconTopLeft[0]) * pixelRatio),
                        Math.floor((pixelPoint.y - iconTopLeft[1]) * pixelRatio)
                    ];
                    var codeAtCoord = mask.readCoord(clickInIcon[0], clickInIcon[1], 3);
                    return codeAtCoord;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }).filter((feature: QueryFeature) => {
            // TODO filter out features with different tolerances
            return true;
        });


        return features as Array<QueryFeature>;
    }

    private _dedupeFeatures(features: QueryFeature[], type: ('popup' | 'tooltip') = 'popup') {
        const uniqueFeatures: { [key: string]: QueryFeature } = {};

        // Add this somewhere else, map?
        const generateKey = (str: string) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                let chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return new Uint32Array([hash])[0].toString(36);
        };

        features.forEach(feature => {
            const primaryKeys = this._activePopups.get(type)?.get(feature.layer.id)?.options.primaryKeys || [];
            let compareString = feature.layer.id;
            if (primaryKeys.length) {
                compareString += JSON.stringify(Object.keys(feature.properties)
                    .filter(key => primaryKeys.indexOf(key) > -1)
                    .map(key => [key, (feature.properties as { [key: string]: string | number })[key]])
                    .reduce((a, c) => ({ ...a, ...{ [c[0]]: c[1] } }), {})
                );
            } else {
                compareString += JSON.stringify(feature.properties);
            }
            const featureKey = generateKey(compareString);
            if (uniqueFeatures[featureKey]) {
                // Merge Geometries?

                const baseGeometry = uniqueFeatures[featureKey].geometry;

                if (baseGeometry.type === 'Point' || baseGeometry.type === 'LineString' || baseGeometry.type === 'Polygon') {
                    // Make into a multi!
                    baseGeometry.type = 'Multi' + baseGeometry.type as any;
                    baseGeometry.coordinates = [baseGeometry.coordinates as (Position | Position[])] as (Position[] | Position[][]);
                }
                if (baseGeometry.type === 'MultiPoint' || baseGeometry.type === 'MultiLineString' || baseGeometry.type === 'MultiPolygon') {
                    if (feature.geometry.type === baseGeometry.type.replace(/^Multi/g, '')) {
                        // TODO clean this up
                        baseGeometry.coordinates.push((feature.geometry as any).coordinates as any);
                        uniqueFeatures[featureKey].geometry = baseGeometry;
                    }
                }
            } else {
                uniqueFeatures[featureKey] = feature;
            }
        });

        return Object.keys(uniqueFeatures)
            .map(key => uniqueFeatures[key])
    };
};