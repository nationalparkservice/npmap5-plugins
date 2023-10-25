import { BBox, Feature, FeatureCollection, Polygon, Position } from "geojson";
import { EPSG } from "../core/projection";
import { XYCoord } from "./XYCoord";
import { isCounterClockwise, pointInPolygon } from "../core/polygon";

export class BoundingBox {

    /**
     * The north-west coordinate of the bounding box.
     */
    northWest: XYCoord;

    /**
     * The south-east coordinate of the bounding box.
     */
    southEast: XYCoord;

    /**
     * Creates a bounding box from an array of coordinates.
     *
     * @param {Array<{x: number, y: number}>} geometry - The coordinates to create the bounding box from.
     * @param {EPSG} [epsg='3857'] - The EPSG code of the coordinate system.
     */
    constructor(geometry: Array<{ 'x': number, 'y': number }>, epsg: EPSG = '3857') {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        geometry.forEach(rawPoint => {
            const point = new XYCoord(rawPoint.x, rawPoint.y, epsg);
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        });

        this.northWest = new XYCoord(minX, maxY);
        this.southEast = new XYCoord(maxX, minY);
    }

    /**
     * Returns the bounding box as an object with minX, minY, maxX, maxY properties.
     *
     * @param {EPSG} [epsg='3857'] - The EPSG code of the coordinate system.
     * @return {minX: number, minY: number, maxX: number, maxY: number}  The bounding box as an object.
     */
    bboxObject(epsg: EPSG = '3857'): { minX: number, minY: number, maxX: number, maxY: number } {
        const xField = epsg === '4326' ? 'lng' : 'x';
        const yField = epsg === '4326' ? 'lat' : 'y';

        return {
            minX: this.northWest[xField], //West
            minY: this.southEast[yField], //South
            maxX: this.southEast[xField], //East
            maxY: this.northWest[yField]  //North
        };
    }

    /**
     * Returns the bounding box as a GeoJSON bounding box array.
     *
     * @param {EPSG} [epsg='4326'] - The EPSG code of the coordinate system.
     * @return {BBox} The bounding box as a GeoJSON bounding box array.
     */
    toGeoJSONBBox(epsg: EPSG = '4326'): BBox {
        // Note since the GeoJSON spec only supports 4326, this is 4326 be default
        // https://datatracker.ietf.org/doc/html/rfc7946#section-5
        // [westlon, minlat, eastlon, 90.0]
        const obj = this.bboxObject(epsg);
        return [
            obj.minX,
            obj.minY,
            obj.maxX,
            obj.maxY,
        ];
    }

    /**
     * Returns the bounding box as a GeoJSON geometry object.
     *
     * @param {EPSG} [epsg='4326'] - The EPSG code of the coordinate system.
     * @return {Polygon} The bounding box as a GeoJSON Polygon geometry object.
     */
    toGeoJSONGeometry(epsg: EPSG = '4326'): Polygon {
        // Note since the GeoJSON spec only supports 4326, this is 4326 be default
        const geojsonBbox = this.toGeoJSONBBox(epsg);
        return {
            "type": "Polygon",
            "coordinates": [[
                [geojsonBbox[0], geojsonBbox[1]],
                [geojsonBbox[0], geojsonBbox[3]],
                [geojsonBbox[2], geojsonBbox[3]],
                [geojsonBbox[2], geojsonBbox[1]],
                [geojsonBbox[0], geojsonBbox[1]]
            ]]
        };
    }

    /**
     * Returns the bounding box as a GeoJSON feature object.
     *
     * @param {EPSG} [epsg='4326'] - The EPSG code of the coordinate system.
     * @return {Feature} The bounding box as a GeoJSON feature object.
     */
    toGeoJSONFeature(epsg: EPSG = '4326'): Feature {
        return {
            "type": "Feature",
            "properties": {},
            "bbox": this.toGeoJSONBBox(epsg),
            "geometry": this.toGeoJSONGeometry(epsg)
        };
    }

    /**
     * Returns the bounding box as a GeoJSON feature collection object.
     *
     * @param {EPSG} [epsg='4326'] - The EPSG code of the coordinate system.
     * @return {FeatureCollection} The bounding box as a GeoJSON feature collection object.
     */
    toGeoJSON(epsg: EPSG = '4326'): FeatureCollection {
        // Note since the GeoJSON spec only supports 4326, this is 4326 be default
        return {
            "type": "FeatureCollection",
            "features": [
                this.toGeoJSONFeature(epsg)
            ]
        };
    }

    /**
     * Checks if the bounding box overlaps with another bounding box.
     *
     * @param {BoundingBox} otherBbox - The other bounding box to check for overlap.
     * @return {boolean} True if the bounding boxes overlap, false otherwise.
     */
    overlaps(otherBbox: BoundingBox): boolean {
        return (
            otherBbox.southEast.x >= this.northWest.x &&
            otherBbox.northWest.x <= this.southEast.x &&
            otherBbox.southEast.y <= this.northWest.y &&
            otherBbox.northWest.y >= this.southEast.y
        );
    }

    /**
     * Checks if the bounding box is a point.
     *
     * @return {boolean} True if the bounding box is a point, false otherwise.
     */
    get isPoint(): boolean {
        return (
            this.northWest.x === this.southEast.x &&
            this.northWest.y === this.southEast.y
        );
    }

    /**
     * Returns the width of the bounding box.
     *
     * @param {EPSG} [epsg='3857'] - The EPSG code of the coordinate system.
     * @return {number} The width of the bounding box.
     */
    width(epsg: EPSG = '3857'): number {
        const bboxObj = this.bboxObject(epsg);
        return bboxObj.maxX - bboxObj.minX;
    }

