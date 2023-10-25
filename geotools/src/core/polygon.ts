import { Position } from "geojson";

/**
 * Determines whether a ring of positions is arranged in a counter-clockwise order.
 * 
 * @param {Position[]} ring - An array of positions, where each position is an array of [longitude, latitude].
 * @returns {boolean} True if the ring is arranged in counter-clockwise order, otherwise false.
 * 
 * @example
 * const ring = [[0, 0], [1, 1], [1, 0]];
 * console.log(isCounterClockwise(ring));
 * // expected output: false
 */
export function isCounterClockwise(ring: Position[]): boolean {
    // source: https://stackoverflow.com/a/18472899/8344891
    return ring.map((point, idx) => {
        const prevPoint = ring[((idx - 1) + ring.length) % ring.length];
        return (prevPoint[0] - point[0]) * (prevPoint[1] + point[1]);
    }).reduce((a, c) => a + c, 0) >= 0;
}

export function pointInRing(testPoint: Position, ring: Position[]): boolean {
    // The function uses the ray-casting algorithm to determine if a point is inside a polygon.
    // testPoint: The point that needs to be tested.
    // ring: An array of points that define the polygon.
    // The function returns a boolean value: true if the point is inside the polygon, false otherwise.

    const contains = ring.map((ringPoint, idx) => {
        const prevRingPoint = ring[((idx - 1) + ring.length) % ring.length];
        return (
            ((ringPoint[1] > testPoint[1]) != (prevRingPoint[1] > testPoint[1])) &&
            (testPoint[0] < (prevRingPoint[0] - ringPoint[0]) * (testPoint[1] - ringPoint[1]) / (prevRingPoint[1] - ringPoint[1]) + ringPoint[0])
        );
    }).reduce((accumulator, current) => current ? !accumulator : accumulator, false);

    return contains;
};

/**
 * Determines whether a point is inside a polygon with holes.
 * This assumes proper winding, if you are unsure, use rewindRings first
 * 
 * @param point - The point to be tested.
 * @param rings - An array of rings where the first ring is the outer boundary and the subsequent rings are holes.
 * @returns {boolean} - Returns true if the point is inside the polygon (and not in any of the holes), false otherwise.
 */
export function pointInPolygon(point: Position, rings: Position[][]): boolean {
    let contains = false;
    let done = false;

    for (let i = 0; i < rings.length && !done; i++) {
        const ccw = isCounterClockwise(rings[i]);

        if (pointInRing(point, rings[i])) {
            if (ccw) {
                // Exterior rings are counterclockwise.
                // The point is in the outer ring.
                contains = true;
            } else {
                // Holes are clockwise.
                // The point is in one of the holes.
                contains = false;
                done = true;
            }
        }
    }

    return contains;
};

/**
 * Rewinds rings of a polygon so that the outer ring is counterclockwise and the holes are clockwise.
 *
 * @param rings - An array of rings (arrays of positions) that represent the polygon and its holes.
 * @returns {Position[][]} - A new array of rings with the exterior ring counterclockwise and the holes clockwise.
 */
export function rewindRings(rings: Position[][]): Position[][] {
    const newRings: Position[][] = [];

    for (let i = 0; i < rings.length; i++) {
        let ccw = true; // Default all rings to be exterior (counterclockwise)
        const ringIsCCW = isCounterClockwise(rings[i]);

        // If the first point of the current ring is inside any of the previous rings, then it's an inside ring (hole).
        for (let j = 0; j < newRings.length && ccw; j++) {
            if (pointInRing(rings[i][0], newRings[j])) {
                ccw = false;
            }
        }

        // If the orientation of the current ring is not the same as the desired orientation, reverse the ring.
        newRings.push(ringIsCCW === ccw ? rings[i] : rings[i].reverse());
    }

    return newRings;
};
