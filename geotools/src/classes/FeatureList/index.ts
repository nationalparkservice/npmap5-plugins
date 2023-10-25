import { Feature, FeatureCollection, GeoJsonProperties, Geometry, LineString, MultiLineString, MultiPoint, MultiPolygon, Point, Polygon, Position } from "geojson";
import { WGS84ToWebMercator, WebMercatorToWGS84 } from "../../core/projection";

export type FeatureTypes = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon;
type FeatureTypeStrings = 'Point' | 'MultiPoint' | 'LineString' | 'MultiLineString' | 'Polygon' | 'MultiPolygon';

/**
 * Represents a list of GeoJSON features.
 */
export default class FeatureList {
    _features: Map<number, Feature> = new Map();
    _featureIdxCounter: number = -1;


    /**
     * Creates a new FeatureList instance with the specified features.
     *
     * @param features - An array of GeoJSON features to initialize the list.
     */
    constructor(features: Feature<FeatureTypes>[]) {
        features.map(feature => this.add(feature));
    }

    /**
     * Add a feature to the feature list.
     *
     * @param feature - The feature to add.
     * @returns The index of the added feature.
     */
    add(feature: Feature<FeatureTypes>) {
        const maxIdx = ++this._featureIdxCounter;
        this._features.set(maxIdx, feature);
        return maxIdx;
    }

    /**
     * Remove a feature from the feature list.
     *
     * @param featureIdx - The index of the feature to remove.
     */
    remove(featureIdx: number) {
        this._features.delete(featureIdx);
    }

    /**
     * Returns a feature from the feature list.
     *
     * @param featureIdx - The index of the feature to return.
     */
    getFeature(featureIdx: number) {
        return this._features.get(featureIdx);
    }

    /**
     * Converts a set of coordinates into either a Polygon or MultiPolygon geometry.
     *
     * @param coords - The coordinates to be converted.
     * @returns Either a Polygon or MultiPolygon geometry.
     * @throws {Error} If the input coordinates are invalid.
     */
    static polygonize = (coords: Position[][] | Position[][][]): Polygon | MultiPolygon => {
        let geometry: Geometry;
        if (!Array.isArray(coords[0])) {
            throw new Error('Invalid coordinates');
        }
        if (!Array.isArray(coords[0][0])) {
            geometry = {
                'coordinates': coords as Position[][],
                type: 'Polygon'
            }

        } else if (!Array.isArray(coords[0][0][0])) {
            geometry = {
                'coordinates': coords as Position[][][],
                type: 'MultiPolygon'
            }
        } else {
            throw new Error('Invalid Coords')
        }
        return geometry;
    };

    /**
     * Creates a GeoJSON feature.
     * 
     * @param geometry - The geometry of the feature.
     * @param properties - The properties of the feature.
     * @param layerName - The name of the layer.
     * 
     * @returns The created feature.
     */
    static feature(geometry: Geometry, properties: GeoJsonProperties, layerName?: string): Feature {
        const feature: Feature = {
            'type': 'Feature',
            'properties': properties,
            'geometry': geometry
        };
        if (layerName !== undefined) {
            (feature as any).layerName = layerName;
        }
        return feature;
    };

    /**
     * Creates a GeoJSON feature collection.
     *
     * @param features - An array of features.
     *
     * @returns The created feature collection.
     */
    static collection(features: Feature[]): FeatureCollection {
        return {
            'type': 'FeatureCollection',
            'features': features
        };
    }

    /**
     * Creates a GeoJSON Point Feature
     * @param {Position} coordinates - An array of two numbers representing the x and y coordinates.
     * @param {any} properties - An object representing the properties of the Point.
     * @param {string} [layerName] - Optional layer name.
     * @returns {Feature<Point>} - A GeoJSON Point Feature.
     */
    static pointFeature([x, y]: Position, properties: any, layerName?: string): Feature<Point> {
        const feature: Feature<Point> = {
            type: 'Feature',
            properties: properties,
            geometry: {
                type: 'Point',
                coordinates: [x, y]
            }
        };
        if (layerName) {
            (feature as any).layerName = layerName
        }
        return feature;
    }

