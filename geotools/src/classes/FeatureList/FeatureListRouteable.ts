import { Feature, GeoJsonProperties, LineString, MultiLineString, Position } from "geojson";
import FeatureList from ".";
import { NodeGraph } from "./NodeGraph";
import RBush from "rbush";
import { WGS84ToWebMercator, WebMercatorToWGS84 } from "../../core/projection";
import { distance, euclideanDistance } from "../../core/distance";
import { nearestPointOnLineSegment } from '../../core/geometry';


export type nodeInfoType = {
    featureIdx: number;
    nodeIdx: number;
    feature?: Feature<LineString, GeoJsonProperties>;
    node?: Position;
};

// TODO a speed function
export type routeOptions = {
    speedField: string | undefined,
    speedUnits: 'kph' | 'mph' | 'other',
    onewayField: string | undefined,
    onewayString: string | string[] | undefined, // What the field will say if it's a one way route (yes, true, etc), can be an array as well
    defaultSpeed: number
};

type segmentInfo = {
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
    featureIdx: number,
    startIdx: number
    endIdx: number
};

type intersectionPointInfo = {
    nearestPoint: undefined | Position;
    nearestPointWGS84: undefined | Position;
    distanceInMeters: number;
    featureIdx: number;
    startNodeIdx: number;
    endNodeIdx: number;
}

/**
 * Represents a list of GeoJSON features that can be used for routing purposes.
 * This uses dijkstrajs for routing and rbush for spatial indexing
 */
export default class FeatureListRoutable extends FeatureList {
    _features: Map<number, Feature<LineString>> = new Map();
    _graph: NodeGraph = new NodeGraph();
    _rbushTree: RBush<segmentInfo>;
    _options: routeOptions;

    static defaultOptions: routeOptions = {
        speedField: undefined,
        speedUnits: 'mph',
        onewayField: undefined,
        onewayString: undefined,
        defaultSpeed: 25
    };

    /**
     * Initializes a new instance of the FeatureListRoutable class.
     *
     * @param {Feature<LineString | MultiLineString>[]} features - An array of line string features to initialize the list.
     * @param {Partial<routeOptions>} [options=FeatureListRoutable.defaultOptions] - Optional routing options.
     */
    constructor(features: Feature<LineString | MultiLineString>[], options: Partial<routeOptions> = FeatureListRoutable.defaultOptions) {
        // Since super must be called before this is used, call it empty, then fill in the values
        super([]);

        this._rbushTree = new RBush(9);
        this._options = {
            ...FeatureListRoutable.defaultOptions,
            ...options,
        };

        features.map(feature => this.add(feature));
    }

    /**
     * Adds a line string or multi-line string feature to the list.
     *
     * @param {Feature<LineString | MultiLineString, GeoJsonProperties>} feature - The feature to add.
     * @returns {number} The index of the added feature in the list.
     */
    add(feature: Feature<LineString | MultiLineString, GeoJsonProperties>): number {
        let maxIdx = -Infinity;

        if (feature.geometry.type === 'MultiLineString') {
            // Split up multi-line strings into single line strings
            feature.geometry.coordinates.forEach((lineStringCoords) => {
                const lineStringFeature = FeatureList.feature(
                    { type: 'LineString', coordinates: lineStringCoords },
                    feature.properties
                ) as Feature<LineString>;
                maxIdx = this.addLine(lineStringFeature as Feature<LineString>);
            });
        } else {
            maxIdx = this.addLine(feature as Feature<LineString>);
        }

        return maxIdx;
    }

