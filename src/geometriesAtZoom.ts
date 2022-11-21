export default class GeometriesAtZoom {
    // Keeps track of the geometries that have already been loaded
    _geometriesAtZoom: (Map<string, boolean> | undefined)[] = new Array(24);
    _maxGeometryZoom: number = 0;

    async getKeysAtZoom(zoom: number, maxZoom?: number) {
        // Determine the max zoom based on the user input, the map's maxzoom, or the maxzoom we have cached
        maxZoom = maxZoom !== undefined ? maxZoom : this._maxGeometryZoom;

        const geometryGroups: string[][] = [];
        for (let z = (Math.min(maxZoom, this._maxGeometryZoom)); z >= zoom; z--) {
            if (this._geometriesAtZoom[z] !== undefined) {
                geometryGroups.push([...(this._geometriesAtZoom[z] as Map<string, boolean>).keys()]);
            }
        }
        return geometryGroups.flat();
    }

    updateKeyAtZoom(zoom: number, primaryKey: string) {
        let returnValue: ('added' | 'updated') = 'added';
        if (this._geometriesAtZoom[zoom] === undefined) this._geometriesAtZoom[zoom] = new Map();
        this._maxGeometryZoom = Math.max(this._maxGeometryZoom, zoom);
        for (let z = 0; z < zoom; z++) {
            if (this._geometriesAtZoom[z] !== undefined) {
                (this._geometriesAtZoom[z] as Map<string, boolean>).delete(primaryKey);
                returnValue = 'updated';
            }
        }
        (this._geometriesAtZoom[zoom] as Map<string, boolean>).set(primaryKey, true);
        return returnValue;
    }

    async updateKeysAtZoom(zoom: number, primaryKeys: string[]) {
        return primaryKeys.map(primaryKey =>
            this.updateKeyAtZoom(zoom, primaryKey)
        );
    }
}