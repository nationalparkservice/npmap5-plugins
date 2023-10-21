import {
    Map as MapElement,
    Cancelable,
    RequestParameters
} from 'maplibre-gl';

export default class MapFetch {
    // Uses the map's built in fetch library, which is slightly more robust than fetch

    _map: MapElement;
    constructor(map: MapElement) {
        this._map = map;
    }

    async fetch(url: RequestInfo | URL, init: RequestInit = {}, callbackCancel?: { (cancel: Cancelable): void }) {
        let urlString = url.toString();

        // URLs over 2048 characters can't use GET, so if no method is set, switch them to POST
        // Convert the body to a query string
        // TODO if there is already a querystring, we can't just append it
        // TODO this only works with urlencoded bodies, there can be others?
        const getUrl = init.body ? (urlString.replace(/\??$/, '?') + init.body) : urlString;
        if (getUrl.length > 2048 && init.method === undefined) {
            init.method = 'POST';
        }

        // Default to GET
        init.method = ['POST', 'GET', 'PUT'].indexOf((init.method || '').toUpperCase()) > -1 ? (init.method || '').toUpperCase() : 'GET';

        if (init.method === 'GET') {
            // We can't use the body, so we need to make it into a queryString
            urlString = getUrl;
        }

        const requestParameters: RequestParameters = {
            url: urlString,
            method: init.method as RequestParameters['method']
        };
        if (init.method === 'POST') {
            if (init.headers) requestParameters.headers = init.headers;
            if (init.body) requestParameters.body = init.body.toString();
        }

        return ({
            arrayBuffer: async () => {
                requestParameters.type = 'arrayBuffer';
                return this._getResource(requestParameters, callbackCancel) as Promise<ArrayBuffer>;
            },
            json: async () => {
                requestParameters.type = 'json'
                return this._getResource(requestParameters, callbackCancel) as Promise<unknown>;
            },
            text: async () => {
                requestParameters.type = 'string'
                return this._getResource(requestParameters, callbackCancel) as Promise<string>;
            }
        })
    }

    async _getResource(requestParameters: RequestParameters, callbackCancel?: { (cancel: Cancelable): void }) {
        return new Promise((res, rej) => {
            let cancelable = this._map.style.getResource(Math.random().toString(32).substring(2), requestParameters, (e, r) => {
                if (e) {
                    rej(e.toString());
                } else {
                    res(r)
                };
            });
            if (callbackCancel) {
                callbackCancel({
                    'cancel': () => {
                        cancelable.cancel();
                        rej('cancel');
                    }
                });
            }
        });
    }
}