    /**
     * Adds a line string feature to the feature collection, updating the spatial index tree and graph connections.
     *
     * @param {Feature<LineString>} lineString - The line string feature to add.
     * @param {number[]} connections - An array of connection points along the line.
     * @param {number} useFeatureIndex - The index to use for the feature if provided.
     *
     * @returns {number} The index of the added feature in the collection.
     */
    addLine(lineString: Feature<LineString>, connections: number[] = [0, Infinity], useFeatureIndex?: number): number {
        // Add the line string feature to the collection and get its index
        if (useFeatureIndex === undefined) {
            useFeatureIndex = super.add(lineString);
        } else {
            this._features.set(useFeatureIndex, lineString);
        }
        const featureIdx = useFeatureIndex;

        const coords = lineString.geometry.coordinates;
        const cachedConnections: Map<number, nodeInfoType[]> = new Map();

        // Add all line segments to the spatial index tree
        for (let pointIdx = 0; pointIdx < coords.length; pointIdx++) {
            // Check if there are any existing nodes that match this one
            // If there are, add them to the connections list
            const matched = this._getMatchingPoints({ featureIdx, nodeIdx: pointIdx });
            //?.forEach(matched => {
            if (matched && matched.length) {
                connections.push(pointIdx);
                cachedConnections.set(pointIdx, matched);
            };

            if (pointIdx > 0) {
                const [endLng, endLat] = coords[pointIdx];
                const { x: endX, y: endY } = WGS84ToWebMercator(endLng, endLat);

                const [startLng, startLat] = coords[pointIdx - 1];
                const { x: startX, y: startY } = WGS84ToWebMercator(startLng, startLat);

                // Insert the segment into the spatial index tree
                this._rbushTree.insert({
                    minX: Math.min(startX, endX),
                    minY: Math.min(startY, endY),
                    maxX: Math.max(startX, endX),
                    maxY: Math.max(startY, endY),
                    featureIdx,
                    startIdx: pointIdx - 1,
                    endIdx: pointIdx
                });
            }
        }

        // Create a Set to store unique and valid connections
        const uniqueConnections: Set<number> = new Set();

        // Iterate through the connections and normalize them
        connections.forEach(connection => {
            // Normalize the connection value to be within the bounds
            const normalizedConnection = Math.max(Math.min(connection, coords.length - 1), 0);
            // Add the normalized connection to the Set
            uniqueConnections.add(normalizedConnection);
        });

        // Convert the Set back to an array for a loop
        [...uniqueConnections].sort((a, b) => a - b).forEach((nodeIdx, connectionIdx, array) => {

            if (connectionIdx > 0) {
                const prevNodeIdx = array[connectionIdx - 1];


                const startNode = { nodeIdx: prevNodeIdx, featureIdx };
                const endNode = { nodeIdx, featureIdx };

                // Check for intersections with other lines
                //const startNodeMatches = this._getMatchingPoints(startNode) || [];
                //const endNodeMatches = this._getMatchingPoints(endNode) || [];

                // Add the graph connections for the line string start and end
                this.addGraphConnection(startNode, endNode);
            }/*

              // Add the connections to other lines
              startNodeMatches.forEach(matchedStartNode => {
                  this.addGraphConnection(startNode, matchedStartNode);
              });
              endNodeMatches.forEach(matchedEndNode => {
                  this.addGraphConnection(endNode, matchedEndNode);
              });
              
          }*/
            const matched = cachedConnections.get(nodeIdx);

            if (matched && matched.length) {
                matched.forEach(matchedNode => {
                    this.addGraphConnection(matchedNode, { featureIdx, nodeIdx });
                });
            }

        });

        return featureIdx;
    }

    /**
     * Calculates the length of a line represented by an array of coordinates.
     *
     * @param {LineString['coordinates']} coords - The coordinates of the line.
     *
     * @returns {number} - The length of the line in meters.
     */
    lineLength(coords: LineString['coordinates'], startIdx: number = 0, endIdx: number = Infinity): number {
        let sum = 0;
        for (let i = startIdx + 1; i <= Math.min(coords.length, endIdx); i++) {
            const prevCoord = coords[i - 1];
            const coord = coords[i] || prevCoord;
            sum += distance(prevCoord, coord) * 1000; // Convert to meters.
        }
        return sum;
    }

