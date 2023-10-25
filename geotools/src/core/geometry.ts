import { LineString, MultiLineString, MultiPolygon, Polygon, Position } from "geojson";
import { distance, euclideanDistance } from "./distance";

export type distanceTypes = 'euclidean' | 'haversine';
const distanceFn = (distanceType: distanceTypes) => distanceType === 'haversine' ? distance : euclideanDistance;

/**
 * Computes the angle (in radians) between the line formed by two points and the positive X-axis.
 * 
 * @param positionA - The coordinates of the first point.
 * @param positionB - The coordinates of the second point.
 * @returns The angle in radians.
 * 
 * @example
 * angleBetweenPoints([0, 0], [1, 1]) // returns 0.7853981633974483
 */
export function angleBetweenPoints(positionA: Position, positionB: Position): number {
    return Math.atan2(positionB[1] - positionA[1], positionB[0] - positionA[0]);
}

/**
 * Converts polar coordinates to Cartesian coordinates.
 * Creates a point at the specified distance and angle from a starting point
 *
 * @param {Position} startPosition - The starting position in Cartesian coordinates.
 * @param {number} angle - The angle in radians from the positive x-axis.
 * @param {number} distance - The distance from the starting position.
 * @return {Position} The Cartesian coordinates of the new point.
 */
export function polarToCartesian(startPosition: Position, angle: number, distance: number): Position {
    return [
        Math.cos(angle) * distance + startPosition[0], // x coordinate
        Math.sin(angle) * distance + startPosition[1]  // y coordinate
    ];
}

/**
 * Find the nearest point on a line segment to a given point.
 * 
 * @param {Position} testPoint - The point to which we are finding the nearest point on the line.
 * @param {[Position, Position]} - The line segment.
 * @param {string} [distanceType='euclidean'] - The type of distance calculation ('euclidean' or 'spatial'). Use euclidean with 3857 and Haversine with 4326
 * @returns {Position} The nearest point on the line segment to the test point.
 */
export function nearestPointOnLineSegment(testPoint: Position, [lineStart, lineEnd]: [Position, Position], distanceType: distanceTypes = 'euclidean'): Position {
    const [x0, y0] = testPoint;
    const [x1, y1] = lineStart;
    const [x2, y2] = lineEnd;

    // Handle edge case where line segment is a point
    if (x1 === x2 && y1 === y2) {
        return lineStart;
    }

    // Handle edge case where line segment is vertical
    if (x1 === x2) {
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        if (y0 <= minY) return [x1, minY];
        if (y0 >= maxY) return [x1, maxY];
        return [x1, y0];
    }

    // Handle edge case where line segment is horizontal
    if (y1 === y2) {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        if (x0 <= minX) return [minX, y1];
        if (x0 >= maxX) return [maxX, y1];
        return [x0, y1];
    }

    // Calculate the slope and intercept of the line
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;

    // Calculate the slope and intercept of the perpendicular line through the test point
    const pM = -1 / m;
    const pB = y0 - pM * x0;

    // Calculate the intersection of the two lines
    const intersectionX = (b - pB) / (pM - m);
    const intersectionY = m * intersectionX + b;
    const intersectionPoint = [intersectionX, intersectionY].map(pt => Object.is(pt, -0) ? 0 : pt); // Remove the -0 because there's no need for it

    // Check if the intersection point is within the line segment
    const withinSegment =
        intersectionX >= Math.min(x1, x2) && intersectionX <= Math.max(x1, x2) &&
        intersectionY >= Math.min(y1, y2) && intersectionY <= Math.max(y1, y2);

    // If the intersection point is not within the segment,
    // the nearest point is either the start or end of the segment
    if (withinSegment) {
        return intersectionPoint;
    } else {
        const distToStart = distanceFn(distanceType)(testPoint, lineStart);
        const distToEnd = distanceFn(distanceType)(testPoint, lineEnd);
        return distToStart < distToEnd ? lineStart : lineEnd;
    }
};

export function normalizeToMulti(coords: Position[] | Position[][] | Position[][][]): Position[][][] {
    if (Array.isArray(coords[0][0])) { // check if coords is Position[][] or Position[][][]
        if (Array.isArray(coords[0][0][0])) { // check if coords is Position[][][]
            return coords as Position[][][];
        } else {
            // convert Position[][] to Position[][][]
            return (coords as Position[][]).map(coord => [coord]);
        }
    } else {
        // convert Position[] to Position[][][]
        return [[coords as Position[]]];
    }
}

