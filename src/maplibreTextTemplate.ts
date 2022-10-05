import {
    default as MapLibrary,
    Map as MaplibreMap,
    CanonicalTileID,
    MapOptions
} from 'maplibre-gl';
import { mapIconToImage } from './icons';
import { QueryFeature } from '.';


type section = {
    fontStack?: string,
    image?: string,
    scale?: number,
    text?: string,
    textColor?: string
};

const emptyMapTemplate: MapOptions = {
    'container': document.createElement('div'),
    'style': {
        'version': 8,
        'glyphs': '{fontstack}/{range}.pbf', //DUMMY
        'sources': {
            'blank': {
                'type': 'geojson',
                'data': {
                    "type": "FeatureCollection",
                    "features": []
                }
            }
        },
        'layers': []
    }
};

export default class maplibreTextTemplate {
    private _map: MaplibreMap;
    constructor(mapLibrary: typeof MapLibrary) {
        this._map = new mapLibrary.Map(emptyMapTemplate);
    }

    evaluateText(expression: string | Array<any>,
        properties: { [key: string]: string },
        featureState?: QueryFeature['state']): HTMLParagraphElement {
        const p = document.createElement('p');
        this._evaluate(expression, properties, featureState)
            .then(sections =>
                p.textContent = sections.map(section => section.text).join('')
            );
        return p;
    };

    evaluateHtml(expression: string | Array<any>,
        properties: { [key: string]: string },
        featureState?: QueryFeature['state'],
        map?: MaplibreMap): HTMLDivElement {
        const imageList = map ? map.style._availableImages : [];
        const div = document.createElement('div');
        this._evaluate(expression, properties, featureState, undefined, imageList)
            .then(sections => {
                sections.forEach(section => div.appendChild(this._sectionToHtml(section, map)));
                console.log('sections', sections, div);
            }
            ).catch(e => {
                console.log('ERROR WITH DIV', e);
            });
        return div;
    };

    private _sectionToHtml(section: section, map?: MaplibreMap): HTMLSpanElement {
        const span = document.createElement('span');
        span.textContent = section.text || null;

        if (section.fontStack) {
            span.style.fontFamily = section.fontStack;
        }
        if (section.scale) {
            span.style.fontSize = (section.scale * 100) + '%';
        }
        if (section.textColor) {
            span.style.color = section.textColor;
        }
        if (map && section.image) {
            if (map.hasImage(section.image)) {
                const img = this._drawIcon(section.image, section.image, map);
                if (img) {
                    span.appendChild(img);
                }
            }
        }
        return span;
    }

    private async _evaluate(
        expression: string | Array<any>,
        properties: { [key: string]: string },
        featureState?: QueryFeature['state'],   
        tileId?: CanonicalTileID,
        availableImages?: Array<string>) {
        const layerId = Math.random().toString(32).substring(2);
        this._map.addLayer({
            'id': layerId,
            'source': 'blank',
            'type': 'symbol',
            'layout': {
                'text-field': expression
            }
        });
        await new Promise<void>(res => this._map.once('styledata', () => res()));
        const layer = this._map.getLayer(layerId);
        const sections = (layer.layout && (layer.layout as any)._values['text-field'].evaluate(
            { 'properties': properties, 'state': featureState },
            featureState,
            tileId,
            availableImages).sections) || [];
        this._map.removeLayer(layerId);

        return sections as Array<section>;
    }

    private _drawIcon(iconName: string, altText: string, map: MaplibreMap): HTMLImageElement | undefined {
        const image = mapIconToImage(iconName, map);
        if (altText && altText.toString) {
            image.element.title = image.element.alt = altText.toString();
        }
        return image.element;
    }
}