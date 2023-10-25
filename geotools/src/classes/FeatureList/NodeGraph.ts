import { nodeInfoType } from "./FeatureListRouteable";

export type graphOptions = {
    defaultEdgeValue: number;
};

/**
 * Represents a graph of nodes and edges for routing purposes.
 */
export class NodeGraph {
    _graph: { [from: string]: { [to: string]: number } } = {};

    _edgeLookup: { [to: string]: string[] } = {};
    _featureLookup: Map<number, { [nodeName: string]: boolean }> = new Map();

    options: graphOptions;

    static defaultOptions: graphOptions = {
        defaultEdgeValue: Infinity
    };

    /**
     * Creates a new instance of the NodeGraph class.
     *
     * @param {Partial<graphOptions>} [options={}] - Optional graph options.
     */
    constructor(options: Partial<graphOptions> = {}) {
        this.options = { ...NodeGraph.defaultOptions, ...options };
    }

    featureNodeToNodeName(featureIdx: number, nodeIdx: number): string {
        return `${featureIdx.toString()}:${nodeIdx.toString()}`;

    }
    nodeNameToFeatureNode(nodeName: string): { featureIdx: number, nodeIdx: number } {
        const [featureIdxStr, nodeIdxStr] = nodeName.split(':');
        return {
            featureIdx: parseInt(featureIdxStr),
            nodeIdx: parseInt(nodeIdxStr)
        }
    }

    /**
     * Checks if a node with the given name exists in the graph.
     *
     * @param {nodeInfoType} nodeInfo - The name of the node to check.
     * @returns {boolean} True if the node exists, false otherwise.
     */
    hasNode(nodeInfo: nodeInfoType): boolean {
        const nodeName = this.featureNodeToNodeName(nodeInfo.featureIdx, nodeInfo.nodeIdx);
        return this._graph[nodeName] !== undefined;
    }

    /**
     * Sets a node in the graph by its unique name and coordinates.
     *
     * @param {nodeInfoType} nodeInfo - The unique name of the node.
     * @returns {{ [to: string]: number; }} The data where the node was set.
     */
    addNode(nodeInfo: nodeInfoType): { [to: string]: number; } {
        // Add the node to the list
        const nodeName = this.featureNodeToNodeName(nodeInfo.featureIdx, nodeInfo.nodeIdx);

        const featureLookupObj = this._featureLookup.get(nodeInfo.featureIdx) || {};
        featureLookupObj[nodeName] = true;
        this._featureLookup.set(nodeInfo.featureIdx, featureLookupObj);

        this._graph[nodeName] = this._graph[nodeName] || {};
        return this._graph[nodeName];
    }

    /**
     * Removes a node from the graph by its unique name.
     *
     * @param {nodeInfoType} nodeInfo - The unique name of the node to remove.
     * @returns {NodeGraph} The NodeGraph instance.
     */
    removeNode(nodeInfo: nodeInfoType): NodeGraph {
        const nodeName = this.featureNodeToNodeName(nodeInfo.featureIdx, nodeInfo.nodeIdx);

        // Add the node to the list
        delete this._graph[nodeName];

        // Remove all edges that have this node
        if (this._edgeLookup[nodeName] === undefined) this._edgeLookup[nodeName] = [];
        this._edgeLookup[nodeName].forEach(fromName => {
            this.removeEdge(this.nodeNameToFeatureNode(fromName), nodeInfo);
        });
        delete this._edgeLookup[nodeName];
        Object.keys(this._edgeLookup).forEach(edgeNodeName => {
            this._edgeLookup[edgeNodeName] = this._edgeLookup[edgeNodeName].filter(v => v !== nodeName)
        })

        // Remove this node from its feature
        const featureLookupObj = this._featureLookup.get(nodeInfo.featureIdx) || {};
        if (featureLookupObj[nodeName]) {
            delete featureLookupObj[nodeName]
        }
        this._featureLookup.set(nodeInfo.featureIdx, featureLookupObj);

        return this;
    }

    /**
     * Removes a node from the graph by its unique name.
     *
     * @param {number} featureIdx - The unique name of the node to remove.
     * @returns {NodeGraph} The NodeGraph instance.
     */
    removeFeature(featureIdx: number): NodeGraph {
        const featureLookupObj = this._featureLookup.get(featureIdx) || {};

        // Remove all the nodes in the feature
        Object.keys(featureLookupObj).forEach(nodeName => {
            const nodeInfo = this.nodeNameToFeatureNode(nodeName);
            this.removeNode(nodeInfo);
        })

        return this;
    }

