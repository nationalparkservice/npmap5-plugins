import {
  default as MapLibrary,
  VectorSourceSpecification,
  Evented,
  Source,
  Dispatcher,
  VectorTileSource,
} from 'maplibre-gl';

export type CartoSourceSpecification = Omit<VectorSourceSpecification, 'type' | 'tiles' | 'url' | 'scheme'> & {
  'type': 'carto',
  'user': string,
  'table'?: string,
  'sql'?: string,
  'server'?: string
};

// https://carto.com/developers/maps-api/reference/#operation/instantiateAnonymousMap
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
  sql: string,
  /** A string value, specifying the CartoCSS style version of the CartoCSS attribute. */
  cartocss_version?: string,
  /** The name of the column containing the geometry. Default "the_geom_webmercator" */
  geom_column?: string
  /** Defines the type of column as either geometry or raster. Default "geometry" */
  geom_type?: "geometry" | "raster",
  /**
   * Defines the raster band (this option is only applicable when the geom_type=raster.)
   * 
   * Note: If the default, or no value is specified, raster bands are interpreted as either:
   * 
   * grayscale (for single bands)
   * RGB (for 3 bands)
   * RGBA (for 4 bands).
   */
  raster_band?: string,
  /** The spatial reference identifier for the geometry column. Default "3857" */
  srid: string,
  /** A string of values containing the tables that the Mapnik layer SQL configuration is using. This value is used if there is a problem guessing what the affected tables are from the SQL configuration (i.e. when using PL/SQL functions). */
  affected_tables?: string,
  /** A string of values that contains the fields rendered inside grid.json. All the parameters should be exposed as a result of executing the Mapnik layer SQL query. */
  interactivity?: string,
  /** The id and column values returned by the Mapnik attributes service. 
   * (This option is disabled if no configuration is defined). 
   * You must specify this value as part of the Mapnik layer SQL configuration.
 */
  attributes?: [
    {
      'id': string,
      'columms': string
    }
  ]
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
  type: "mapnik" | "cartodb" | "torque" | "http" | "plain" | "named",
  options: CartoApiLayerOptions
}
export type CartoApiV1CreateMap = {
  /** Spec version to use for validation. */
  version?: string,
  /**   The default map extent for the map projection. Note: Currently, only webmercator is supported. */
  extent?: string,
  /**   The spatial reference identifier for the map. */
  srid?: string,
  /**   The maximum zoom level for your map. A request beyond the defined maxzoom returns a 404 error. */
  maxzoom?: string,
  /** The minimum zoom level for your map. A request beyond the defined minzoom returns a 404 error. */
  minzoom?: string,
  layers: Array<CartoApiLayerObj>
};


const cartoDefaults = {
  'type': 'carto',
  'server': 'carto.com'
} as CartoSourceSpecification;

export default function CartoSource(mapLibrary: typeof MapLibrary, options: Partial<CartoSourceSpecification> = cartoDefaults) {
  return class CartoSource extends mapLibrary['VectorTileSource'] implements Source {
    _originalSource: CartoSourceSpecification;

    constructor(id: string, originalSource: CartoSourceSpecification, dispatcher: Dispatcher, eventedParent: Evented) {
      super(id, { 'type': 'vector', 'collectResourceTiming': true }, dispatcher, eventedParent);

      // Set the defaults
      this.id = id;
      this._originalSource = { ...options, ...originalSource };

      // If there is not a SQL query, but there's a table, make the query 'SELECT * FROM {TABLE}'
      if (this._originalSource.table && !this._originalSource.sql) {
        this._originalSource.sql = `SELECT * FROM "${this._originalSource.user}"."${this._originalSource.table}";`;
      } else if (this._originalSource.sql && !this._originalSource.table) {
        this._originalSource.table = undefined;
      } else if (!this._originalSource.sql && !this._originalSource.table) {
        throw new Error(`${this._originalSource.type} requires either a sql or table parameter`);
      }
    }

    load() {
      this.convertToSource().then(convertedSource => {
        this.url = convertedSource.url; //
        this.tiles = convertedSource.tiles; //?: string[] | undefined;
        this.bounds = convertedSource.bounds; //?: [number, number, number, number] | undefined;
        this.scheme = convertedSource.scheme; //?: "xyz" | "tms" | undefined;
        this.minzoom = convertedSource.minzoom; //?: number | undefined;
        this.maxzoom = convertedSource.maxzoom; //?: number | undefined;
        this.promoteId = convertedSource.promoteId; //?: PromoteIdSpecification | undefined;
        super.load();
      });
    }

    async convertToSource() {
      let cartoMapConfig = {
        version: '1.3.0',
        layers: [{
          'type': 'mapnik',
          'options': {
            'sql': this._originalSource.sql,
            'srid': '3857'
          }
        }]
      } as CartoApiV1CreateMap;

      if (this._originalSource.minzoom !== undefined) cartoMapConfig.minzoom = this._originalSource.minzoom.toString();
      if (this._originalSource.maxzoom !== undefined) cartoMapConfig.maxzoom = this._originalSource.maxzoom.toString();
      //if (this.source.bounds) {
      // TODO maplibre only support 4326 and carto wants 3857
      //cartoMapConfig.extent = JSON.stringify(this.source.bounds);
      //}

      let url = new URL(`https://${this._originalSource.server}/user/${this._originalSource.user}/api/v1/map`);

      // carto.com uses a different format than on-prem
      if (this._originalSource.server === 'carto.com') {
        url = new URL(`https://${this._originalSource.user}.${this._originalSource.server}/api/v1/map`);
      }

      url.searchParams.append('config', JSON.stringify(cartoMapConfig));

      let tileUrls = [] as Array<string>;
      try {
        const resp = await fetch(url);
        const json = await resp.json();
        tileUrls = json.metadata.tilejson.vector.tiles as Array<string>;
      } catch (e) {
        throw new Error(`${this._originalSource.type} source failed to load`);
      }

      let maplibrarySource: VectorSourceSpecification = {
        ...this._originalSource,
        ...{
          'type': 'vector',
          'tiles': tileUrls
        }
      };
      return maplibrarySource as Required<VectorSourceSpecification>;
    }
  };
};