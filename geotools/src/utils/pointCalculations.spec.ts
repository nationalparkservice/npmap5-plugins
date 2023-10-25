import { Feature, Position } from 'geojson';
import { pointBetween, pointInBbox, pointInFeatures } from './pointCalculations';

describe('pointInBbox', () => {
    it('pointInBbox function', () => {
        const testPoint: [number, number] = [1, 1];
        const pointA: [number, number] = [0, 0];
        const pointB: [number, number] = [2, 2];
        expect(pointInBbox(testPoint, pointA, pointB)).toBe(true);

        const testPoint2: [number, number] = [3, 3];
        expect(pointInBbox(testPoint2, pointA, pointB)).toBe(false);
    });
});

describe('pointInFeatures', () => {


    it('pointInFeatures function', () => {
        const testPoint: [number, number] = [1, 1];
        const features: Feature[] = [
            {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]]
                },
                properties: {}
            }
        ];
        const quantizeClicks = 0;

        const result = pointInFeatures(testPoint, features, quantizeClicks);
        expect(result).toBeDefined();
        expect(result.intersectionPoint).toBeDefined();
        expect(result.intersectionPointWGS84).toBeDefined();

    });
});


describe('pointBetween', () => {

    test('pointBetween function', () => {
        const pointA: Position = [0, 0];
        const pointB: Position = [10, 10];
        const testPoint: Position = [5, 7];
        const location: number[] = [0, 0];

        const result = pointBetween(pointA, pointB, testPoint, location);
        expect(result).toBeDefined();
        expect(result.intersectionPoint).toBeDefined();
        expect(result.intersectionPointWGS84).toBeDefined();
    });
});

