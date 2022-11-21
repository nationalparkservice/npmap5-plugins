import { default as ArcGisRestSource } from "../dist/maplibre-gl-arcgis-rest-source.esm.js";
import { default as layerSelector } from "./layerSelector.js";


const map = new maplibregl.Map({
    container: "map",
    style: 'https://demotiles.maplibre.org/style.json', // style URL
    center: [-87.631760, 41.874674], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

window.mmaapp = map;
// Add the ArcGisRestSource
map.addSourceType('arcgis-rest', ArcGisRestSource(maplibregl), (e) => e && console.error('There was an error', e));

// Use a prefix so the layer selector can find our layers
const layerIdPrefix = 'example-';

map.on('load', () => {

    map.addSource('cities', {
        'type': 'arcgis-rest',
        'url': 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0/query'
    });
    map.addSource('states', {
        "type": 'arcgis-rest',
        'url': "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2",
    });
    map.addSource('counties', {
        "type": 'arcgis-rest',
        'url': "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/3",
    });
    map.addSource('highways', {
        'type': 'arcgis-rest',
        "url": "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/1",
        "resultRecordCount": 250 //The smaller the number, the more requests, but items will show up quicker
    });

    map.addLayer({
        "id": layerIdPrefix + "States",
        "source": "states",
        "type": "line",
        "paint": {
            'line-color': '#000',
            'line-width': 2
        }
    });
    map.addLayer({
        "id": layerIdPrefix + "Counties",
        "source": "counties",
        "type": "line",
        "paint": {
            'line-color': '#999',
            'line-width': 1
        },
        'filter': ["all", ['>', ["zoom"], 7]]
    });

    map.addLayer({
        "id": layerIdPrefix + "Cities (circle)",
        "source": "cities",
        "type": "circle",
        'paint': {
            'circle-color': '#aaf',
            'circle-radius': [
                "case",
                ['>', ["get", "pop2000"], 1000000],
                8,
                ['>', ["get", "pop2000"], 500000],
                5,
                ['>', ["get", "pop2000"], 100000],
                4,
                ['>', ["get", "pop2000"], 50000],
                3,
                ['>', ["get", "pop2000"], 20000],
                2,
                1
            ]
        }
    });

    map.addLayer({
        "id": layerIdPrefix + "Highways",
        "source": "highways",
        "type": "line",
        'paint': {
            'line-color': [
                "case",
                ['==', ["get", "type"], "Multi-Lane Divided"],
                "#f44",
                ['>', ["get", "type"], "Paved Divided"],
                "#fa4",
                ['>', ["get", "type"], "Paved Undivided"],
                "#444",
                ['>', ["get", "type"], "Gravel"],
                "#555",
                "#777"
            ]
        }
    });

    map.addLayer({
        "id": layerIdPrefix + "Cities (label)",
        "source": "cities",
        "type": "symbol",
        'layout': {
            'text-field': ['get', 'areaname'],
            'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
            'text-radial-offset': 0.5,
            'text-justify': 'auto'
        },
        'filter': ["any",
            ["all", ['>', ["get", "pop2000"], 1000000]],
            ["all", ['>', ["get", "pop2000"], 500000], ['>', ["zoom"], 3]],
            ["all", ['>', ["get", "pop2000"], 100000], ['>', ["zoom"], 5]],
            ["all", ['>', ["get", "pop2000"], 50000], ['>', ["zoom"], 9]],
            ["all", ['>', ["get", "pop2000"], 20000], ['>', ["zoom"], 10]],
            ["all", ['>', ["zoom"], 11]]
        ]
    });

});

// After the last frame rendered before the map enters an "idle" state,
//  add the toggle fields / layer selector
map.on('idle', () => {
    // Add the layer selector
    layerSelector(map, layerIdPrefix);
});