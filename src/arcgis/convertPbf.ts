import proto from '../types/FeatureCollection';
import Pbf from 'pbf';
import { esriFeatureServiceResponse, esriPbfFeature, esriPbfFeatureResult, esriPbfGeometryTypeEnum } from '../types/arcgisRestTypes';
import { deZigZag, mergeRings } from './esriTools';
import { Multipoint, Point, Polyline, Polygon } from 'arcgis-rest-api';

export class ConvertPbf {
    data: ArrayBuffer;
    constructor(pbfData: ArrayBuffer) {
        this.data = pbfData;
    }

    async convert() {
        const pbf = new Pbf(this.data);
        const pbfJson = proto().read(pbf);

        // Get the FeatureResult
        if (pbfJson.queryResult === null) {
            //console.warn('issue with the result', pbfJson);
            return this._buildResponse({
                'exceededTransferLimit': true,
            }, []);
        }

        const featureResult = pbfJson.queryResult.featureResult as esriPbfFeatureResult;

        // Get the field names
        const fields = featureResult.fields.map((field: any) => field.name);

        // Get the translation info
        const translation = featureResult.transform.translate;
        const scale = featureResult.transform.scale;
        const geometryType = featureResult.geometryType;
        const quantizeOriginPostion = featureResult.transform.quantizeOriginPostion;
        const srid = featureResult.spatialReference?.wkid.toString();

        const features = featureResult.features.map((feature: esriPbfFeature) => {

            // Parse each attribute
            let attributes = feature.attributes
                .map((attribute: any, index: number) => ({ 'key': fields[index], 'value': attribute[attribute['value_type']] }))
                .reduce((a: Object, c: any) => {
                    const newObj: any = {};
                    newObj[c.key] = c.value;
                    return { ...a, ...newObj };
                }, {});

            // Parse the geometries and clean up the quantization
            let rings: number[][][] = [[[]]];

            if (((feature as esriPbfFeature).geometry !== null)) {
                let counts = geometryType === esriPbfGeometryTypeEnum.esriGeometryTypePoint ? [1] : ((feature as esriPbfFeature).geometry.lengths);

                // Break into X and Y rings
                let x: number[] = [];
                let y: number[] = [];
                feature.geometry.coords.forEach((coord, idx) => {
                    if (idx % 2 === 0) {
                        x.push(coord);
                    } else {
                        y.push(coord);
                    }
                });
                //let x = feature.geometry.coords.filter((_: number, idx: number) => idx % 2 === 0);
                //let y = feature.geometry.coords.filter((_: number, idx: number) => idx % 2 === 1);


                // dezigzag the rings, and merge + reproject them
                let ringsX = deZigZag(x, counts, scale.xScale, translation.xTranslate, false);
                let ringsY = deZigZag(y, counts, scale.yScale, translation.yTranslate, quantizeOriginPostion === 0);

                // Merge the rings
                rings = mergeRings(ringsX, ringsY, srid);
                //rings = ringsX.map((ring, i) => ring.map((x, j) => [x, ringsY[i][j]]));
            }


            let geometry = {} as (Point | Polyline | Polygon | Multipoint)
            if (esriPbfGeometryTypeEnum[geometryType] === 'esriGeometryTypePoint') {
                geometry = { 'x': rings[0][0][0], 'y': rings[0][0][1] } as Point;
            } else if (esriPbfGeometryTypeEnum[geometryType] === 'esriGeometryTypeMultiPoint') {
                geometry = { 'points': rings[0] } as Multipoint;
            } else if (esriPbfGeometryTypeEnum[geometryType] === 'esriGeometryTypePolyline') {
                geometry = { paths: rings } as Polyline;
            } else if (esriPbfGeometryTypeEnum[geometryType] === 'esriGeometryTypePolygon') {
                geometry = { rings: rings } as Polygon;
            }

            return {
                'geometry': geometry,
                'attributes': attributes,
            } as esriFeatureServiceResponse['features'][0];
        });

        return this._buildResponse(featureResult, features);
    }

    _buildResponse(featureResult: Partial<esriPbfFeatureResult>, features: esriFeatureServiceResponse['features']) {
        return {
            'features': features,
            'exceededTransferLimit': featureResult.exceededTransferLimit,
            'spatialReference': { 'wkid': 4326, 'latestWkid': 4326 },
            'geometryType': esriPbfGeometryTypeEnum[featureResult.geometryType || 127].replace('Type', ''),
            'hasM': featureResult.hasM,
            'hasZ': featureResult.hasZ,
            'globalIdFieldName': featureResult.globalIdFieldName
        } as esriFeatureServiceResponse;
    }
};