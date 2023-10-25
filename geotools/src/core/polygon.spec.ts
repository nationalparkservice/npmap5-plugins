import { isCounterClockwise, pointInPolygon, pointInRing, rewindRings } from './polygon';

describe('isCounterClockwise', () => {
    it('should return false for clockwise ring', () => {
        const ring = [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]];
        expect(isCounterClockwise(ring)).toBe(false);
    });

    it('should return true for counter-clockwise ring', () => {
        const ring = [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]];
        expect(isCounterClockwise(ring)).toBe(true);
    });
});

describe('pointInRing', () => {
    test('point inside the polygon', () => {
        const testPoint = [3, 3];
        const ring = [[0, 0], [0, 6], [6, 6], [6, 0]];
        expect(pointInRing(testPoint, ring)).toBe(true);
    });

    test('point outside the polygon', () => {
        const testPoint = [-1, -1];
        const ring = [[0, 0], [0, 6], [6, 6], [6, 0]];
        expect(pointInRing(testPoint, ring)).toBe(false);
    });

    test('point on the polygon edge', () => {
        const testPoint = [0, 3];
        const ring = [[0, 0], [0, 6], [6, 6], [6, 0]];
        expect(pointInRing(testPoint, ring)).toBe(true);
    });
});

describe('pointInPolygon', () => {
    test('point inside the polygon', () => {
        const point = [3, 3];
        const rings = [
            [[0, 0], [6, 0], [6, 6], [0, 6], [0, 0]],
            [[1, 1], [1, 2], [2, 2], [2, 1], [1, 1]]
        ];
        expect(pointInPolygon(point, rings)).toBe(true);
    });

    test('point in the hole of the polygon', () => {
        const point = [1.5, 1.5];
        const rings = [
            [[0, 0], [6, 0], [6, 6], [0, 6], [0, 0]],
            [[1, 1], [1, 2], [2, 2], [2, 1], [1, 1]]
        ];
        expect(pointInPolygon(point, rings)).toBe(false);
    });

    test('point outside the polygon', () => {
        const point = [-1, -1];
        const rings = [
            [[0, 0], [6, 0], [6, 6], [0, 6], [0, 0]],
            [[1, 1], [1, 2], [2, 2], [2, 1], [1, 1]]
        ];
        expect(pointInPolygon(point, rings)).toBe(false);
    });
});

describe('rewindRings', () => {
    test('rings with incorrect orientations', () => {
        const rings = [
            [[0, 0], [0, 6], [6, 6], [6, 0], [0, 0]], // clockwise (should be counterclockwise)
            [[1, 1], [2, 1], [2, 2], [1, 2], [1, 1]]  // counterclockwise (should be clockwise)
        ];
        const expectedRings = [
            [[0, 0], [6, 0], [6, 6], [0, 6], [0, 0]], // counterclockwise
            [[1, 1], [1, 2], [2, 2], [2, 1], [1, 1]]  // clockwise
        ];
        expect(rewindRings(rings)).toEqual(expectedRings);
    });

    test('rings with correct orientations', () => {
        const rings = [
            [[0, 0], [6, 0], [6, 6], [0, 6], [0, 0]], // counterclockwise
            [[1, 1], [1, 2], [2, 2], [2, 1], [1, 1]]  // clockwise
        ];
        const expectedRings = [
            [[0, 0], [6, 0], [6, 6], [0, 6], [0, 0]], // counterclockwise
            [[1, 1], [1, 2], [2, 2], [2, 1], [1, 1]]  // clockwise
        ];
        expect(rewindRings(rings)).toEqual(expectedRings);
    });
});

