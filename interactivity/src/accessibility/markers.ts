import { Map, MapGeoJSONFeature } from "maplibre-gl";
import { bufferPoint } from "../tileMath";
import { AccessibilityOptions, GeoJSONMapFeature } from ".";
import { LineString, MultiLineString, MultiPolygon, Point, Polygon, Position } from 'geojson';
import { drawOutline, getBbox, getPointInLayer, toPointCloud } from "./geometry";

export default class SvgMarker {
    _map: Map;
    _options: Required<AccessibilityOptions>;

    constructor(map: Map, options: Required<AccessibilityOptions>) {
        this._map = map;
        this._options = options;
    }

    createSvg(feature: MapGeoJSONFeature, tabIndex: number) {
        let polygon: (SVGPolygonElement | undefined) = undefined;

        // Create different markers for different types of shapes
        if (feature.geometry.type === 'Point') {
            polygon = this.pointMarker(feature as GeoJSONMapFeature<Point>, tabIndex);
        } else if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
            polygon = this.lineMarker(feature as GeoJSONMapFeature<LineString | MultiLineString>, tabIndex);
        } else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
            polygon = this.polygonMarker(feature as GeoJSONMapFeature<Polygon | MultiPolygon>, tabIndex);
        }

        if (polygon) {
            polygon.style.fill = 'rgba(0,0,0,0)';
        }

        return polygon;
    }

    pointMarker(feature: GeoJSONMapFeature<Point>, tabIndex: number) {

        const { bufferPixels, bufferSteps } = this._options
        let pointBufferPixels = bufferPixels;

        const screenPoint = this._map.project(feature.geometry.coordinates as [number, number]);
        let bufferedCoords = bufferPoint(pointBufferPixels, bufferSteps, [screenPoint.x, screenPoint.y]);

        if (feature.layer.paint && (feature.layer.paint as any)['circle-radius']) {
            pointBufferPixels = (feature.layer.paint as any)['circle-radius'] + (bufferPixels / 2);
        }
        bufferedCoords = bufferPoint(pointBufferPixels, bufferSteps, [screenPoint.x, screenPoint.y]);

        // TODO text can be made accessible as well
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
            .map(pt => this._map.unproject(pt as [number, number]))
            .filter(pt => pt !== undefined)
            .map(pt => [pt?.lng, pt?.lat] as [number, number]);;

        const pointAsPolygon = {
            'type': 'Feature',
            'properties': feature.properties,
            'layer': feature.layer,
            geometry: {
                'type': 'Polygon',
                'coordinates': [bufferedCoords4326]
            }
        } as GeoJSONMapFeature<Polygon | MultiPolygon>;

        return this.polygonMarker(pointAsPolygon, tabIndex, feature, { drawFeature: true });
    }

    lineMarker(feature: GeoJSONMapFeature<LineString | MultiLineString>, tabIndex: number) {
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

        if (this._options.drawFeature === true) {
            lineAsPolygon = drawOutline(feature, this._map.getZoom(), this._options.bufferPixels, this._options.bufferSteps);
        } else {
            // Just return it as if it were a Polygon / Multipolygon
            // Maybe just send a bbox?
            lineAsPolygon = {
                'type': 'Feature',
                'properties': feature.properties,
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

        return this.polygonMarker(lineAsPolygon, tabIndex, feature);
    }

    polygonMarker(feature: GeoJSONMapFeature<Polygon | MultiPolygon>,
        tabIndex: number,
        originalFeature: GeoJSONMapFeature<Polygon | MultiPolygon | Point | MultiLineString | LineString> = feature,
        options: Partial<AccessibilityOptions> = {}) {
        // Find the first point in the geometry, or use an external one
        //interactivePoint = interactivePoint ||
        //    this._getPointInLayer(this._toPointCloud(feature.geometry.coordinates), feature);
        const { bufferPixels, bufferSteps, labelField, drawFeature } = { ...this._options, ...options };

        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon') as SVGPolygonElement;

        const prjList = toPointCloud(feature.geometry.coordinates)
            .map(coord => (this._map).project(coord as [number, number]));

        let points = '';

        if (drawFeature === true) {
            // Draw a circle around the whole multipolygon (maybe this won't work it's zoomed too much?)
            if (feature.geometry.type === 'MultiPolygon') {
                // TODO: I don't think this would work?
                feature = drawOutline(feature, this._map.getZoom(), bufferPixels, bufferSteps);
            }
            points = prjList.map(xy => [xy.x, xy.y]).join(',');

        } else {
            // Just a rect
            const bounds = getBbox(prjList.map(xy => [xy.x, xy.y]));

            // Define the corners of the rectangle based on bounds
            let topLeft = `${bounds.l},${bounds.t}`;
            let topRight = `${bounds.r},${bounds.t}`;
            let bottomRight = `${bounds.r},${bounds.b}`;
            let bottomLeft = `${bounds.l},${bounds.b}`;

            // Set the points attribute of the polygon
            points = `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;
        }
        polygon.setAttribute('points', points);

        this.simulateMouseEffects(polygon, originalFeature);

        let label: string | undefined = undefined;
        if (typeof labelField === 'function') {
            label = labelField(feature);
        } else if (labelField !== undefined) {
            label = feature.properties && feature.properties[labelField];
        }
        if (label) {
            polygon.tabIndex = tabIndex; // TODO right now it'll only get a tab index if it has a label?
            polygon.ariaLabel = label;
            polygon.ariaLabel ? (polygon as any).alt = polygon.ariaLabel : true;
        }

        return polygon;
    }

    simulateMouseEffects(element: SVGPolygonElement, feature: GeoJSONMapFeature<Polygon | MultiPolygon | Point | MultiLineString | LineString>) {
        const { simulateHover, simulateClick } = this._options;
        const layerId = feature.layer.id;
        const interactivePoint = getPointInLayer(this._map, feature) as [number, number];

        if (simulateHover || true) this.simulateHover(element, layerId, interactivePoint);
        if (simulateClick) this.simulateClick(element, layerId, interactivePoint);
    }

    simulateHover(element: SVGPolygonElement, layerId: string, interactivePoint: [number, number]): void {
        element.onfocus = (event) => {
            const screenPoint = this._map.project(interactivePoint);

            this._map.fire('mousemove', {
                point: screenPoint,
                lngLat: { lng: interactivePoint[0], lat: interactivePoint[1] },
                type: "mousemove",
                layerId: layerId,
                _defaultPrevented: false,
                originalEvent: { ...event, clientX: screenPoint.x, clientY: screenPoint.y }
            });
        };

        element.onblur = (event) => {
            if (!this._map) return;
            const antipode = interactivePoint.map(x => x * -1);
            const offScreenPoint = this._map.project(antipode as [number, number]);

            this._map.fire('mousemove', {
                point: offScreenPoint,
                lngLat: { lng: antipode[0], lat: antipode[1] },
                type: "mousemove",
                layerId: layerId,
                _defaultPrevented: false,
                originalEvent: { ...event, clientX: offScreenPoint.x, clientY: offScreenPoint.y }
            });
        };
    }

    simulateClick(element: SVGPolygonElement, layerId: string, interactivePoint: [number, number]): void {
        element.onkeydown = (event) => {
            const screenPoint = this._map.project(interactivePoint);

            const acceptableKeys: Array<typeof event['code']> = ['Enter', 'Space', 'NumpadEnter'];
            if (acceptableKeys.indexOf(event.code) > -1) {
                this._map.fire('click', {
                    point: screenPoint,
                    lngLat: { lng: interactivePoint[0], lat: interactivePoint[1] },
                    type: "click",
                    layerId: layerId, // TODO does this do anything?
                    _defaultPrevented: false,
                    originalEvent: { ...event, clientX: screenPoint.x, clientY: screenPoint.y }
                });
            }
        };
    }
}