    /**
     * Finds and adds graph connections for nearby points within a specified distance.
     *
     * @param {nodeInfoType} testPoint - The point to test and find nearby connections.
     * @param {number} [distanceInMeters=1] - The maximum distance in meters to consider for nearby points.
     * @param {RBush<rbushData>} [tree=this._rbushTree] - The spatial index tree to search for nearby points.
     */
    _getMatchingPoints(testPoint: nodeInfoType, distanceInMeters: number = 1, tree: RBush<segmentInfo> = this._rbushTree): nodeInfoType[] | undefined {
        if (!testPoint.node) {
            testPoint.node = this.getNode(testPoint);
        }
        if (testPoint.node) {
            const coords3857 = WGS84ToWebMercator(testPoint.node[0], testPoint.node[1]);
            const min = [coords3857.x - (distanceInMeters / 2), coords3857.y - (distanceInMeters / 2)];  //polarToCartesian(testPoint.node, (5 / 4) * Math.PI, distanceInMeters);
            const max = [coords3857.x + (distanceInMeters / 2), coords3857.y + (distanceInMeters / 2)];  //polarToCartesian(testPoint.node, (1 / 4) * Math.PI, distanceInMeters);
            const nearbyLines = tree.search({ minX: min[0], minY: min[1], maxX: max[0], maxY: max[1] });
            const matchedPoints: nodeInfoType[] = [];
            nearbyLines.filter(line => line.featureIdx !== testPoint.featureIdx).forEach(neighbor => {
                if (!testPoint.node) return;
                const neighborFeature = this._features.get(neighbor.featureIdx);
                if (!neighborFeature) return;
                const startNode = neighborFeature.geometry.coordinates[neighbor.startIdx];
                const endNode = neighborFeature.geometry.coordinates[neighbor.endIdx];

                if (this._comparePositions(testPoint.node, endNode)) {
                    matchedPoints.push({ 'featureIdx': neighbor.featureIdx, 'nodeIdx': neighbor.endIdx });
                }
                if (this._comparePositions(testPoint.node, startNode)) {
                    matchedPoints.push({ 'featureIdx': neighbor.featureIdx, 'nodeIdx': neighbor.startIdx });
                }
            });
            return matchedPoints;
        }
    }

    /**
     * Compares two positions for equality.
     *
     * @param {Position} coordA - The first position to compare.
     * @param {Position} coordB - The second position to compare.
     * @returns {boolean} `true` if the positions are equal, `false` otherwise.
     */
    _comparePositions(coordA: Position, coordB: Position): boolean {
        // TODO tolerance
        return coordA[0] === coordB[0] && coordA[1] === coordB[1];
    }

    getFeatureRoutingInfo(feature: number | Feature<LineString | MultiLineString, GeoJsonProperties>) {
        const lineString = typeof feature === 'number' ? this._features.get(feature) : feature;


        // Extract options for cost calculation
        const { defaultSpeed, speedField, onewayField } = this._options;
        let speed = defaultSpeed;
        let isOneWay = false;

        if (lineString) {

            // Calculate the cost of the line segment based on options
            speed = Number((speedField !== undefined && lineString.properties) ? (lineString.properties[speedField] || defaultSpeed) : defaultSpeed);

            // Determine if the line is one-way based on options
            const onewayString = Array.isArray(this._options.onewayString) ? this._options.onewayString : [this._options.onewayString];
            isOneWay = Boolean(lineString.properties && onewayField && lineString.properties[onewayField] && onewayString.includes(lineString.properties[onewayField]));
        }

        return {
            speed,
            isOneWay
        };

    }

    speedToCost(speed: number, units: 'kph' | 'mph' | 'other', featureIdx: number, startNodeIdx: number = 0, endNodeIdx: number = Infinity) {

        // Define a function to convert cost units
        const convertUnits = (units: 'kph' | 'mph' | 'other', rate: number) => {
            switch (units) {
                case 'kph':
                    return rate * (1 / 1000);
                case 'mph':
                    return rate * (1 / 1609.34);
                case 'other':
                    return rate;
            }
        };

        const feature = this._features.get(featureIdx);

        // Calculate the length of the line string
        const length = this.lineLength(feature?.geometry.coordinates || [], startNodeIdx, endNodeIdx);
        const metersPerUnit = convertUnits(units, speed);

        return metersPerUnit * length;
    }