    /**
     * Sets an edge between two nodes in the graph by their addresss.
     *
     * @param {nodeInfoType} from - The address of the source node.
     * @param {nodeInfoType} to - The address of the target node.
     * @param {number} [cost] - The cost of the edge (optional, uses default if not provided).
     * @returns {NodeGraph} The NodeGraph instance.
     */
    addEdge(from: nodeInfoType, to: nodeInfoType, cost?: number): NodeGraph {
        const fromName = this.featureNodeToNodeName(from.featureIdx, from.nodeIdx);
        const toName = this.featureNodeToNodeName(to.featureIdx, to.nodeIdx);

        if (!this.hasNode(from)) throw new Error(`Node "${from}" does not exist`);
        if (!this.hasNode(to)) throw new Error(`Node "${to}" does not exist`);

        cost = cost === undefined ? this.options.defaultEdgeValue : cost;
        // Add the edge to the list
        this._graph[fromName][toName] = cost;

        if (this._edgeLookup[toName] === undefined) this._edgeLookup[toName] = [];
        this._edgeLookup[toName].push(fromName);

        return this;
    }

    splitEdge(from: nodeInfoType, to: nodeInfoType, splitPoint: nodeInfoType, costA: number, costB: number): NodeGraph {
        const fromName = this.featureNodeToNodeName(from.featureIdx, from.nodeIdx);
        const toName = this.featureNodeToNodeName(to.featureIdx, to.nodeIdx);
        const splitPointName = this.featureNodeToNodeName(splitPoint.featureIdx, splitPoint.nodeIdx);

        const edgeFullCost = this.getEdge(from, to);

        if (edgeFullCost !== undefined) {
            // Remove the existing edge
            this.removeEdge(from, to);
        }

        costA = costA === undefined ? this.options.defaultEdgeValue : costA;
        costB = costB === undefined ? this.options.defaultEdgeValue : costB;

        // Add the edges to the list
        this._graph[fromName][splitPointName] = costA;
        this._graph[splitPointName][toName] = costB;

        if (this._edgeLookup[toName] === undefined) this._edgeLookup[toName] = [];
        this._edgeLookup[toName].push(splitPointName);
        if (this._edgeLookup[splitPointName] === undefined) this._edgeLookup[splitPointName] = [];
        this._edgeLookup[splitPointName].push(fromName);

        return this;
    }

    /**
     * Removes an edge between two nodes in the graph by their addresss.
     *
     * @param {nodeInfoType} from - The address of the source node.
     * @param {nodeInfoType} to - The address of the target node.
     */
    removeEdge(from: nodeInfoType, to: nodeInfoType) {
        const fromName = this.featureNodeToNodeName(from.featureIdx, from.nodeIdx);
        const toName = this.featureNodeToNodeName(to.featureIdx, to.nodeIdx);
        this._graph[fromName] && delete this._graph[fromName][toName];

        if (this._edgeLookup[toName] === undefined) this._edgeLookup[toName] = [];
        this._edgeLookup[toName] = this._edgeLookup[toName].filter(v => v !== fromName);
    }

    /**
     * Gets the cost of an edge between two nodes in the graph by their addresss.
     *
     * @param {nodeInfoType} from - The address of the source node.
     * @param {nodeInfoType} to - The address of the target node.
     * @returns {number} The cost of the edge.
     */
    getEdge(from: nodeInfoType, to: nodeInfoType): number | undefined {
        const fromName = this.featureNodeToNodeName(from.featureIdx, from.nodeIdx);
        const toName = this.featureNodeToNodeName(to.featureIdx, to.nodeIdx);

        try {
            return this._graph[fromName] && this._graph[fromName][toName];
        } catch (e) {
            return;
        }
    }
    /**
     * Retrieves all edges associated with a given node.
     *
     * @param {nodeInfoType} nodeInfo - Information about the target node.
     * @returns {Array<{ from: nodeInfoType, to: nodeInfoType }>} - An array of objects representing edges, with 'from' and 'to' properties.
     */
    getAllEdges(nodeInfo: nodeInfoType): { from: nodeInfoType, to: nodeInfoType }[] {
        // Get the node name based on feature and node indices
        const nodeName = this.featureNodeToNodeName(nodeInfo.featureIdx, nodeInfo.nodeIdx);

        // Collect edges where the target node is the 'from' node
        const fromEdges = Object.keys(this._graph[nodeName] || {}).map(key => ({
            'from': nodeInfo,
            'to': this.nodeNameToFeatureNode(key)
        }));

        // Collect edges where the target node is the 'to' node
        const toEdges = (this._edgeLookup[nodeName] || []).map(key => ({
            'from': this.nodeNameToFeatureNode(key),
            'to': nodeInfo
        }));

        // Combine and return both sets of edges
        return [...fromEdges, ...toEdges];
    }

    /**
     * Retrieves all nodes associated with a given feature.
     *
     * @param {number} featureIdx - The index of the feature to retrieve nodes for.
     * @returns {nodeInfoType[]} - An array of nodes associated with the specified feature.
     */
    getNodesOnFeature(featureIdx: number): nodeInfoType[] {
        return Object.keys(this._featureLookup.get(featureIdx) || {}).map(nodeName =>
            this.nodeNameToFeatureNode(nodeName)
        );
    }

}