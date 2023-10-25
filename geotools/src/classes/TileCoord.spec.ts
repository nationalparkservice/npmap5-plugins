import { TileCoord } from "./TileCoord";
import { XYCoord } from "./XYCoord";

describe('TileCoord', () => {
    describe('constructor', () => {
        it('should throw error for out of bounds x', () => {
            expect(() => new TileCoord(-1, 0, 0)).toThrow('x is out of bounds');
            expect(() => new TileCoord(2, 0, 0)).toThrow('x is out of bounds');
        });

        it('should throw error for out of bounds y', () => {
            expect(() => new TileCoord(0, -1, 0)).toThrow('y is out of bounds');
            expect(() => new TileCoord(0, 2, 0)).toThrow('y is out of bounds');
        });

        it('should create TileCoord instance', () => {
            const tileCoord = new TileCoord(0, 0, 0);
            expect(tileCoord).toBeInstanceOf(TileCoord);
            expect(tileCoord.x).toBe(0);
            expect(tileCoord.y).toBe(0);
            expect(tileCoord.z).toBe(0);
        });
    });

    describe('metersPerPixel', () => {
        it('should return correct meters per pixel', () => {
            const tileCoord = new TileCoord(0, 0, 0);
            expect(tileCoord.metersPerPixel).toBe(156543.03392804097);
        });
    });

    describe('children', () => {
        it('should throw error for negative levels', () => {
            const tileCoord = new TileCoord(0, 0, 0);
            expect(() => tileCoord.children(-1)).toThrow('Tile Parent out of range.');
        });

        it('should return correct children', () => {
            const tileCoord = new TileCoord(0, 0, 0);
            const children = tileCoord.children();
            expect(children.length).toBe(4);
            expect(children[0].x).toBe(0);
            expect(children[0].y).toBe(0);
            expect(children[0].z).toBe(1);
            expect(children[3].x).toBe(1);
            expect(children[3].y).toBe(1);
            expect(children[3].z).toBe(1);
        });
    });

    describe('parent', () => {
        it('should throw error for negative levels', () => {
            const tileCoord = new TileCoord(0, 0, 0);
            expect(() => tileCoord.parent(-1)).toThrow('Tile Parent out of range.');
        });

        it('should throw error for levels greater than z', () => {
            const tileCoord = new TileCoord(0, 0, 0);
            expect(() => tileCoord.parent(1)).toThrow('Tile Parent out of range.');
        });

        it('should return correct parent', () => {
            const tileCoord = new TileCoord(48, 100, 8);
            const parent = tileCoord.parent();
            expect(parent.x).toBe(24);
            expect(parent.y).toBe(50);
            expect(parent.z).toBe(7);
        });
    });

    describe('contains', () => {
        it('should contain this point', () => {
            const tileCoord = new TileCoord(13655, 24869, 16);
            expect(tileCoord.contains(new XYCoord(0, 0, '4326'))).toBe(false);
            expect(tileCoord.contains(new XYCoord(-110, 40, '4326'))).toBe(false);
            expect(tileCoord.contains(new XYCoord(-104.9875, 39.750, '4326'))).toBe(true);
        });
    });

    describe('toQuadKey', () => {
        it('should return a quadkey', () => {
            const tileCoord = new TileCoord(179, 361, 10);
            expect(tileCoord.quadKey).toBe('0212312013');
        });
    });

    describe('toTileKey', () => {
        it('should return a tileKey', () => {
            const tileCoord = new TileCoord(1987, 2952, 13);
            expect(tileCoord.tileKey).toBe('eed37dd');
        });
    });
});