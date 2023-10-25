import { Feature, Point, Position } from 'geojson';
import Base from '.';  // adjust the import to your file structure

const { feature, collection, pointFeature, normalizeToMulti } = Base;

describe('pointFeature', () => {
    it('pointFeature creates correct geojson', () => {
        const x = 10;
        const y = 20;
        const properties = { name: 'myPoint' };
        const layerName = 'myLayer';

        const expectedGeoJson: Feature<Point> = {
            type: 'Feature',
            properties: properties,
            geometry: {
                type: 'Point',
                coordinates: [x, y]
            },
            layerName: layerName
        } as any;


        expect(pointFeature([x, y], properties, layerName)).toEqual(expectedGeoJson);
    });
});

describe('feature', () => {
    it('should create a feature', () => {
        const geometry: Point = {
            type: 'Point',
            coordinates: [10, 20],
        };
        const properties = { name: 'test' };
        const layerName = 'layer1';

        const result = feature(geometry, properties, layerName);

        expect(result.type).toBe('Feature');
        expect(result.properties).toEqual(properties);
        expect(result.geometry).toEqual(geometry);
        expect((result as any).layerName).toBe(layerName);
    });
});


describe('collection', () => {
    it('should create a feature collection', () => {
        const features: Feature[] = [
            {
                type: 'Feature',
                properties: { name: 'test1' },
                geometry: { type: 'Point', coordinates: [10, 20] },
            },
            {
                type: 'Feature',
                properties: { name: 'test2' },
                geometry: { type: 'Point', coordinates: [30, 40] },
            },
        ];

        const result = collection(features);

        expect(result.type).toBe('FeatureCollection');
        expect(result.features).toEqual(features);
    });
});

describe('normalizeToMulti', () => {
    it('normalizes Position[] to Position[][][]', () => {
        const coords: Position[] = [[1, 1], [2, 2]];
        const expected: Position[][][] = [[[[1, 1], [2, 2]]]];
        expect(normalizeToMulti(coords)).toEqual(expected);
    });

    it('normalizes Position[][] to Position[][][]', () => {
        const coords: Position[][] = [[[1, 1], [2, 2]]];
        const expected: Position[][][] = [[[[1, 1], [2, 2]]]];
        expect(normalizeToMulti(coords)).toEqual(expected);
    });

    it('keeps Position[][][] unchanged', () => {
        const coords: Position[][][] = [[[[1, 1], [2, 2]]]];
        const expected: Position[][][] = [[[[1, 1], [2, 2]]]];
        expect(normalizeToMulti(coords)).toEqual(expected);
    });
});
