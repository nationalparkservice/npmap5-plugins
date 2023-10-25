import { earthCircumference } from "../core/projection";
import { tileToQuadKey, tileToTileKey, tileTopLeft } from "../core/tilemath";
import { XYCoord } from "./XYCoord";

export type tileCoordOptions = {
    'tileSize'?: number
}

export class TileCoord {
    x: number;
    y: number;
    z: number;
    tileSize: number;
    northWest: XYCoord;
    southEast: XYCoord;
    center: XYCoord;

    /**
     * Creates a new tile coordinate.
     * 
     * @param {number} x - The x coordinate.
     * @param {number} y - The y coordinate.
     * @param {number} z - The zoom level.
     * @param {tileCoordOptions} [options] - Optional parameters for the tile coordinate.
     */
    constructor(x: number, y: number, z: number, options?: tileCoordOptions) {
        if (x < 0 || x > 1 << z) {
            throw new Error('x is out of bounds');
        }
        if (y < 0 || y > 1 << z) {
            throw new Error('y is out of bounds');
        }
        this.x = x;
        this.y = y;
        this.z = z;
        this.tileSize = options?.tileSize || 256;
        this.northWest = TileCoord.tileXY(this.x, this.y, this.z);
        this.southEast = TileCoord.tileXY(this.x + 1, this.y + 1, this.z);
        this.center = TileCoord.tileXY(this.x + 0.5, this.y + 0.5, this.z);
    }

    /**
     * Converts tile coordinates to an XY coordinate.
     * 
     * @param {number} x - The x coordinate.
     * @param {number} y - The y coordinate.
     * @param {number} z - The zoom level.
     * @returns {XYCoord} - The XY coordinate.
     */
    static tileXY(x: number, y: number, z: number): XYCoord {
        const topLeft = tileTopLeft(x, y, z);
        return new XYCoord(
            topLeft.x,
            topLeft.y,
            '3857'
        );
    }

    /**
     * Gets the size of each pixel in meters at the current zoom level.
     * 
     * @returns {number} - The size of each pixel in meters.
     */
    get metersPerPixel(): number {
        return earthCircumference / (this.tileSize * Math.pow(2, this.z));
    }

    /**
     * Gets the children of the current tile at a specified number of zoom levels deeper.
     * 
     * @param {number} [levels=1] - The number of zoom levels deeper to get the children for.
     * @returns {TileCoord[]} - An array of tile coordinates.
     */
    children(levels: number = 1): TileCoord[] {
        if (levels < 0) throw new Error("Tile Parent out of range.");
        const newSize = 1 << levels;
        return new Array(newSize * newSize).fill(undefined).map((_, idx) => {
            const xOffset = idx % (newSize);
            const yOffset = Math.floor(idx / (newSize));
            return new TileCoord(
                this.x * (newSize) + xOffset,
                this.y * (newSize) + yOffset,
                this.z + levels,
                {
                    'tileSize': this.tileSize
                }
            );
        });
    }

    /**
     * Gets the parent of the current tile at a specified number of zoom levels higher.
     * 
     * @param {number} [levels=1] - The number of zoom levels higher to get the parent for.
     * @returns {TileCoord} - The parent tile coordinate.
     */
    parent(levels: number = 1): TileCoord {
        if (levels < 0 || levels > this.z) throw new Error("Tile Parent out of range.")
        const zoomDiffMultiplier = Math.pow(2, (levels * -1));
        return new TileCoord(
            Math.floor(this.x * zoomDiffMultiplier),
            Math.floor(this.y * zoomDiffMultiplier),
            this.z - levels,
            {
                'tileSize': this.tileSize
            }
        );
    };

    /**
     * Checks if a given XY coordinate is contained within the current tile.
     * 
     * @param {XYCoord} coord - The XY coordinate.
     * @returns {boolean} - True if the coordinate is contained within the tile, false otherwise.
     */
    contains(coord: XYCoord): boolean {
        const tileAddress = coord.pixelAtZoom(this.z, 1);
        return (Math.floor(tileAddress.x) === this.x) &&
            (Math.floor(tileAddress.y) === this.y)
    }

    /**
     * Converts the current tile coordinate to a quadkey.
     * 
     * @returns {string} - The quadkey.
     */
    get quadKey(): string {
        return tileToQuadKey(this.x, this.y, this.z);
    }

    /**
     * Converts the current tile coordinate to a tileKey.
     * 
     * @returns {string} - The toTileKey.
     */
    get tileKey(): string {
        return tileToTileKey(this.x, this.y, this.z);
    }
};