    /**
     * Adds a new node to the graph and updates adjacent edges.
     *
     * @param {nodeInfoType} nodeInfo - Information about the node to be added.
     */
    _addNode(nodeInfo: nodeInfoType) {
        // Add the new node
        this._graph.addNode(nodeInfo);

        // Retrieve any existing nodes on the same feature
        const existingNodesOnFeature = this._graph._featureLookup.get(nodeInfo.featureIdx);

        // If there are already nodes on this feature, we may need to split the edges
        // Identify existing nodes (NodeA and NodeB)
        if (existingNodesOnFeature) {
            const target = nodeInfo.nodeIdx;

            // Extract node indices and sort them in ascending order
            const featureIndex = Object.keys(existingNodesOnFeature)
                .map(nodeName => this._graph.nodeNameToFeatureNode(nodeName).nodeIdx)
                .sort((a, b) => a - b);

            let below: number | undefined;
            let above: number | undefined;

            // Loop through sorted feature indices to find the position of the new node
            featureIndex.forEach((current, i, arr) => {
                if (current === target) {
                    // The new node is inserted between current and above
                    below = arr[i - 1];
                    above = arr[i + 1];
                } else if (current < target) {
                    // The new node is below current
                    below = current;
                } else if (current > target && above === undefined) {
                    // The new node is above current
                    above = current;
                }
            });

            // Check if both above and below exist
            if (above !== undefined && below !== undefined) {
                const aboveNodeInfo = { featureIdx: nodeInfo.featureIdx, nodeIdx: above };
                const belowNodeInfo = { featureIdx: nodeInfo.featureIdx, nodeIdx: below };

                // Check if there is an edge between above and below
                if (this._graph.getEdge(aboveNodeInfo, belowNodeInfo) !== undefined) {
                    // Remove the edge between NodeA (above) and NodeB (below)
                    this._graph.removeEdge(aboveNodeInfo, belowNodeInfo);
                    // Add a new edge from NodeA to the new NodeC
                    this.addGraphConnection(aboveNodeInfo, nodeInfo);
                    // Add a new edge from the new NodeC to NodeB
                    this.addGraphConnection(nodeInfo, belowNodeInfo);
                }

                // Check if there is an edge between below and above
                if (this._graph.getEdge(belowNodeInfo, aboveNodeInfo) !== undefined) {
                    // Remove the edge between NodeA (below) and NodeB (above)
                    this._graph.removeEdge(belowNodeInfo, aboveNodeInfo);
                    // Add a new edge from NodeB (below) to the new NodeC
                    this.addGraphConnection(belowNodeInfo, nodeInfo);
                    // Add a new edge from the new NodeC to NodeA (above)
                    this.addGraphConnection(nodeInfo, aboveNodeInfo);
                }
            }
        }
    }


    /**
     * Adds a connection between two nodes in the graph.
     *
     * @param {nodeInfoType} startNode - The starting node.
     * @param {nodeInfoType} endNode - The ending node.
     */
    addGraphConnection(startNode: nodeInfoType, endNode: nodeInfoType) {
        // Make sure the nodes exist to connect
        this._addNode(startNode);
        this._addNode(endNode);

        // Get the cost info
        const { isOneWay, speed } = this.getFeatureRoutingInfo(startNode.featureIdx);

        let cost = 0;
        if (startNode.featureIdx === endNode.featureIdx) {
            // Right now all features connecting to other features have no cost TODO?
            cost = this.speedToCost(speed, this._options.speedUnits, startNode.featureIdx, startNode.nodeIdx, endNode.nodeIdx);
        }

        this._graph.addEdge(startNode, endNode, cost);

        // Add the reverse direction if not one-way.
        if (!isOneWay) {
            this._graph.addEdge(endNode, startNode, cost);
        }
    }

