import { esriFeatureServiceResponse, esriPbfFeatureResult } from '../types/arcgisRestTypes';
export declare class ConvertPbf {
    data: ArrayBuffer;
    constructor(pbfData: ArrayBuffer);
    convert(): Promise<esriFeatureServiceResponse>;
    _buildResponse(featureResult: Partial<esriPbfFeatureResult>, features: esriFeatureServiceResponse['features']): esriFeatureServiceResponse;
}