    /**
     * Returns the height of the bounding box.
     *
     * @param {EPSG} [epsg='3857'] - The EPSG code of the coordinate system.
     * @return {number} The height of the bounding box.
     */
    height(epsg: EPSG = '3857'): number {
        const bboxObj = this.bboxObject(epsg);
        return bboxObj.maxY - bboxObj.minY;
    }

    /**
     * Returns the area of the bounding box.
     *
     * @param {EPSG} [epsg='3857'] - The EPSG code of the coordinate system.
     * @return {number} The area of the bounding box.
     */
    area(epsg: EPSG = '3857'): number {
        return this.width(epsg) * this.height(epsg);
    }

    /**
     * Checks if the bounding box contains a point.
     *
     * @param {Object} point - The point to check.
     * @param {number} point.x - The x coordinate of the point.
     * @param {number} point.y - The y coordinate of the point.
     * @param {EPSG} [epsg='3857'] - The EPSG code of the coordinate system.
     * @return {boolean} True if the bounding box contains the point, false otherwise.
     */
    containsPoint(point: { 'x': number, 'y': number }, epsg: EPSG = '3857'): boolean {
        const pointBBox = new BoundingBox([point], epsg);
        return this.overlaps(pointBBox);
    }

    /**
     * Checks if the bounding box intersects with a line.
     *
     * @param {Position[]} line - The line to check.
     * @param {EPSG} [epsg='4326'] - The EPSG code of the coordinate system.
     * @return {boolean} True if the bounding box intersects the line, false otherwise.
     */
    intersectsLine(line: Position[], epsg: EPSG = '4326'): boolean {
        // https://stackoverflow.com/questions/3838329/how-can-i-check-if-two-segments-intersect
        let intersects = false;
        const bboxLines = this.toGeoJSONGeometry(epsg).coordinates[0];
        const ccw = isCounterClockwise;

        let lineAStart: Position, lineAEnd: Position, lineBStart: Position, lineBEnd: Position;
        for (let i = 0; i < line.length && !intersects; i++) {
            lineAStart = line[i];
            lineAEnd = line[(i + 1) % line.length];
            for (let j = 0; j < bboxLines.length && !intersects; j++) {
                lineBStart = bboxLines[j];
                lineBEnd = bboxLines[(j + 1) % bboxLines.length];

                intersects = (
                    ccw([lineAStart, lineBStart, lineBEnd]) != ccw([lineAEnd, lineBStart, lineBEnd]) &&
                    ccw([lineAStart, lineAEnd, lineBStart]) != ccw([lineAStart, lineAEnd, lineBEnd])
                );
            }
        }
        return intersects;
    }
    
    /**
     * Checks if a feature is contained within a bounding box.
     *
     * @param feature - The feature to check.
     * @param epsg - The EPSG code of the coordinate system. Defaults to '4326' because it takes GeoJSON.
     * @throws Will throw an error if the feature is a MultiPolygon.
     * @returns True if the bounding box contains the feature, false otherwise.
     */
    containsFeature(feature: Feature, epsg: EPSG = '4326'): boolean {
        // Defaults to 4326 because it takes geojson
        // Will not work with MultiPolygons
        let contains = false;

        // Simple function to convert geojson y,x to an object
        const toObj = (point: Array<number>) => ({
            'x': point[0],
            'y': point[1]
        });

        if (feature.geometry.type === 'MultiPolygon') {
            throw new Error('MultiPolyon not supported');
        }
        if (feature.geometry.type === 'Point') {
            // If the input geometry is a point, we can do a point in bbox calc
            contains = this.overlaps(new BoundingBox([toObj(feature.geometry.coordinates)], epsg));
        } else {
            // LineStrings, MultiLineStrings and Polygons
            let rings: Array<Array<Position>> = [[]];
            // Convert LineStrings to the format used for MultiLineStrings and Polygons
            if (feature.geometry.type === 'LineString') {
                rings = [feature.geometry.coordinates];
            } else {
                // TODO remove any!!
                rings = (feature.geometry as any).coordinates;
            }

            // Get the Bbox of the feature
            let coords = ((feature.geometry as any).coordinates as Position[][])
                .reduce((a, c) => [...a, ...c], [])
                .map(point => toObj(point));
            const featureBbox = new BoundingBox(coords, epsg);

            let ring: Position[] = [];
            for (let i = 0; i < rings.length && !contains; i++) {
                ring = rings[i];

                // Check if any points in the polygon are in the bbox
                // or if any of the edges cross the box
                for (let j = 0; j < ring.length && !contains; j++) {
                    if (
                        this.containsPoint({ 'x': ring[j][0], 'y': ring[j][1] }, epsg) ||
                        this.intersectsLine([ring[j], ring[(j + 1) % ring.length]])
                    ) {
                        contains = true;
                    }
                }
            }

            // The match can also happen if any (or all) of the bbox points are in the feature
            // this can only happen with polygons that are both wider AND taller than the bbox
            if (
                !contains &&
                feature.geometry.type === 'Polygon' &&
                featureBbox.width() > this.width() &&
                featureBbox.height() > this.height()
            ) {
                let bboxRing = this.toGeoJSONGeometry().coordinates[0];
                for (let k = 0; k < (bboxRing.length - 1) && !contains; k++) {
                    contains = pointInPolygon(bboxRing[k], feature.geometry.coordinates);
                }
            }
        }
        return contains;
    }

    toString() {
        return JSON.stringify(this.bboxObject('3857'));
    }
};