    /**
      * Removes a feature from the list and related indexes.
      *
      * @param {number} featureIdx - The index of the feature to remove.
      */
    remove(featureIdx: number): void {
        this.removeLine(featureIdx);
        super.remove(featureIdx);
        // You may add code here to remove the feature from additional indexes if needed.
    }

    /**
     * Removes a line feature from the collection and associated data structures.
     *
     * @param {number} featureIdx - The index of the line feature to be removed.
     */
    removeLine(featureIdx: number): void {
        const lineString = this._features.get(featureIdx);

        if (lineString) {
            const coords = lineString.geometry.coordinates;

            // Remove all segments in the segment rbush index
            for (let pointIdx = 0; pointIdx < coords.length; pointIdx++) {
                const [endLng, endLat] = coords[pointIdx];
                const { x: endX, y: endY } = WGS84ToWebMercator(endLng, endLat);

                if (pointIdx > 0) {
                    const [startLng, startLat] = coords[pointIdx - 1]; // Use pointIdx - 1 to get the start coordinates
                    const { x: startX, y: startY } = WGS84ToWebMercator(startLng, startLat);

                    // Calculate the bounding box of the segment
                    const bbox = {
                        minX: Math.min(startX, endX),
                        minY: Math.min(startY, endY),
                        maxX: Math.max(startX, endX),
                        maxY: Math.max(startY, endY)
                    };

                    // Find and remove references to the segment in the rbush tree
                    const refs = this._rbushTree.search(bbox);
                    refs
                        .filter(ref => ref.featureIdx === featureIdx)
                        .forEach(ref => this._rbushTree.remove(ref));
                }
            }

            this._graph.removeFeature(featureIdx);
        }
    }

    /**
     * Adds a new node to a feature at the specified index.
     *
     * @param {number} featureIdx - The index of the feature to add the node to.
     * @param {number} newNodeIdx - The index where the new node should be inserted.
     * @param {Position} node - The coordinates of the new node.
     * @param {Position} useNewFeatureIdx - Forces the updated feature to have a new featureIdx, used for tests.
     *
     * @returns {number | undefined} - The featureIdx of the new feature if successful, undefined otherwise.
     */
    addNodeToFeature(featureIdx: number, newNodeIdx: number, node: Position, useNewFeatureIdx: boolean = false): number | undefined {
        // Create an array to store the new coordinates
        const newCoords: Position[] = [];

        // Get the existing feature
        const feature = this._features.get(featureIdx);

        if (feature) {
            // Remove the existing feature
            this.remove(featureIdx);

            // Iterate through the existing coordinates
            for (let nodeIdx = 0; nodeIdx <= feature.geometry.coordinates.length; nodeIdx++) {
                if (nodeIdx < newNodeIdx) {
                    // Copy coordinates before the insertion point
                    newCoords.push(feature.geometry.coordinates[nodeIdx]);
                } else {
                    // Insert the new node's coordinates at the specified index
                    newCoords.push(nodeIdx === newNodeIdx ? node : feature.geometry.coordinates[nodeIdx - 1]);
                }
            }

            // Create a new feature with the updated coordinates
            const newFeature: Feature<LineString, GeoJsonProperties> = {
                ...feature,
                geometry: {
                    ...feature.geometry,
                    coordinates: newCoords
                }
            };

            // Add the new feature with the inserted node
            return this.addLine(newFeature, [0, newNodeIdx, Infinity], useNewFeatureIdx ? undefined : featureIdx);
        }
    }

    getNode(node: nodeInfoType | string): Position | undefined {
        let nodeInfo: nodeInfoType;
        if (typeof node === 'string') {
            nodeInfo = this._graph.nodeNameToFeatureNode(node);
        } else {
            nodeInfo = node;
        }
        if (nodeInfo) {
            return this._features.get(nodeInfo.featureIdx)?.geometry.coordinates[nodeInfo.nodeIdx];
        }
    }

