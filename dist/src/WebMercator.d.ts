/**
  * Converts a webmercator x,y to WGS84 lng,lat
  * @param x
  * @param y
  * @returns LngLngLike
  */
export declare function toWGS84(x: number, y: number): {
    lng: number;
    lat: number;
};
/**
 * Converts a WGS84 lng,lat to webmercator x,y
 * @param lng
 * @param lat
 * @returns {x: number, y: number}
 */
export declare function fromWGS84(lng: number, lat: number): {
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
export declare function metersPerPixel(zoom: number, tileSize?: number): number;
