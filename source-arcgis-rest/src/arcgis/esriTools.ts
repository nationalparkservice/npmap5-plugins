import { esriGeometryType, Multipoint, Point, Polygon, Polyline } from "arcgis-rest-api";
import { esriExtent, esriFeatureServiceResponse, esriJSONTranform, esriQuantizationParameters } from "../types/arcgisRestTypes";
import { fromWGS84, metersPerPixel, toWGS84 } from "../WebMercator";

export const webMercatorCodes = ['102100', '900913', '3857', '3587', '54004', '41001', '102113', '3785'];

export function getEsriBoundingBox(lngLatBbox: [number, number, number, number]): esriExtent {
    const sw = [Math.min(lngLatBbox[0], lngLatBbox[2]), Math.min(lngLatBbox[1], lngLatBbox[3])];
    const ne = [Math.max(lngLatBbox[0], lngLatBbox[2]), Math.max(lngLatBbox[1], lngLatBbox[3])];
    let swXY = fromWGS84(sw[0], sw[1]);
    let neXY = fromWGS84(ne[0], ne[1]);
    return {
        'type': 'extent',
        'xmin': swXY.x,
        'ymin': swXY.y,
        'xmax': neXY.x,
        'ymax': neXY.y,
        'spatialReferece': {
            'latestWkid': 102100,
            'wkid': 3857
        }
    };
};

export function quantizationParameters(tileZoomLevel: number, tileSize: number = 256): esriQuantizationParameters {
    return {
        mode: 'view',
        originPosition: 'upperLeft',
        tolerance: metersPerPixel(tileZoomLevel, tileSize), //size of one pixel in the outSpatialReference units
        extent: getEsriBoundingBox([-180.0, -85.06, 180, 85.06])
    };
};

export function mergeRings(ringsX: number[][], ringsY: number[][], srid: string): number[][][] {
    const reproject = (x: number, y: number): number[] => {
        const xy = toWGS84(x, y);
        return [xy.lng, xy.lat];
    };

    if (webMercatorCodes.indexOf(srid) > -1) {
        return ringsX.map((ring, i) => ring.map((x, j) => reproject(x, ringsY[i][j])));
    } else {
        return ringsX.map((ring, i) => ring.map((x, j) => [x, ringsY[i][j]]));
    }

};

export function deZigZag(values: number[], splits: number[], scale: number, initialOffset: number, upperLeftOrigin: boolean): number[][] {
    return splits.map((split: number, i: number) => {
        let lastValue = 0;
        return Array(split).fill(undefined).map((_: undefined, j: number) => {
            const valueOffset = splits.reduce((a: number, v: number, idx: number) => a += (idx < i ? v : 0), 0);
            const value = values[valueOffset + j];
            const sign = upperLeftOrigin ? -1 : 1;
            let returnValue: number;

            if (j === 0) {
                returnValue = (value * sign) + (initialOffset / scale);
            } else {
                returnValue = (value * sign) + lastValue;
            }

            lastValue = returnValue;
            return returnValue;
        }).map((v: number) => v * scale);
    });
}


export class DeZigZagJSON {
    features: esriFeatureServiceResponse['features'];
    transform: esriJSONTranform;
    geometryType: esriGeometryType;
    srid: string = '3857';
    constructor(features: esriFeatureServiceResponse['features'], transform: esriJSONTranform, geometryType: esriGeometryType) {
        this.features = features;
        this.transform = transform;
        this.geometryType = geometryType;
    }

    async convert() {
        return this.features.map(feature => {
            feature.geometry = this.convertGeometry(feature.geometry);
            return feature;
        })
    }

    convertGeometry(geometry: esriFeatureServiceResponse['features'][0]['geometry']) {

        const counts: number[] = [];
        const x: number[] = [];
        const y: number[] = [];

        if (this.geometryType === 'esriGeometryPoint') {
            counts.push(1);
            x.push((geometry as Point).x);
            y.push((geometry as Point).y);
        } else if (this.geometryType === 'esriGeometryMultipoint') {
            (geometry as Multipoint).points.forEach(p => {
                counts.push(1);
                x.push(p[0]);
                y.push(p[1]);
            });
        } else if (this.geometryType === 'esriGeometryPolyline') {
            (geometry as Polyline).paths.forEach(l => {
                counts.push(l.length);
                l.forEach(position => {
                    x.push(position[0]);
                    y.push(position[1]);
                })
            });
        } else if (this.geometryType === 'esriGeometryPolygon') {
            (geometry as Polygon).rings.forEach(poly => {
                counts.push(poly.length);
                poly.forEach(position => {
                    x.push(position[0]);
                    y.push(position[1]);
                })
            });
        }

        // dezigzag the rings, and merge + reproject them
        const ringsX = deZigZag(x, counts, this.transform.scale[0], this.transform.translate[0], false);
        const ringsY = deZigZag(y, counts, this.transform.scale[1], this.transform.translate[1], this.transform.originPosition === 'upperLeft');

        // Merge the rings
        const rings = mergeRings(ringsX, ringsY, this.srid);

        let newGeometry = {} as (Point | Polyline | Polygon | Multipoint);
        if (this.geometryType === 'esriGeometryPoint') {
            newGeometry = { 'x': rings[0][0][0], 'y': rings[0][0][1] } as Point;
        } else if (this.geometryType === 'esriGeometryMultipoint') {
            newGeometry = { 'points': rings[0] } as Multipoint;
        } else if (this.geometryType === 'esriGeometryPolyline') {
            newGeometry = { paths: rings } as Polyline;
        } else if (this.geometryType === 'esriGeometryPolygon') {
            newGeometry = { rings: rings } as Polygon;
        }
        return newGeometry;
    }
}