    /**
     * Calculates the route between two nodes and returns it as a GeoJSON LineString.
     *
     * @param {nodeInfoType} nodeA - The starting node.
     * @param {nodeInfoType} nodeB - The ending node.
     *
     * @returns {Feature<LineString>} - A GeoJSON LineString representing the route.
     */
    routeNodes(nodeA: nodeInfoType, nodeB: nodeInfoType): Feature<LineString> {
        // Convert graphlib graph to dijkstrajs-compatible formatß
        const nodeAName = this._graph.featureNodeToNodeName(nodeA.featureIdx, nodeA.nodeIdx);
        const nodeBName = this._graph.featureNodeToNodeName(nodeB.featureIdx, nodeB.nodeIdx);
        const nodesInPath = this.routeAStar(nodeAName, nodeBName);

        if (!nodesInPath) {
            throw new Error('Count not find path');
        }

        // Accumulators
        const routeCoords: LineString['coordinates'] = [];
        let distanceSum = 0;
        let cost = 0;
        const pushRouteCoord = (coord: Position) => {
            if (!this._comparePositions(coord, routeCoords[routeCoords.length - 1])) {
                return routeCoords.push(coord);
            }
        }

        for (let i = 0; i < nodesInPath.length; i++) {
            const currNode = nodesInPath[i]
            const prevNode = i > 0 && nodesInPath[i - 1];

            if (currNode) {
                const currNodePosition: Position | undefined = this.getNode(currNode);
                if (currNodePosition) {
                    if (!prevNode) {
                        // First node!
                        routeCoords.push(currNodePosition);
                    } else {
                        const currNodeInfo = this._graph.nodeNameToFeatureNode(currNode);
                        const prevNodeInfo = this._graph.nodeNameToFeatureNode(prevNode);
                        const prevNodePosition: Position | undefined = this.getNode(prevNode);

                        if (prevNodePosition) {
                            // Make sure this is a new point, not reason to add the same point multiple times!

                            // Add intermediate nodes
                            if (currNodeInfo.featureIdx === prevNodeInfo.featureIdx) {
                                // The nodes are on the same line, so there may be some more nodes to add
                                const step = currNodeInfo.nodeIdx > prevNodeInfo.nodeIdx ? 1 : -1;
                                const start = prevNodeInfo.nodeIdx + step;
                                const end = currNodeInfo.nodeIdx;
                                for (let j = start; step > 0 ? j < end : j > end; j += step) {
                                    const nodeAtJ = this.getNode({ nodeIdx: j, featureIdx: currNodeInfo.featureIdx });
                                    if (nodeAtJ) pushRouteCoord(nodeAtJ);
                                }
                            }

                            // Calculate distance using haversine distance
                            distanceSum += (distance(prevNodePosition, currNodePosition) * 1000);
                            cost += this._graph.getEdge(currNodeInfo, prevNodeInfo) || 0;
                            pushRouteCoord(currNodePosition);
                            // TODO: Add instructions for each segment, e.g., "continue straight," "turn left," etc.

                        }
                    }
                }
            }
        }

        const routeLine: Feature<LineString> = {
            'type': 'Feature',
            'properties': {
                distance: distanceSum,
                cost,
                meanCost: distanceSum === 0 ? 0 : cost / distanceSum
            },
            'geometry': {
                'type': 'LineString',
                'coordinates': routeCoords
            }
        };

        return routeLine;
    }

