
import {
    Popup,
    default as MapLibrary,
    Map as MaplibreMap,
    LngLatLike,
    CircleLayerSpecification,
    FillLayerSpecification,
    SymbolLayerSpecification,
    LineLayerSpecification,
    LayerSpecification
} from 'maplibre-gl';
import {
    popupTemplate,
    popupHelperOptions,
    highlightOptions,
    QueryFeature
} from '.';
import {
    default as maplibreTextTemplate
} from './maplibreTextTemplate';
import { colorTools } from './icons';

export default class BindPopup {
    options: popupHelperOptions;
    popup: Popup;
    popupTemplate?: popupTemplate;
    private _expressionTemplate?: maplibreTextTemplate;

    constructor(popupTemplate: popupTemplate, options: popupHelperOptions, mapLibrary: typeof MapLibrary) {
        const defaultOptions: popupHelperOptions = {
            closeButton: true,
            closeOnClick: true,
            closeOnMove: false,
            focusAfterOpen: true,
            pointer: 'pointer',
            tolerance: 3,
            formatter: this._formatter.bind(this),
            templater: this._templater.bind(this),
            highlightFeature: false
        };

        if (options.highlightFeature) {
            const highlightObj = typeof options.highlightFeature === 'object' ?
                options.highlightFeature :
                {};
            options.highlightFeature = {
                ...{
                    highlightColor: '#00ffff',
                    opacity: undefined,
                    layerName: Math.random().toString(36).substring(2),
                    layerConfig: undefined
                } as Omit<highlightOptions, 'layerName'> & { 'layerName': string },
                ...highlightObj
            };
        }

        // Set some defaults for a tooltip
        if (options.type === 'tooltip') {
            defaultOptions.anchor = 'top-left';
            defaultOptions.focusAfterOpen = false;
        }

        // If we're using the default, load the map expession template
        if (!options.formatter && !options.templater) {
            this._expressionTemplate = new maplibreTextTemplate(mapLibrary);
        }

        this.options = { ...defaultOptions, ...options };
        this.popupTemplate = popupTemplate;

        this.popup = new mapLibrary.Popup(this.options);
    }

    showing() {
        return this.popup.isOpen;
    }

    showMulti(lngLat: LngLatLike, features: Array<QueryFeature>, context: MaplibreMap | HTMLElement, map?: MaplibreMap, activePopups?: Map<'tooltip' | 'popup', Map<string, BindPopup>>) {
        if (!this.options.multiFormatter) {
            throw new Error('No multiFormatter found');
        }
        this._show(lngLat, this.options.multiFormatter(features, this.popupTemplate, map, activePopups, this.popup), context);
    }

    show(
        lngLat: LngLatLike,
        feature: QueryFeature,
        context: MaplibreMap | HTMLElement,
        map?: MaplibreMap,
        activePopups?: Map<'tooltip' | 'popup', Map<string, BindPopup>>,
        highlight = this.options.highlightFeature !== false) {
        this._show(lngLat, (this.options.formatter || this._formatter)(feature, this.popupTemplate, map, activePopups), context);
        if (map && highlight) {
            this.highlightFeature(feature, map);
        }
    }

