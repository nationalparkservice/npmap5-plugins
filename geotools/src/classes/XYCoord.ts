import { Position } from "geojson";
import { Coord3857, Coord4326, EPSG, WGS84ToWebMercator, WebMercatorToWGS84 } from "../core/projection";
import { xyzToTile } from "../core/tilemath";

/**
 * Class representing an XY Coordinate.
 */
export class XYCoord {
    x: number;
    y: number;
    lng: number;
    lat: number;

    /**
     * Creates an instance of XYCoord.
     * @param {number} x - The x coordinate or longitude.
     * @param {number} y - The y coordinate or latitude.
     * @param {EPSG} [epsg='3857'] - The EPSG code, either '3857' or '4326'.
     */
    constructor(x: number, y: number, epsg: EPSG = '3857') {
        if (epsg === '3857') {
            this.x = x;
            this.y = y;
            const lngLat = WebMercatorToWGS84(x, y);
            this.lng = lngLat.lng;
            this.lat = lngLat.lat;
        } else if (epsg === '4326') {
            this.lng = x;
            this.lat = y;
            const xy = WGS84ToWebMercator(x, y);
            this.x = xy.x;
            this.y = xy.y;
        } else {
            throw new Error('Only 3857 and 4326 are supported')
        }
    }

    /**
     * Gets the pixel coordinates at a specific zoom level.
     * @param {number} z - The zoom level.
     * @param {number} [tileSize=256] - The size of the tile.
     * @returns {{ x: number, y: number }} - The pixel coordinates.
     */
    pixelAtZoom(z: number, tileSize: number = 256): { x: number; y: number; } {
        const tile = xyzToTile(this.x, this.y, z);
        return {
            'x': tile.x * tileSize,
            'y': tile.y * tileSize
        };
    }

    /**
     * Gets the XY coordinates as an array.
     * @returns {number[]} - The XY coordinates.
     */
    get xyArray(): number[] {
        return [this.x, this.y];
    }

    /**
     * Gets the XY coordinates as an object.
     * @returns {{ x: number, y: number }} - The XY coordinates.
     */
    get xyObject(): Coord3857 {
        return { x: this.x, y: this.y };
    }

    /**
     * Gets the longitude and latitude as an array.
     * @returns {[number, number]} - The longitude and latitude.
     */
    get lngLatArray(): [number, number] {
        return [this.lng, this.lat] as [number, number];
    }

    /**
     * Gets the longitude and latitude as a Position.
     * @returns {Position} - The longitude and latitude.
     */
    get lngLatPosition(): Position {
        return this.lngLatArray as Position;
    }

    /**
     * Gets the longitude and latitude as an object.
     * @returns {{ lng: number, lat: number }} - The longitude and latitude.
     */
    get lngLatObject(): Coord4326 {
        return { lng: this.lng, lat: this.lat };
    }
};
