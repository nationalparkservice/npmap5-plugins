import {
  default as MapLibrary,
  Evented,
  Source,
  Dispatcher,
  RasterSourceSpecification,
} from 'maplibre-gl';

export type WmsSourceSpecification = Omit<RasterSourceSpecification, 'type' | 'tiles' | 'url' | 'scheme'> & {
  'url': string,
  'layers': Array<string | number>,
  'transparent'?: boolean,
  tileSize?: number
};

const WmsSourceDefaults = {
  transparent: true,
  tileSize: 256
}

// https://docs.geoserver.org/stable/en/user/services/wms/reference.html
export type WmsApiLayerOptions = {
  /**   Service name. Value is WMS. */
  service: 'WMS',
  /** Service version. Value is one of 1.0.0, 1.1.0, 1.1.1, 1.3.0. */
  version: '1.0.0' | '1.1.0' | '1.1.1',
  /**   Operation name. Value is GetMap. */
  request: 'GetMap',
  /**   Layers to display on map.Value is a comma - separated list of layer names. */
  layers: string,
  /** Styles in which layers are to be rendered.Value is a comma - separated list of style names, 
   * or empty if default styling is required.Style names may be empty in the list, 
   * to use default layer styling. */
  styles: string,
  /** Spatial Reference System for map output.Value is in form EPSG: nnn. */
  srs: string,
  /**   Bounding box for map extent.Value is minx, miny, maxx, maxy in units of the SRS. */
  bbox: string
  /** Width of map output, in pixels. */
  width: string,
  /** Height of map output, in pixels. */
  height: string,
  /** Format for the map output. */
  format: string,
  /** Whether the map background should be transparent.Values are true or false.Default is false */
  transparent?: boolean,
  /**  Background color for the map image.Value is in the form RRGGBB.Default is FFFFFF(white). */
  bgcolor?: string,
  /** Format in which to report exceptions.Default value is application / vnd.ogc.se_xml. */
  exceptions?: string,
  /**   Time value or range for map data. */
  time?: string,
  /**   A URL referencing a StyledLayerDescriptor XML file which controls or enhances map layers and styling */
  sld?: string,
  /** A URL - encoded StyledLayerDescriptor XML document which controls or enhances map layers and styling */
  sld_body?: string,
};

export type WmsApiLayerOptions130 = Omit<WmsApiLayerOptions, 'version' | 'srs'> & {
  version: '1.3.0',
  crs: string
};



export default function WmsSource(mapLibrary: typeof MapLibrary) {
  return class WmsSource extends mapLibrary['RasterTileSource'] implements Source {
    _originalSource: WmsSourceSpecification;

    constructor(id: string, originalSource: WmsSourceSpecification, dispatcher: Dispatcher, eventedParent: Evented) {
      super(id, { 'type': 'raster' }, dispatcher, eventedParent);

      // Set the defaults
      this.id = id;
      this._originalSource = {...WmsSourceDefaults, ...originalSource};
    }

    load() {
      this.convertToSource().then(convertedSource => {
        this.type = 'raster';
        this.url = convertedSource.url; //
        this.tiles = convertedSource.tiles; //?: string[] | undefined;
        this.bounds = convertedSource.bounds; //?: [number, number, number, number] | undefined;
        this.scheme = convertedSource.scheme; //?: "xyz" | "tms" | undefined;
        this.minzoom = convertedSource.minzoom; //?: number | undefined;
        this.maxzoom = convertedSource.maxzoom; //?: number | undefined;
        super.load();
      });
    }

    async convertToSource() {

      const url = new URL(`${this._originalSource.url}`);

      url.searchParams.append('request', 'GetCapabilities');
      url.searchParams.append('service', 'WMS');

      let wmsCapabilities: Document;
      try {
        const response = await fetch(url);
        const text = await response.text();
        wmsCapabilities = new window.DOMParser().parseFromString(text, "text/xml");
      } catch (e) {
        throw new Error('Cannot get WMS Capabilities');
      }
      const imageFormats = [...(wmsCapabilities.getElementsByTagName('GetMap')[0].children)]
        .filter(c => c.tagName === 'Format')
        .map(c => c.textContent);
      const wmsVersion = wmsCapabilities.getElementsByTagName('WMS_Capabilities')[0].getAttribute('version');

      console.log('Image Formats', imageFormats, 'version', wmsVersion);
      (window as any).cap = wmsCapabilities;

      const wmsQuery: Omit<WmsApiLayerOptions, 'version' | 'srs' | 'bbox'> = {
        'layers': this._originalSource.layers.join(','),
        'format': 'png32', // TODO check with version
        'height': this._originalSource.tileSize?.toString() as string,
        'width': this._originalSource.tileSize?.toString() as string,
        'service': 'WMS',
        'request': 'GetMap',
        'transparent':  this._originalSource.transparent as boolean,
        'styles': '' // TODO
      };

      if (wmsVersion === '1.3.0') {
        (wmsQuery as WmsApiLayerOptions130).version = '1.3.0';
        (wmsQuery as WmsApiLayerOptions130).crs = 'EPSG:3857';
      } else {
        (wmsQuery as WmsApiLayerOptions).version = '1.1.1';
        (wmsQuery as WmsApiLayerOptions).srs = 'EPSG:3857';
      }

      const tileUrl = new URL(`${this._originalSource.url}`);
      Object.keys(wmsQuery).map(key => {
        tileUrl.searchParams.append(key, (wmsQuery as any)[key])
      });

      let maplibrarySource: RasterSourceSpecification = {
        ...this._originalSource,
        ...{
          'type': 'raster',
          'tiles': [tileUrl.toString() + '&bbox={bbox-epsg-3857}']
        }
      };
      return maplibrarySource as Required<RasterSourceSpecification>;
    }
  };
};