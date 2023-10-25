import { FeatureCollection, GeoJsonProperties, MultiPolygon, Polygon, Position } from "geojson";
import FeatureList, { FeatureTypes } from ".";
import { bufferLine, bufferPoint, bufferPolygonHull } from "../../core/buffer";
import { isCounterClockwise } from "../../core/polygon";

// Buffer requires polygon-clipping to be imported, so it's only included if needed

export default class FeatureListBuffer extends FeatureList {
    buffer(distanceInMeters: number, steps: number = 8): FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> {
        const bufferedFeatures = [...this._features.values()].map(feature => {
            if (['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'].includes(feature.geometry.type)) {
                throw new Error('Unknown geometry type: ' + feature.geometry.type);
            }
            const projectedCoords = FeatureList.projectWGS84toWebMercator((feature.geometry as FeatureTypes).coordinates, (feature.geometry as FeatureTypes).type) as FeatureTypes['coordinates'];
            let bufferedFeature: FeatureTypes['coordinates'];
            switch (feature.geometry.type) {
                case 'Point':
                    bufferedFeature = bufferPoint(projectedCoords as Position, distanceInMeters, steps);
                    break;
                case 'MultiPoint':
                case 'LineString':
                    bufferedFeature = bufferLine(projectedCoords as Position[], distanceInMeters, steps);
                    break;
                case 'MultiLineString':
                    bufferedFeature = projectedCoords.map((line: any) => bufferLine(line as Position[], distanceInMeters, steps));
                    break;
                case 'Polygon':
                    bufferedFeature = bufferPolygonHull(projectedCoords as Position[][], distanceInMeters, steps);
                    break;
                case 'MultiPolygon':
                    bufferedFeature = bufferPolygonHull(
                        projectedCoords
                            .map((polygons: any) => polygons
                                .filter((polygon: Position[]) => isCounterClockwise(polygon))),
                        distanceInMeters, steps
                    );
                    break;
                default:
                    throw new Error('Unknown geometry type: ' + feature.geometry.type);
            }
            const bufferedFeatureWGS84 = FeatureList.projectWebMercatorToWGS84(bufferedFeature, feature.geometry.type);
            return bufferedFeatureWGS84;
        });
        const features = bufferedFeatures.map(bufferedFeature => FeatureList.feature(FeatureList.polygonize(bufferedFeature as Position[][] | Position[][][]), {}));
        return FeatureList.collection(features) as FeatureCollection<Polygon, GeoJsonProperties>;
    }
}