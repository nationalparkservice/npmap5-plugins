import { Coord3857, earthCircumference } from "./projection";

export type TileAddress = { x: number, y: number, z: number };

/**
 * Convert latitude to partial tile number at a specific zoom level.
 *
 * @param lat - Latitude in degrees.
 * @param zoom - Zoom level.
 * @returns {number} - The partial tile number.
 */
export function lat2PartialTile(lat: number, zoom: number): number {
    return (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom);
};

/**
 * Convert longitude to partial tile number at a specific zoom level.
 *
 * @param lon - Longitude in degrees.
 * @param zoom - Zoom level.
 * @returns {number} - The partial tile number.
 */
export function long2PartialTile(lon: number, zoom: number): number {
    return (lon + 180) / 360 * Math.pow(2, zoom);
};

/**
 * Convert latitude to tile number at a specific zoom level.
 *
 * @param lat - Latitude in degrees.
 * @param zoom - Zoom level.
 * @returns {number} - The tile number.
 */
export function lat2tile(lat: number, zoom: number): number {
    return Math.floor(lat2PartialTile(lat, zoom));
};

/**
 * Convert longitude to tile number at a specific zoom level.
 *
 * @param lon - Longitude in degrees.
 * @param zoom - Zoom level.
 * @returns {number} - The tile number.
 */
export function long2tile(lon: number, zoom: number): number {
    return Math.floor(long2PartialTile(lon, zoom));
};

/**
 * Convert tile number to latitude at a specific zoom level.
 *
 * @param y - The tile number.
 * @param z - Zoom level.
 * @returns {number} - Latitude in degrees.
 */
export function tile2lat(y: number, z: number): number {
    const n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
    return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
};

/**
 * Convert tile number to longitude at a specific zoom level.
 *
 * @param x - The tile number.
 * @param z - Zoom level.
 * @returns {number} - Longitude in degrees.
 */
export function tile2long(x: number, z: number): number {
    return (x / Math.pow(2, z) * 360 - 180);
};

export function xyzToTile(x: number, y: number, z: number): TileAddress {
    return {
        x: (x / earthCircumference + 0.5) * (1 << z),
        y: ((y * -1) / earthCircumference + 0.5) * (1 << z),
        z
    };
};

export function tileTopLeft(x: number, y: number, z: number): Coord3857 {
    return {
        x: (x / (1 << z) - 0.5) * earthCircumference,
        y: (y / (1 << z) - 0.5) * earthCircumference * -1
    };
}

/**
 * Convert a QuadKey to a tile coordinate.
 * 
 * @param {string} quadKey - The QuadKey.
 * @returns TileAddress - The tile coordinate.
 */
export const tileCoordFromQuadKey = (quadKey: string): TileAddress => {
    let x = 0;
    let y = 0;
    const z = quadKey.length;

    for (let i = z; i > 0; i--) {
        const mask = 1 << (i - 1);
        switch (quadKey[z - i]) {
            case '0':
                break;

            case '1':
                x |= mask;
                break;

            case '2':
                y |= mask;
                break;

            case '3':
                x |= mask;
                y |= mask;
                break;

            default:
                throw new Error("Invalid QuadKey digit sequence.");
        }
    }

    return { x, y, z };
};



/**
 * Get the tiles within a bounding box at a specified zoom level.
 * 
 * @param {BoundingBox} bbox - The bounding box.
 * @param {number} zoom - The zoom level.
 * @returns {TileAddress[]} - An array of tile coordinates.
 */
export function tilesInBbox({ x: west, y: north }: Coord3857, { x: east, y: south }: Coord3857, zoom: number): Array<TileAddress> {
    const northWestTile = xyzToTile(north, west, zoom);
    const southEastTile = xyzToTile(south, east, zoom);

    let tiles: Array<TileAddress> = [];
    // Iterate over the tiles within the bounding box and add them to the tiles array
    for (let yTile = Math.floor(southEastTile.y); yTile <= Math.ceil(northWestTile.y); yTile++) {
        for (let xTile = Math.floor(southEastTile.x); xTile <= Math.ceil(northWestTile.x); xTile++) {
            tiles.push({ x: xTile, y: yTile, z: zoom });
        }
    }

    return tiles;
};

/**
 * Convert tile coordinates to a quad key.
 * @param x - The x coordinate of the tile.
 * @param y - The y coordinate of the tile.
 * @param z - The zoom level of the tile.
 * @returns A string representing the quad key of the tile.
 */
export function tileToQuadKey(x: number, y: number, z: number): string {
    // Create an array of length z and map each element to a digit.
    return Array.from({ length: z }, (_, idx) => {
        const i = z - idx;
        const mask = 1 << (i - 1);
        let digit = 0;
        // Update digit based on the bits of x and y.
        digit += (x & mask) != 0 ? 1 : 0;
        digit += (y & mask) != 0 ? 2 : 0;
        return digit;
    }).join('');
}

/**
 * Convert tile coordinates to a tile key.
 * @param x - The x coordinate of the tile.
 * @param y - The y coordinate of the tile.
 * @param z - The zoom level of the tile.
 * @returns A string representing the tile key of the tile.
 */
export function tileToTileKey(x: number, y: number, z: number): string {
    const dim = 1 << z;
    // Compute the key by encoding x, y, and z into a single string.
    return (dim * y + x).toString(36) + z.toString(36) + z.toString(36);
}

/**
 * Convert a TileKey to a tile coordinate.
 * 
 * @param {string} key - The TileKey.
 * @returns TileAddress - The tile coordinate.
 */
export function tileCoordFromTileKey(key: string): TileAddress {
    const z = parseInt(key.slice(-1), 36);
    const xy = parseInt(key.slice(0, -2), 36);
    const dim = 1 << z;
    const y = Math.floor(xy / dim);
    const x = xy % dim;
    return { x, y, z };
};