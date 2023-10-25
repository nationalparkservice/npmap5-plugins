import { WGS84ToWebMercator } from './projection';
import { lat2PartialTile, long2PartialTile, lat2tile, long2tile, tile2lat, tile2long, tileCoordFromQuadKey, tileCoordFromTileKey, tilesInBbox, tileToQuadKey, tileToTileKey } from './tilemath';

describe('Tile Coordinate Conversions', () => {
    const zoom = 10;

    test('latitude to partial tile', () => {
        const lat = 52.2296756;
        expect(lat2PartialTile(lat, zoom)).toBeCloseTo(337.178787);
    });

    test('longitude to partial tile', () => {
        const lon = 21.0122287;
        expect(long2PartialTile(lon, zoom)).toBeCloseTo(571.768117);
    });

    test('latitude to tile', () => {
        const lat = 52.2296756;
        expect(lat2tile(lat, zoom)).toBe(337);
    });

    test('longitude to tile', () => {
        const lon = 21.0122287;
        expect(long2tile(lon, zoom)).toBe(571);
    });

    test('tile to latitude', () => {
        const y = 337;
        expect(tile2lat(y, zoom)).toBeCloseTo(52.26815);
    });

    test('tile to longitude', () => {
        const x = 571;
        expect(tile2long(x, zoom)).toBeCloseTo(20.742187);
    });

    test('zoom level 5', () => {
        const lat = 52.2296756;
        const lon = 21.0122287;
        const z = 5;

        expect(lat2PartialTile(lat, z)).toBeCloseTo(10.536837);
        expect(long2PartialTile(lon, z)).toBeCloseTo(17.867753);
        expect(lat2tile(lat, z)).toBe(10);
        expect(long2tile(lon, z)).toBe(17);
        expect(tile2lat(10, z)).toBeCloseTo(55.776573);
        expect(tile2long(17, z)).toBeCloseTo(11.25);
    });

    test('zoom level 15', () => {
        const lat = 52.2296756;
        const lon = 21.0122287;
        const z = 15;

        expect(lat2PartialTile(lat, z)).toBeCloseTo(10789.721189);
        expect(long2PartialTile(lon, z)).toBeCloseTo(18296.579750);
        expect(lat2tile(lat, z)).toBe(10789);
        expect(long2tile(lon, z)).toBe(18296);
        expect(tile2lat(10789, z)).toBeCloseTo(52.229868);
        expect(tile2long(18296, z)).toBeCloseTo(21.005859);
    });
});



describe('Tiles in Bounding Box', () => {
    test('Get tiles in bounding box', () => {
        const northWest = WGS84ToWebMercator(-115, 49);
        const southEast = WGS84ToWebMercator(-110, 30);
        const zoom = 4;
        const tiles = tilesInBbox(northWest, southEast, zoom);

        expect(tiles.map(({ x, y, z }) => [x, y, z])).toEqual([
            [9, 12, 4],
            [10, 12, 4],
            [11, 12, 4],
            [9, 13, 4],
            [10, 13, 4],
            [11, 13, 4],
            [9, 14, 4],
            [10, 14, 4],
            [11, 14, 4]
        ]);
    });
});

describe('TileCoord from QuadKey and Back', () => {
    test('tileToQuadKey', () => {
        expect(tileToQuadKey(1, 1, 1)).toBe('3');
        expect(tileToQuadKey(2, 1, 2)).toBe('12');
    });

    test('Convert QuadKey to TileCoord', () => {
        const quadKey = '1202102332221212';
        const tileCoord = tileCoordFromQuadKey(quadKey);

        expect(tileCoord.x).toBe(35210);
        expect(tileCoord.y).toBe(21493);
        expect(tileCoord.z).toBe(16);
    });

    test('Invalid QuadKey digit sequence', () => {
        const quadKey = '120210233222121x';

        expect(() => tileCoordFromQuadKey(quadKey)).toThrow('Invalid QuadKey digit sequence.');
    });
});


describe('TileCoord from TileKey and Back', () => {
    test('Convert TileKey to TileCoord', () => {
        const tileKey = '2a44';
        const tileCoord = tileCoordFromTileKey(tileKey);

        expect(tileCoord.x).toBe(2);
        expect(tileCoord.y).toBe(5);
        expect(tileCoord.z).toBe(4);
    });

    test('tileToTileKey', () => {
        expect(tileToTileKey(2, 6, 4)).toBe('2q44');
        expect(tileToTileKey(2, 5, 4)).toBe('2a44');
    });
});
