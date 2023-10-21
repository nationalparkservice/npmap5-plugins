const map = new maplibregl.Map({
    container: "map",
    style: 'https://demotiles.maplibre.org/style.json', // style URL
    center: [-112.2138, 40.9572], // starting position [lng, lat]
    zoom: 4
});

// This is extra code used to pull an SVG in as a string
async function loadSvg(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Error fetching SVG:", error);
    }
}

const pts = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "coordinates": [
                    -107.01260252207857,
                    42.90605113669463
                ],
                "type": "Point"
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "coordinates": [
                    -109.03762459246244,
                    37.867431025696106
                ],
                "type": "Point"
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "coordinates": [
                    -116.42013759436634,
                    39.44342399726813
                ],
                "type": "Point"
            }
        }
    ]
};

window.map = map;
map.on('load', function () {

    // As soon as the map is loaded, add the plugin to it, this way any layers that request an icon will use the library
    const svgPlugin = new SVGPlugin(map);
    window.svgPlugin = svgPlugin;

    map.addSource('pts', {
        'type': 'geojson',
        'data': pts
    });

    map.addLayer({
        'id': 'pts-layer',
        'type': 'symbol',
        'source': 'pts',
        'layout': {
            'icon-image': SVGPlugin.stringifyConfig({
                baseImageId: 'peak-coyote',
                functions: [
                    {
                        name: 'applyCss',
                        params: {
                            color: 'red',
                            fill: 'blue',
                            width: '15px',
                            height: '15px'
                          }
                    }
                ]
            })
        }
    });

    loadSvg('./svgs/coyote.svg').then(coyoteIcon => svgPlugin.addImage('peak-coyote', coyoteIcon));

});