export default class GeometriesAtZoom {
    _geometriesAtZoom: (Map<string, boolean> | undefined)[];
    _maxGeometryZoom: number;
    getKeysAtZoom(zoom: number, maxZoom?: number): Promise<string[]>;
    updateKeyAtZoom(zoom: number, primaryKey: string): "added" | "updated";
    updateKeysAtZoom(zoom: number, primaryKeys: string[]): Promise<("added" | "updated")[]>;
}