    highlightFeature(feature: QueryFeature, map: MaplibreMap) {
        feature.id = feature.id || Math.floor(Math.random() * 100);
        (feature.state as any)['hover'] = true;
        //console.log('highlighting feature', feature);
        if (typeof this.options.highlightFeature !== 'object') {
            throw new Error('Invalid type of highlight layer:' + typeof this.options.highlightFeature)
        }

        const options = this.options.highlightFeature;

        const highLightColor = new colorTools(options.highlightColor);
        highLightColor.alpha = options.opacity ? options.opacity : highLightColor.alpha;

        const featureType = feature.layer.type;

        (window as any).feature = feature;
        let layerIcon, layerCircleSize, layerLineWidth;
        if (featureType === 'symbol') {
            layerIcon = (feature.layer.layout as any)['icon-image']?.name; // TODO if this doesn't exist, just make it a circle
        } else if (featureType === 'circle') {
            layerCircleSize = (feature.layer.paint as any)['circle-radius'];
        } else if (featureType === 'line') {
            layerLineWidth = (feature.layer.paint as any)['line-width'];
        }

        const removeUndefined = (obj: { [key: string]: string | number | undefined }) =>
            Object.keys(obj)
                .map(key => [key, obj[key]])
                .filter(v => v[1] !== undefined && v[1] !== null)
                .reduce((previous, current) =>
                    ({ ...previous, ...{ [current[0] as string]: current[1] } }),
                    {})


        const featureTypeMap: { [key: string]: FillLayerSpecification | LineLayerSpecification | SymbolLayerSpecification | CircleLayerSpecification } = {
            'circle': {
                'type': 'circle',
                'paint': removeUndefined({
                    "circle-color": highLightColor.hex,
                    "circle-radius": layerCircleSize,
                    "circle-opacity": highLightColor.alpha
                })
            } as CircleLayerSpecification,
            'fill': {
                'type': 'fill',
                'paint': removeUndefined({
                    "fill-color": highLightColor.hex,
                    "fill-opacity": highLightColor.alpha
                })
            } as FillLayerSpecification,
            'line': {
                'type': 'line',
                'paint': removeUndefined({
                    "line-color": highLightColor.hex,
                    "line-width": layerLineWidth,
                    "line-opacity": highLightColor.alpha
                })
            } as LineLayerSpecification,
            'symbol': {
                'type': 'symbol',
                'layout': {
                    "icon-image": layerIcon
                },
                'paint': removeUndefined({
                    'icon-color': options.highlightColor,
                    'icon-opacity': highLightColor.alpha
                })
            } as SymbolLayerSpecification,
        }
        // Get the feature type
        const data = feature.toJSON();
        // Layer Name is important
        if (!options.layerName) {
            options.layerName = Math.random().toString(36).substring(2);
        }
        // Add a new layer to the map for this feature
        map.addSource(options.layerName, {
            'type': 'geojson',
            'data': data
        });
        map.addLayer({
            ...(featureTypeMap[featureType] || featureTypeMap['circle']),
            'minzoom': 0,
            'maxzoom': 20,
            ...(options.layerConfig || {}),
            ...{
                'id': options.layerName,
                'source': options.layerName
            }
        } as LayerSpecification);
        this.popup.once('close', () => {
            if (options.layerName) {
                if (map.getLayer(options.layerName)) map.removeLayer(options.layerName);
                if (map.getSource(options.layerName)) map.removeSource(options.layerName);
            }
        })

        return options.layerName;
    }

    private _show(lngLat: LngLatLike, content: HTMLElement, context: MaplibreMap | HTMLElement) {

        if (context instanceof HTMLElement) {
            // Add the popup to a DOM Object
            context.appendChild(content);
        } else {
            this.popup.setDOMContent(content);
            this.popup.setLngLat(lngLat);
            this.popup.addTo(context);
        }
    }

    private _templater(exp: string | Array<any>, feature: QueryFeature, map?: MaplibreMap): HTMLSpanElement {
        if (typeof exp === 'string') {
            return this._simpleTemplater(exp, feature.properties);
        } else if (this._expressionTemplate) {
            return this._expressionTemplate.evaluateHtml(exp, feature.properties, feature.state, map);
        } else {
            throw new Error('Cannot load expression template');
        }
    };

    private _simpleTemplater(exp: string, obj: { [key: string]: string }): HTMLSpanElement {
        const span = document.createElement('span');
        Object.keys(obj).forEach(key => {
            const re = new RegExp('{' + key + '}', 'g');
            exp = exp.replace(re, obj[key])
        });
        span.textContent = exp;

        return span;
    };

    private _formatter(feature: QueryFeature, popupTemplate: popupTemplate, map?: MaplibreMap): HTMLElement {
        const templater = this.options.templater || this._templater;

        const templateToElement = (elementType: string, exp: string | Array<any>) => {
            const el = document.createElement(elementType);
            let content = templater(exp, feature, map);
            if (typeof content === 'string') {
                el.textContent = content;
            } else {
                el.appendChild(content);
            }
            return el;
        };

        const div = document.createElement('div');
        if (popupTemplate === undefined) {
            throw new Error('The default Popup Formatter requires a template');
        } else if (typeof popupTemplate === 'string') {
            div.appendChild(templateToElement('p', popupTemplate));
        } else if (popupTemplate instanceof HTMLElement) {
            div.appendChild(popupTemplate);
        } else {
            // Header
            if (popupTemplate.header) {
                const header = div.appendChild(templateToElement('strong', popupTemplate.header));
                div.appendChild(header);
            }
            // Body
            if (popupTemplate.body) {
                if (popupTemplate.body instanceof HTMLElement) {
                    div.appendChild(popupTemplate.body);
                } else {
                    const body = div.appendChild(templateToElement('div', popupTemplate.body));
                    div.appendChild(body);
                }
            }
            // Footer
            if (popupTemplate.footer) {
                const footer = div.appendChild(templateToElement('div', popupTemplate.footer));
                div.appendChild(footer);
            }
        }

        return div;
    }
};