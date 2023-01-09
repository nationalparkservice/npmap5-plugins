import { default as MapLibrary, VectorSourceSpecification, Evented, Dispatcher } from 'maplibre-gl';
export type CartoSourceSpecification = Omit<VectorSourceSpecification, 'type' | 'tiles' | 'url' | 'scheme'> & {
    'type': 'carto';
    'user': string;
    'table'?: string;
    'sql'?: string;
    'server'?: string;
};
export type CartoApiLayerOptions = {
    /** The SQL request to the user database that will fetch the rendered data.
     * The SQL request should include the following Mapnik layer configurations:
     *   geom_column
     *   interactivity
     *   attributes
     *
     *   Note: The SQL request may contain substitutions tokens, such as !bbox!, !pixel_width! and !pixel_height!.
     *   It is suggested to define the layergroup minzoom and extent variables to prevent errors.
     *
     */
    sql: string;
    /** A string value, specifying the CartoCSS style version of the CartoCSS attribute. */
    cartocss_version?: string;
    /** The name of the column containing the geometry. Default "the_geom_webmercator" */
    geom_column?: string;
    /** Defines the type of column as either geometry or raster. Default "geometry" */
    geom_type?: "geometry" | "raster";
    /**
     * Defines the raster band (this option is only applicable when the geom_type=raster.)
     *
     * Note: If the default, or no value is specified, raster bands are interpreted as either:
     *
     * grayscale (for single bands)
     * RGB (for 3 bands)
     * RGBA (for 4 bands).
     */
    raster_band?: string;
    /** The spatial reference identifier for the geometry column. Default "3857" */
    srid: string;
    /** A string of values containing the tables that the Mapnik layer SQL configuration is using. This value is used if there is a problem guessing what the affected tables are from the SQL configuration (i.e. when using PL/SQL functions). */
    affected_tables?: string;
    /** A string of values that contains the fields rendered inside grid.json. All the parameters should be exposed as a result of executing the Mapnik layer SQL query. */
    interactivity?: string;
    /** The id and column values returned by the Mapnik attributes service.
     * (This option is disabled if no configuration is defined).
     * You must specify this value as part of the Mapnik layer SQL configuration.
   */
    attributes?: [
        {
            'id': string;
            'columms': string;
        }
    ];
};
export type CartoApiLayerObj = {
    /**
      mapnik - rasterized tiles
      cartodb - an alias for mapnik (for backward compatibility)
      torque - render vector tiles in torque format
      http - load tiles over HTTP
      plain - color or background image url
      named - use a Named Map as a layer
    */
    type: "mapnik" | "cartodb" | "torque" | "http" | "plain" | "named";
    options: CartoApiLayerOptions;
};
export type CartoApiV1CreateMap = {
    /** Spec version to use for validation. */
    version?: string;
    /**   The default map extent for the map projection. Note: Currently, only webmercator is supported. */
    extent?: string;
    /**   The spatial reference identifier for the map. */
    srid?: string;
    /**   The maximum zoom level for your map. A request beyond the defined maxzoom returns a 404 error. */
    maxzoom?: string;
    /** The minimum zoom level for your map. A request beyond the defined minzoom returns a 404 error. */
    minzoom?: string;
    layers: Array<CartoApiLayerObj>;
};
export default function CartoSource(mapLibrary: typeof MapLibrary, options?: Partial<CartoSourceSpecification>): {
    new (id: string, originalSource: CartoSourceSpecification, dispatcher: Dispatcher, eventedParent: Evented): {
        _originalSource: CartoSourceSpecification;
        load(): void;
        convertToSource(): Promise<Required<VectorSourceSpecification>>;
        type: "vector";
        id: string;
        minzoom: number;
        maxzoom: number;
        url: string;
        scheme: string;
        tileSize: number;
        promoteId: import("maplibre-gl").PromoteIdSpecification;
        _options: VectorSourceSpecification;
        _collectResourceTiming: boolean;
        dispatcher: Dispatcher;
        map: import("maplibre-gl").Map;
        bounds: [number, number, number, number];
        tiles: string[];
        tileBounds: import("maplibre-gl").TileBounds;
        reparseOverscaled: boolean;
        isTileClipped: boolean;
        _tileJSONRequest: import("maplibre-gl").Cancelable;
        _loaded: boolean;
        loaded(): boolean;
        hasTile(tileID: import("maplibre-gl").OverscaledTileID): boolean;
        onAdd(map: import("maplibre-gl").Map): void;
        setSourceProperty(callback: Function): void;
        setTiles(tiles: string[]): any;
        setUrl(url: string): any;
        onRemove(): void;
        serialize(): any;
        loadTile(tile: import("maplibre-gl").Tile, callback: import("maplibre-gl").Callback<void>): void;
        abortTile(tile: import("maplibre-gl").Tile): void;
        unloadTile(tile: import("maplibre-gl").Tile): void;
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
