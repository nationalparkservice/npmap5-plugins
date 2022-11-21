/// <reference types="geojson-vt" />
declare module 'vt-pbf' {
    import geojsonvt from "geojson-vt";
    function fromGeojsonVt(geojsonvt: {
        [layerName: string]: geojsonvt.Tile;
    }, options: {
        version?: number;
        extent?: number;
    }): any;
}
