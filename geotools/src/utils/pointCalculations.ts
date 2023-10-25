import { Feature, Point, Position } from "geojson";
import { euclideanDistance } from "../core/distance";
import { XYCoord } from "../classes/XYCoord";

/**
 * Checks if a given point lies inside a bounding box.
 * 
 * @param testPoint - The point to test, in the format [longitude, latitude].
 * @param pointA - One corner of the bounding box, in the format [longitude, latitude].
 * @param pointB - The opposite corner of the bounding box, in the format [longitude, latitude].
 * 
 * @returns A boolean indicating whether the test point is inside the bounding box.
 * 
 * @example
 * ```
 * const testPoint = [1, 1];
 * const pointA = [0, 0];
 * const pointB = [2, 2];
 * 
 * pointInBbox(testPoint, pointA, pointB);
 * // Returns: true
 * ```
 */
export function pointInBbox(testPoint: [number, number] | Position, pointA: [number, number] | Position, pointB: [number, number] | Position): boolean {
    const [south, north] = pointA[0] < pointB[0] ? [pointA[0], pointB[0]] : [pointB[0], pointA[0]];
    const [west, east] = pointA[1] < pointB[1] ? [pointA[1], pointB[1]] : [pointB[1], pointA[1]];

    return (
        testPoint[0] >= south &&
        testPoint[0] <= north &&
        testPoint[1] >= west &&
        testPoint[1] <= east
    );
};

export type PointInfo = {
    distanceFromLine: number,
    intersectionPoint: Position,
    distanceFromPoint?: number,
    intersectsSegment?: boolean,
    intersectionPointWGS84?: Position,
    pointLocation?: number[]
};

/**
 * Returns the closest point along the path of a GeoJSON geometry to a given test point.
 *
 * @param testPoint - The point to test, in the format [longitude, latitude].
 * @param geometry - A GeoJSON geometry object.
 * @param location - Used to determine where on a GeoJSON object the segment is.
 *
 * @returns The closest point along the path of the geometry to the test point.
 */
export function pointOnPath(testPoint: [number, number], geometry: GeoJSON.Geometry, location: number = 0): PointInfo {

    const pointOnLine = (testPoint: [number, number], line: [number, number][], location: number[]) => {
        let pointsOnLine = line.map((vertex, i) =>
            pointBetween(
                (new XYCoord(...line[i === 0 ? i : i - 1], '4326')).xyArray,
                (new XYCoord(...vertex, '4326')).xyArray,
                (new XYCoord(...testPoint, '4326')).xyArray,
                location.concat([i - 1, i])
            )
        );

        if (pointsOnLine.filter(newPoint => newPoint.intersectsSegment).length === 0) {
            const closestVertex = line.map((vertex, i) => ({
                intersectsSegment: true,
                distanceFromLine: 0,
                distanceFromPoint: euclideanDistance((new XYCoord(...testPoint, '4326')).lngLatPosition, (new XYCoord(...vertex, '4326')).lngLatPosition),
                intersectionPoint: (new XYCoord(...vertex, '4326')).lngLatPosition,
                intersectionPointWGS84: vertex,
                pointLocation: location.concat([i, i])
            } as PointInfo)).reduce((prev: PointInfo, curr) => (prev.distanceFromPoint || prev.distanceFromLine) < (curr.distanceFromPoint || curr.distanceFromLine) ? prev : curr, {} as any);
            pointsOnLine.push(closestVertex);
        }

        let pointOnLine = pointsOnLine.filter(newPoint => newPoint.intersectsSegment)
            .reduce((prev: PointInfo, curr) => (prev.distanceFromPoint || prev.distanceFromLine) < (curr.distanceFromPoint || curr.distanceFromLine) ? prev : curr, {} as any);
        return pointOnLine;
    };

    const bestPoint = (results: PointInfo[]) => {
        return results.filter(result => result).reduce((prev: PointInfo, curr) => (prev.distanceFromPoint || prev.distanceFromLine) < (curr.distanceFromPoint || curr.distanceFromLine) ? prev : curr, {} as any);
    };

    const types = {
        'Point': (testPoint: [number, number], coordinates: [number, number]) => types['MultiPoint'](testPoint, [coordinates]),
        'MultiPoint': (testPoint: [number, number], coordinates: [number, number][]) => bestPoint(coordinates.map(coord => ({
            'distanceFromLine': euclideanDistance((new XYCoord(...coord, '4326')).lngLatPosition, (new XYCoord(...testPoint, '4326')).lngLatPosition),
            'intersectionPoint': coord
        }))),
        'LineString': (testPoint: [number, number], coordinates: [number, number][]) => types['MultiPolygon'](testPoint, [[coordinates]]),
        'MultiLineString': (testPoint: [number, number], coordinates: [number, number][][]) => types['Polygon'](testPoint, coordinates),
        'Polygon': (testPoint: [number, number], coordinates: [number, number][][]) => types['MultiPolygon'](testPoint, [coordinates]),
        'MultiPolygon': (testPoint: [number, number], coordinates: [number, number][][][]) => bestPoint(coordinates.map((coords, i) =>
            bestPoint(coords.map((line, j) => pointOnLine(testPoint, line, [location, i, j])))
        ))
    };

    if (!types.hasOwnProperty(geometry.type as string)) throw new Error('Geometry type "' + geometry.type + '" not supported');

    return types[geometry.type as keyof (typeof types)](testPoint, (geometry as Point).coordinates as any) as PointInfo;
};

