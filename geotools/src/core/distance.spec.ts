import { euclideanDistance, distance } from './distance';

describe('Distances', () => {

    it('euclideanDistance', () => {
        expect(euclideanDistance([0, 0], [3, 4])).toBe(5);
    });

    it('distance', () => {
        // Distance between San Francisco and Los Angeles
        expect(distance([-122.4194, 37.7749], [-118.2437, 34.0522])).toBeCloseTo(559.746922, 3);
        // Distance between New York and Los Angeles
        expect(distance([-74.0060, 40.7128], [-118.2437, 34.0522])).toBeCloseTo(3940.155205, 3);
    });
});
