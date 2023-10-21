import { default as MapLibrary, Dispatcher, Evented, Map as MapElement, Cancelable, Callback, Tile, GeoJSONSourceDiff } from 'maplibre-gl';
import { ArcGisRestSpecification, esriFeatureServiceResponse, esriMapServiceResponse, esriRequestParameters } from './types/arcgisRestTypes';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
export default function ArcGisRestSource(mapLibrary: typeof MapLibrary): {
    new (id: string, originalSource: ArcGisRestSpecification, dispatcher: Dispatcher, eventedParent: Evented): {
        _originalSource: ArcGisRestSpecification;
        _quantizedQuery: boolean;
        _requestFormat: 'json' | 'pbf';
        _geometriesAtZoom: {
            subClass: any;
            worker: Worker;
            handlers: Map<string, {
                res: (value: any) => void;
                rej: (value: Error) => void;
            }>;
            initId: string;
            _: {} | undefined;
            onLoad(): Promise<unknown>;
            exec(command: string): (...args: any) => Promise<any>;
            get(command: string): Promise<any>;
        } | {
            subClass: any;
            onLoad(): Promise<any>;
            get(command: string): Promise<any>;
            exec(command: string): (...args: any) => Promise<any>;
        };
        _requests: Cancelable[];
        _primaryKeyType?: "string" | "number" | undefined;
        _sortableFields: string[];
        _events: Evented;
        _liveLayer: boolean;
        _waitTimes: {
            [key: string]: number;
        };
        _isUpdateable: boolean;
        onAdd(map: MapElement): void;
        _asyncLoad(map: MapElement): Promise<false | undefined>;
        loadTile(tile: Tile, callback: Callback<void>): void;
        loadMapData(map?: MapElement, bounds?: [number, number, number, number]): Promise<void>;
        drawMapData(newEsriJson: esriFeatureServiceResponse | esriMapServiceResponse, displayZoom: number): Promise<void>;
        /**
         * Responsible for invoking WorkerSource's geojson.loadData target, which
         * handles loading the geojson data and preparing to serve it up as tiles,
         * using geojson-vt or supercluster as appropriate.
         * @param diff - the diff object
         */
        _updateWorkerData(diff?: GeoJSONSourceDiff): void;
        _queryFeatures(url: string, options: esriRequestParameters, offset: number, cancel: (cancel: Cancelable) => void, map: MapElement, zoom: number): Promise<void>;
        _esriJsonToFeatures(esriJson: esriFeatureServiceResponse | esriMapServiceResponse): Feature<Geometry, GeoJsonProperties>[];
        _waitEvent(name: string, waitTime?: number): void;
        type: "geojson";
        id: string;
        minzoom: number;
        maxzoom: number;
        tileSize: number;
        attribution: string;
        promoteId: import("maplibre-gl").PromoteIdSpecification;
        isTileClipped: boolean;
        reparseOverscaled: boolean;
        _data: string | import("geojson").GeoJSON | undefined;
        _options: import("maplibre-gl").GeoJsonSourceOptions;
        workerOptions: import("maplibre-gl").WorkerOptions;
        map: MapElement;
        actor: import("maplibre-gl").Actor;
        _pendingLoads: number;
        _collectResourceTiming: boolean;
        _removed: boolean;
        load: () => void;
        setData(data: string | import("geojson").GeoJSON): any;
        updateData(diff: GeoJSONSourceDiff): any;
        setClusterOptions(options: import("maplibre-gl").SetClusterOptions): any;
        getClusterExpansionZoom(clusterId: number, callback: Callback<number>): any;
        getClusterChildren(clusterId: number, callback: Callback<Feature<Geometry, GeoJsonProperties>[]>): any;
        getClusterLeaves(clusterId: number, limit: number, offset: number, callback: Callback<Feature<Geometry, GeoJsonProperties>[]>): any;
        loaded(): boolean;
        abortTile(tile: Tile): void;
        unloadTile(tile: Tile): void;
        onRemove(): void;
        serialize: () => import("maplibre-gl").GeoJSONSourceSpecification;
        hasTransition(): boolean;
        _listeners: import("maplibre-gl").Listeners;
        _oneTimeListeners: import("maplibre-gl").Listeners;
        _eventedParent: Evented;
        _eventedParentData: any;
        on(type: string, listener: import("maplibre-gl").Listener): any;
        off(type: string, listener: import("maplibre-gl").Listener): any;
        once(type: string, listener?: import("maplibre-gl").Listener | undefined): any | Promise<any>;
        fire(event: string | import("maplibre-gl").Event, properties?: any): any;
        listens(type: string): boolean;
        setEventedParent(parent?: Evented | null | undefined, data?: any): any;
    };
};
