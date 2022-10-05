import { Feature, LineString, MultiLineString, MultiPolygon, Point, Polygon, Position, Geometry } from 'geojson';
import {
    Evented,
    Map as maplibreMap,
    Marker,
    default as MapLibrary,
    MapGeoJSONFeature
} from 'maplibre-gl';
import { projections, bufferPoint, pixelsToMeters, convexHull, quickHash, shuffle } from './tileMath';

export type GeoJSONMapFeature<G extends Geometry | null = Geometry> = Feature<G> & { 'layer': MapGeoJSONFeature['layer'] };

export interface AccessibilityOptions {
    'labelField': string | ((feature: GeoJSONMapFeature) => string), // The field to use for the label
    'drawFeature'?: boolean, // Will Draw a line around the feature, otherwise will make a bbox
    'bufferPixels'?: number, // The size of the line buffer in screen pixels
    'bufferSteps'?: number, // The amount of points in the buffer circle (defaults to 8),
    'simulateHover'?: boolean | ((feature: GeoJSONMapFeature) => void), // Simulates the mouseover event on focus
    'simulateClick'?: boolean | ((feature: GeoJSONMapFeature) => void), // Simulates the mouseclick event on space, enter, or numpad enter
};



export default class Accessibility {

    _map?: maplibreMap;
    _events: Evented;
    _waitTimes: { [key: string]: number } = {};
    _mapLibrary: typeof MapLibrary;
    _container: HTMLElement = document.createElement('span');
    _bufferFn?: () => any;
    _currentFeatureHash: string = '';
    _imageMap: HTMLMapElement;
    _overlay: Marker;

    layerOptions: { [key: string]: AccessibilityOptions } = {};

    constructor(mapLibrary: typeof MapLibrary, options: AccessibilityOptions) {
        this._mapLibrary = mapLibrary;
        this._events = new mapLibrary.Evented();
        this._imageMap = document.createElement('map');

        const markerElement = document.createElement('div');
        this._overlay = new this._mapLibrary.Marker(markerElement);
    }

    addLayer(layerName: string, options: AccessibilityOptions) {
        // Set defaults
        const defaultOptions = {
            'drawFeature': false,
            'bufferPixels': 5,
            'bufferSteps': 8,
            'simulateHover': true,
            'simulateClick': true
        };

        if (options.labelField === undefined) {
            throw new Error('A label name is required for the Accessibility Control');
        }

        this.layerOptions[layerName] = { ...defaultOptions, ...options };
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
        this._imageMap.childNodes.forEach(item => item.remove()); // Remove all the old image maps
        this._overlay.remove(); // Remove the marker
        this._drawOverlay(); // Draw a new marker
    }

    _addFeatures() {
        if (!this._map) return;

        // Query all the features
        const features = this._map.queryRenderedFeatures(undefined, { 'layers': Object.keys(this.layerOptions) });

        // Store a hash about the current features so we know if they've updated
        // We only update the accessibility layer if the features are new (we ignore state and style changes)
        const currentHash = this._featureHash(features);

        if (this._currentFeatureHash !== currentHash) {
            this._currentFeatureHash = currentHash;
            this._clear(); // Remove the old markers

            // TODO dedup?
            const loadingMarkers = features.map(this._addMarker.bind(this));


            Promise.all(loadingMarkers)
                .then(markers => this._events.fire('markersLoaded', markers));
        }

    }

    _featureHash(features: MapGeoJSONFeature | MapGeoJSONFeature[]) {
        if (!Array.isArray(features)) features = [features];

        return quickHash(JSON.stringify(features.map(f => ({
            ...f,
            state: {}, // Ignore State Changes
            layer: {
                ...f.layer,
                'layout': {}, // Ignore Changes to layout
                'paint': {} // Ignore Changes to Paint
            },
            'zoom': this._map?.getZoom(),
            'center': this._map?.getCenter()
        }))));
    }

