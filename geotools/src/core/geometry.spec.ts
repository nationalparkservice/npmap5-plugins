import { angleBetweenPoints, nearestPointOnLineSegment, polarToCartesian } from "./geometry";

describe('angleBetweenPoints function', () => {
    it('various angeles', () => {
        expect(angleBetweenPoints([0, 0], [1, 0])).toBeCloseTo(0); // 0 degrees
        expect(angleBetweenPoints([0, 0], [1, 1])).toBeCloseTo(Math.PI / 4); // 45 degrees
        expect(angleBetweenPoints([0, 0], [0, 1])).toBeCloseTo(Math.PI / 2); // 90 degrees
        expect(angleBetweenPoints([0, 0], [-1, 1])).toBeCloseTo(3 * Math.PI / 4); // 135 degrees
        expect(angleBetweenPoints([0, 0], [-1, 0])).toBeCloseTo(Math.PI); // 180 degrees
        expect(angleBetweenPoints([0, 0], [-1, -1])).toBeCloseTo(-3 * Math.PI / 4); // -135 degrees
        expect(angleBetweenPoints([0, 0], [0, -1])).toBeCloseTo(-Math.PI / 2); // -90 degrees
        expect(angleBetweenPoints([0, 0], [1, -1])).toBeCloseTo(-Math.PI / 4); // -45 degrees
    });
});

describe('polarToCartesian function', () => {
    test('various points', () => {
        const result1 = polarToCartesian([0, 0], 0, 1);
        expect(result1[0]).toBeCloseTo(1, 5);
        expect(result1[1]).toBeCloseTo(0, 5);

        const result2 = polarToCartesian([0, 0], Math.PI / 2, 1);
        expect(result2[0]).toBeCloseTo(0, 5);
        expect(result2[1]).toBeCloseTo(1, 5);

        const result3 = polarToCartesian([1, 1], Math.PI, 1);
        expect(result3[0]).toBeCloseTo(0, 5);
        expect(result3[1]).toBeCloseTo(1, 5);

        const result4 = polarToCartesian([0, 0], Math.PI, 1);
        expect(result4[0]).toBeCloseTo(-1, 5);
        expect(result4[1]).toBeCloseTo(0, 5);

        const result5 = polarToCartesian([0, 0], 3 * Math.PI / 2, 1);
        expect(result5[0]).toBeCloseTo(0, 5);
        expect(result5[1]).toBeCloseTo(-1, 5);

        const result6 = polarToCartesian([1, 1], 0, Math.sqrt(2));
        expect(result6[0]).toBeCloseTo(1 + Math.sqrt(2), 5);
        expect(result6[1]).toBeCloseTo(1, 5);

    });
});

describe('nearestPointOnLineSegment function', () => {
    it('should return the intersection point if it is within the segment', () => {
        const testPoint = [3, 4];
        const lineStart = [1, 1];
        const lineEnd = [5, 5];
        const expected = [3.5, 3.5];
        const result = nearestPointOnLineSegment(testPoint, [lineStart, lineEnd]);
        expect(result).toEqual(expected);
    });

    it('should return the line start if it is the nearest point', () => {
        const testPoint = [0, 0];
        const lineStart = [1, 1];
        const lineEnd = [5, 5];
        const expected = [1, 1];
        const result = nearestPointOnLineSegment(testPoint, [lineStart, lineEnd]);
        expect(result).toEqual(expected);
    });

    it('should return the line end if it is the nearest point', () => {
        const testPoint = [10, 10];
        const lineStart = [1, 1];
        const lineEnd = [5, 5];
        const expected = [5, 5];
        const result = nearestPointOnLineSegment(testPoint, [lineStart, lineEnd]);
        expect(result).toEqual(expected);
    });

    it('should handle vertical lines', () => {
        const testPoint = [3, 3];
        const lineStart = [2, 1];
        const lineEnd = [2, 5];
        const expected = [2, 3];
        const result = nearestPointOnLineSegment(testPoint, [lineStart, lineEnd]);
        expect(result).toEqual(expected);
    });

    it('should handle horizontal lines', () => {
        const testPoint = [3, 3];
        const lineStart = [1, 2];
        const lineEnd = [5, 2];
        const expected = [3, 2];
        const result = nearestPointOnLineSegment(testPoint, [lineStart, lineEnd]);
        expect(result).toEqual(expected);
    });
});
