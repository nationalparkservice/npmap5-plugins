import { Position } from "geojson";
import { angleBetweenPoints, polarToCartesian } from "./geometry";
import { Geom, union } from "polygon-clipping";

/**
 * Generates a set of points forming a clockwise arc around a central point.
 *
 * @param distance - The distance of each point from the central point.
 * @param steps - The number of points to generate. Default is 8.
 * @param prevPosition - The previous point [x, y]. If undefined, `position` is used.
 * @param nextPosition - The next point [x, y]. If undefined, `position` is used.
 * @returns An array of points forming a clockwise arc.
 *
 * @example
 * const arcPoints = bufferPoint(10, 8, [0, 0]);
 */
export function bufferPoint(
    position: Position,
    size: number,
    steps: number = 8,
    prevPosition?: Position,
    nextPosition?: Position
): Position[] {
    // Determine a "plane" based on the line between the prev point and the next.
    // If either prev or next is undefined, use the current.
    // That means if both are undefined, it'll treat the position as a point.
    const plane = angleBetweenPoints(prevPosition || position, nextPosition || position);
    const stepSize = (2 / steps) * Math.PI;
    const points = new Array(steps + 1).fill(0).map((_, idx) => {
        const ptAngle = (plane + (stepSize * (idx + 1))) % (2 * Math.PI);
        //console.log('pts', plane, stepSize, ptAngle, polarToCartesian(position, ptAngle, size));
        return polarToCartesian(position, ptAngle, size);
    });
    return points;
}

/**
 * Generates a buffer around a line represented by an array of points.
 *
 * @param line - An array of points representing the line.
 * @param size - The buffer size.
 * @param steps - The number of points to generate for each buffer circle. Default is 8.
 * @returns An array of points representing the buffered line.
 *
 * @example
 * const bufferedLine = bufferLine([[0, 0], [1, 1]], 1);
 */
export const bufferLine = (line: Position[], size: number, steps = 8): Position[] => {
    // Draw circle around each point in line
    const circles = line.map((coord, idx) => bufferPoint(coord, size, steps, coord, line[idx + 1]));
    // Draw a rectangle around each point pair (drop the last one)
    const rectangles = line.slice(0, -1).map((coord, idx) => lineToPoly(coord, line[idx + 1] || coord, size));
    return mergePolygons(...rectangles, ...circles)[0][0];
};

/**
 * Buffers a polygon (expands it by a certain distance) and then computes the convex hull of the buffered polygon.
 * 
 * @param polygon - The polygon to buffer and compute the convex hull of.
 * @param size - The distance by which to buffer the polygon.
 * @param steps - The number of points to generate for the buffered circle around each point on the hull of the polygon.
 * @returns The convex hull of the buffered polygon.
 */
export function bufferPolygonHull(polygon: Position[][] | Position[][][], size: number, steps = 8): Position[] {
    // Dump all the points in the polygon into a large list
    const points = flattenCoordinates(polygon);

    // Get the outermost points (convex hull) of the polygon
    const unbufferedHull = convexHull(points);

    // Buffer every point on the outer hull by generating a circle of points around each point on the hull
    const bufferedCircles = unbufferedHull.map((point, idx, a) => {
        const prevPoint = a[idx - 1 < 0 ? a.length - 1 : idx - 1];
        const nextPoint = a[(idx + 1) % a.length];
        return bufferPoint(point, size, steps, prevPoint, nextPoint);
    });

    // Flatten the circles, and compute the convex hull of the buffered area
    return convexHull(flattenCoordinates(bufferedCircles));
}


function flattenCoordinates(coordinates: Position[] | Position[][] | Position[][][]): Position[] {
    const flattened: Position[] = [];
    for (const element of coordinates as any) {
        if (Array.isArray(element[0])) {
            if (Array.isArray(element[0][0])) {
                // If element is a 3D array, concatenate its 2D arrays into the flattened array
                for (const subElement of element) {
                    flattened.push(...subElement);
                }
            } else {
                // If element is a 2D array, push its elements into the flattened array
                flattened.push(...element);
            }
        } else {
            // If element is a 1D array, push it into the flattened array
            flattened.push(element);
        }
    }
    return flattened;
}

/**
 * Constructs the convex hull of a set of points.
 * Basically give it a bunch of points and it'll draw a line around all of them
 * 
 * @param positions - An array of positions for which to construct the convex hull.
 * 
 * @returns The convex hull of the input points.
 */
export function convexHull(positions: Position[]): Position[] {
    // Clone the input array to avoid mutating it and convert it to XY
    const newPoints = positions.slice();

    // Sort the points using a predefined comparator
    newPoints.sort(pointComparator);

    // Construct and return the convex hull of the sorted points
    return makeHullPresorted(newPoints);
};

/**
 * Converts a line segment defined by two endpoints into a polygon by adding a buffer of a specified size around the line.
 * 
 * @param coordA - The starting position of the line segment.
 * @param coordB - The ending position of the line segment.
 * @param size - The size of the buffer to add around the line.
 * 
 * @returns An array of positions representing the vertices of the polygon.
 */
