import FeatureListRoutable, { routeOptions } from "./FeatureListRouteable";
import { readFileSync } from 'fs';
import { Feature, FeatureCollection, GeoJsonProperties, LineString, MultiLineString, Position } from "geojson";

/*describe('FeatureListRoutable Methods', () => {

    it('should calculate the length of a line in meters', () => {
        // Define a sample line string coordinates
        const coords: LineString['coordinates'] = [
            [-122.419416, 37.774930], // Start point
            [-122.401200, 37.774930], // 1 mile to the east
            [-122.416633, 37.782574], // 1 mile to the north-west (diagonal)
            [-122.405950, 37.794389], // 1 mile to the north-east (diagonal)
        ];

        const featureList = new FeatureListRoutable([]);
        expect(featureList).toBeDefined;

        // convertion to meters
        const toMeters = 1609.34;

        // Assertion: Ensure the calculated lengths match the expected length
        // On Mile Segments
        expect(featureList.lineLength(coords, 0, 1)).toBeCloseTo(1 * toMeters, -2);
        expect(featureList.lineLength(coords, 1, 2)).toBeCloseTo(1 * toMeters, -2);
        expect(featureList.lineLength(coords, 2, 3)).toBeCloseTo(1 * toMeters, -2);

        // two mile segments
        expect(featureList.lineLength(coords, 0, 2)).toBeCloseTo(2 * toMeters, -2);
        expect(featureList.lineLength(coords, 1, 3)).toBeCloseTo(2 * toMeters, -2);

        // The entire line, but specified
        expect(featureList.lineLength(coords, 0, 3)).toBeCloseTo(3 * toMeters, -2);

        // The entire line
        expect(featureList.lineLength(coords)).toBeCloseTo(3 * toMeters, -2);

    });
});

describe('FeatureListRoutable With Test Data', () => {

    let featureList: FeatureListRoutable | undefined;
    const nodes = [[[0, 0], [0, 1]], [[0, 1], [0, 2]], [[0, 2], [0, 3]]];

    beforeEach(() => {
        featureList = new FeatureListRoutable([{
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'MultiLineString',
                'coordinates': nodes
            }
        }]);
    });

    describe('Dealing with Features', () => {


        it('should add a multi-line feature and split it into individual lines', () => {
            expect(featureList).toBeDefined;

            if (featureList) {

                // Expect the feature size to increase
                expect(featureList._features.size).toEqual(3);

                // Expect a new node to be added as well
                expect(featureList._graph.hasNode({ featureIdx: 0, nodeIdx: 0 })).toBeDefined;
                expect(featureList._graph.hasNode({ featureIdx: 1, nodeIdx: 0 })).toBeDefined;
                expect(featureList._graph.hasNode({ featureIdx: 2, nodeIdx: 0 })).toBeDefined;
                expect(featureList._graph.hasNode({ featureIdx: 0, nodeIdx: 1 })).toBeDefined;
                expect(featureList._graph.hasNode({ featureIdx: 1, nodeIdx: 1 })).toBeDefined;
                expect(featureList._graph.hasNode({ featureIdx: 2, nodeIdx: 1 })).toBeDefined;

                expect(featureList._graph.hasNode({ featureIdx: 0, nodeIdx: 0 })).toBeDefined;
                expect(featureList._graph.hasNode({ featureIdx: 1, nodeIdx: 0 })).toBeDefined;
                expect(featureList._graph.hasNode({ featureIdx: 2, nodeIdx: 0 })).toBeDefined;
                expect(featureList._graph.hasNode({ featureIdx: 0, nodeIdx: 1 })).toBeDefined;
                expect(featureList._graph.hasNode({ featureIdx: 1, nodeIdx: 1 })).toBeDefined;
                expect(featureList._graph.hasNode({ featureIdx: 2, nodeIdx: 1 })).toBeDefined;
            }
        });

        it('should add a multi-line feature and create edges', () => {
            expect(featureList).toBeDefined;

            if (featureList) {
                // All three new lines should now be edges forwards and backwards
                const { defaultSpeed } = featureList._options;
                const milesPerDegreeAtEquator = 69.1708966367;
                expect(featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 1 })).toBeCloseTo(milesPerDegreeAtEquator * defaultSpeed);
                expect(featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 1 }, { featureIdx: 0, nodeIdx: 0 })).toBeCloseTo(milesPerDegreeAtEquator * defaultSpeed);
                expect(featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 0 }, { featureIdx: 1, nodeIdx: 1 })).toBeCloseTo(milesPerDegreeAtEquator * defaultSpeed);
                expect(featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 1 }, { featureIdx: 1, nodeIdx: 0 })).toBeCloseTo(milesPerDegreeAtEquator * defaultSpeed);
                expect(featureList._graph.getEdge({ featureIdx: 2 - 0, nodeIdx: 0 }, { featureIdx: 2 - 0, nodeIdx: 1 })).toBeCloseTo(milesPerDegreeAtEquator * defaultSpeed);
                expect(featureList._graph.getEdge({ featureIdx: 2 - 0, nodeIdx: 1 }, { featureIdx: 2 - 0, nodeIdx: 0 })).toBeCloseTo(milesPerDegreeAtEquator * defaultSpeed);

                // These three paths should also get connected with no cost, so check that
                expect(featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 1 }, { featureIdx: 1, nodeIdx: 0 })).toEqual(0);
                expect(featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 1 }, { featureIdx: 2 - 0, nodeIdx: 0 })).toEqual(0);
                expect(featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 1 })).toEqual(0);
                expect(featureList._graph.getEdge({ featureIdx: 2 - 0, nodeIdx: 0 }, { featureIdx: 1, nodeIdx: 1 })).toEqual(0);
            }
        });

        it('should be able to remove one feature', () => {
            expect(featureList).toBeDefined;

            if (featureList) {
                // Remove one lines, and test again
                featureList.remove(0);

                // Expect the feature size to increase
                expect(featureList._features.size).toEqual(2);

                // Expect a new node to be removed
                expect(featureList._graph.hasNode({ featureIdx: 0, nodeIdx: 0 })).toBeFalsy();
                expect(featureList._graph.hasNode({ featureIdx: 1, nodeIdx: 0 })).toBeTruthy();
                expect(featureList._graph.hasNode({ featureIdx: 2, nodeIdx: 0 })).toBeTruthy();
                expect(featureList._graph.hasNode({ featureIdx: 0, nodeIdx: 1 })).toBeFalsy();
                expect(featureList._graph.hasNode({ featureIdx: 1, nodeIdx: 1 })).toBeTruthy();
                expect(featureList._graph.hasNode({ featureIdx: 2, nodeIdx: 1 })).toBeTruthy();

                // Edges should be gone
                expect(featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 1 })).toBeUndefined();
                expect(featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 1 }, { featureIdx: 0, nodeIdx: 0 })).toBeUndefined();
                expect(featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 0 }, { featureIdx: 1, nodeIdx: 1 })).toBeDefined();
                expect(featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 1 }, { featureIdx: 1, nodeIdx: 0 })).toBeDefined();
                expect(featureList._graph.getEdge({ featureIdx: 2, nodeIdx: 0 }, { featureIdx: 2, nodeIdx: 1 })).toBeDefined();
                expect(featureList._graph.getEdge({ featureIdx: 2, nodeIdx: 1 }, { featureIdx: 2, nodeIdx: 0 })).toBeDefined();

                // Edge connections should be gone
                expect(featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 1 }, { featureIdx: 1, nodeIdx: 0 })).toBeUndefined();
                expect(featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 1 }, { featureIdx: 2, nodeIdx: 0 })).toBeDefined();
                expect(featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 1 })).toBeUndefined();
                expect(featureList._graph.getEdge({ featureIdx: 2, nodeIdx: 0 }, { featureIdx: 1, nodeIdx: 1 })).toBeDefined();
            }
        });

        it('should be able to remove all features', () => {
            expect(featureList).toBeDefined;

            if (featureList) {
                // Remove one lines, and test again
                featureList.remove(0);
                featureList.remove(1);
                featureList.remove(2);

                // Expect the feature size to increase
                expect(featureList._features.size).toEqual(0);

                // Expect a new node to be removed
                expect(featureList._graph.hasNode({ featureIdx: 0, nodeIdx: 0 })).toBeFalsy();
                expect(featureList._graph.hasNode({ featureIdx: 1, nodeIdx: 0 })).toBeFalsy();
                expect(featureList._graph.hasNode({ featureIdx: 2, nodeIdx: 0 })).toBeFalsy();
                expect(featureList._graph.hasNode({ featureIdx: 0, nodeIdx: 1 })).toBeFalsy();
                expect(featureList._graph.hasNode({ featureIdx: 1, nodeIdx: 1 })).toBeFalsy();
                expect(featureList._graph.hasNode({ featureIdx: 2, nodeIdx: 1 })).toBeFalsy();

                // Edges should be gone
                expect(featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 1 })).toBeUndefined();
                expect(featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 1 }, { featureIdx: 0, nodeIdx: 0 })).toBeUndefined();
                expect(featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 0 }, { featureIdx: 1, nodeIdx: 1 })).toBeUndefined();
                expect(featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 1 }, { featureIdx: 1, nodeIdx: 0 })).toBeUndefined();
                expect(featureList._graph.getEdge({ featureIdx: 2, nodeIdx: 0 }, { featureIdx: 2, nodeIdx: 1 })).toBeUndefined();
                expect(featureList._graph.getEdge({ featureIdx: 2, nodeIdx: 1 }, { featureIdx: 2, nodeIdx: 0 })).toBeUndefined();

                // Edge connections should be gone
                expect(featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 1 }, { featureIdx: 1, nodeIdx: 0 })).toBeUndefined();
                expect(featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 1 }, { featureIdx: 2, nodeIdx: 0 })).toBeUndefined();
                expect(featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 1 })).toBeUndefined();
                expect(featureList._graph.getEdge({ featureIdx: 2, nodeIdx: 0 }, { featureIdx: 1, nodeIdx: 1 })).toBeUndefined();
            }
        });
    });

    describe('Routing With Nodes', () => {


        it('should be able route along a single edge', () => {
            expect(featureList).toBeDefined;

            if (featureList) {
                const route = featureList.routeNodes({ featureIdx: 0, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 1 });
                const edge = featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 1 });
                const { defaultSpeed } = featureList._options;
                const metersInAMile = 1609.34;

                expect(route.geometry.coordinates).toStrictEqual([nodes[0][0], nodes[0][1]]);
                expect(route.properties?.distance).toBe(Number(edge) / (defaultSpeed / metersInAMile));
                expect(route.properties?.cost).toBe(Number(edge));
            }
        });

        it('should be able route along all edges', () => {
            expect(featureList).toBeDefined;

            if (featureList) {
                const { defaultSpeed } = featureList._options;
                const metersInAMile = 1609.34;

                const route = featureList.routeNodes({ featureIdx: 0, nodeIdx: 0 }, { featureIdx: 2, nodeIdx: 1 });
                const edgeA = featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 1 });
                const edgeB = featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 0 }, { featureIdx: 1, nodeIdx: 1 });
                const edgeC = featureList._graph.getEdge({ featureIdx: 2, nodeIdx: 0 }, { featureIdx: 2, nodeIdx: 1 });
                const edgeSum = (Number(edgeA) + Number(edgeB) + Number(edgeC));
                expect(route.geometry.coordinates).toStrictEqual([nodes[0][0], nodes[0][1], nodes[1][1], nodes[2][1]]);

                expect(route.properties?.distance).toBeCloseTo(edgeSum / (defaultSpeed / metersInAMile));
                expect(route.properties?.cost).toBe(edgeSum);
            }
        });
    });

    describe('Adding new points', () => {


        it('should allow me to add a new point in a feature that will generate more edges', () => {
            expect(featureList).toBeDefined;
            const featureIdx = 0;
            if (featureList) {
                // Make sure the feature we want to remove exist at the beginning
                // Make sure the original edges have been removed
                const { defaultSpeed } = featureList._options;
                const milesPerDegreeAtEquator = 69.1708966367;
                const expectedFullValue = milesPerDegreeAtEquator * defaultSpeed;

                expect(featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 1 })).toBeCloseTo(expectedFullValue);
                expect(featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 1 }, { featureIdx: 1, nodeIdx: 0 })).toBeCloseTo(expectedFullValue);
                expect(featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 1 }, { featureIdx: 0, nodeIdx: 0 })).toBeCloseTo(expectedFullValue);
                expect(featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 0 }, { featureIdx: 1, nodeIdx: 1 })).toBeCloseTo(expectedFullValue);

                const newNode = { 'nodeIdx': 1, node: [0, 0.5] };
                // This uses a new feature index to make sure we are recreating the entire feature
                // It would work in prod, but it's an non-standard usage
                featureList.addNodeToFeature(featureIdx, newNode.nodeIdx, newNode.node, true);

                expect(featureList._features.size).toEqual(3);

                // Make sure the original edges have been removed
                expect(featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 1 })).toBeUndefined();
                expect(featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 1 }, { featureIdx: 1, nodeIdx: 0 })).toBeUndefined();
                expect(featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 1 }, { featureIdx: 0, nodeIdx: 0 })).toBeUndefined();
                expect(featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 0 })).toBeUndefined();

                // Make sure it added the new edges
                expect(featureList._graph.getEdge({ featureIdx: 3, nodeIdx: 0 }, { featureIdx: 3, nodeIdx: 1 })).toBeCloseTo(expectedFullValue / 2);
                expect(featureList._graph.getEdge({ featureIdx: 3, nodeIdx: 1 }, { featureIdx: 3, nodeIdx: 2 })).toBeCloseTo(expectedFullValue / 2);

                // Reverse
                expect(featureList._graph.getEdge({ featureIdx: 3, nodeIdx: 1 }, { featureIdx: 3, nodeIdx: 0 })).toBeCloseTo(expectedFullValue / 2);
                expect(featureList._graph.getEdge({ featureIdx: 3, nodeIdx: 2 }, { featureIdx: 3, nodeIdx: 1 })).toBeCloseTo(expectedFullValue / 2);

                // Reconnects to other edges
                expect(featureList._graph.getEdge({ featureIdx: 3, nodeIdx: 2 }, { featureIdx: 1, nodeIdx: 0 })).toBe(0);
                // Reserver
                expect(featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 0 }, { featureIdx: 3, nodeIdx: 2 })).toBe(0);
            }
        });
    });

    describe('Routing with wgs84 points', () => {

        it('should be able route along a single edge using wgs84', () => {
            expect(featureList).toBeDefined;

            if (featureList) {
                //const route = featureList.routeNodes({ featureIdx: 0, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 1 });
                const route = featureList.routePoints(nodes[0][0], nodes[0][1]);
                const edge = featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 1 });
                const { defaultSpeed } = featureList._options;
                const metersInAMile = 1609.34;

                expect(route.geometry.coordinates).toStrictEqual([nodes[0][0], nodes[0][1]]);
                expect(route.properties?.distance).toBe(Number(edge) / (defaultSpeed / metersInAMile));
                expect(route.properties?.cost).toBe(Number(edge));
            }
        });

        it('should be able route along all edges', () => {
            expect(featureList).toBeDefined;

            if (featureList) {
                const { defaultSpeed } = featureList._options;
                const metersInAMile = 1609.34;

                const route = featureList.routePoints(nodes[0][0], nodes[2][1]);
                const edgeA = featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 1 });
                const edgeB = featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 0 }, { featureIdx: 1, nodeIdx: 1 });
                const edgeC = featureList._graph.getEdge({ featureIdx: 2, nodeIdx: 0 }, { featureIdx: 2, nodeIdx: 1 });
                const edgeSum = (Number(edgeA) + Number(edgeB) + Number(edgeC));
                expect(route.geometry.coordinates).toStrictEqual([nodes[0][0], nodes[0][1], nodes[1][1], nodes[2][1]]);

                expect(route.properties?.distance).toBeCloseTo(edgeSum / (defaultSpeed / metersInAMile));
                expect(route.properties?.cost).toBe(edgeSum);
            }
        });

        it('should be able route along all edges and includes a middle point', () => {
            expect(featureList).toBeDefined;

            if (featureList) {
                const { defaultSpeed } = featureList._options;
                const metersInAMile = 1609.34;

                featureList.add({ 'type': 'Feature', 'properties': {}, 'geometry': { 'type': 'LineString', coordinates: [[0, 3], [0, 3.5], [0, 4]] } })

                const route = featureList.routePoints(nodes[0][0], [0, 4]);
                const edgeA = featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 1 });
                const edgeB = featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 0 }, { featureIdx: 1, nodeIdx: 1 });
                const edgeC = featureList._graph.getEdge({ featureIdx: 2, nodeIdx: 0 }, { featureIdx: 2, nodeIdx: 1 });
                const edgeD = featureList._graph.getEdge({ featureIdx: 3, nodeIdx: 0 }, { featureIdx: 3, nodeIdx: 2 });

                const edgeSum = (Number(edgeA) + Number(edgeB) + Number(edgeC) + Number(edgeD));
                expect(route.geometry.coordinates).toStrictEqual([nodes[0][0], nodes[0][1], nodes[2][0], nodes[2][1], [0, 3.5], [0, 4]]);

                expect(route.properties?.distance).toBeCloseTo(edgeSum / (defaultSpeed / metersInAMile));
                expect(route.properties?.cost).toBe(edgeSum);
            }
        });

        it('should be able to add a point and it will be included in the route', () => {
            expect(featureList).toBeDefined;

            if (featureList) {
                const { defaultSpeed } = featureList._options;
                const metersInAMile = 1609.34;

                // Should be 3
                expect(featureList._features.size).toEqual(3);

                // Do these before the split
                const edgeA = featureList._graph.getEdge({ featureIdx: 0, nodeIdx: 0 }, { featureIdx: 0, nodeIdx: 1 });
                const edgeB = featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 0 }, { featureIdx: 1, nodeIdx: 1 });
                const edgeC = featureList._graph.getEdge({ featureIdx: 2, nodeIdx: 0 }, { featureIdx: 2, nodeIdx: 1 });
                const edgeSum = (Number(edgeA) + Number(edgeB) + Number(edgeC));

                const newPoint: Position = [0, 1.5];
                featureList.addPointOnLine(newPoint, 10);

                // Should still be 3
                expect(featureList._features.size).toEqual(3);

                const route = featureList.routePoints(nodes[0][0], nodes[2][1]);
                expect(route.geometry.coordinates).toStrictEqual([nodes[0][0], nodes[0][1], newPoint, nodes[1][1], nodes[2][1]]);

                expect(route.properties?.distance).toBeCloseTo(edgeSum / (defaultSpeed / metersInAMile));
                expect(route.properties?.cost).toBe(edgeSum);

                // Should work on reverse as well
                const revRoute = featureList.routePoints(nodes[2][1], nodes[0][0]);
                expect(revRoute.geometry.coordinates).toStrictEqual([nodes[2][1], nodes[1][1], newPoint, nodes[0][1], nodes[0][0]]);

                expect(revRoute.properties?.distance).toBeCloseTo(edgeSum / (defaultSpeed / metersInAMile));
                expect(revRoute.properties?.cost).toBe(edgeSum);
            }
        });

        it('should be able to add a point and route from it', () => {
            expect(featureList).toBeDefined;

            if (featureList) {
                const { defaultSpeed } = featureList._options;
                const metersInAMile = 1609.34;

                // Should be 3
                expect(featureList._features.size).toEqual(3);

                const newPoint: Position = [0, 1.5];
                featureList.addPointOnLine(newPoint, 10);

                // Should still be 3
                expect(featureList._features.size).toEqual(3);


                // Do these before the split
                const edgeA = featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 1 }, { featureIdx: 1, nodeIdx: 2 });
                const edgeB = featureList._graph.getEdge({ featureIdx: 1, nodeIdx: 2 }, { featureIdx: 2, nodeIdx: 0 });
                const edgeC = featureList._graph.getEdge({ featureIdx: 2, nodeIdx: 0 }, { featureIdx: 2, nodeIdx: 1 });
                const edgeSum = (Number(edgeA) + Number(edgeB) + Number(edgeC));

                const route = featureList.routePoints(newPoint, nodes[2][1]);
                expect(route.geometry.coordinates).toStrictEqual([newPoint, nodes[1][1], nodes[2][1]]);

                expect(route.properties?.distance).toBeCloseTo(edgeSum / (defaultSpeed / metersInAMile));
                expect(route.properties?.cost).toBe(edgeSum);
            }
        });
    });
}); */