const nearestPointOnLine = (testPoint: Position, coords: (Position | undefined)[], distanceType: distanceTypes): {
    closestPoint: Position,
    segment: [Position, Position],
    segmentIdx: number
} | undefined => {
    // Remove undefines
    const filteredCoords = coords.filter(coords => coords !== undefined) as Position[];
    if (filteredCoords === undefined || coords.length === 0) {
        // Blank Coord
        return undefined;
    } else if (filteredCoords.length === 1) {
        //If there's only one coordinate, then that's clearly the closest point
        return {
            closestPoint: filteredCoords[0],
            segment: [filteredCoords[0], filteredCoords[0]],
            segmentIdx: 0
        };
    } else {
        // Looks through the multiple lines and determines which one is the closest to the testPoint
        let minDistance = Infinity;
        let closestPoint = filteredCoords[0];
        let segment: [Position, Position] = [closestPoint, closestPoint];
        let segmentIdx = 0;
        for (let i = 1; i < filteredCoords.length; i++) {
            const prevCoord = filteredCoords[i - 1];
            const coord = filteredCoords[i];
            const closestSegementPoint = nearestPointOnLineSegment(testPoint, [prevCoord, coord || prevCoord], distanceType);
            const distanceToClosestSegementPoint = distanceFn(distanceType)(testPoint, closestSegementPoint);
            if (minDistance < distanceToClosestSegementPoint) {
                minDistance = distanceToClosestSegementPoint;
                closestPoint = closestSegementPoint;
                segment = [prevCoord, coord];
                segmentIdx = i;
            }
        }
        return {
            closestPoint,
            segment,
            segmentIdx
        }
    }
};

export function nearestPointOnFeature(testPoint: Position, coords: Position[] | Position[][] | Position[][][], distanceType: distanceTypes = 'euclidean'): Position | undefined {
    const fullCoords = normalizeToMulti(coords);
    return nearestPointOnLine(testPoint, fullCoords
        .map(coordGroupA => nearestPointOnLine(testPoint, coordGroupA
            .map(coordGroupB => nearestPointOnLine(testPoint, coordGroupB, distanceType)?.closestPoint
            ), distanceType)?.closestPoint
        ), distanceType)?.closestPoint;
}

export function lineLength(coords: Position[] | Position[][] | Position[][][], distanceType: distanceTypes = 'euclidean'): number {
    const fullCoords = normalizeToMulti(coords);
    return fullCoords
        .map(groupA => groupA
            .map(lineCoords => {
                let sum = 0;
                for (let i = 1; i < lineCoords.length; i++) {
                    const prevCoord = lineCoords[i - 1];
                    const coord = lineCoords[i];
                    sum += distanceFn(distanceType)(prevCoord, coord || prevCoord);
                }
                return sum;
            })
            .reduce((acc, curr) => acc + curr, 0)
        ).reduce((acc, curr) => acc + curr, 0);
};

/**
 * Converts MultiLineString features to LineString features
 * Basically just puts them all into separate features with the same feature.properties
 * @param {GeoJSON.Feature[]} features - array of GeoJSON features
 * @return {GeoJSON.Feature[]} - array of LineString GeoJSON features
 */
export function convertMultiLineStringToLineString(features: GeoJSON.Feature[]): GeoJSON.Feature[] {
    const lineStringFeatures: GeoJSON.Feature[] = features
        .filter(feature => feature.geometry.type === 'LineString');

    const multiLineStringFeatures: GeoJSON.Feature[] = features
        .filter(feature => feature.geometry.type === 'MultiLineString');

    const convertedFeatures: GeoJSON.Feature[] = multiLineStringFeatures
        .flatMap(feature => {
            const coordinates: Position[][] = (feature.geometry as MultiLineString).coordinates;
            return coordinates.map(coord => {
                return {
                    'type': 'Feature',
                    'properties': feature.properties,
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': coord
                    }
                };
            });
        });

    return [...lineStringFeatures, ...convertedFeatures];
};

export function splitFeaturesAtPoint(testPoint: Position, features: GeoJSON.Feature<LineString | MultiLineString | Polygon | MultiPolygon>[], distanceType: distanceTypes = 'euclidean') {
    // Looks through the [features] and finds the best place to add [testPoint]
    // It then adds the closest point on the line to the geometry
    // (it creates a new point, it doesn't use one of the existing nodes, unless that node is actually the closest place on the line to the point)
    const nearestFeatureInfo = features.map((feature, featureIdx) => {
        let distance = Infinity;
        const nearestPoint = nearestPointOnFeature(testPoint, feature.geometry.coordinates, distanceType);
        if (nearestPoint) {
            distance = distanceFn(distanceType)(testPoint, nearestPoint);
            console.log(distanceType, testPoint, nearestPoint, distanceFn(distanceType)(testPoint, nearestPoint));

        };

        return {
            distance,
            nearestPoint,
            featureIdx,
            testPoint
        }
    }).reduce((acc, curr) => acc.distance < curr.distance ? acc : curr, {
        distance: Infinity
    });
    console.log(nearestFeatureInfo);

};