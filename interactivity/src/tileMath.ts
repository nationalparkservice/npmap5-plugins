import { Position } from "geojson";
import polygonTools, { Geom } from 'polygon-clipping';

export const earthCircumference = 40075016.68557849;
export const pixelsToMeters = (px: number, zoom: number) => px * (earthCircumference / (256 * 1 << zoom));
export function angle(positionA: Position, positionB: Position) {
    return Math.atan2(positionB[1] - positionA[1], positionB[0] - positionA[0]);
}
export function drawPoint(startPosition: Position, angle: number, distance: number) {
    return [
        Math.cos(angle) * distance + startPosition[0],
        Math.sin(angle) * distance + startPosition[1]
    ];
}
export function bufferPoint(distance: number, steps: number = 8, position: Position, prevPosition?: Position, nextPosition?: Position) {
    // draws a clockwise arc around pointX (position) from pointA (prevPosition) to pointA (nextPosition) at a distance of (length) with (steps) points
    // Determine a "plane" based on the line between the prev point and the next, if either prev or next is undefined, use the current
    // That means if both are undefined, it'll treat the position as a point
    const plane = angle(prevPosition || position, nextPosition || position);
    const stepSize = (2 / steps) * Math.PI;
    const points = new Array(steps).fill(0).map((_, idx) => {
        const ptAngle = (plane + (stepSize * (idx + 1))) % (2 * Math.PI);
        return drawPoint(position, ptAngle, distance)
            .map(v => Math.round(v)); // Round to the nearest meter
    });
    return points;
}

export const projections = {
    WebMercatortoWGS84: (x: number, y: number) => {
        // Convert the lat lng
        const wgsLng = x * 180 / (earthCircumference / 2);
        // thanks magichim @ github for the correction
        const wgsLat = Math.atan(Math.exp(y * Math.PI / (earthCircumference / 2))) * 360 / Math.PI - 90;
        return { lng: wgsLng, lat: wgsLat };
    },
    WGS84toWebMercator: (lng: number, lat: number) => {
        // Calculate the web mercator X and Y
        // https://gist.github.com/onderaltintas/6649521
        const wmx = lng * (earthCircumference / 2) / 180;
        let wmy = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
        wmy = wmy * (earthCircumference / 2) / 180;
        return { x: wmx, y: wmy };
    }
};

type hullPoint = {
    'x': number,
    'y': number
};

//https://github.com/nayuki/Nayuki-web-published-code/blob/master/convex-hull-algorithm/convex-hull.ts
// //////////////////
function makeHull(points: hullPoint[]) {
    let newPoints = points.slice();
    newPoints.sort(POINT_COMPARATOR);
    return makeHullPresorted(newPoints);
};

// Returns the convex hull, assuming that each points[i] <= points[i + 1]. Runs in O(n) time.
function makeHullPresorted(points: hullPoint[]) {
    if (points.length <= 1)
        return points.slice();
    // Andrew's monotone chain algorithm. Positive y coordinates correspond to "up"
    // as per the mathematical convention, instead of "down" as per the computer
    // graphics convention. This doesn't affect the correctness of the result.
    let upperHull = [];
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        while (upperHull.length >= 2) {
            const q = upperHull[upperHull.length - 1];
            const r = upperHull[upperHull.length - 2];
            if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x))
                upperHull.pop();
            else
                break;
        }
        upperHull.push(p);
    }
    upperHull.pop();
    let lowerHull = [];
    for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        while (lowerHull.length >= 2) {
            const q = lowerHull[lowerHull.length - 1];
            const r = lowerHull[lowerHull.length - 2];
            if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x))
                lowerHull.pop();
            else
                break;
        }
        lowerHull.push(p);
    }
    lowerHull.pop();
    if (upperHull.length == 1 && lowerHull.length == 1 && upperHull[0].x == lowerHull[0].x && upperHull[0].y == lowerHull[0].y)
        return upperHull;
    else
        return [...upperHull, ...lowerHull];
};

function POINT_COMPARATOR(a: hullPoint, b: hullPoint) {
    if (a.x < b.x)
        return -1;
    else if (a.x > b.x)
        return +1;
    else if (a.y < b.y)
        return -1;
    else if (a.y > b.y)
        return +1;
    else
        return 0;
};
// //////////////////

export function convexHull(positions: Position[]) {
    const points = positions.map(pos => ({ 'x': pos[0], 'y': pos[1] }));
    return makeHull(points).map(pnt => [pnt.x, pnt.y]);
};

const mergePolygons = (...polygons: Position[][]) => {
    const geoms = polygons.map(polygon => {
        const g = [[polygon]] as Geom;
        return g;
    });
    const firstGeom = geoms.shift() as Geom;
    return polygonTools.union(firstGeom, ...geoms);
};

const lineToPoly = (coordA: Position, coordB: Position, size: number) => {
    const slope = angle(coordA, coordB);
    const perpendicular = (slope + (Math.PI / 2)) % (2 * Math.PI);
    const line = [coordA, coordB];
    const polygon = [];
    for (let i = 0; i < 4; i++) {
        const direction = ((i === 0 || i === 3) ? 1 : -1);
        const lineIdx = Math.floor(i / 2);
        polygon.push([
            line[lineIdx][0] + (direction * size * Math.cos(perpendicular)),
            line[lineIdx][1] + (direction * size * Math.sin(perpendicular)),
        ]);
    }
    // Close the line
    polygon.push(polygon[0]);
    return polygon;
};

export const bufferLine = (line: Position[], size: number, steps = 8) => {
    const circles = line.map((coord, idx) => bufferPoint(size, steps, coord, coord, line[idx + 1]));
    const rectangles = line.map((coord, idx) => lineToPoly(coord, line[idx + 1] || coord, size));
    return mergePolygons(...circles, ...rectangles)[0][0];
};

export const quickHash = (str: string) => {
    // https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        let chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Uint32Array.from([hash])[0].toString(36);
};

export const shuffle = (length: number) => {
    //https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    var array: number[] = (new Array(length)).fill('').map((_, i) => i);

    /*
    for i from n−1 downto 1 do
        j ← random integer such that 0 ≤ j ≤ i
        exchange a[j] and a[i]
    */

    for (let i = length - 1; i > 0; i--) {
        let newIdx = Math.floor(Math.random() * (i + 1));
        let oldValue = array[newIdx];

        array[newIdx] = array[i];
        array[i] = oldValue;
    }

    return array;
}
// Test: shuffle(100).sort((a,b) => a - b).map((v, i) => v===i).reduce((a,c) => a && c, true)