    /**
     * Gets the closest intersection point to a given click point and provides from info about the feature it should be part of.
     *
     * @param {Position} clickPoint4326 - The click point in WGS84 coordinates (longitude, latitude).
     * @param {number} toleranceInMeters - The tolerance in web mercator meters for identifying the closest point (default is 0).
     *
     * @returns {intersectionPointInfo | undefined} - Information about the closest intersection point or undefined if not found.
     */
    getClosestPointInfo(clickPoint4326: Position, toleranceInMeters: number = 0): intersectionPointInfo | undefined {
        // Convert the click point to Web Mercator since the index is in Web Mercator.
        const clickPointWebMerc = WGS84ToWebMercator(clickPoint4326[0], clickPoint4326[1]);

        // Create a bounding box (bbox) around the click point for bbox intersection.
        const clickPointBbox = {
            minX: clickPointWebMerc.x - (toleranceInMeters / 2),
            minY: clickPointWebMerc.y - (toleranceInMeters / 2),
            maxX: clickPointWebMerc.x + (toleranceInMeters / 2),
            maxY: clickPointWebMerc.y + (toleranceInMeters / 2),
        };

        // Look for line segments that intersect the bbox.
        const closestNeighbors = this._rbushTree.search(clickPointBbox);

        // Process the closest neighbors.
        // Find the segment that is actually closest to the click point.
        const closestPoints = closestNeighbors.map(neighbor => {
            // Get the feature the idx was referring to.
            const feature = this.getFeature(neighbor.featureIdx) as Feature<LineString, GeoJsonProperties>;

            const defaultValues: intersectionPointInfo = {
                nearestPoint: undefined,
                nearestPointWGS84: undefined,
                distanceInMeters: Infinity,
                featureIdx: neighbor.featureIdx,
                startNodeIdx: neighbor.startIdx,
                endNodeIdx: neighbor.endIdx
            }

            // Convert the segment start and end into Web Mercator.
            const startNode = feature.geometry.coordinates[neighbor.startIdx];
            const endNode = feature.geometry.coordinates[neighbor.endIdx];
            const start = WGS84ToWebMercator(startNode[0], startNode[1]);
            const end = WGS84ToWebMercator(endNode[0], endNode[1]);

            if (feature) {
                // Find the nearest point on the segment between start and end.
                const nearestPoint = nearestPointOnLineSegment(
                    [clickPointWebMerc.x, clickPointWebMerc.y],
                    [[start.x, start.y], [end.x, end.y]],
                    'euclidean'
                );

                // Convert the nearest point back to WGS84 for simplicity.
                const nearestPointWGS84 = WebMercatorToWGS84(nearestPoint[0], nearestPoint[1]);

                // Update the nearestPoint (3857 and 4326) and return the distance from the click point in 3857 meters for sorting.
                return {
                    ...defaultValues,
                    nearestPoint,
                    nearestPointWGS84: [nearestPointWGS84.lng, nearestPointWGS84.lat],
                    distanceInMeters: euclideanDistance([clickPointWebMerc.x, clickPointWebMerc.y], nearestPoint)
                }
            } else {
                return defaultValues;
            }
        }).sort((pt1, pt2) => pt1.distanceInMeters - pt2.distanceInMeters);

        return closestPoints[0];
    }

    /**
      * Adds a point on a line feature at the closest intersection point to a given click point.
      *
      * @param {Position} clickPoint4326 - The click point in WGS 84 coordinates.
      * @param {number} toleranceInMeters - Tolerance for finding the closest intersection point in meters (default is 0).
      * @returns {Position | undefined} - The position of the added point or undefined if no intersection point is found.
      */
    addPointOnLine(clickPoint4326: Position, toleranceInMeters: number = 0): Position | undefined {
        // Get information about the closest intersection point.
        const intersectionPoint = this.getClosestPointInfo(clickPoint4326, toleranceInMeters);

        // Check if an intersection point is found and if it has nearestPointWGS84.
        if (!intersectionPoint || !intersectionPoint.nearestPointWGS84) {
            return undefined;
        }

        const feature = this.addNodeToFeature(intersectionPoint.featureIdx, intersectionPoint.endNodeIdx, intersectionPoint.nearestPointWGS84);

        // Return the nearestPointWGS84 if features are successfully split.
        return feature ? intersectionPoint.nearestPointWGS84 : undefined;
    }

