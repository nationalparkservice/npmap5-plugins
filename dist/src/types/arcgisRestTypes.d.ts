import { esriGeometryType, Multipoint, Point, Polygon, Polyline, SpatialReferenceWkid } from "arcgis-rest-api";
import { VectorSourceSpecification } from "maplibre-gl";
export declare type esriRequestParameters = {
    "where"?: string;
    "objectIds"?: string;
    "geometry"?: string;
    "geometryType"?: esriGeometryType;
    "inSR"?: string | number;
    "spatialRel"?: "esriSpatialRelIntersects" | "esriSpatialRelContains" | "esriSpatialRelCrosses" | "esriSpatialRelEnvelopeIntersects" | "esriSpatialRelIndexIntersects" | "esriSpatialRelOverlaps" | "esriSpatialRelTouches" | "esriSpatialRelWithin";
    "relationParam"?: any;
    "time"?: number;
    "distance"?: number;
    "units"?: "esriSRUnit_Meter" | "esriSRUnit_StatuteMile" | "esriSRUnit_Foot" | "esriSRUnit_Kilometer" | "esriSRUnit_NauticalMile" | "esriSRUnit_USNauticalMile";
    "outFields"?: string;
    "returnGeometry"?: boolean;
    "maxAllowableOffset"?: number;
    "geometryPrecision"?: number;
    "outSR"?: string | number;
    "havingClause"?: string;
    "gdbVersion"?: string;
    "returnDistinctValues"?: boolean;
    "returnIdsOnly"?: boolean;
    "returnCountOnly"?: boolean;
    "returnExtentOnly"?: boolean;
    "orderByFields"?: string;
    "groupByFieldsForStatistics"?: string;
    "outStatistics"?: string;
    "returnZ"?: boolean;
    "returnM"?: boolean;
    "multipatchOption"?: string;
    "resultOffset"?: number;
    "resultRecordCount"?: number;
    "maxRecordCountFactor"?: number;
    "quantizationParameters"?: string;
    "returnCentroid"?: boolean;
    "resultType"?: "none" | "standard" | "tile";
    "token"?: string;
    "historicMoment"?: number;
    "returnTrueCurves"?: boolean;
    "sqlFormat"?: "none" | "standard" | "native";
    "returnExceededLimitFeatures"?: boolean;
    "datumTransformation"?: any;
    "timeReferenceUnknownClient"?: boolean;
    "f"?: "html" | "json" | "geojson" | "pbf";
};
export declare type esriExtent = {
    "type": "extent";
    "xmin": number;
    "ymin": number;
    "xmax": number;
    "ymax": number;
    "spatialReferece": SpatialReferenceWkid;
};
export declare type esriQuantizationParameters = {
    mode: 'view' | 'edit';
    originPosition: 'upperLeft' | 'lowerLeft';
    tolerance: number;
    extent: esriExtent;
};
export declare type ArcGisRestSpecification = Omit<VectorSourceSpecification, 'type' | 'tiles' | 'url' | 'scheme'> & {
    /** WHERE clause syntax on the fields in the layer is supported for most data sources.
     * Some data sources have restrictions on what is supported.
     * Hosted feature services in ArcGIS Enterprise running on a spatiotemporal
     * data source only support a subset of SQL-92.  */
    'where': string;
    /** The list of fields to be included in the returned result set.
     * This list is a comma-delimited list of field names.
     * You can also specify the wildcard "*" as the value of this parameter.
     * In this case, the query results include all the field values. */
    'outfields'?: Array<string> | '*';
    /** This option can be used for fetching query results up to the
     * resultRecordCount specified. When resultOffset is specified but
     *  this parameter is not, the map service defaults it to maxRecordCount. */
    'resultRecordCount'?: number;
    /** The URL to either the MapService or the FeatureService */
    'url': string;
    /** If required, you can specific your ArcGIS token */
    'token'?: string;
};
export declare type ArcGisRestSpecificationMetadata = {
    id: number;
    name: string;
    displayField: string;
    description: string;
    copyrightText: string;
    geometryType: esriGeometryType;
    style: string;
    htmlPopupType: 'esriServerHTMLPopupTypeAsHTMLText' | 'esriServerHTMLPopupTypeAsURL' | 'esriServerHTMLPopupTypeNone';
    extent: esriExtent;
};
export declare type esriFieldType = 'esriFieldTypeInteger' | 'esriFieldTypeSmallInteger' | 'esriFieldTypeDouble' | 'esriFieldTypeSingle' | 'esriFieldTypeString' | 'esriFieldTypeDate' | 'esriFieldTypeGeometry' | 'esriFieldTypeOID' | 'esriFieldTypeBlob' | 'esriFieldTypeGlobalID' | 'esriFieldTypeRaster' | 'esriFieldTypeGUID' | 'esriFieldTypeXML';
export declare type esriFullGeometryType = 
/** Any of the geometry coclass types. */
'esriGeometryAny' | 
/** A collection of geometries of arbitrary type. */
'esriGeometryBag' | 
/** A third degree bezier curve (four control points). */
'esriGeometryBezier3Curve' | 
/** A portion of the boundary of a circle. */
'esriGeometryCircularArc' | 
/** A portion of the boundary of an ellipse. */
'esriGeometryEllipticArc' | 
/** A rectangle indicating the spatial extent of another geometry. */
'esriGeometryEnvelope' | 
/** A straight line segment between two points. */
'esriGeometryLine' | 
/** A collection of surface patches. */
'esriGeometryMultiPatch' | 
/** An ordered collection of points. */
'esriGeometryMultipoint' | 
/** A geometry of unknown type. */
'esriGeometryNull' | 
/** A connected sequence of segments. */
'esriGeometryPath' | 
/** A single zero dimensional geometry. */
'esriGeometryPoint' | 
/** A collection of rings ordered by their containment relationship. */
'esriGeometryPolygon' | 
/** An ordered collection of paths. */
'esriGeometryPolyline' | 
/** directional line extending from an origin point. */
'esriGeometryRay' | 
/** An area bounded by one closed path. */
'esriGeometryRing' | 
/** A complete 3 dimensional sphere. */
'esriGeometrySphere' | 
/** A surface patch of triangles defined by the first point and two consecutive points. */
'esriGeometryTriangleFan' | 
/** overlapping sets of three consecutive points each. */
'esriGeometryTriangles' | 
/** A surface patch of triangles defined by three consecutive points. */
'esriGeometryTriangleStrip';
export declare type esriSpatialReference = {
    "wkid": number;
    "latestWkid"?: number;
    "vcsWkid"?: number;
    "latestVcsWkid"?: number;
    "wkt"?: string;
};
export interface esriMapServiceResponse {
    displayFieldName: string;
    /** fieldAliases deprecated at 10 */
    fieldAliases: {
        [key: string]: string;
    };
    /** features may include geometry for layers only */
    features: {
        'attributes': {
            [key: string]: string;
        };
        'geometry': (Point | Polyline | Polygon | Multipoint);
    }[];
    fields: {
        name: string;
        type: esriFieldType;
        alias: string;
        length?: number;
    }[];
    /** For Layers only */
    geometryType: esriGeometryType;
    /** For Layers only */
    spatialReference: esriSpatialReference;
    exceededTransferLimit?: boolean;
}
export interface esriFeatureServiceResponse extends esriMapServiceResponse {
    "objectIdFieldName": string;
    "globalIdFieldName": string;
    /** added in 10.1 */
    "hasZ": boolean;
    /** added in 10.1 */
    "hasM": boolean;
}
export declare type esriPbfFeatureResult = {
    exceededTransferLimit: boolean;
    features: Array<esriPbfFeature>;
    fields: Array<any>;
    geohashFieldName: string;
    geometryProperties?: any;
    geometryType: number;
    globalIdFieldName: string;
    hasM: boolean;
    hasZ: boolean;
    objectIdFieldName: string;
    serverGens?: any;
    spatialReference: esriSpatialReference;
    transform: esriPbfTranform;
    uniqueIdField: {
        [key: string]: (string | boolean);
    };
    values: Array<any>;
};
export declare type esriPbfFeature = {
    "attributes": Array<{
        [key: string]: (string | number | boolean);
    }>;
    "centroid"?: any;
    "compressed_geometry": string;
    "geometry": {
        [key: string]: Array<number>;
    };
    "length": number;
    "shapeBuffer"?: any;
};
export declare enum esriPbfGeometryTypeEnum {
    esriGeometryTypePoint = 0,
    esriGeometryTypeMultipoint = 1,
    esriGeometryTypePolyline = 2,
    esriGeometryTypePolygon = 3,
    esriGeometryTypeMultipatch = 4,
    esriGeometryTypeNone = 127
}
export declare type esriPbfScale = {
    mScale: number;
    xScale: number;
    yScale: number;
    zScale: number;
};
export declare type esriPbfTranslate = {
    mTranslate: number;
    xTranslate: number;
    yTranslate: number;
    zTranslate: number;
};
export declare type esriPbfTranform = {
    quantizeOriginPostion: number;
    scale: esriPbfScale;
    translate: esriPbfTranslate;
};
export declare type esriJSONTranform = {
    originPosition: 'upperLeft' | 'lowerLeft';
    scale: [number, number];
    translate: [number, number, number, number];
};
export interface esriServer {
    /** Added at 10.0 SP1 */
    "currentVersion"?: string;
    "serviceDescription"?: string;
    "description": string;
    "copyrightText": string;
    /**   //the feature layers published by this service */
    "layers"?: esriServerLayer[];
    /** the non-spatial tables published by this service - from 10 onward */
    "tables"?: {
        "id": number;
        "name": string;
    }[];
    "spatialReference": esriSpatialReference;
    "initialExtent": esriExtent;
    "fullExtent": esriExtent;
    "units": 'esriSRUnit_Meter' | 'esriSRUnit_StatuteMile' | 'esriSRUnit_Foot' | 'esriSRUnit_Kilometer' | 'esriSRUnit_NauticalMile' | 'esriSRUnit_USNauticalMile';
    "documentInfo": {
        [key: string]: string;
    };
    /** Comma separated list of "Query,Create,Delete,Update,Uploads,Editing,Map,Query,Data" */
    "capabilities": string;
    /** Added at 10.1 */
    "maxRecordCount"?: number;
    /** Comma separated list of 'html' | 'json' | 'geojson' | 'pbf' */
    "supportedQueryFormats": string;
    "cimVersion"?: string;
    "id"?: number;
    "name"?: string;
    "type"?: string;
    "parentLayer"?: {
        "id": string;
        "name": string;
    };
    "defaultVisibility"?: boolean;
    "minScale"?: number;
    "maxScale"?: number;
    "canScaleSymbols"?: boolean;
    "geometryType"?: string;
    "ownershipBasedAccessControlForFeatures"?: {
        "allowOthersToQuery": boolean;
    };
    "relationships"?: string[];
    "isDataVersioned"?: boolean;
    "isDataArchived"?: boolean;
    "archivingInfo"?: {
        "supportsQueryWithHistoricMoment": boolean;
        "startArchivingMoment": number;
    };
    "supportsStatistics"?: boolean;
    "supportsExceedsLimitStatistics"?: boolean;
    "supportsAdvancedQueries"?: boolean;
    "supportsCoordinatesQuantization"?: boolean;
    "supportsDatumTransformation"?: boolean;
    "advancedQueryCapabilities"?: {};
    "advancedQueryAnalyticCapabilities"?: {
        "supportsPagination": boolean;
        "supportsTrueCurve": boolean;
        "supportsQueryWithDistance": boolean;
        "supportsReturningQueryExtent": boolean;
        "supportsStatistics": boolean;
        "supportsPercentileStatistics": boolean;
        "supportsHavingClause": boolean;
        "supportsOrderBy": boolean;
        "supportsDistinct": boolean;
        "supportsCountDistinct": boolean;
        "supportsQueryWithResultType": boolean;
        "supportsReturningGeometryCentroid": boolean;
        "supportsSqlExpression": boolean;
        "supportsQueryWithDatumTransformation": boolean;
        "supportsLod": boolean;
        "supportsQueryWithLodSR": boolean;
        "supportsQueryAnalytic": boolean;
    };
    "hasMetadata"?: boolean;
    "extent"?: esriExtent;
    "sourceSpatialReference"?: esriSpatialReference;
    "effectiveMinScale"?: number;
    "drawingInfo"?: esriDrawingInfo;
    "hasAttachments"?: boolean;
    "htmlPopupType"?: string;
    "displayField"?: string;
    "typeIdField"?: string;
    "subtypeField"?: string;
    "fields"?: esriServiceFieldType[];
    "indexes"?: {
        [key: string]: string | boolean;
    }[];
    "geometryField"?: esriServiceFieldType[];
    "datesInUnknownTimezone"?: boolean;
    "dateFieldsTimeReference"?: {
        "timeZone": string;
        "respectsDaylightSaving": boolean;
    };
    "preferredTimeReference"?: any | null;
    "useStandardizedQueries"?: boolean;
    "supportedSpatialRelationships"?: ("esriSpatialRelIntersects" | "esriSpatialRelContains" | "esriSpatialRelCrosses" | "esriSpatialRelEnvelopeIntersects" | "esriSpatialRelIndexIntersects" | "esriSpatialRelOverlaps" | "esriSpatialRelTouches" | "esriSpatialRelWithin" | "esriSpatialRelRelation")[];
}
declare type esriServerLayer = {
    "id": number;
    "name": string;
    "parentLayerId": number;
    "defaultVisibility": boolean;
    "subLayerIds"?: number[];
    "minScale": number;
    "maxScale": number;
    "geometryType": esriGeometryType;
};
declare type esriFeatureServerOnly = {
    "hasVersionedData": boolean;
    "supportsDisconnectedEditing": boolean;
    /** Added at 10.8 */
    "supportsDatumTransformation"?: boolean;
    /** Added at 10.7  */
    "supportsReturnDeleteResults"?: boolean;
    "hasStaticData": boolean;
    /** Added at 10.7 */
    "supportsRelationshipsResource"?: boolean;
    /** Added at 10.8 */
    "userTypeExtensions"?: ('parcelFabric' | 'utilityNetwork')[];
    "advancedEditingCapabilities": {
        "supportsSplit": boolean;
        "supportsReturnServiceEditsInSourceSR": true;
    };
    "allowGeometryUpdates": boolean;
    "syncEnabled": boolean;
    /** Added at 10.9.1 */
    /** comma separated list of 'csv' | 'shapefile' | 'sqlite' | 'geoPackage' | 'filegdb' | 'featureCollection' | 'geojson' | 'excel' */
    "supportedExportFormats"?: string;
    /** Added 10.7.1 */
    "returnServiceEditsHaveSR"?: boolean;
    /** Added 10.07 */
    "validationSystemLayers"?: {
        "validationPointErrorlayerId": number;
        "validationLineErrorlayerId": number;
        "validationPolygonErrorlayerId": number;
        "validationObjectErrortableId": number;
    };
    /** Added at 10.0.6 */
    "extractChangesCapabilities"?: {
        "supportsReturnIdsOnly": boolean;
        "supportsReturnExtentOnly": boolean;
        "supportsReturnAttachments": boolean;
        "supportsLayerQueries": boolean;
        "supportsSpatialFilter": boolean;
        "supportsReturnFeature": boolean;
    };
    "syncCapabilities": {
        "supportsASync": boolean;
        "supportsRegisteringExistingData": boolean;
        "supportsSyncDirectionControl": boolean;
        "supportsPerLayerSync": boolean;
        "supportsPerReplicaSync": boolean;
        "supportsRollbackOnFailure": boolean;
        /** Added at 10.7 */
        "supportedSyncDataOptions"?: number;
        /** Added at 10.8 */
        "supportsQueryWithDatumTransformatiom"?: boolean;
    };
    "editorTrackingInfo": {
        "enableEditorTracking": boolean;
        "enableOwnershipAccessControl": boolean;
        "allowOthersToUpdate": boolean;
        "allowOthersToDelete": boolean;
    };
    "relationships": esriServer['tables'];
    /** Added at 10.7.1 */
    "datumTransformations"?: {
        "geoTransforms": [
            {
                "wkid": number;
                "latestWkid": number;
                "transformForward": boolean;
                "name": string;
            }
        ];
    }[];
    "enableZDefaults"?: boolean;
    /** Added at 10.7 */
    "isLocationTrackingService"?: boolean;
    /** Added at 10.7 */
    "isLocationTrackingView"?: boolean;
    /** Added at 11.0 */
    "isIndoorsService"?: boolean;
    "zDefault"?: number;
    "editFieldsInfo"?: any | null;
    "syncCanReturnChanges"?: boolean;
    "infoInEstimates"?: string[];
    "isDataBranchVersioned"?: boolean;
    "isDataReplicaTracked"?: boolean;
    "isCoGoEnabled"?: boolean;
    "supportsRollbackOnFailureParameter"?: boolean;
    "supportsValidateSQL"?: boolean;
    "supportsQuantizationEditMode"?: boolean;
    "supportsCalculate"?: boolean;
    "supportsASyncCalculate"?: boolean;
    "hasM"?: boolean;
    "hasZ"?: boolean;
    "allowUpdateWithoutMValues"?: boolean;
    "allowTrueCurvesUpdates"?: boolean;
    "onlyAllowTrueCurveUpdatesByTrueCurveClients"?: boolean;
    "supportsApplyEditsWithGlobalIds"?: boolean;
    "objectIdField"?: string;
    "globalIdField"?: string;
    "types"?: string[];
    "templates["?: {
        "name": string;
        "description": string;
        "prototype": {
            "attributes": {
                [key: string]: string;
            };
        };
        "drawingTool": string;
    }[];
    "standardMaxRecordCount"?: number;
    "tileMaxRecordCount"?: number;
    "standardMaxRecordCountNoGeometry"?: number;
    "maxRecordCountFactor"?: number;
};
declare type esriMapServerOnly = {
    "mapName": string;
    /** Added at 10.1 */
    "supportsDynamicLayers"?: boolean;
    "singleFusedMapCache": number;
    "tileInfo": {
        "rows": number;
        "cols": number;
        "dpi": number;
        "format": number;
        "compressionQuality": number;
        "origin": {
            x: number;
            y: number;
        };
        "spatialReference": esriSpatialReference;
        "lods": {
            "level": number;
            "resolution": number;
            "scale": number;
        }[];
    };
    /** from 10 onward - if the map supports querying and exporting maps based on time */
    "timeInfo"?: {
        "timeExtent": number[];
        "timeReference": {
            "timeZone": string;
            "respectsDaylightSaving": number;
        };
        "timeRelation": string;
        "defaultTimeInterval": number;
        "defaultTimeIntervalUnits": 'esriTimeUnitsCenturies' | 'esriTimeUnitsDays' | 'esriTimeUnitsDecades' | 'esriTimeUnitsHours' | 'esriTimeUnitsMilliseconds' | 'esriTimeUnitsMinutes' | 'esriTimeUnitsMonths' | 'esriTimeUnitsSeconds' | 'esriTimeUnitsWeeks' | 'esriTimeUnitsYears' | 'esriTimeUnitsUnknown';
        "defaultTimeWindow": number;
        "hasLiveData": boolean;
        "liveModeOffsetDirection": 'pastAndFuture' | 'past' | 'future';
    };
    /** Comma separated string of PNG32,PNG24,PNG,JPG,DIB,TIFF,EMF,PS,PDF,GIF,SVG,SVGZ */
    "supportedImageFormatTypes": string;
    /** Added at 10.1 */
    "maxRecordCount"?: number;
    /** Added at 10.1 */
    "maxImageHeight"?: number;
    /** Added at 10.1 */
    "maxImageWidth"?: number;
    /** Added at 10.1 */
    "minScale"?: number;
    /** Added at 10.1 */
    "maxScale"?: number;
    /** Added at 10.1 */
    "tileServers"?: string[];
    "exportTilesAllowed": boolean;
    "maxExportTilesCount": number;
    /** Comma separated list of FeatureServer,KmlServer,MobileServer,WCSServer,WFSServer,WMSServer,NAServer,SchematicsServer */
    "supportedExtensions": string;
    /** Added at 10.3 */
    "resampling"?: number;
    "subLayers"?: any[];
    "referenceScale"?: number;
    "subtypeFieldName"?: any | null;
    "defaultSubtypeCode"?: any | null;
    "subtypes"?: any | null;
    "canModifyLayer"?: boolean;
    "hasLabels"?: boolean;
    "effectiveMaxScale"?: number;
    "supportsDynamicLegends"?: boolean;
};
export declare type esriServerError = {
    "error": {
        "code": number;
        "message": 'json' | 'urlencoded';
        "details": any[];
    };
};
export declare type esriFeatureServer = esriServer & esriFeatureServerOnly;
export declare type esriMapServer = esriServer & esriMapServerOnly;
declare type esriDrawingInfo = {};
declare type esriServiceFieldType = {
    "name": string;
    "type": esriFieldType;
    "alias": string;
    "domain": string | null;
    "editable": boolean;
    "nullable": boolean;
    "defaultValue": string | null;
    "modelName": string;
};
export {};
