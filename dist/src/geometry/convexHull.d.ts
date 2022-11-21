/** thwese functions need their own library and testing suite! */
/** Convex Hull */
declare type hullPoint = {
    'x': number;
    'y': number;
};
export declare class ConvexHull {
    hull: Array<[number, number]>;
    cloud: Array<[number, number]>;
    constructor(positions: Array<[number, number]>);
    bbox(): [number, number, number, number];
    _makeHull(points: hullPoint[]): hullPoint[];
    /** Returns the convex hull, assuming that each points[i] <= points[i + 1]. Runs in O(n) time. */
    _makeHullPresorted(points: hullPoint[]): hullPoint[];
    _comparator(a: hullPoint, b: hullPoint): 0 | 1 | -1;
}
export {};
