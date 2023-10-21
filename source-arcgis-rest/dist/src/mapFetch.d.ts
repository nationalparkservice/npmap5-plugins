import { Map as MapElement, Cancelable, RequestParameters } from 'maplibre-gl';
export default class MapFetch {
    _map: MapElement;
    constructor(map: MapElement);
    fetch(url: RequestInfo | URL, init?: RequestInit, callbackCancel?: {
        (cancel: Cancelable): void;
    }): Promise<{
        arrayBuffer: () => Promise<ArrayBuffer>;
        json: () => Promise<unknown>;
        text: () => Promise<string>;
    }>;
    _getResource(requestParameters: RequestParameters, callbackCancel?: {
        (cancel: Cancelable): void;
    }): Promise<unknown>;
}
