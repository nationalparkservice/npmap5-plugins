import { default as MapLibrary, Evented, Dispatcher, RasterSourceSpecification } from 'maplibre-gl';
export declare type WmsSourceSpecification = Omit<RasterSourceSpecification, 'type' | 'tiles' | 'url' | 'scheme'> & {
    'url': string;
    'layers': Array<string | number>;
    'transparent'?: boolean;
    'format': string;
    tileSize?: number;
};
export declare type WmsApiLayerOptions = {
    /**   Service name. Value is WMS. */
    service: 'WMS';
    /** Service version. Value is one of 1.0.0, 1.1.0, 1.1.1, 1.3.0. */
    version: '1.0.0' | '1.1.0' | '1.1.1' | '1.3.0';
    /**   Operation name. Value is GetMap. */
    request: 'GetMap';
    /**   Layers to display on map.Value is a comma - separated list of layer names. */
    layers: string;
    /** Styles in which layers are to be rendered.Value is a comma - separated list of style names,
     * or empty if default styling is required.Style names may be empty in the list,
     * to use default layer styling. */
    styles: string;
    /** Spatial Reference System for map output.Value is in form EPSG: nnn. */
    srs: string;
    /**   Bounding box for map extent.Value is minx, miny, maxx, maxy in units of the SRS. */
    bbox: string;
    /** Width of map output, in pixels. */
    width: string;
    /** Height of map output, in pixels. */
    height: string;
    /** Format for the map output. */
    format: string;
    /** Whether the map background should be transparent.Values are true or false.Default is false */
    transparent?: boolean;
    /**  Background color for the map image.Value is in the form RRGGBB.Default is FFFFFF(white). */
    bgcolor?: string;
    /** Format in which to report exceptions.Default value is application / vnd.ogc.se_xml. */
    exceptions?: string;
    /**   Time value or range for map data. */
    time?: string;
    /**   A URL referencing a StyledLayerDescriptor XML file which controls or enhances map layers and styling */
    sld?: string;
    /** A URL - encoded StyledLayerDescriptor XML document which controls or enhances map layers and styling */
    sld_body?: string;
};
export declare type WmsApiLayerOptions130 = Omit<WmsApiLayerOptions, 'version' | 'srs'> & {
    version: '1.3.0';
    crs: string;
};
export default function WmsSource(mapLibrary: typeof MapLibrary): {
    new (id: string, originalSource: WmsSourceSpecification, dispatcher: Dispatcher, eventedParent: Evented): {
        _originalSource: WmsSourceSpecification;
        load(): void;
        convertToSource(): Promise<Required<RasterSourceSpecification>>;
        type: "raster" | "raster-dem";
        id: string;
        minzoom: number;
        maxzoom: number;
        url: string;
        scheme: string;
        tileSize: number;
        bounds: [number, number, number, number];
        tileBounds: import("maplibre-gl").TileBounds;
        roundZoom: boolean;
        dispatcher: Dispatcher;
        map: import("maplibre-gl").Map;
        tiles: string[];
        _loaded: boolean;
        _options: RasterSourceSpecification | import("maplibre-gl").RasterDEMSourceSpecification;
        _tileJSONRequest: import("maplibre-gl").Cancelable;
        loaded(): boolean;
        onAdd(map: import("maplibre-gl").Map): void;
        onRemove(): void;
        serialize(): any;
        hasTile(tileID: import("maplibre-gl").OverscaledTileID): boolean;
        loadTile(tile: import("maplibre-gl").Tile, callback: import("maplibre-gl").Callback<void>): void;
        abortTile(tile: import("maplibre-gl").Tile, callback: import("maplibre-gl").Callback<void>): void;
        unloadTile(tile: import("maplibre-gl").Tile, callback: import("maplibre-gl").Callback<void>): void;
        hasTransition(): boolean;
        _listeners: import("maplibre-gl").Listeners;
        _oneTimeListeners: import("maplibre-gl").Listeners;
        _eventedParent: Evented;
        _eventedParentData: any;
        on(type: string, listener: import("maplibre-gl").Listener): any;
        off(type: string, listener: import("maplibre-gl").Listener): any;
        once(type: string, listener: import("maplibre-gl").Listener): any;
        fire(event: string | import("maplibre-gl").Event, properties?: any): any;
        listens(type: string): any;
        setEventedParent(parent?: Evented | null | undefined, data?: any): any;
    };
};