describe('FeatureListRoutable With Simple Data', () => {
    const simpleGeojsonFilePath = __dirname + '/../../test_assets/simple_paths.geojson';
    const simpleGeojsonData = JSON.parse(readFileSync(simpleGeojsonFilePath, 'utf8')) as FeatureCollection<LineString>;
    const features = simpleGeojsonData.features as Feature<LineString | MultiLineString, GeoJsonProperties>[];

    let featureList: FeatureListRoutable | undefined;

    beforeEach(() => {
        featureList = new FeatureListRoutable(features);
    });

    afterEach(() => {
        featureList = undefined;
    });

    describe('Initialization', () => {
        it('should initialize correctly with provided features and options', () => {
            expect(featureList).toBeDefined();
            if (featureList) {
                expect(featureList).toBeDefined();
                expect(featureList._features.size).toEqual(simpleGeojsonData.features.length);
            }
        });

        it('should initialize with default options if no options provided', () => {
            expect(featureList).toBeDefined();
            if (featureList) {
                Object.keys(featureList._options).map(key => {
                    featureList && expect(featureList._options[key as keyof routeOptions]).toEqual(FeatureListRoutable.defaultOptions[key as keyof routeOptions]);
                })
            }
        });
    });

    describe('Make Sure Edges are as expected', () => {
        const intersections: { [key: string]: number } = {};
        let edges: {
            [from: string]: {
                [to: string]: number;
            };
        };
        it('should initialize correctly with provided features and options', () => {
            expect(featureList).toBeDefined();
            expect(featureList?._features.size).toEqual(simpleGeojsonData.features.length);

            if (featureList) {

                simpleGeojsonData.features.forEach((featureA, idxA) => {
                    simpleGeojsonData.features.forEach((featureB, idxB) => {
                        if (idxA !== idxB) {
                            featureA.geometry.coordinates.forEach(([lngA, latA], coordIdxA) => {
                                featureB.geometry.coordinates.forEach(([lngB, latB], coordIdxB) => {
                                    if (lngA === lngB && latA === latB) {
                                        // There's an intersection!
                                        intersections[`${idxA}:${coordIdxA}->${idxB}:${coordIdxB}`] = 0;
                                    }
                                })
                            })
                        }
                    });
                });

                edges = featureList._graph._graph;
            }
        });

        it('should have 16 connections', () => {
            expect(Object.keys(intersections).length).toEqual(16);
        });
        it('should match all conections', () => {
            Object.entries(intersections).forEach(([k, v]) => {
                const [from, to] = k.split('->');
                expect(edges[from][to]).toEqual(v);
            });
        });
    });

    describe('One Way Roads', () => {
        it('Route along the outer edge when the diagonal road is set to one way', () => {
            expect(featureList).toBeDefined();
            expect(featureList?._features.size).toEqual(simpleGeojsonData.features.length);

            if (featureList) {
                // Set the diagonal field
                featureList._options = {
                    ...featureList._options,
                    onewayField: 'oneway',
                    onewayString: 'true'
                };

                // Set the diagonal to one way
                const diagonalRoad = featureList._features.get(3);
                if (diagonalRoad) {
                    featureList.remove(3);
                    diagonalRoad.properties = diagonalRoad.properties || {};
                    diagonalRoad.properties['oneway'] = 'true';
                    featureList.addLine(diagonalRoad, undefined, 3);
                    //featureList._features.set(3, diagonalRoad);
                }

                // Get the route from top right to bottom right
                const topRight = { featureIdx: 0, nodeIdx: 1 };
                const bottomLeft = { featureIdx: 2, nodeIdx: 0 };

                const route = featureList.routeNodes(topRight, bottomLeft); // This route will take the diagonal
                const reverseRoute = featureList.routeNodes(bottomLeft, topRight); // The route will have to go around

                expect(route.geometry.coordinates).toMatchObject((diagonalRoad as any).geometry.coordinates);

                // Leave out the duplicate nodes
                const revPathExpected = [
                    featureList.getNode('2:0'),
                    featureList.getNode('2:1'),
                    //featureList.getNode('4:1'),
                    featureList.getNode('4:0'),
                    //featureList.getNode('1:2'),
                    featureList.getNode('1:1'),
                    featureList.getNode('1:0'),
                    //featureList.getNode('5:1'),
                    featureList.getNode('5:0'),
                    //featureList.getNode('0:0'),
                    featureList.getNode('0:1')
                ]

                expect(reverseRoute.geometry.coordinates).toMatchObject(revPathExpected);
            }

        });
    });

    describe('Travel Speeds', () => {
        // TODO
    });

    describe('Heal Ends', () => {
        // TODO
    });
});

