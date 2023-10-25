/**
 * The circumference of the Earth in meters.
 */
export const earthCircumference = 40075016.68557849;
export type Coord3857 = { x: number, y: number };
export type Coord4326 = { lng: number, lat: number };

/**
 * Converts Web Mercator coordinates to WGS 84 coordinates.
 *
 * @param x - The x coordinate in Web Mercator.
 * @param y - The y coordinate in Web Mercator.
 * @returns The equivalent WGS 84 coordinates.
 */
export function WebMercatorToWGS84(x: number, y: number): Coord4326 {
    // Convert the lat lng
    const wgsLng = x * 180 / (earthCircumference / 2);
    // thanks magichim @ github for the correction
    const wgsLat = Math.atan(Math.exp(y * Math.PI / (earthCircumference / 2))) * 360 / Math.PI - 90;
    return { lng: wgsLng, lat: wgsLat };
};

/**
 * Converts WGS 84 coordinates to Web Mercator coordinates.
 *
 * @param lng - The longitude in WGS 84.
 * @param lat - The latitude in WGS 84.
 * @returns The equivalent Web Mercator coordinates.
 */
export function WGS84ToWebMercator(lng: number, lat: number): Coord3857 {
    // Calculate the web mercator X and Y
    // https://gist.github.com/onderaltintas/6649521
    const wmx = lng * (earthCircumference / 2) / 180;
    let wmy = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
    wmy = wmy * (earthCircumference / 2) / 180;
    return { x: wmx, y: wmy };
};

/**
 * Converts pixels to meters for a given zoom level and tile size.
 * 
 * @param pixels - The distance in pixels.
 * @param zoomLevel - The zoom level of the map.
 * @param tileSize - The size of a tile in pixels. Default is 256.
 * 
 * @returns The distance in meters.
 */
export function pixelsToMeters(pixels: number, zoomLevel: number, tileSize = 256): number {
    const resolution = earthCircumference / tileSize * Math.pow(2, -zoomLevel);
    return pixels * resolution;
};

/**
 * Converts meters to pixels for a given zoom level and tile size.
 * 
 * @param meters3857 - The distance in meters.
 * @param zoomLevel - The zoom level of the map.
 * @param tileSize - The size of a tile in pixels. Default is 256.
 * 
 * @returns The distance in pixels.
 */
export function metersToPixels(meters3857: number, zoomLevel: number, tileSize = 256): number {
    const resolution = earthCircumference / tileSize * Math.pow(2, -zoomLevel);
    return meters3857 / resolution;
};


export type EPSG = ('3857' | '4326');
