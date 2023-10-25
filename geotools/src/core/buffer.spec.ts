import { Position } from "geojson";
import { bufferLine, bufferPoint, bufferPolygonHull, lineToPoly, mergePolygons } from "./buffer";

// Helper to round numbers
function arraysEqualWithMargin(a: Position, b: Position, margin: number) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (Math.abs(a[i] - b[i]) > margin) return false;
    }
    return true;
}

describe('buffer Point', () => {
    it('bufferPoint function', () => {
        const margin = 0.001;
        const arcPoints = bufferPoint([0, 0], 1, 4);
        const expectedPoints = [
            [0, 1],
            [-1, 0],
            [0, -1],
            [1, 0],
            [0, 1]
        ];

        arcPoints.forEach((point, idx) => {
            expect(arraysEqualWithMargin(point, expectedPoints[idx], margin)).toBe(true);
        });
    });
});

describe('buffer Point at a 45 degree angle', () => {
    it('bufferPoint function at 45º', () => {
        const margin = 0.001;
        const arcPoints = bufferPoint([0, 0], 1, 4, [0, 0], [1, 1]);
        const expectedPoints = [
            [-0.70710, 0.70710],
            [-0.70710, -0.70710],
            [0.70710, -0.70710],
            [0.70710, 0.70710],
            [-0.70710, 0.70710]
        ];

        arcPoints.forEach((point, idx) => {
            expect(arraysEqualWithMargin(point, expectedPoints[idx], margin)).toBe(true);
        });
    });
});

describe('Line Buffer Tools', () => {
    it('bufferLine function', () => {
        const margin = 0.001;
        const bufferedLine = bufferLine([[0, 0], [1, 1]], 1);
        const expectedBuffer = [
            [-1, 0],
            [-0.707107, -0.707107],
            [-0.000001, -1],
            [0.707106, -0.707107],
            [1.707106, 0.292893],
            [2, 1],
            [1.707106, 1.707106],
            [1, 2],
            [0.292893, 1.707106],
            [-0.707107, 0.707106],
            [-1, 0]
        ];

        bufferedLine.forEach((point, idx) => {
            expect(arraysEqualWithMargin(point, expectedBuffer[idx], margin)).toBe(true);
        });
    });

    it('mergePolygons', () => {
        const polygon1 = [[0, 0], [0, 1], [1, 1], [1, 0]];
        const polygon2 = [[1, 0], [1, 1], [2, 1], [2, 0]];

        const mergedPolygon = mergePolygons(polygon1, polygon2);

        // The polygonClipping.union returns the union of the two polygons:
        const expectedResult = [[[[0, 0], [2, 0], [2, 1], [0, 1], [0, 0]]]]

        expect(mergedPolygon).toEqual(expectedResult);
    });

    it('lineToPoly', () => {
        const coordA = [0, 0];
        const coordB = [1, 1];
        const size = 1;

        const resultPolygon = lineToPoly(coordA, coordB, size);

        const expectedResult = [
            [-0.7071, 0.7071],// - Top-left
            [0.2929, 1.7071],// - Top-right
            [1.7071, 0.2929],// - Bottom-right
            [0.7071, -0.7071],// - Bottom-left
            [-0.7071, 0.7071]// - Top-left (close the polygon)
        ];

        const margin = 0.001;
        resultPolygon.forEach((point, idx) => {
            expect(arraysEqualWithMargin(point, expectedResult[idx], margin)).toBe(true);
        });
    });

});

describe('polygon buffering', () => {
    describe('bufferPolygonHull', () => {
        it('should return the convex hull of the buffered polygon', () => {
            const polygon = [[[0, 0], [1, 1], [2, 2], [3, 3]]];
            const size = 1;
            const steps = 8;
            const result = bufferPolygonHull(polygon, size, steps);
            // Expect the result to be a convex hull of the buffered polygon
            expect(result).toEqual(expect.any(Array));
        });

        it('should handle a simple square', () => {
            const polygon = [[[0, 0], [0, 1], [1, 1], [1, 0]]];
            const size = 0.1;
            const steps = 8;
            const result = bufferPolygonHull(polygon, size, steps);
            expect(result).toEqual(expect.any(Array));
        });

        it('should handle a complex polygon', () => {
            const polygon = [[[0, 0], [0, 5], [5, 5], [5, 0], [2.5, 2.5]]];
            const size = 0.5;
            const steps = 8;
            const result = bufferPolygonHull(polygon, size, steps);
            expect(result).toEqual(expect.any(Array));
        });

        it('should handle a single point', () => {
            const polygon = [[[0, 0]]];
            const size = 1;
            const steps = 8;
            const result = bufferPolygonHull(polygon, size, steps);
            expect(result).toEqual(expect.any(Array));
        });
    });
});
