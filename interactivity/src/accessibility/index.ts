import { Feature, Geometry } from 'geojson';
import {
    Evented,
    Map as maplibreMap,
    Marker,
    default as MapLibrary,
    MapGeoJSONFeature
} from 'maplibre-gl';
import { quickHash } from '../tileMath';
import SvgMarker from './markers';

export type GeoJSONMapFeature<G extends Geometry | null = Geometry> = Feature<G> & { 'layer': MapGeoJSONFeature['layer'] };

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
};


export default class Accessibility {
    _map?: maplibreMap;
    _events: Evented;
    _waitTimes: { [key: string]: number } = {};
    _mapLibrary: typeof MapLibrary;
    _container: HTMLElement = document.createElement('span');
    //_bufferFn?: () => any;
    _currentFeatureHash: string = '';
    _svg: SVGSVGElement;
    _overlay: Marker;
    _defaultOptions: AccessibilityOptions;

    layerOptions: { [key: string]: Required<AccessibilityOptions> } = {};
    static DefaultOptions: AccessibilityOptions = {
        'labelField': 'name',
        'drawFeature': false,
        'bufferPixels': 5,
        'bufferSteps': 8,
        'simulateHover': true,
        'simulateClick': true
    };

    /**
     * Constructs the Accessibility object.
     *
     * @param mapLibrary - The maplibre library used to render the map.
     * @param defaultOptions - Default options for accessibility features.
     */
    constructor(mapLibrary: typeof MapLibrary, defaultOptions: Partial<AccessibilityOptions>) {
        // Reference to the map library
        this._mapLibrary = mapLibrary;

        // Use the maplibre Event emitter to manage events
        this._events = new mapLibrary.Evented();

        // Create an SVG element that will be used to enhance accessibility
        this._svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        // Create a marker for the overlay
        const markerElement = document.createElement('div');
        this._overlay = new this._mapLibrary.Marker(markerElement);

        // Merge the provided default options with the existing default options
        this._defaultOptions = { ...Accessibility.DefaultOptions, ...defaultOptions };
    }


    addLayer(layerName: string, options: AccessibilityOptions) {
        // Set defaults
        if (options.labelField === undefined) {
            throw new Error('A label name is required for the Accessibility Control');
        }
        this.layerOptions[layerName] = { ...this._defaultOptions, ...options } as Required<AccessibilityOptions>;
    }

    removeLayer(layerName: string) {
        delete this.layerOptions[layerName];
    }

    addTo(map: maplibreMap) {
        this.onAdd(map);
    }

    remove() {
        this.onRemove();
    }

    onAdd(map: maplibreMap) {
        this._map = map;
        this._initMapListeners();
        // Since it's a plugin, it needs to return a container, but we don't need one, so it's just a blank container
        return this._container;
    }

    onRemove() {
        this._clear();
        this._initMapListeners(false);
        delete this._map;
    }

    _clear() {
        if (!this._map) return;
        this._waitTimes = {}; // Clear all waits, since we cleared the map
        while (this._svg.firstChild) {
            this._svg.removeChild(this._svg.firstChild);
        }
        this._overlay.remove(); // Remove the marker
    }

    _addFeatures() {
        if (!this._map) return;

        // Query the features out of the map in any of the layers that are specified
        const features = this._map.queryRenderedFeatures(undefined, { 'layers': Object.keys(this.layerOptions) });
        //let features = [];

        // Store a hash about the current features so we know if they've updated
        // We only update the accessibility layer if the features are new (to ignore state and style changes)

        const featureHash = this._featureHash(features);
        //console.log('HASH', featureHash);

        if (this._currentFeatureHash !== featureHash) {
            this._currentFeatureHash = featureHash;
            this._clear(); // Remove the old markers
            this._drawOverlay(); // Draw a new marker

            // TODO dedup?
            // TODO remove offscreen markers?
            const loadingMarkers = features.map(this._addMarker.bind(this));

            // Once all the markers are added, fire an event
            Promise.all(loadingMarkers)
                .then(markers => this._events.fire('markersLoaded', markers));
        }
    }

