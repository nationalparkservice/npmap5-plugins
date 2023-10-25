import { BoundingBox } from './BoundingBox';

test('bboxObject should return correct values', () => {
    const bbox = new BoundingBox([{ x: 0, y: 0 }, { x: 10, y: 10 }], '3857');
    expect(bbox.bboxObject()).toEqual({
        minX: 0,
        minY: 0,
        maxX: 10,
        maxY: 10,
    });
});

test('toGeoJSONBBox should return correct values', () => {
    const bbox = new BoundingBox([{ x: 0, y: 0 }, { x: 10, y: 10 }], '4326');
    expect(bbox.toGeoJSONBBox()).toEqual([0, 0, 10, 10]);
});

test('toGeoJSONGeometry should return correct values', () => {
    const bbox = new BoundingBox([{ x: 0, y: 0 }, { x: 10, y: 10 }], '4326');
    expect(bbox.toGeoJSONGeometry()).toEqual({
        type: 'Polygon',
        coordinates: [
            [
                [0, 0],
                [0, 10],
                [10, 10],
                [10, 0],
                [0, 0],
            ],
        ],
    });
});

test('toGeoJSONFeature should return correct values', () => {
    const bbox = new BoundingBox([{ x: 0, y: 0 }, { x: 10, y: 10 }], '4326');
    expect(bbox.toGeoJSONFeature()).toEqual({
        type: 'Feature',
        properties: {},
        bbox: [0, 0, 10, 10],
        geometry: {
            type: 'Polygon',
            coordinates: [
                [
                    [0, 0],
                    [0, 10],
                    [10, 10],
                    [10, 0],
                    [0, 0],
                ],
            ],
        },
    });
});

test('toGeoJSON should return correct values', () => {
    const bbox = new BoundingBox([{ x: 0, y: 0 }, { x: 10, y: 10 }], '4326');
    expect(bbox.toGeoJSON()).toEqual({
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                bbox: [0, 0, 10, 10],
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [0, 0],
                            [0, 10],
                            [10, 10],
                            [10, 0],
                            [0, 0],
                        ],
                    ],
                },
            },
        ],
    });
});

test('overlaps should return true when bounding boxes overlap', () => {
    const bbox1 = new BoundingBox([{ x: 0, y: 0 }, { x: 10, y: 10 }]);
    const bbox2 = new BoundingBox([{ x: 5, y: 5 }, { x: 15, y: 15 }]);
    expect(bbox1.overlaps(bbox2)).toBe(true);
});

test('overlaps should return false when bounding boxes do not overlap', () => {
    const bbox1 = new BoundingBox([{ x: 0, y: 0 }, { x: 10, y: 10 }]);
    const bbox2 = new BoundingBox([{ x: 15, y: 15 }, { x: 20, y: 20 }]);
    expect(bbox1.overlaps(bbox2)).toBe(false);
});

test('isPoint should return true when the bounding box is a point', () => {
    const bbox = new BoundingBox([{ x: 0, y: 0 }, { x: 0, y: 0 }]);
    expect(bbox.isPoint).toBe(true);
});

test('isPoint should return false when the bounding box is not a point', () => {
    const bbox = new BoundingBox([{ x: 0, y: 0 }, { x: 10, y: 10 }]);
    expect(bbox.isPoint).toBe(false);
});

test('width should return correct value', () => {
    const bbox = new BoundingBox([{ x: 0, y: 0 }, { x: 10, y: 10 }]);
    expect(bbox.width()).toBe(10);
});

test('height should return correct value', () => {
    const bbox = new BoundingBox([{ x: 0, y: 0 }, { x: 10, y: 10 }]);
    expect(bbox.height()).toBe(10);
});

test('area should return correct value', () => {
    const bbox = new BoundingBox([{ x: 0, y: 0 }, { x: 10, y: 10 }]);
    expect(bbox.area()).toBe(100);
});

test('containsPoint should return true when point is inside bounding box', () => {
    const bbox = new BoundingBox([{ x: 0, y: 0 }, { x: 10, y: 10 }]);
    expect(bbox.containsPoint({ x: 5, y: 5 })).toBe(true);
});

test('containsPoint should return false when point is outside bounding box', () => {
    const bbox = new BoundingBox([{ x: 0, y: 0 }, { x: 10, y: 10 }]);
    expect(bbox.containsPoint({ x: 15, y: 15 })).toBe(false);
});

test('containsPoint should return true when point is on the edge of the bounding box', () => {
    const bbox = new BoundingBox([{ x: 0, y: 0 }, { x: 10, y: 10 }]);
    expect(bbox.containsPoint({ x: 0, y: 0 })).toBe(true);
    expect(bbox.containsPoint({ x: 10, y: 10 })).toBe(true);
});