    _addMarker(feature: MapGeoJSONFeature, idx: number) {
        if (!this._map) return;
        const tabIndex = idx + 1;

        // Create the marker
        let area: (HTMLAreaElement | undefined) = undefined;

        // Create different markers for different types of shapes
        if (feature.geometry.type === 'Point') {
            area = this._pointMarker(feature as any, tabIndex);
        } else if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
            area = this._lineMarker(feature as any, tabIndex);
        } else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
            area = this._polygonMarker(feature as any, tabIndex);
        }

        if (area !== undefined) {
            this._imageMap.appendChild(area);
        }

        return area;
    }

    _toPointCloud(coordinateList: Position | Position[] | Position[][] | Position[][][]): Position[] {
        // Normalize all positions to Position[][][]
        if (typeof coordinateList[0] === 'number') {
            coordinateList = [[[coordinateList as Position]]];
        }
        if (typeof (coordinateList as Position[])[0][0] === 'number') {
            coordinateList = [coordinateList as Position];
        }
        if (typeof (coordinateList as Position[][])[0][0][0] === 'number') {
            coordinateList = [coordinateList as Position];
        }

        // Now that everything is normalized, put it into a big list
        const coordCloud = (coordinateList as Position[][][])
            .reduce((a, c) => [...a, ...c], [])
            .reduce((a, c) => [...a, ...c], []);

        return coordCloud;
    }

    /*_getPointInLayer(coordinates: Position[], feature: GeoJSONMapFeature) { // screen coordinates
        if (!this._map) return;
        const canvas = this._map.getCanvas();
        const max = { x: canvas.width, y: canvas.height };
        const itemHash = (item: MapGeoJSONFeature | GeoJSONMapFeature) => quickHash(JSON.stringify({
            'properties': item.properties,
            'layer': item.layer,
            'geometry': item.geometry || (item as any)._geometry
        }));
        const currentFeatureHash = itemHash(feature as GeoJSONMapFeature);

        // Start with the first point
        let pointInLayer = undefined;

        // Check if the point is on the screen
        // Shuffle the points to increase chances that we'll find a match
        const shuffledIndexes = shuffle(coordinates.length);
        for (let i = 0; i < coordinates.length; i++) {
            //Project the point to screen coords
            // This 
            const testPosition = shuffledIndexes[i];
            const pt = this._map.project(coordinates[testPosition] as [number, number]);
            if (pt.x >= 0 && pt.x <= max.x && pt.y >= 0 && pt.y <= max.y) {
                const features = this._map.queryRenderedFeatures(pt);
                if (features[0] && currentFeatureHash === itemHash(features[0])) {
                    pointInLayer = coordinates[testPosition];
                    break;
                }
            }
        }

        // It should be good enough to just use that point
        // TODO, what is it's not?
        return pointInLayer;
    }*/

    _simulateMouseEffects(element: HTMLElement, layerOptions: AccessibilityOptions, layerId: string | number) {

        /*
        // Fire a mousemove on focus
        if (layerOptions.simulateHover === true && interactivePoint) {
            element.onfocus = (event) => {
                if (!this._map) return;
                const screenPoint = this._map.project(interactivePoint as [number, number]);

                this._map.fire('mousemove', {
                    point: screenPoint,
                    lngLat: (interactivePoint as [number, number]),
                    type: "mousemove",
                    layerId: layerId, //feature.layer.id,
                    _defaultPrevented: false,
                    originalEvent: { ...event, clientX: screenPoint.x, clientY: screenPoint.y }
                });
            };

            element.onblur = (event) => {
                if (!this._map) return;
                const antipode = (interactivePoint as [number, number]).map(x => x * -1);
                const offScreenPoint = this._map.project(antipode as [number, number]);

                this._map.fire('mousemove', {
                    point: offScreenPoint,
                    lngLat: (antipode as [number, number]),
                    type: "mousemove",
                    layerId: layerId, //feature.layer.id,
                    _defaultPrevented: false,
                    originalEvent: { ...event, clientX: offScreenPoint.x, clientY: offScreenPoint.y }
                });
            };
        }

        // Fire a click on space, enter, or numpad enter
        if (layerOptions.simulateClick === true && clickPoint) {
            element.onkeydown = (event) => {
                if (!this._map) return;
                const screenPoint = this._map.project(clickPoint as [number, number]);

                const acceptableKeys: Array<typeof event['code']> = ['Enter', 'Space', 'NumpadEnter'];
                if (acceptableKeys.indexOf(event.code) > -1) {
                    this._map.fire('click', {
                        point: screenPoint,
                        lngLat: (clickPoint as [number, number]),
                        type: "click",
                        _defaultPrevented: false,
                        originalEvent: { ...event, clientX: screenPoint.x, clientY: screenPoint.y }
                    });
                }
            };
        }

        // TODO custom moveover/click
        */
    }

    _projectCoords(coordinates: Position[], projectTo: '3857' | '4326'): Position[] {
        return (coordinates).map((pos: Position) => {
            if (projectTo === '3857') {
                const coord = projections.WGS84toWebMercator(pos[0], pos[1]);
                return [coord.x, coord.y] as Position;
            } else {
                const coord = projections.WebMercatortoWGS84(pos[0], pos[1]);
                return [coord.lng, coord.lat] as Position;
            }
        });
    }

    _drawOutline(feature: GeoJSONMapFeature<Point | LineString | MultiLineString | Polygon | MultiPolygon>):
        GeoJSONMapFeature<Polygon> {
        if (!this._map) throw new Error();

        const layerOptions = this.layerOptions[feature.layer.id];

        const bufferPixels = layerOptions.bufferPixels as number;
        const bufferMeters = pixelsToMeters(bufferPixels, this._map.getZoom());
        const bufferSteps = layerOptions.bufferSteps as number;

        // Project the line into 3857

        let highlightArea;
        //if (feature.geometry.type === 'LineString') {
        //    const projectedLine = this._projectCoords(feature.geometry.coordinates, '3857');
        //    highlightArea = bufferLine(projectedLine, bufferMeters, bufferSteps);
        //} else {
        const pointCloud = this._toPointCloud(feature.geometry.coordinates);
        const projectedCloud = this._projectCoords(pointCloud, '3857');
        const bufferedCloud = projectedCloud
            .map((point, idx) => bufferPoint(bufferMeters, bufferSteps, point, projectedCloud[idx - 1], projectedCloud[idx + 1]))
            .reduce((a, c) => [...a, ...c], []);
        highlightArea = convexHull(bufferedCloud);
        //}

        return {
            type: feature.type,
            'layer': feature.layer,
            'properties': {},
            geometry: {
                'type': 'Polygon',
                'coordinates': [this._projectCoords(highlightArea, '4326')] as Position[][]
            }
        };
    }


    _getBbox(coordinateList: Position | Position[] | Position[][] | Position[][][]) {
        let bounds = { l: -Infinity, r: Infinity, t: -Infinity, b: Infinity };

        // If the map isn't ready, return infinite bounds
        if (!this._map) return bounds;

        const coordCloud = this._toPointCloud(coordinateList);

        // Find the bbox
        for (let i = 0; i < coordCloud.length; i++) {
            bounds.l = (bounds.l > coordCloud[i][0]) ? bounds.l : coordCloud[i][0];
            bounds.r = (bounds.r < coordCloud[i][0]) ? bounds.r : coordCloud[i][0];
            bounds.t = (bounds.t > coordCloud[i][1]) ? bounds.t : coordCloud[i][1];
            bounds.b = (bounds.b < coordCloud[i][1]) ? bounds.b : coordCloud[i][1];
        }

        return bounds;
    };

    _pointMarker(feature: GeoJSONMapFeature<Point>, tabIndex: number) {
        if (!this._map) return;

        let radius = 25;

        const screenPoint = this._map.project(feature.geometry.coordinates as [number, number]);
        let bufferedCoords = bufferPoint(radius, 32, [screenPoint.x, screenPoint.y]);
        //if (feature.layer.type === 'circle') {
        if (feature.layer.paint && (feature.layer.paint as any)['circle-radius']) {
            radius = (feature.layer.paint as any)['circle-radius'] + 5;
        }
        bufferedCoords = bufferPoint(radius, 32, [screenPoint.x, screenPoint.y]);

        //} else {
        //    // Symbol
        //    if (feature.layer.layout) {
        //        if ((feature.layer.layout as any)['text-field']) {
        //            const width = ((feature.layer.layout as any)['text-field'].toString()).length * 8;
        //            bufferedCoords = bufferLine([[screenPoint.x - (width / 2), screenPoint.y], [screenPoint.x + (width / 2), screenPoint.y]], 25, 16);
        //            (window as any).feat = feature;
        //        }
        //    }
        //}

        const bufferedCoords4326 = bufferedCoords
            .map(pt => this._map?.unproject(pt as [number, number]))
            .filter(pt => pt !== undefined)
            .map(pt => [pt?.lng, pt?.lat] as [number, number]);;

        const pointAsPolygon = {
            'type': 'Feature',
            'properties': {},
            'layer': feature.layer,
            geometry: {
                'type': 'Polygon',
                'coordinates': [bufferedCoords4326]
            }
        } as GeoJSONMapFeature<Polygon | MultiPolygon>;

        // If hovering over the object will show a state change, then simulate hover
        //const interactivePoint = this._getPointInLayer([feature.geometry.coordinates], feature);

        return this._polygonMarker(pointAsPolygon, tabIndex);
    }

    _lineMarker(feature: GeoJSONMapFeature<LineString | MultiLineString>, tabIndex: number) {
        // Buffers the line and makes it into a polygon
        if (!this._map) return;

        let lineAsPolygon: GeoJSONMapFeature<Polygon | MultiPolygon>;

        // Since we're buffering the line, we'll need to specify the first point to mimic click and mouseover
        /*const interactivePoint = (feature.geometry.type === 'LineString' ?
            this._getPointInLayer(feature.geometry.coordinates, feature) :
            this._getPointInLayer(this._toPointCloud(feature.geometry.coordinates), feature));*/

        // If there is no best point for hover, just use the first point for the click
        /*const clickPoint = interactivePoint || (feature.geometry.type === 'LineString' ?
            feature.geometry.coordinates[0] :
            feature.geometry.coordinates[0][0]);*/

        if (this.layerOptions[feature.layer.id].drawFeature === true) {
            lineAsPolygon = this._drawOutline(feature);
        } else {
            // Just return it as if it were a Polygon / Multipolygon
            // Maybe just send a bbox?
            lineAsPolygon = {
                'type': 'Feature',
                'properties': {},
                'layer': feature.layer,
                geometry: feature.geometry.type === 'LineString' ? {
                    'type': 'Polygon',
                    'coordinates': [feature.geometry.coordinates as Position[]]
                } : {
                    'type': 'MultiPolygon',
                    'coordinates': [feature.geometry.coordinates as Position[][]]
                }
            }
        }

        return this._polygonMarker(lineAsPolygon, tabIndex);
    }

    _polygonMarker(feature: GeoJSONMapFeature<Polygon | MultiPolygon>, tabIndex: number) {
        if (!this._map) return;

        // Layer options
        const layerOptions = this.layerOptions[feature.layer.id];

        // Find the first point in the geometry, or use an external one
        //interactivePoint = interactivePoint ||
        //    this._getPointInLayer(this._toPointCloud(feature.geometry.coordinates), feature);

        const area = document.createElement('area');

        const prjList = this.
            _toPointCloud(feature.geometry.coordinates)
            .map(coord => (this._map as maplibreMap).project(coord as [number, number]));

        if (layerOptions.drawFeature === true) {

            // Draw a circle around the whole multipolygon (maybe this won't work it's zoomed too much?)
            if (feature.geometry.type === 'MultiPolygon') {
                feature = this._drawOutline(feature);
            }

            area.shape = 'poly';
            area.coords = prjList.map(xy => [xy.x, xy.y]).join(',');


        } else {
            // Just a rect
            const bounds = this._getBbox(prjList.map(xy => [xy.x, xy.y]));

            area.shape = 'rect';
            area.coords = [bounds.l, bounds.t, bounds.r, bounds.b].join(',');
        }

        // Simulate click/hover
        this._simulateMouseEffects(area, layerOptions, feature.layer.id);

        let label: string | undefined = undefined;
        if (typeof layerOptions.labelField === 'function') {
            label = layerOptions.labelField(feature);
        } else {
            label = feature.properties && feature.properties[layerOptions.labelField];
        }
        if (label) {
            area.tabIndex = tabIndex;
            area.ariaLabel = label;
            area.ariaLabel ? area.alt = area.ariaLabel : true;
        }

        return area;
    }

    _waitEvent(name: string, waitTime: number = 100) {
        // Uses listeners are a debouncer
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
        const img = document.createElement('img');
        // transparent 1x1 gif
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        img.useMap = '#accessibleMap_' + (Math.random().toString(32).substring(2));
        img.style.width = canvas.style.width;
        img.style.height = canvas.style.height;
        this._imageMap.name = img.useMap;
        canvas.appendChild(this._imageMap);


        // Add the canvas and the imageMap
        // Create the Div element
        const markerElement = document.createElement('div');
        markerElement.id = 'accessibility-marker-' + img.useMap;
        markerElement.style.width = img.style.width;
        markerElement.style.height = img.style.height;
        markerElement.appendChild(this._imageMap);
        markerElement.appendChild(img);
        this._overlay = new this._mapLibrary.Marker(markerElement);

        // Set initial point
        this._overlay.setLngLat(this._map.getCenter());
        this._overlay.setOffset([0, 0]);

        this._overlay.addTo(this._map);
        return this._overlay;
    }


    _initMapListeners(enable: boolean = true) {
        if (!this._map) return;
        const enabled = enable ? 'on' : 'off';

        // Move Start
        // Remove all divs
        this._map[enabled]('movestart', _ => this._clear());

        // Moveend & Render
        // Query all map features and draw the accessibilty items
        const isMoving = () => {
            if ((this._map && !this._map.isMoving())) {
                this._waitEvent('addFeatures');
            }
        };

        this._events.on('addFeatures', () => { this._addFeatures() });

        this._map[enabled]('moveend', _ => isMoving());
        this._map[enabled]('render', _ => isMoving());

        (window as any)._map = this._map;

    }
};