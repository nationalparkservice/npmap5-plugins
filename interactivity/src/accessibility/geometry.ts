import { bufferPoint, convexHull, pixelsToMeters, projections, quickHash, shuffle } from "../tileMath";
import { Map, MapGeoJSONFeature } from "maplibre-gl";
import { GeoJSONMapFeature } from ".";
import { Feature, LineString, MultiLineString, MultiPolygon, Point, Polygon, Position, Geometry } from 'geojson';


export function toPointCloud(coordinateList: Position | Position[] | Position[][] | Position[][][]): Position[] {
    // Normalize all positions to Position[][][]
    if (typeof coordinateList[0] === 'number') {
        coordinateList = [[[coordinateList as Position]]];
    }
    if (typeof (coordinateList as Position[])[0][0] === 'number') {
        coordinateList = [coordinateList as Position];
    }
    if (typeof (coordinateList as Position[][])[0][0][0] === 'number') {
        coordinateList = [coordinateList as Position];
    }

    // Now that everything is normalized, put it into a big list
    const coordCloud = (coordinateList as Position[][][])
        .reduce((a, c) => [...a, ...c], [])
        .reduce((a, c) => [...a, ...c], []);

    return coordCloud;
}

export function projectCoords(coordinates: Position[], projectTo: '3857' | '4326'): Position[] {
    return (coordinates).map((pos: Position) => {
        if (projectTo === '3857') {
            const coord = projections.WGS84toWebMercator(pos[0], pos[1]);
            return [coord.x, coord.y] as Position;
        } else {
            const coord = projections.WebMercatortoWGS84(pos[0], pos[1]);
            return [coord.lng, coord.lat] as Position;
        }
    });
}

export function getPointInLayer(map: Map, feature: GeoJSONMapFeature) {
    const canvas = map.getCanvas();
    const max = { x: canvas.width, y: canvas.height };
    const itemHash = (item: MapGeoJSONFeature | GeoJSONMapFeature) => quickHash(JSON.stringify({
        'properties': item.properties,
        'layer': item.layer,
        'geometry': item.geometry || (item as any)._geometry
    }));
    const currentFeatureHash = itemHash(feature as GeoJSONMapFeature);
    const coordinates = toPointCloud((feature as any).geometry.coordinates)

    // Start with the first point
    let pointInLayer = coordinates[0];

    // Check if the point is on the screen
    // Shuffle the points to increase chances that we'll find a match
    const shuffledIndexes = shuffle(coordinates.length);
    for (let i = 0; i < coordinates.length; i++) {
        //Project the point to screen coords
        const testPosition = shuffledIndexes[i];
        const pt = map.project(coordinates[testPosition] as [number, number]);
        if (pt.x >= 0 && pt.x <= max.x && pt.y >= 0 && pt.y <= max.y) {
            const features = map.queryRenderedFeatures(pt);
            if (features[0] && currentFeatureHash === itemHash(features[0])) {
                pointInLayer = coordinates[testPosition];
                break;
            }
        }
    }

    // It should be good enough to just use that point
    // TODO, what if it's not?
    return pointInLayer;
}

export function drawOutline(feature: GeoJSONMapFeature<Point | LineString | MultiLineString | Polygon | MultiPolygon>, zoom: number, bufferPixels: number, bufferSteps: number): GeoJSONMapFeature<Polygon> {


    const bufferMeters = pixelsToMeters(bufferPixels, zoom);

    // Project the line into 3857
    let highlightArea;
    //if (feature.geometry.type === 'LineString') {
    //    const projectedLine = this._projectCoords(feature.geometry.coordinates, '3857');
    //    highlightArea = bufferLine(projectedLine, bufferMeters, bufferSteps);
    //} else {
    const pointCloud = toPointCloud(feature.geometry.coordinates);
    const projectedCloud = projectCoords(pointCloud, '3857');
    const bufferedCloud = projectedCloud
        .map((point, idx) => bufferPoint(bufferMeters, bufferSteps, point, projectedCloud[idx - 1], projectedCloud[idx + 1]))
        .reduce((a, c) => [...a, ...c], []);
    highlightArea = convexHull(bufferedCloud);
    //}

    return {
        type: feature.type,
        'layer': feature.layer,
        'properties': {},
        geometry: {
            'type': 'Polygon',
            'coordinates': [projectCoords(highlightArea, '4326')] as Position[][]
        }
    };
}

export function getBbox(coordinateList: Position | Position[] | Position[][] | Position[][][]) {
    let bounds = { l: -Infinity, r: Infinity, t: -Infinity, b: Infinity };

    const coordCloud = toPointCloud(coordinateList);

    // Find the bbox
    for (let i = 0; i < coordCloud.length; i++) {
        bounds.l = (bounds.l > coordCloud[i][0]) ? bounds.l : coordCloud[i][0];
        bounds.r = (bounds.r < coordCloud[i][0]) ? bounds.r : coordCloud[i][0];
        bounds.t = (bounds.t > coordCloud[i][1]) ? bounds.t : coordCloud[i][1];
        bounds.b = (bounds.b < coordCloud[i][1]) ? bounds.b : coordCloud[i][1];
    }

    return bounds;
};