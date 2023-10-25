import { nodeInfoType } from "./FeatureListRouteable";
import { NodeGraph } from "./NodeGraph";

const nodeA = { featureIdx: 0, nodeIdx: 1 };
const nodeB = { featureIdx: 1, nodeIdx: 2 };
const nodeC = { featureIdx: 2, nodeIdx: 0 };
const options = { defaultEdgeValue: 42 };

describe('NodeGraph', () => {

    // Initialize a NodeGraph instance for testing
    let graph: NodeGraph;

    beforeEach(() => {
        graph = new NodeGraph(options);
    });

    it('NodeGraph can set and get nodes', () => {
        graph.addNode(nodeA);
        graph.addNode(nodeB);

        expect(graph.getEdge(nodeA, nodeB)).toBeUndefined(); // No edge yet

        // Verify the existence of nodes
        expect(graph.hasNode(nodeA)).toBeTruthy();
        expect(graph.hasNode(nodeB)).toBeTruthy();
        expect(graph.hasNode(nodeC)).toBeFalsy(); // Not added
    });

    it('NodeGraph can set and get edges', () => {
        graph.addNode(nodeA);
        graph.addNode(nodeB);
        graph.addNode(nodeC);

        // Set an edge
        graph.addEdge(nodeA, nodeB, 10);

        expect(graph.getEdge(nodeA, nodeB)).toBe(10);
        expect(graph.getEdge(nodeB, nodeA)).toBeUndefined(); // Undirected graph

        // Test removing an edge
        graph.removeEdge(nodeA, nodeB);
        expect(graph.getEdge(nodeA, nodeB)).toBeUndefined();

        expect(graph.hasNode(nodeC)).toBeTruthy(); // Added this time
    });

    it('NodeGraph can remove nodes', () => {
        graph.addNode(nodeA);
        graph.addNode(nodeB);

        // Remove a node
        graph.removeNode(nodeA);

        // Verify that the node and its associated edge are removed
        expect(graph.hasNode({ featureIdx: 0, nodeIdx: 3 })).toBeFalsy();
        expect(graph.getEdge(nodeA, nodeB)).toBeUndefined();
    });

    it('NodeGraph can set and get nodes and edges by name', () => {
        graph.addNode(nodeA);
        graph.addNode(nodeB);

        // Set an edge by name
        graph.addEdge(nodeA, nodeB, 10);

        // Check if the edge exists
        expect(graph.getEdge(nodeA, nodeB)).toBe(10);
        expect(graph.getEdge(nodeB, nodeA)).toBeUndefined(); // Undirected graph

        // Remove an edge by name
        graph.removeEdge(nodeA, nodeB);
        expect(graph.getEdge(nodeA, nodeB)).toBeUndefined();
    });

    it('NodeGraph can set and remove nodes and edges by name', () => {
        graph.addNode(nodeA);
        graph.addNode(nodeB);

        // Set an edge by name
        graph.addEdge(nodeA, nodeB, 10);

        // Remove a node by name
        graph.removeNode(nodeA);

        // Verify that the node and its associated edge are removed
        expect(graph.hasNode(nodeA)).toBeFalsy();
        expect(graph.getEdge(nodeA, nodeB)).toBeUndefined();
    });

    it('NodeGraph delete all nodes in a feature', () => {
        const nodes = [
            { featureIdx: 0, nodeIdx: 1 },
            { featureIdx: 0, nodeIdx: 2 },
            { featureIdx: 0, nodeIdx: 3 },
            { featureIdx: 1, nodeIdx: 1 },
            { featureIdx: 1, nodeIdx: 2 },
        ];

        // Add the nodes
        nodes.forEach(node => graph.addNode(node));

        // Add the edges
        graph.addEdge(nodes[0], nodes[1], 10);
        graph.addEdge(nodes[1], nodes[2], 10);
        graph.addEdge(nodes[2], nodes[3], 10);
        graph.addEdge(nodes[3], nodes[4], 10);


        // Make sure all is good
        nodes.forEach(node => expect(graph.hasNode(node)).toBeTruthy());
        expect(graph.getEdge(nodes[0], nodes[1])).toBeDefined();
        expect(graph.getEdge(nodes[1], nodes[2])).toBeDefined();
        expect(graph.getEdge(nodes[2], nodes[3])).toBeDefined();
        expect(graph.getEdge(nodes[3], nodes[4])).toBeDefined();


        // Remove the 0 feature
        graph.removeFeature(0);

        // Make sure it deleted all the edges, except for the ones on feature idx 1
        nodes.forEach(node => {
            if (node.featureIdx === 0) {
                expect(graph.hasNode(node)).toBeFalsy()
            } else {
                expect(graph.hasNode(node)).toBeTruthy()

            }
        });

        // Make sure it deletes all edges associated with that feature
        expect(graph.getEdge(nodes[0], nodes[1])).toBeUndefined();
        expect(graph.getEdge(nodes[1], nodes[2])).toBeUndefined();
        expect(graph.getEdge(nodes[2], nodes[3])).toBeUndefined();
        expect(graph.getEdge(nodes[3], nodes[4])).toBeDefined();
    });

    it('NodeGraph should be able to tell you all edges that a node has', () => {
        const nodes = [
            { featureIdx: 0, nodeIdx: 1 },
            { featureIdx: 0, nodeIdx: 2 },
            { featureIdx: 0, nodeIdx: 3 },
            { featureIdx: 1, nodeIdx: 1 },
            { featureIdx: 1, nodeIdx: 2 },
        ]

        // Add the nodes
        nodes.forEach(node => graph.addNode(node));

        // Add the edges
        graph.addEdge(nodes[0], nodes[1], 10);
        graph.addEdge(nodes[0], nodes[2], 10);
        graph.addEdge(nodes[2], nodes[3], 10);
        graph.addEdge(nodes[3], nodes[0], 10);

        expect(graph.getAllEdges(nodes[0]).length).toBe(3);
        expect(graph.getAllEdges(nodes[0])[0]).toMatchObject({ 'from': nodes[0], 'to': nodes[1] });
        expect(graph.getAllEdges(nodes[0])[1]).toMatchObject({ 'from': nodes[0], 'to': nodes[2] });
        expect(graph.getAllEdges(nodes[0])[2]).toMatchObject({ 'from': nodes[3], 'to': nodes[0] });


        // Remove an edge
        graph.removeEdge(nodes[0], nodes[2]);
        expect(graph.getAllEdges(nodes[0]).length).toBe(2);
        expect(graph.getAllEdges(nodes[0])[0]).toMatchObject({ 'from': nodes[0], 'to': nodes[1] });
        expect(graph.getAllEdges(nodes[0])[1]).toMatchObject({ 'from': nodes[3], 'to': nodes[0] });

        // Remove node
        graph.removeNode(nodes[0]);
        expect(graph.getAllEdges(nodes[0]).length).toBe(0);
    });

    // Test case for when featureIdx has associated nodes
    it('should return an array of nodes when featureIdx has associated nodes', () => {
        graph.addNode(nodeA);
        graph.addNode(nodeB);
        graph.addNode(nodeC);
        const nodeD = { ...nodeC, nodeIdx: 2 };
        graph.addNode(nodeD);

        // Expect just nodeA for feature 0
        expect(graph.getNodesOnFeature(nodeA.featureIdx)).toEqual([nodeA]);

        // Expect nodeC and nodeD for feature 2
        expect(graph.getNodesOnFeature(nodeC.featureIdx)).toEqual([nodeC, nodeD]);

        // Remove a node
        graph.removeNode(nodeB);

        // NO Change
        // Expect just nodeA for feature 0
        expect(graph.getNodesOnFeature(nodeA.featureIdx)).toEqual([nodeA]);

        // Expect nodeC and nodeD for feature 2
        expect(graph.getNodesOnFeature(nodeC.featureIdx)).toEqual([nodeC, nodeD]);

        // Remove a node
        graph.removeNode(nodeA);

        // A is gone
        // Expect just nodeA for feature 0
        expect(graph.getNodesOnFeature(nodeA.featureIdx)).toEqual([]);

        // Expect nodeC and nodeD for feature 2
        expect(graph.getNodesOnFeature(nodeC.featureIdx)).toEqual([nodeC, nodeD]);

        // Remove a node
        graph.removeNode(nodeC);

        // A is gone
        // Expect just nodeA for feature 0
        expect(graph.getNodesOnFeature(nodeA.featureIdx)).toEqual([]);

        // Expect nodeC and nodeD for feature 2
        expect(graph.getNodesOnFeature(nodeC.featureIdx)).toEqual([nodeD]);

        // Remove a node
        graph.removeNode(nodeD);

        // A is gone
        // Expect just nodeA for feature 0
        expect(graph.getNodesOnFeature(nodeA.featureIdx)).toEqual([]);

        // Expect nodeC and nodeD for feature 2
        expect(graph.getNodesOnFeature(nodeC.featureIdx)).toEqual([]);
    });

    // Test case for when featureIdx has no associated nodes
    it('should return an empty array when featureIdx has no associated nodes', () => {
        // Call the method being tested
        const result: nodeInfoType[] = graph.getNodesOnFeature(2); // Assuming featureIdx 2 has no associated nodes

        // Assertion: Ensure the result is an empty array
        expect(result).toEqual([]);
    });

    // Test cRemove Feature
    it('should remove an entire feature', () => {
        graph.addNode(nodeA);
        graph.addNode(nodeB);
        graph.addNode(nodeC);
        const nodeD = { ...nodeC, nodeIdx: 2 };
        graph.addNode(nodeD);

        // Expect just nodeA for feature 0
        expect(graph.getNodesOnFeature(nodeA.featureIdx)).toEqual([nodeA]);

        // Expect nodeC and nodeD for feature 2
        expect(graph.getNodesOnFeature(nodeC.featureIdx)).toEqual([nodeC, nodeD]);

        // Remove a feature
        graph.removeFeature(nodeA.featureIdx)

        // NO Change
        // Expect just nodeA for feature 0
        expect(graph.getNodesOnFeature(nodeA.featureIdx)).toEqual([]);

        // Expect nodeC and nodeD for feature 2
        expect(graph.getNodesOnFeature(nodeC.featureIdx)).toEqual([nodeC, nodeD]);

        // Remove a feature
        graph.removeFeature(nodeC.featureIdx)

        // A is gone
        // Expect just nodeA for feature 0
        expect(graph.getNodesOnFeature(nodeA.featureIdx)).toEqual([]);

        // Expect nodeC and nodeD for feature 2
        expect(graph.getNodesOnFeature(nodeC.featureIdx)).toEqual([]);
    });

});