/** ESPG codes that refer to Web Mercator */
export declare const webMercatorCodes: string[];
/** The "earthCircumference" in meters that is used to calculate Web Mercator meters */
export declare const earthCircumference = 40075016.68557849;
/**
 * Converts a string into a unique has quickly (not securely)
 * @param str
 * @returns a hash
 */
export declare const simpleHash: (str: string) => string;
export declare const maplibreKey: {
    /**
     * Takes a xyz tile and converts it to a maplibre tile key
     * @param wrap
     * @param overscaledZ
     * @param z
     * @param x
     * @param y
     * @returns a maplibre tile key
     */
    toKey: (wrap: number, overscaledZ: number, z: number, x: number, y: number) => string;
    /**
     * Takes maplibre tile key and returns the xyz tile
     * @param key
     * @returns Array [x, y, z, overscaledZ]
     */
    fromKey: (key: string) => number[];
};
export declare const tileFrom: {
    /**
     * Gets the tile's X dimension (left edge) using the lng and zoom
     * @param lng
     * @param zoom
     * @returns tile X dimension
     */
    lng: (lng: number, zoom: number) => number;
    /**
     * Gets the tile's Y (top edge) dimension using the lat and zoom
     * @param lat
     * @param zoom
     * @returns tile Y dimension
     */
    lat: (lat: number, zoom: number) => number;
    /**
     * Gets the tile's X and Y dimension (left edge and top edge) using the lng, lat, and zoom
     * @param lng
     * @param lat
     * @param zoom
     * @returns tile X,Y,Z dimensions
     */
    lngLat: (lng: number, lat: number, zoom: number) => number[];
    /**
     * Gets the tile's X dimension (left edge) using the web mercator X and zoom
     * @param x
     * @param zoom
     * @returns tile X dimension
     */
    wmX: (x: number, zoom: number) => number;
    /**
     * Gets the tile's Y dimension (top) using the web mercator Y and zoom
     * @param y
     * @param zoom
     * @returns tile Y dimension
     */
    wmY: (y: number, zoom: number) => number;
    /**
     * Gets the tile's X,Y dimensions (left, top) using the web mercator X, Y, and zoom
     * @param x
     * @param y
     * @param zoom
     * @returns tile X,Y,Z dimensions
     */
    wmXY: (x: number, y: number, zoom: number) => number[];
};
export declare const tileTo: {
    lng: (x: number, zoom: number) => number;
    lat: (y: number, zoom: number) => number;
    wmX: (x: number, zoom: number) => number;
    wmY: (y: number, zoom: number) => number;
    lngLat: (x: number, y: number, zoom: number) => [number, number];
    wmXY: (x: number, y: number, zoom: number) => [number, number];
};
export declare const projection: {
    /**
      * Converts a webmercator x,y to WGS84 lng,lat
      * @param x
      * @param y
      * @returns LngLngLike
      */
    WebMercatortoWGS84: (x: number, y: number) => {
        lng: number;
        lat: number;
    };
    /**
     * Converts a WGS84 lng,lat to webmercator x,y
     * @param lng
     * @param lat
     * @returns {x: number, y: number}
     */
    WGS84toWebMercator: (lng: number, lat: number) => {
        x: number;
        y: number;
    };
    /**
     * Takes a zoom, returns WebMercator Meters Per Pixel
     * Adapted from: https://github.com/mapbox/postgis-vt-util/blob/master/src/ZRes.sql
     * @param zoom
     * @param tileSize is optional, default is 256 (for 256x256 tiles)
     * @returns number
     */
    metersPerPixel: (zoom: number, tileSize?: number) => number;
};
declare type Position = [number, number];
export declare const coordinatesToCloud: (coordinateList: Position | Position[] | Position[][] | Position[][][]) => Position[];
export declare const reprojectCoordinates: (coordinates: Position | Position[] | Position[][] | Position[][][]) => (Position | Position[] | Position[][] | Position[][][]);
export declare const geojsonvtId: {
    xyzToID: (x: number, y: number, z: number) => number;
    idToXyz: (id: number) => [x: number, y: number, z: number];
};
export {};