    /**
     * Modifies positions within a feature's coordinates using the provided function.
     * This is used for reprojection, or moving a feature
     *
     * @param coords - The coordinates to be modified.
     * @param fn - The function to apply to each position.
     * @param geometryType - The type of geometry (e.g., 'MultiPolygon').
     * @returns The modified coordinates in the specified geometry type.
     */
    static modifyPositions(coords: FeatureTypes['coordinates'], fn: (pos: Position) => Position, geometryType: FeatureTypeStrings = 'MultiPolygon'): FeatureTypes['coordinates'] {
        const normalizedCoords = JSON.parse(JSON.stringify(FeatureList.normalizeToMulti(coords)));
        for (let i = 0; i < normalizedCoords.length; i++) {
            for (let j = 0; j < normalizedCoords[i].length; j++) {
                for (let k = 0; normalizedCoords[i][j].length; k++) {
                    normalizedCoords[i][j][k] = fn(normalizedCoords[i][j][k]);
                }
            }
        }
        return FeatureList.multiToType(normalizedCoords, geometryType as any)
    }

    /**
     * Projects coordinates from WGS84 to Web Mercator.
     *
     * @param coords - The coordinates to be projected.
     * @param geometryType - The type of geometry (e.g., 'MultiPolygon').
     * @returns The projected coordinates in the specified geometry type.
     */
    static projectWGS84toWebMercator(coords: FeatureTypes['coordinates'], geometryType: FeatureTypeStrings = 'MultiPolygon'): FeatureTypes['coordinates'] {
        const fn = ([lng, lat]: Position) => {
            const { x, y } = WGS84ToWebMercator(lng, lat);
            return [x, y];
        }
        return FeatureList.modifyPositions(coords, fn, geometryType);
    }

    /**
     * Projects coordinates from Web Mercator to WGS84.
     *
     * @param coords - The coordinates to be projected.
     * @param geometryType - The type of geometry (e.g., 'MultiPolygon').
     * @returns The projected coordinates in the specified geometry type.
     */
    static projectWebMercatorToWGS84(coords: FeatureTypes['coordinates'], geometryType: FeatureTypeStrings = 'MultiPolygon'): FeatureTypes['coordinates'] {
        const fn = ([x, y]: Position) => {
            const { lng, lat } = WebMercatorToWGS84(x, y);
            return [lng, lat];
        }
        return FeatureList.modifyPositions(coords, fn, geometryType);
    }

    /**
     * Normalize coordinates to a MultiPolygon format.
     *
     * @param coords - The coordinates to normalize.
     * @returns The normalized coordinates in MultiPolygon format.
     */
    static normalizeToMulti(coords: FeatureTypes['coordinates']): Position[][][] {
        const isPosition = (value: FeatureTypes['coordinates']): value is Position => Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number';
        const isPositionArray = (value: FeatureTypes['coordinates']): value is Position[] => Array.isArray(value) && (value as any).every(isPosition);
        const isPosition2DArray = (value: FeatureTypes['coordinates']): value is Position[][] => Array.isArray(value) && (value as any).every(isPositionArray);

        if (isPosition(coords)) {
            return [[[coords]]];
        } else if (isPositionArray(coords)) {
            return [[coords]];
        } else if (isPosition2DArray(coords)) {
            return [coords];
        } else {
            return coords;
        }
    }

    /**
     * Convert a Multi-type coordinates array to the specified geometry type.
     *
     * @param coords - The coordinates array.
     * @param geometryType - The target geometry type.
     * @returns The coordinates in the specified geometry type.
     */
    // Define overloaded function signatures
    static multiToType(coords: Position[][][], geometryType: 'Point'): Point['coordinates'];
    static multiToType(coords: Position[][][], geometryType: 'MultiPoint' | 'LineString'): (MultiPoint | LineString)['coordinates'];
    static multiToType(coords: Position[][][], geometryType: 'MultiLineString' | 'Polygon'): (MultiLineString | Polygon)['coordinates'];
    static multiToType(coords: Position[][][], geometryType: 'Polygon'): Polygon['coordinates'];
    static multiToType(coords: Position[][][], geometryType: 'MultiPolygon'): MultiPolygon['coordinates'];
    static multiToType(coords: Position[][][], geometryType: 'Point' | 'MultiPoint' | 'LineString' | 'MultiLineString' | 'Polygon' | 'MultiPolygon'): FeatureTypes['coordinates'] {
        switch (geometryType) {
            case 'Point':
                // Dim 1
                return coords[0][0][0];
            case 'MultiPoint':
            case 'LineString':
                // Dim 2
                return coords[0][0];
            case 'MultiLineString':
            case 'Polygon':
                // Dim 3
                return coords[0];
            case 'MultiPolygon':
                // Dim 4
                return coords;
            default:
                throw new Error('nope')
        }
    }

    /**
     * Converts the FeatureList to a GeoJSON FeatureCollection.
     *
     * @returns A GeoJSON FeatureCollection representing the features in the list.
     */
    toJSON(): FeatureCollection {
        const featuresArray = Array.from(this._features.values());
        return FeatureList.collection(featuresArray);
    }

}