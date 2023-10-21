import {
    default as MapLibrary,
    Dispatcher,
    Evented,
    Source,
    Map as MapElement,
    Cancelable,
    Callback,
    Tile,
    GeoJSONSourceDiff,
    GeoJSONFeatureId
} from 'maplibre-gl';
import {
    ArcGisRestSpecification,
    esriFeatureServer,
    esriFeatureServiceResponse,
    esriFieldType,
    esriMapServer,
    esriMapServiceResponse,
    esriRequestParameters,
    esriServerError
} from './types/arcgisRestTypes';

import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { arcgisToGeoJSON } from '@terraformer/arcgis';
import { createActor } from './worker/actor';
import GeometriesAtZoom from './geometriesAtZoom';
import { quantizationParameters } from './arcgis/esriTools';
import { fromWGS84 } from './WebMercator';
import MapFetch from './mapFetch';

const ArcGisRestSourceDefaults = {
    where: '1=1',
    outfields: '*',
    resultRecordCount: undefined,
} as Partial<ArcGisRestSpecification>;

export default function ArcGisRestSource(mapLibrary: typeof MapLibrary) {
    return class ArcGisRest extends mapLibrary['GeoJSONSource'] implements Source {
        _originalSource: ArcGisRestSpecification;
        _quantizedQuery: boolean = false;
        _requestFormat: 'json' | 'pbf' = 'json';
        _geometriesAtZoom = createActor('GeometriesAtZoom');
        _requests: Cancelable[] = [];
        _primaryKeyType?: 'string' | 'number';
        _sortableFields: string[] = [];
        _events: Evented = new mapLibrary['Evented'];
        _liveLayer: boolean = false;
        _waitTimes: { [key: string]: number } = {};
        _isUpdateable: boolean = false; // Determines if the layer can be updated

        constructor(id: string, originalSource: ArcGisRestSpecification, dispatcher: Dispatcher, eventedParent: Evented) {
            super(id, { 'type': 'geojson', collectResourceTiming: false, 'data': {} }, dispatcher, eventedParent);
            (window as any).layer = this;

            // Set the defaults
            this.id = id;
            this._originalSource = { ...ArcGisRestSourceDefaults, ...originalSource };

            // Clean the input URL to remove trailing query strings
            const cleanedUrl = this._originalSource.url.match(/.+?[Feature|Map]Server\/\d{1,}/);

            if (cleanedUrl) {
                this._originalSource.url = cleanedUrl[0];
            } else {
                throw new Error('ArcGisRest URL is invalid ' + this._originalSource.url);
            }

            (window as any).source = this;
        }

        onAdd(map: MapElement) {
            this.map = map;
            this._asyncLoad(map).then(() => this.load());
        }

        async _asyncLoad(map: MapElement) {

            // Read the config from the server
            const url = new URL(this._originalSource.url);
            url.searchParams.append('f', 'json');
            if (this._originalSource.token) {
                url.searchParams.append('token', this._originalSource.token);
            }

            // Use the built in fetch, and make it cancellable
            const mapFetch = new MapFetch(map);
            const esriLayerConfig = await (await mapFetch.fetch(url)).json() as (esriFeatureServer | esriMapServer);

            if ((esriLayerConfig as any as esriServerError).error) {
                console.error('ArcGIS Error', (esriLayerConfig as any as esriServerError).error);
                return false;
            }

            // Get some important values from this

            const maxRecordCount = esriLayerConfig.maxRecordCount || 500;
            const supportedQueryFormats = (esriLayerConfig.supportedQueryFormats || "")
                .toLowerCase()
                .replace(/\s/g, '')
                .split(',');

            const supportsPbf = supportedQueryFormats.indexOf('pbf') > -1;
            this._requestFormat = supportsPbf ? 'pbf' : 'json';

            // Only quantize lines and polygons
            this._quantizedQuery = (esriLayerConfig.supportsCoordinatesQuantization === true) && (
                esriLayerConfig.geometryType === 'esriGeometryPolygon' ||
                esriLayerConfig.geometryType === 'esriGeometryPolyline'
            );

            if (esriLayerConfig.fields) {
                this._sortableFields = (esriLayerConfig.fields)
                    .filter(field => (([
                        'esriFieldTypeString', 'esriFieldTypeDouble', 'esriFieldTypeDate', 'esriFieldTypeGUID',
                        'esriFieldTypeGlobalID', 'esriFieldTypeInteger', 'esriFieldTypeOID', 'esriFieldTypeSingle',
                        'esriFieldTypeSmallInteger'
                    ] as esriFieldType[]).indexOf(field.type as any) > -1) &&
                        field.name.indexOf('()') === -1 &&
                        (field.alias || '').indexOf('()') === -1)
                    .map(field => field.name);
            }

            if (esriLayerConfig.indexes) {
                this.promoteId = esriLayerConfig.indexes
                    .filter((index) => (
                        index.isUnique === true) &&
                        index.fields &&
                        this._sortableFields.indexOf(index.fields as string) > -1
                    )
                    .map((index: { [key: string]: string | boolean }) => index['fields'])[0] as string;
            }

            if (esriLayerConfig.fields) {
                this._primaryKeyType = esriLayerConfig.fields
                    .filter((f: any) => f.name === this.promoteId)
                    .map((f: any) => ([
                        'esriFieldTypeDouble', 'esriFieldTypeDate', 'esriFieldTypeGUID',
                        'esriFieldTypeGlobalID', 'esriFieldTypeInteger', 'esriFieldTypeOID', 'esriFieldTypeSingle',
                        'esriFieldTypeSmallInteger'
                    ] as esriFieldType[]).indexOf(f.type as any) > -1 ? 'number' : 'string')[0];
            }

            // Set the record count to the smaller of the two values (either the server max record count, or the defined one)
            this._originalSource.resultRecordCount = (this._originalSource.resultRecordCount || Infinity) < maxRecordCount ? this._originalSource.resultRecordCount : maxRecordCount;

            // Start with blank data
            this.setData({
                "type": "FeatureCollection",
                "features": []
            });

            this._events.on('data', (esriData) => this.drawMapData(esriData.json, esriData.zoom));
            this.loadMapData(map);

            // Don't load the map if we're not trying to request one (liveLayer)
            map.on('moveend', () => this._liveLayer && this._waitEvent('redrawMap', 100));
            this._events.on('redrawMap', () => this.loadMapData(map));
        };

        loadTile(tile: Tile, callback: Callback<void>): void {
            if (!this._liveLayer) {
                this._liveLayer = true; // This makes sure we're only loading the layer if its tiles are requested
                this._waitEvent('redrawMap', 1000);
            }
            super.loadTile(tile, callback);
        }

        async loadMapData(map?: MapElement, bounds?: [number, number, number, number]) {
            map = map === undefined ? this.map : map;
            if (map === undefined) throw new Error('Source Data (Source ID: ' + this.id + ') could not be loaded');
            console.log('LOADING');
            // Don't load the map if we're not trying to request one (liveLayer)
            //if (!this._liveLayer) return;

            // Get list of all geometries at this or a higher zoom, if it doesn't support quantization, set to max zoom
            const displayZoom = this._quantizedQuery ? Math.floor(this.map.getZoom()) : this.map.getMaxZoom();

            // Create the ArcGIS Request
            let where = this._originalSource.where;

            // Build the request object
            const request = {
                where
            } as esriRequestParameters;

            // If there is a primary key, make sure we don't download it again
            if (this.promoteId) {
                bounds = bounds || [map.getBounds().getWest(), map.getBounds().getSouth(), map.getBounds().getEast(), map.getBounds().getNorth()]
                const projectedSouthWest = fromWGS84(bounds[0], bounds[1]);
                const projectedNorthEast = fromWGS84(bounds[2], bounds[3]);
                const projectedBounds = [projectedSouthWest.x, projectedSouthWest.y, projectedNorthEast.x, projectedNorthEast.y];
                const alreadyLoadedKeys = await (this._geometriesAtZoom.exec('getKeysAtZoom') as GeometriesAtZoom['getKeysAtZoom'])(displayZoom) as string[];
                request.geometry = projectedBounds.join(',');
                request.geometryType = 'esriGeometryEnvelope';
                request.inSR = '3857';

                const wrap = (v: string) => this._primaryKeyType === 'string' ? `'${v}'` : v;

                if (alreadyLoadedKeys.length) {
                    request.where = `(${where}) AND "${this.promoteId}" NOT IN (${alreadyLoadedKeys.map(k => wrap(k)).join(',')})`;
                }
            }

            // Cancel all over requests
            this._requests.forEach(fn => fn.cancel());

            //const newEsriJson = await 
            this._queryFeatures(this._originalSource.url, request, 0, (cancel) => this._requests.push(cancel), map, displayZoom);
            this._liveLayer = false; // We won't draw the layer again until another tile it requested
        }

        async drawMapData(newEsriJson: esriFeatureServiceResponse | esriMapServiceResponse, displayZoom: number) {
            // Convert to GeoJSON Features
            const newFeatures = this._esriJsonToFeatures(newEsriJson)

            // Run the diff
            const ids = newFeatures.map(feature => (feature.properties as any)[this.promoteId as string] as string);
            const updatedIds = await ((this._geometriesAtZoom.exec('updateKeysAtZoom') as GeometriesAtZoom['updateKeysAtZoom'])(displayZoom, ids));

            const dataDiff = {
                add: updatedIds.map((updatedId, idx) => {
                    if (updatedId === 'added') {
                        return newFeatures[idx];
                    }
                }).filter(idx => idx !== undefined),
                update: updatedIds.map((updatedId, idx) => {
                    if (updatedId === 'updated') {
                        const newGeometry = newFeatures[idx].geometry;
                        return {
                            id: ids[idx],
                            newGeometry
                        }
                    }
                }).filter(idx => idx !== undefined),
                removeAll: false,
                remove: []
            } as Required<GeoJSONSourceDiff>;

            if (dataDiff.update.length || dataDiff.add.length) {

                if ((this as any).updateData && this._isUpdateable) {
                    // Maplibre version 3!
                    //https://github.com/maplibre/maplibre-gl-js/commit/6a33333e2ca444abb28382e61d84c01169d7f325
                    //console.log('USING UPDATE', dataDiff, this.promoteId);
                    this.updateData(dataDiff);
                } else {
                    // Update the _data in place
                    console.log('this._data', this._data);
                    const currentFeatures = (this._data as FeatureCollection).features;
                    const currentFeaturesIds = currentFeatures.map(feature => (feature.properties as any)[this.promoteId as string] as GeoJSONFeatureId);

                    // these functions were tested on on jsbench.me, and for loops are the fastest
                    for (let i = 0; i < dataDiff.update.length; i++) {
                        let featureIdx = currentFeaturesIds.indexOf(dataDiff.update[i].id);
                        if (featureIdx > -1) {
                            currentFeatures[featureIdx].geometry = dataDiff.update[i].newGeometry || currentFeatures[featureIdx].geometry;
                        }
                    };
                    for (let i = 0; i < dataDiff.add.length; i++) {
                        const record = dataDiff.add[i];
                        if (record.properties) record.id = record.id || record.properties[this.promoteId as string];
                        currentFeatures.push(record);
                    }

                    if (this._data) {
                        this.setData(this._data);
                        //this._isUpdateable = true; // TODO test with updateData in maplibre-gl-js
                    }
                }
            }
        }

        /**
         * Responsible for invoking WorkerSource's geojson.loadData target, which
         * handles loading the geojson data and preparing to serve it up as tiles,
         * using geojson-vt or supercluster as appropriate.
         * @param diff - the diff object
         */

        _updateWorkerData(diff?: GeoJSONSourceDiff) {
            console.log('UPDATING!!', diff);
            super._updateWorkerData(diff);
        }

        async _queryFeatures(
            url: string,
            options: esriRequestParameters,
            offset: number,
            cancel: { (cancel: Cancelable): void },
            map: MapElement,
            zoom: number): Promise<void> {

            map = map === undefined ? this.map : map;
            if (map === undefined) throw new Error('Source Data (Source ID: ' + this.id + ') could not be loaded');

            // Convert the out field array to a string
            const outFieldsString = Array.isArray(this._originalSource.outfields) ?
                this._originalSource.outfields.map(f => `"${f}"`).join(',') :
                '*';

            const quantizationSting = this._quantizedQuery ?
                JSON.stringify(quantizationParameters(zoom, this.tileSize)) :
                '';

            // Define the full query parameters
            const queryParams = {
                'where': this._originalSource.where,
                'spatialRel': 'esriSpatialRelIntersects',
                'outFields': outFieldsString,
                'returnGeometry': true,
                'returnTrueCurves': false,
                // If the data is quantized, quantize it to 3857, otherwise just use 4326
                // the PBF format is always quantized (even if the coordinates quantization isn't supported)
                'outSR': (this._quantizedQuery || this._requestFormat === 'pbf') ? '3857' : '4326',
                'returnIdsOnly': false,
                'returnCountOnly': false,
                'returnZ': false,
                'returnM': false,
                'returnDistinctValues': false,
                'returnExtentOnly': false,
                'featureEncoding': 'esriDefault',
                'orderByFields': this._sortableFields.map(v => `"${v}"`).join(','),
                'resultOffset': offset !== undefined ? offset : 0,
                'resultRecordCount': this._originalSource.resultRecordCount,
                'quantizationParameters': quantizationSting,
                //'token': this.token, // TODO
                'f': this._requestFormat,
                ...options
            } as esriRequestParameters;

            const mapFetch = new MapFetch(map);
            const tmpUrl = new URL(url);
            Object.keys(queryParams)
                .map(key => tmpUrl.searchParams.append(
                    key,
                    (queryParams as { [key: string]: (string | number | boolean) })[key].toString()
                ))


            const dataPromise: Promise<any> = mapFetch.fetch(url + '/query', {
                'body': tmpUrl.search.replace(/^\?/, ''),
                //'method': 'POST', // Automatically decide based on URL length (GETs have better caching)
                'headers': {
                    'content-type': 'application/x-www-form-urlencoded'
                },
            }, (cancelFunction: Cancelable) => cancel && cancel(cancelFunction));


            const arcgisRequest = await (await dataPromise);
            let data: esriFeatureServiceResponse | esriMapServiceResponse | { 'features': [], 'exceededTransferLimit': boolean } =
                { 'features': [], 'exceededTransferLimit': false };
            try {
                if (queryParams.f === 'pbf') {
                    const pbfData = await arcgisRequest.arrayBuffer() as ArrayBuffer;
                    const convertPbfWorker = createActor('ConvertPbf', [pbfData]);
                    //const convertPbf = new ConvertPbf(pbfData);
                    data = await convertPbfWorker.exec('convert')();
                } else {
                    data = await arcgisRequest.json();
                    if (this._quantizedQuery) {
                        // Dezigzag simplified data
                        const dezigzagWorker = createActor('DeZigZagJSON', [
                            data.features,
                            (data as any).transform,
                            (data as any).geometryType
                        ]);
                        const features = await dezigzagWorker.exec('convert')();
                        (data as any).spatialReference = { 'wkid': 4326 };
                        data.features = features;
                    }
                }
            } catch (e) {
                // There was an error with the request, it was probably cancelled
                if (e !== 'cancel') {
                    console.error('Error with request', e);
                }
                return;
            }
            // Update the data
            if (data && data.features.length) {
                this._events.fire('data', {
                    'json': data,
                    'zoom': zoom
                });
            }

            if (data.exceededTransferLimit === true) {
                this._queryFeatures(url, options, (offset || 0) + data.features.length, cancel, map, zoom);
            }

        }

        _esriJsonToFeatures(esriJson: esriFeatureServiceResponse | esriMapServiceResponse) {

            const supportedGeometryTypes = {
                'esriGeometryPoint': 'Point',
                'esriGeometryMultipoint': 'MultiPoint',
                'esriGeometryLine': 'LineString',
                'esriGeometryPolyline': 'MultiLineString',
                'esriGeometryPolygon': 'MultiPolygon'
            };

            if (Object.keys(supportedGeometryTypes).indexOf(esriJson.geometryType) === -1) {
                throw new Error('Geometry ' + esriJson.geometryType + ' not supported');
            }

            // Convert Features
            const features = esriJson.features.map(feature => {
                // TODO reproject? data should already be 4326 by this point
                if ((esriJson.spatialReference.latestWkid || esriJson.spatialReference.wkid) !== 4326) {
                    console.warn('Unspported Projection (' + (esriJson.spatialReference.latestWkid || esriJson.spatialReference.wkid) + '), some data may not display correctly')
                }
                return {
                    'type': 'Feature',
                    'properties': feature.attributes,
                    'geometry': arcgisToGeoJSON(feature.geometry)
                } as Feature;
            });

            return features;
        }

        _waitEvent(name: string, waitTime: number = 100) {
            // Uses listeners as a debouncer
            console.log('Called', name, waitTime);
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
    }
};