/*
describe('FeatureListRoutable With Real Data', () => {
    // Load a JSON file relative to the current directory
    const geojsonFilePath = __dirname + '/../../test_assets/mackinac_island.geojson';
    const geojsonData = JSON.parse(readFileSync(geojsonFilePath, 'utf8')) as FeatureCollection;

    const features = geojsonData.features as Feature<LineString | MultiLineString, GeoJsonProperties>[];

    let featureList: FeatureListRoutable | undefined;

    beforeEach(() => {
        featureList = new FeatureListRoutable(features);
    });

    afterEach(() => {
        featureList = undefined;
    });

    describe('Initialization', () => {
        it('should initialize correctly with provided features and options', () => {
            expect(featureList).toBeDefined;
            if (featureList) {
                expect(featureList._features.size).toEqual(geojsonData.features.length);
            }
        });

        it('should initialize with default options if no options provided', () => {
            expect(featureList).toBeDefined;
            if (featureList) {
                Object.keys(featureList._options).map(key => {
                    featureList && expect(featureList._options[key as keyof routeOptions]).toEqual(FeatureListRoutable.defaultOptions[key as keyof routeOptions]);
                })
            }
        });
    });

    describe('Adding Features to real datasets', () => {
        it('should add a line feature with one point to the list', () => {
            expect(featureList).toBeDefined;
            if (featureList) {
                featureList.add({
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': [[0, 0]]
                    }
                });

                // Expect the feature size to increase
                expect(featureList._features.size).toEqual(geojsonData.features.length + 1);

                const featureCount = featureList._featureIdxCounter;

                // Expect a new node to be added as well
                expect(featureList._graph.hasNode({ featureIdx: featureCount, nodeIdx: 0 })).toBeDefined;
                expect(featureList._graph.hasNode({ featureIdx: featureCount, nodeIdx: 1 })).toBeUndefined;
                expect(featureList._graph.hasNode({ featureIdx: featureCount + 1, nodeIdx: 2 })).toBeUndefined;

                featureList.remove(2);

                // Expect the feature size to increase
                expect(featureList._features.size).toEqual(geojsonData.features.length);

                // Expect a new node to be added as well
                expect(featureList._graph.hasNode({ featureIdx: featureCount, nodeIdx: 0 })).toBeUndefined;
            };
        });

        it('should add a line feature with two points to the list', () => {
            expect(featureList).toBeDefined;
            if (featureList) {
                featureList.add({
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': [[0, 0], [1, 1]]
                    }
                });

                // Expect the feature size to increase
                expect(featureList._features.size).toEqual(geojsonData.features.length + 1);

                const featureCount = featureList._featureIdxCounter;

                // Expect a new node to be added as well
                expect(featureList._graph.hasNode({ featureIdx: featureCount, nodeIdx: 0 })).toBeDefined;
                expect(featureList._graph.hasNode({ featureIdx: featureCount, nodeIdx: 1 })).toBeDefined;

                featureList.remove(featureCount);

                // Expect the feature size to decrease
                expect(featureList._features.size).toEqual(geojsonData.features.length);

                // Expect a new node to be added as well
                expect(featureList._graph.hasNode({ featureIdx: featureCount, nodeIdx: 0 })).toBeUndefined;
            }
        });
    });

    describe('Routing with wgs84 points', () => {

        it('should be able route along a short path using wgs84', () => {
            expect(featureList).toBeDefined;

            if (featureList) {
                const startPoint = [-84.6085564, 45.8488446];
                const endPoint = [-84.608333, 45.8497498];

                const route = featureList.routePoints(startPoint, endPoint);
                const expectedRoute = {
                    "type": "Feature", "properties": { "distance": 102.78960356037419, "cost": 0.29057915181949256, "meanCost": 0.0028269313408609354 }, "geometry": {
                        "type": "LineString", "coordinates": [[-84.6085564, 45.8488446], [-84.6085272, 45.8490114], [-84.6085602, 45.8490114], [-84.608597, 45.8490235]
                            , [-84.6086087, 45.8490411], [-84.6086261, 45.8490654], [-84.60863, 45.8491153], [-84.6086203, 45.8492018], [-84.608599, 45.8493192], [-84.608566, 45.8494016], [-84.6084962, 45.8494732], [-84.608378, 45.8495758], [-84.6083198, 45.8496325], [-84.608333, 45.8497498]]
                    }
                };
                expect(route.geometry.coordinates).toMatchObject(expectedRoute.geometry.coordinates);
                expect(route.properties).toMatchObject(expectedRoute.properties);
            }
        });
    });

    describe('Routing larger distance with wgs84 points', () => {

        it('should be able route along a short path using wgs84', () => {
            expect(featureList).toBeDefined;

            if (featureList) {
                const startPoint = [-84.6085564, 45.8488446];
                const endPoint = [-84.6071542, 45.8575938];

                const route = featureList.routePoints(startPoint, endPoint);
                const expectedRoute = {
                    "type": "Feature", "properties": {
                        "distance": 1435.0040637634543, "cost": 17.181130121094984, "meanCost": 0.011972879070485418
                    }, "geometry": {
                        "type": "LineString", "coordinates": [[-84.6085564, 45.8488446], [-84.6085272, 45.8490114], [-84.6085602, 45.8490114], [-84.608597, 45.8490235], [-84.6086087, 45.8490411], [-84.6086261, 45.8490654], [-84.60863, 45.8491153], [-84.6086203, 45.8492018], [-84.608599, 45.8493192],
                        [-84.608566, 45.8494016], [-84.6084962, 45.8494732], [-84.608378, 45.8495758], [-84.6083198, 45.8496325], [-84.608333, 45.8497498], [-84.6084084, 45.8497422], [-84.6089645, 45.8497018], [-84.6089082, 45.8500564], [-84.6088935, 45.8501714], [-84.6088668, 45.8503803], [-84.6088379, 45.8506711],
                        [-84.6088107, 45.850812], [-84.6088167, 45.8509187], [-84.6088252, 45.8509725], [-84.6098452, 45.8508827], [-84.6097903, 45.851074], [-84.6097877, 45.8511233], [-84.6097976, 45.8511704], [-84.6098125, 45.8511935], [-84.6098565, 45.8512213], [-84.6099263, 45.8512434], [-84.6108189, 45.8514633],
                        [-84.6104758, 45.8514928], [-84.6104611, 45.8514932], [-84.6097892, 45.8515107], [-84.609317, 45.8515149], [-84.6087702, 45.8515305], [-84.6088912, 45.8525379], [-84.6089728, 45.8529569], [-84.6090869, 45.8532965], [-84.6090776, 45.8534653], [-84.6090246, 45.8536072], [-84.6089624, 45.8537878],
                        [-84.608952, 45.853954], [-84.6090143, 45.8541996], [-84.609201, 45.8544308], [-84.6093462, 45.8546982], [-84.6094603, 45.8549799], [-84.6095122, 45.8551822], [-84.609533, 45.855399], [-84.6094915, 45.8555652], [-84.6093981, 45.8557169], [-84.6093255, 45.8558614], [-84.6092736, 45.8560781],
                        [-84.6092944, 45.8562804], [-84.6093756, 45.8564606], [-84.6094965, 45.856634], [-84.6096629, 45.8567774], [-84.6094138, 45.8568805], [-84.6085387, 45.8570688], [-84.6076595, 45.8572398], [-84.607382, 45.8573044], [-84.6072856, 45.8573269], [-84.6071668, 45.8573732], [-84.6071008, 45.8574238],
                        [-84.6070871, 45.8574778], [-84.6071038, 45.8575408], [-84.6071542, 45.8575938]]
                    }
                };
                expect(route.geometry.coordinates).toMatchObject(expectedRoute.geometry.coordinates);
                expect(route.properties).toMatchObject(expectedRoute.properties);
            }
        });
    });
});
*/