export function lineToPoly(coordA: Position, coordB: Position, size: number): Position[] {
    // Compute the angle between the two points
    const slope = angleBetweenPoints(coordA, coordB);

    // Compute the angle perpendicular to the line segment
    const perpendicular = (slope + (Math.PI / 2)) % (2 * Math.PI);
    const oppositePerpendicular = (slope - (Math.PI / 2)) % (2 * Math.PI);  // Opposite direction

    // Construct the polygon directly
    const polygon: Array<Position> = [
        [ // Top Left
            coordA[0] + (size * Math.cos(perpendicular)),
            coordA[1] + (size * Math.sin(perpendicular)),
        ],
        [ // Top Right
            coordB[0] + (size * Math.cos(perpendicular)),
            coordB[1] + (size * Math.sin(perpendicular)),
        ],
        [ // Bottom Right
            coordB[0] + (size * Math.cos(oppositePerpendicular)),
            coordB[1] + (size * Math.sin(oppositePerpendicular)),
        ],
        [ // Bottom Left
            coordA[0] + (size * Math.cos(oppositePerpendicular)),
            coordA[1] + (size * Math.sin(oppositePerpendicular)),
        ]
    ];

    return [...polygon, polygon[0]];  // Close the polygon by repeating the first vertex at the end
};



/**
 * Merges multiple polygons into a single polygon.
 * 
 * @param polygons - An array of polygons, each represented as an array of positions.
 * 
 * @returns A single polygon resulting from the union of all input polygons.
 */
export function mergePolygons(...polygons: Position[][]): Position[][][] {
    // Transform each polygon into a Geom object
    const multiplier = 1000000;
    const geoms = polygons.map(polygon =>
        [[polygon.map(coords => [
            Math.round(coords[0] * multiplier),
            Math.round(coords[1] * multiplier)
        ])]] as Geom
    );

    // Extract the first geometry
    const firstGeom = geoms.shift();
    // If there's no geom, just return blank
    if (!firstGeom) return [[[]]];

    // Merge all geometries into a single one using polygonClipping.union

    // There is a floating point error with the polygon clipping library
    // https://github.com/mfogel/polygon-clipping/issues/91
    // The multiplier is used as a work around for that issue
    const multi = union(firstGeom, ...geoms);
    return multi.map(polygon => polygon.map(ring => ring.map(coords => [coords[0] / multiplier, coords[1] / multiplier])));
};

/**
 * Computes the convex hull of a set of points using Andrew's monotone chain algorithm.
 * @link https://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain
 * Assumes that the input array of points is already sorted in non-decreasing order.
 * Runs in O(n) time.
 * 
 * @param points - An array of points represented as [x, y] where each point is pre-sorted in non-decreasing order.
 * @returns An array of points representing the convex hull.
 * 
 * @example
 * const points: Position[] = [[0, 0], [1, 1], [2, 2], [3, 1], [3, 3]];
 * const hull = makeHullPresorted(points);
 * console.log(hull); // [[0, 0], [3, 1], [3, 3], [0, 0]]
 */
export function makeHullPresorted(points: Position[]): Position[] {
    if (points.length <= 1)
        return points.slice();

    let upperHull: Position[] = [];
    for (const [x, y] of points) {
        while (upperHull.length >= 2) {
            const [qx, qy] = upperHull[upperHull.length - 1];
            const [rx, ry] = upperHull[upperHull.length - 2];
            if ((qx - rx) * (y - ry) >= (qy - ry) * (x - rx))
                upperHull.pop();
            else
                break;
        }
        upperHull.push([x, y]);
    }
    upperHull.pop();

    let lowerHull: Position[] = [];
    for (let i = points.length - 1; i >= 0; i--) {
        const [x, y] = points[i];
        while (lowerHull.length >= 2) {
            const [qx, qy] = lowerHull[lowerHull.length - 1];
            const [rx, ry] = lowerHull[lowerHull.length - 2];
            if ((qx - rx) * (y - ry) >= (qy - ry) * (x - rx))
                lowerHull.pop();
            else
                break;
        }
        lowerHull.push([x, y]);
    }
    lowerHull.pop();

    if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0][0] === lowerHull[0][0] && upperHull[0][1] === lowerHull[0][1])
        return upperHull;
    else
        return [...upperHull, ...lowerHull];
};


/**
 * Compares two points based on their x and y coordinates (Position).
 *
 * @param a - The first point.
 * @param b - The second point.
 *
 * @returns A negative number if 'a' should appear before 'b' in a sorted array,
 *          a positive number if 'a' should appear after 'b', and 0 if 'a' and 'b' are equivalent.
 */
export function pointComparator([ax, ay]: Position, [bx, by]: Position): -1 | 0 | 1 {
    if (ax < bx) return -1;
    if (ax > bx) return 1;
    if (ay < by) return -1;
    if (ay > by) return 1;
    return 0;
}
// //////////////////

