import geojsonvt from "geojson-vt";
export declare type GeoJSONVT = {
    options: geojsonvt.Options;
    /**
     * Resulting tiles conform to the JSON equivalent of the vector tile specification.
     * https://github.com/mapbox/vector-tile-spec/
     */
    tiles: Record<number, geojsonvt.Tile>;
    tileCoords: geojsonvt.TileCoords;
    total: number;
    stats: Record<number, number>;
    /**
     * splits features from a parent tile to sub-tiles.
     * @param features
     * @param z z / zoom coordinate of the parent tile
     * @param x x coordinate of the parent tile
     * @param y y coordinate of the parent tile
     * @param cz z / zoom coordinate of the target tile
     * @param cx x coordinate of the target tile
     * @param cy y coordinate of the target tile
     */
    splitTile(features: geojsonvt.Tile, z: number, x: number, y: number, cz: number, cx: number, cy: number): void;
    /**
     * gets a tile based on coordinates
     * @param z z / zoom coordinate (supports both number or string input)
     * @param x x coordinate (supports both number or string input)
     * @param y y coordinate (supports both number or string input)
     */
    getTile(z: number | string, x: number | string, y: number | string): null | geojsonvt.Tile;
};