    /**
    * Routes between two points on a map.
    *
    * @param {Position} start4326 - The starting point in WGS 84 coordinates.
    * @param {Position} end4326 - The ending point in WGS 84 coordinates.
    * @returns {Route} - The route between the two points.
    * @throws {Error} Throws an error if start or end points are not found or if there's an error with the nodes.
    */
    routePoints(start4326: Position, end4326: Position, toleranceInMeters: number = 0): Feature<LineString, GeoJsonProperties> {
        // Get information about the closest points to start and end coordinates.
        const nodeAInfo = this.getClosestPointInfo(start4326, toleranceInMeters);
        const nodeBInfo = this.getClosestPointInfo(end4326, toleranceInMeters);

        /**
         * Get node information based on intersectionPointInfo and target coordinates.
         *
         * @param {intersectionPointInfo} nodeInfo - Information about the closest point.
         * @param {Position} targetCoord - The target coordinate to compare.
         * @returns {nodeInfoType | undefined} - Node information or undefined if not found.
         */
        const getIntersectionNodeInfo = (nodeInfo: intersectionPointInfo, targetCoord: Position): nodeInfoType | undefined => {
            let match: number = -1;
            const feature = this.getFeature(nodeInfo.featureIdx) as Feature<LineString>;

            // Check if the target coordinate matches the start or end of the segment.
            const startPt = feature.geometry.coordinates[nodeInfo.startNodeIdx];
            if (this._comparePositions(targetCoord, startPt)) match = nodeInfo.startNodeIdx;
            const endPt = feature.geometry.coordinates[nodeInfo.endNodeIdx];
            if (match < 0 && this._comparePositions(targetCoord, endPt)) match = nodeInfo.endNodeIdx;

            return match === -1 ? undefined : {
                featureIdx: nodeInfo.featureIdx,
                nodeIdx: match
            };
        };

        // Check if node information is available, throw an error if not.
        if (!nodeAInfo || !nodeBInfo) {
            throw new Error(`Cannot find ${!nodeAInfo ? 'start' : 'end'} node`);
        }

        // Retrieve node information based on the closest points.
        const nodeA = getIntersectionNodeInfo(nodeAInfo, start4326);
        const nodeB = getIntersectionNodeInfo(nodeBInfo, end4326);

        // Check if node information is available, throw an error if not.
        if (!nodeA || !nodeB) {
            throw new Error(`Error with ${!nodeA ? 'start' : 'end'} node`);
        }

        // Route between the two nodes.
        return this.routeNodes(nodeA, nodeB);
    }

    routeAStar(start: string, end: string): string[] | null {
        type RouteNode = {
            name: string;
            cost: number;
            heuristic: number;
            parent?: RouteNode;
        };
        const startPosition = this.getNode(start);
        const endPosition = this.getNode(end);
        if (!startPosition || !endPosition) return null;

        const openList: RouteNode[] = [{
            name: start,
            cost: 0,
            heuristic: distance(startPosition, endPosition)
        }];

        const closedList: RouteNode[] = [];
        const graph = this._graph._graph;

        while (openList.length > 0) {
            openList.sort((a, b) => a.cost + a.heuristic - (b.cost + b.heuristic));
            const currentNode = openList.shift()!;

            closedList.push(currentNode);

            if (currentNode.name === end) {
                let path = [];
                let current: RouteNode | undefined = currentNode;
                while (current) {
                    path.unshift(current.name);
                    current = current.parent;
                }
                return path;
            }

            for (const neighbor in graph[currentNode.name]) {
                if (closedList.some(node => node.name === neighbor)) continue;

                const newCost = currentNode.cost + graph[currentNode.name][neighbor];
                const neighborPosition = this.getNode(neighbor);
                const heuristic = Infinity;
                if (neighborPosition) {
                    distance(neighborPosition, endPosition);
                }
                const neighborNode = {
                    name: neighbor,
                    cost: newCost,
                    heuristic: heuristic,
                    parent: currentNode
                };

                // Check if neighbor is in open list and if so, can this node provide a better path?
                const openNeighbor = openList.find(node => node.name === neighbor);
                if (!openNeighbor) {
                    openList.push(neighborNode);
                } else if (openNeighbor && newCost < openNeighbor.cost) {
                    openNeighbor.cost = newCost;
                    openNeighbor.parent = currentNode;
                }
            }
        }

        return null; // No path was found
    }
}