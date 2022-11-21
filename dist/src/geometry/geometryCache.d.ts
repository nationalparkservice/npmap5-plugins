import { Feature, GeoJsonProperties, Geometry, Position } from "geojson";
export declare class CacheableGeometry {
    primaryKey: string;
    geometry: Geometry;
    properties: GeoJsonProperties;
    firstPoint: Position;
    constructor(feature: Feature, primaryKey: string);
}
export declare class GeometryCache {
    geometries: Map<string, CacheableGeometry>;
    _primaryKey?: string;
    _defaultZoom: number;
    constructor(options?: {
        primaryKey?: string;
        defaultZoom?: number;
    });
    set primaryKey(x: string);
    _getKey(geometry: CacheableGeometry, maxZoom: number): string;
    _toCacheableGeometry(geometry: CacheableGeometry | Feature, maxZoom: number): CacheableGeometry;
    add(geometry: CacheableGeometry | Feature, maxZoom?: number): void;
    update(geometry: CacheableGeometry | Feature, maxZoom?: number): void;
    remove(geometry: CacheableGeometry | Feature, maxZoom?: number): void;
}