    _featureHash(features: MapGeoJSONFeature | MapGeoJSONFeature[]) {
        if (!Array.isArray(features)) features = [features];

        // Make this small to prevent memory issues
        return quickHash(features.map(f => quickHash(
            ((f._vectorTileFeature as any)._geometry || 0).toString())).join() + this._map?.getZoom() + this._map?.getCenter()
        );

        /*return quickHash(JSON.stringify(features.map(f => ({
            ...f,
            state: {}, // Ignore State Changes
            layer: {
                ...f.layer,
                'layout': {}, // Ignore Changes to layout
                'paint': {} // Ignore Changes to Paint
            },
            'zoom': this._map?.getZoom(),
            'center': this._map?.getCenter()
        }))));*/
    }

    _addMarker(feature: MapGeoJSONFeature, idx: number) {
        if (!this._map) return;
        const tabIndex = idx + 1;

        const layerOptions = this.layerOptions[feature.layer.id];

        // Create the marker
        const marker = new SvgMarker(this._map, layerOptions);

        // Create the marker
        let polygon = marker.createSvg(feature, tabIndex);

        if (polygon !== undefined) {
            this._svg.appendChild(polygon);
        }

        return polygon;
    }

    _waitEvent(name: string, waitTime: number = 500) {
        // Uses listeners as a debouncer
        this._waitTimes[name] = (this._waitTimes[name] || 0) + waitTime;
        setTimeout(() => {
            if (this._waitTimes[name] !== undefined) {
                this._waitTimes[name] = this._waitTimes[name] - waitTime;
                if (this._waitTimes[name] <= 0) {
                    this._waitTimes[name] = 0; // Reset the time to 0
                    this._events.fire(name);
                }
            }
        }, waitTime);
    }

    _drawOverlay() {
        if (!this._map) return;

        // Create a canvas over the whole map
        const canvas = this._map.getCanvas();

        // Update SVG
        const svg = this._svg;
        svg.setAttribute('width', canvas.style.width);
        svg.setAttribute('height', canvas.style.height);

        // Create rectangle element FOR TESTING
        //////////////////////////////////////////////////////
        // TESTING SECTION
        //let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        //rect.setAttribute('width', canvas.style.width);
        //rect.setAttribute('height', canvas.style.height);
        //rect.style.fill = 'rgba(255,0,0,0.1)';

        // Append rectangle to SVG
        //svg.appendChild(rect);
        // TESTING SECTION
        //////////////////////////////////////////////////////

        // Add the canvas and the imageMap
        // Create the Div element
        const markerElement = document.createElement('div');
        markerElement.style.width = svg.style.width;
        markerElement.style.height = svg.style.height;
        markerElement.style.pointerEvents = 'none';
        this._svg.style.display = 'inline';
        markerElement.appendChild(svg);
        this._overlay = new this._mapLibrary.Marker({ 'element': markerElement });

        // Set initial point
        this._overlay.setLngLat(this._map.getCenter());
        this._overlay.setOffset([0, 3]); //TODO why is this 3?

        this._overlay.addTo(this._map);
        return this._overlay;
    }


    _initMapListeners(enable: boolean = true) {
        if (!this._map) return;
        const enabled = enable ? 'on' : 'off';

        this._map[enabled]('movestart', _ => this._svg.style.display = 'none');

        // Moveend & Render
        // Query all map features and draw the accessibilty items
        const isMoving = () => {
            if ((this._map && !this._map.isMoving())) {
                this._waitEvent('addFeatures');
            }
        };

        this._events[enabled]('addFeatures', () => { this._addFeatures() });

        this._map[enabled]('moveend', _ => isMoving());
        this._map[enabled]('render', _ => isMoving());
    }
};