/**
 * Finds the best segment in a list of features to which a test point belongs.
 * 
 * @param testPoint - The point to test, in the format [longitude, latitude].
 * @param features - An array of GeoJSON Feature objects.
 * @param quantizeClicks - A number to quantize the clicks, default is 0.
 * 
 * @returns The best segment to which the test point belongs.
 */
export function pointInFeatures(testPoint: [number, number], features: Feature[], quantizeClicks: number = 0): PointInfo {
    let newTestPoint: Position;

    if (quantizeClicks) {
        let pointWebMerc = (new XYCoord(...testPoint, '4326')).lngLatPosition;
        pointWebMerc[0] = Math.floor(pointWebMerc[0] / quantizeClicks) * quantizeClicks;
        pointWebMerc[1] = Math.floor(pointWebMerc[1] / quantizeClicks) * quantizeClicks;
        newTestPoint = (new XYCoord(...pointWebMerc as [number, number], '3857')).lngLatPosition;

    } else {
        newTestPoint = testPoint;
    }

    let nearestPoints = features.map((feature, i) => pointOnPath(newTestPoint as [number, number], feature.geometry, i));
    let bestSegment = nearestPoints.reduce((prev: PointInfo, curr) => (prev.distanceFromPoint || prev.distanceFromLine) < (curr.distanceFromPoint || curr.distanceFromLine) ? prev : curr, {} as any);
    return bestSegment;
};

/**
 * A utility function that interpolates a new point, nearest to the test point, between two given points.
 * 
 * @param pointA - The starting point [x, y] or Position.
 * @param pointB - The ending point [x, y] or Position.
 * @param testPoint - The point to test, in the format [x, y] or Position.
 * @param location - An array of numbers representing the location.
 * 
 * @returns A PointInfo object containing various information about the point.
 */
export function pointBetween(
    pointA: [number, number] | Position,
    pointB: [number, number] | Position,
    testPoint: [number, number] | Position,
    location: number[]): PointInfo {

    // Get slope and intersect for pointA, pointB
    const m = (pointB[1] - pointA[1]) / (pointB[0] - pointA[0]);

    // Get the intersect
    const b = pointA[1] - (m * pointA[0]);

    // Get the perpendicular slope
    const pM = -(1 / m);

    // Get the intersect of the perpendicular line through the testPoint
    const pB = testPoint[1] - (pM * testPoint[0]);

    // Determine where the line pM(x) + pB intersects m(x)+b
    const intersectionX = (b - pB) / (pM - m);
    const intersectionY = (pM * intersectionX) + pB;
    const intersectionPoint: [number, number] = [intersectionX, intersectionY];

    // This uses euclideanDistance because the test point is a mouse click
    const distanceFromLine = euclideanDistance(testPoint, intersectionPoint);
    const intersectsSegment = pointInBbox(testPoint, pointA, pointB);

    return {
        intersectsSegment: intersectsSegment,
        distanceFromLine: distanceFromLine,
        distanceFromPoint: 0,
        intersectionPoint: intersectionPoint,
        intersectionPointWGS84: new XYCoord(...intersectionPoint, '3857').lngLatPosition,
        pointLocation: location
    } as PointInfo;
}
