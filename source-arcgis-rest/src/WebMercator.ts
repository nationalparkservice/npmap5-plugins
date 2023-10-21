const earthCircumference = 40075016.68557849;

/**
  * Converts a webmercator x,y to WGS84 lng,lat
  * @param x
  * @param y
  * @returns LngLngLike
  */
export function toWGS84(x: number, y: number): { lng: number, lat: number } {
    // Convert the lat lng
    const wgsLng = x * 180 / (earthCircumference / 2);
    // thanks magichim @ github for the correction
    const wgsLat = Math.atan(Math.exp(y * Math.PI / (earthCircumference / 2))) * 360 / Math.PI - 90;
    return { lng: wgsLng, lat: wgsLat };
};

/**
 * Converts a WGS84 lng,lat to webmercator x,y
 * @param lng
 * @param lat
 * @returns {x: number, y: number}
 */
export function fromWGS84(lng: number, lat: number): { x: number, y: number } {
    // Calculate the web mercator X and Y
    // https://gist.github.com/onderaltintas/6649521
    const wmx = lng * (earthCircumference / 2) / 180;
    let wmy = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
    wmy = wmy * (earthCircumference / 2) / 180;
    return { x: wmx, y: wmy }
};

/**
 * Takes a zoom, returns WebMercator Meters Per Pixel
 * Adapted from: https://github.com/mapbox/postgis-vt-util/blob/master/src/ZRes.sql
 * @param zoom
 * @param tileSize is optional, default is 256 (for 256x256 tiles)
 * @returns number
 */

export function metersPerPixel(zoom: number, tileSize: number = 256): number {
    return earthCircumference / (tileSize * (1 << zoom))
}