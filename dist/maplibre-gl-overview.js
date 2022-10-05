'use strict';

const blankGeoJsonFeature = () => ({
    "type": "FeatureCollection",
    "features": []
});
const between = (min, value, max) => Math.min(max, Math.max(min, value));
function OverviewMap(mapLibrary) {
    return class OverviewMapControl {
        constructor(options) {
            this._extent = blankGeoJsonFeature();
            this._moving = false;
            // Create a container for the overview map
            this._container = document.createElement("div");
            this._container.className = "maplibregl-ctrl-overview-map maplibregl-ctrl";
            this._container.addEventListener("contextmenu", (e) => e.preventDefault());
            // options
            const defaultOptions = {
                zoomLevelOffset: -5,
                watchEvents: ['move', 'rotate', 'pitch'],
                overlayPaint: {
                    'fill-color': '#d29700',
                    'fill-opacity': 0.75
                },
                selectionPaint: {
                    'fill-color': '#d29700',
                    'fill-opacity': 0.25,
                    'fill-outline-color': '#000000'
                },
                width: 150,
                height: 150,
                style: ''
            };
            this.options = { ...defaultOptions, ...options };
            this._mapLibrary = mapLibrary;
            this._container.setAttribute('style', `width: ${this.options.width}px; height: ${this.options.height}px;`);
            // Create the map for the overview
            this._overviewMap = new mapLibrary.Map({
                container: this._container,
                style: this.options.style,
                interactive: true,
                pitchWithRotate: false,
                attributionControl: false,
                boxZoom: false,
                dragRotate: false,
                touchZoomRotate: false,
                touchPitch: false,
                minZoom: -2,
                maxBounds: new mapLibrary.LngLatBounds(new mapLibrary.LngLat(-540, -90), new mapLibrary.LngLat(540, 90))
            });
            this._overviewMap.on('load', () => {
                this._overviewMap.resize();
                this._overviewMap.addSource('bboxSource', {
                    'type': 'geojson',
                    'data': this._extent
                });
                this._overviewMap.addSource('selectionSource', {
                    'type': 'geojson',
                    'data': blankGeoJsonFeature()
                });
                // Add a new layer to visualize the polygon.
                this._overviewMap.addLayer({
                    'id': 'bboxLayer',
                    'type': 'fill',
                    'source': 'bboxSource',
                    'layout': {},
                    'paint': this.options.overlayPaint
                });
                this._overviewMap.addLayer({
                    'id': 'selectionFillLayer',
                    'type': 'fill',
                    'source': 'selectionSource',
                    'layout': {},
                    'paint': this.options.selectionPaint
                });
                this._overviewMap.addLayer({
                    'id': 'selectionLineLayer',
                    'type': 'line',
                    'source': 'selectionSource',
                    'layout': {},
                    'paint': {
                        'line-color': this.options.selectionPaint['fill-outline-color'] || '#000000',
                        'line-width': 2
                    }
                });
            });
        }
        onAdd(map) {
            this._mainMap = map;
            if (this.options.style === '') {
                this._overviewMap.setStyle(this._mainMap.style.serialize());
            }
            // Update the overview map when the main map moves
            this.options.watchEvents.forEach(event => map.on(event, () => this._updateOverview(map)));
            map.once('style.load', () => this._updateOverview(map));
            this._updateOverview(map);
            // Update the main map when the overview moves
            this._overviewMap.on('movestart', () => this._updateMain(map));
            return this._container;
        }
        onRemove() {
            if (this._mainMap) {
                //this._overviewMap.off('movestart', () => this._mainMap && this._moveOverview(this._mainMap));
                this.options.watchEvents
                    .forEach(event => this._mainMap && this._mainMap
                    .off(event, () => this._updateOverview(this._mainMap)));
                this._overviewMap.off('movestart', () => this._updateMain(this._mainMap));
            }
            if (this.options.style === '') {
                this._overviewMap.setStyle('');
            }
            this._mainMap = undefined;
        }
        _updateOverview(map) {
            var _a;
            // Don't update the overview map if it's already moving
            if (this._moving || !this._overviewMap)
                return;
            const pixelRatio = map.getPixelRatio();
            const geojson = blankGeoJsonFeature();
            if (map) {
                const center = map.unproject([(map.getCanvas().width / pixelRatio) / 2, (map.getCanvas().height / pixelRatio) / 2]);
                const bounds = map.getBounds();
                let extentCoordinates = [
                    [-179.99, bounds.getNorth()],
                    [179.99, bounds.getNorth()],
                    [179.99, bounds.getSouth()],
                    [-179.99, bounds.getSouth()],
                    [-179.99, bounds.getNorth()],
                ];
                // If the extent isn't larger that the earth, create a better one
                if ((bounds.getEast() - bounds.getWest()) < 360 + (Math.abs(90 - Math.abs(90 - Math.abs(map.getBearing())))) * (map.getPitch() / 60)) {
                    extentCoordinates = [
                        map.unproject([0, 0]).toArray(),
                        map.unproject([map.getCanvas().width / pixelRatio, 0]).toArray(),
                        map.unproject([map.getCanvas().width / pixelRatio, map.getCanvas().height / pixelRatio]).toArray(),
                        map.unproject([0, map.getCanvas().height / pixelRatio]).toArray(),
                        map.unproject([0, 0]).toArray()
                    ];
                }
                geojson.features.push({
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [extentCoordinates]
                    }
                });
                const newOverviewZoom = between(this._overviewMap.getMinZoom(), map.getZoom() + this.options.zoomLevelOffset, this._overviewMap.getMaxZoom());
                this._moving = true;
                this._overviewMap.setCenter(center);
                this._overviewMap.setZoom(newOverviewZoom);
                this._moving = false;
                (_a = this._overviewMap.getSource('bboxSource')) === null || _a === void 0 ? void 0 : _a.setData(geojson);
                this._extent = geojson;
            }
        }
        _updateMain(map) {
            var _a;
            // Don't update the main map if it's already moving
            if (this._moving || !this._mainMap)
                return;
            const selectionExtent = JSON.parse(JSON.stringify(this._extent));
            const screenCoords = (selectionExtent.features[0]).geometry.coordinates[0].map(pos => this._overviewMap.project(pos));
            (_a = this._overviewMap.getSource('selectionSource')) === null || _a === void 0 ? void 0 : _a.setData(selectionExtent);
            // Used when overzoomed
            new this._mapLibrary.LngLat(...selectionExtent.features[0].geometry.coordinates[0][0]);
            const overZoomOffset = Math.max(this._overviewMap.getZoom() - this._mainMap.getZoom(), this.options.zoomLevelOffset);
            const moving = () => {
                var _a;
                const currentSelectionExtentCoordinates = screenCoords
                    .map(pos => this._overviewMap.unproject([pos.x, pos.y]))
                    .map(xy => [xy.lng, xy.lat]);
                const geojson = blankGeoJsonFeature();
                geojson.features.push({
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [currentSelectionExtentCoordinates]
                    }
                });
                (_a = this._overviewMap.getSource('selectionSource')) === null || _a === void 0 ? void 0 : _a.setData(geojson);
            };
            const done = () => {
                this._overviewMap.off('move', moving);
                this._overviewMap.off('moveend', done);
                if (this._mainMap) {
                    // Deal with the overview map being outside of its minZoom (TODO or max zoom)
                    let newCenter = this._overviewMap.getCenter();
                    console.log('overZoomOffset', overZoomOffset);
                    const newMainZoom = between(this._mainMap.getMinZoom(), this._overviewMap.getZoom() - overZoomOffset, this._mainMap.getMaxZoom());
                    console.log('overZoomOffset', overZoomOffset, this._overviewMap.getZoom(), newMainZoom);
                    this._moving = true;
                    this._mainMap.once('moveend', (e) => e.doneEvents && e.doneEvents());
                    this._mainMap.easeTo({
                        center: newCenter,
                        zoom: newMainZoom
                    }, {
                        doneEvents: () => {
                            var _a;
                            (_a = this._overviewMap.getSource('selectionSource')) === null || _a === void 0 ? void 0 : _a.setData(blankGeoJsonFeature());
                            this._moving = false;
                            this._updateOverview(map);
                        }
                    });
                }
            };
            this._overviewMap.once('moveend', done);
            this._overviewMap.on('move', moving);
        }
        _getCenterAtPitch(map, pitch, rotation) {
            const pixelRatio = map.getPixelRatio();
            const center = map.unproject([(map.getCanvas().width / pixelRatio) / 2, (map.getCanvas().height / pixelRatio) / 2]);
            return center;
        }
    };
}

module.exports = OverviewMap;
