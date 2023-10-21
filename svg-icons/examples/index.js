const map = new maplibregl.Map({
    container: "map",
    style: 'https://demotiles.maplibre.org/style.json', // style URL
    center: [-112.2138, 40.9572], // starting position [lng, lat]
    zoom: 11
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

window.map = map;
map.on('load', function () {

    // As soon as the map is loaded, add the plugin to it, this way any layers that request an icon will use the library
    const svgPlugin = new SVGPlugin(map);
    window.svgPlugin = svgPlugin;

    // Add the data sources for the layers
    // This is the outline of the island to provide context in the map
    map.addSource('island', {
        'type': 'geojson',
        'data': './island.json'
    });

    // This is the point layer we're going to style
    map.addSource('peaks', {
        'type': 'geojson',
        'data': './peaks.json'
    });

    map.addSource('lake-points', {
        'type': 'geojson',
        'data': './lake-points.json'
    });

    // Add the layers
    // This is the outline of the island to provide context in the map
    map.addLayer({
        'id': 'island',
        'type': 'fill',
        'source': 'island',
        paint: {
            'fill-color': 'brown',
            'fill-opacity': 0.25
        }
    });

    // We're using the filter parameter to provide a subset of the layers so that we can demonstrate different ways of using the plugin

    // If the source icon field points to anything other than peak-knob or peak, this is how we'll style it
    // The default values are included but commented out just for completeness
    const peaksOtherIconParams = {
        //fallbackImage: svg-dot,
        //imageOptions: {
        //    pixelRatio: window.devicePixelRatio,
        //    sdf: false,
        //    stretchX: undefined,
        //    stretchY: undefined,
        //    content: undefined,
        //},
        baseImageId: '{icon}', // We can use the mustache syntax to fetch the icon from the data
        fallbackFunctions: [
            {
                name: 'applyCss',
                params: {
                    color: 'rgba(255,255,0,.25)',
                    width: '10px',
                    height: '10px'
                }
            }
        ],
        functions: [
            {
                name: 'applyCss',
                params: {
                    color: 'red',
                    fill: 'blue',
                    width: '25px',
                    height: '25px'
                }
            }
        ]
    };

    map.addLayer({
        'id': 'peaks-other',
        'type': 'symbol',
        'source': 'peaks',
        filter: ['any', ['!=', 'icon', 'peak-knob'], ['!=', 'icon', 'peak']],
        layout: {
            'icon-image': SVGPlugin.stringifyConfig(peaksOtherIconParams)
        }
    });



    map.addLayer({
        'id': 'peaks-knob',
        'type': 'symbol',
        'source': 'peaks',
        filter: ['==', 'icon', 'peak-knob'],
        layout: {
            'icon-image': SVGPlugin.stringifyConfig({
                baseImageId: '{icon}',
                functions: [
                    {
                        name: 'applyCss',
                        params: {
                            color: 'purple',
                            width: '10px',
                            height: '11px'
                        }
                    }
                ]
            })
        }
    });

    map.addLayer({
        'id': 'peaks',
        'type': 'symbol',
        'source': 'peaks',
        filter: ['==', 'icon', 'peak'],
        layout: {
            'icon-image': SVGPlugin.stringifyConfig({
                baseImageId: '{icon}',
                functions: [
                    {
                        name: 'recolorRaster',
                        params: {
                            black: 'red',
                            white: 'yellow'
                        }
                    }
                ]
            })
        }
    });

    const imgRocks = document.createElement('img');
    imgRocks.onload = () => map.addImage('peak-rocks', imgRocks);
    imgRocks.src = './svgs/rocks.png';

    const imgPeak = document.createElement('img');
    imgPeak.onload = () => map.addImage('peak', imgPeak);
    imgPeak.src = './svgs/dot.png';

    loadSvg('./svgs/bison.svg').then(bisonIcon => svgPlugin.addImage('peak-bison', bisonIcon));
    loadSvg('./svgs/coyote.svg').then(coyoteIcon => svgPlugin.addImage('peak-coyote', coyoteIcon));
    loadSvg('./svgs/elephant.svg').then(elephantIcon => svgPlugin.addImage('peak-elephant', elephantIcon));
    loadSvg('./svgs/triangle.svg').then(knobIcon => svgPlugin.addImage('peak-knob', knobIcon));

    // Animated images
    loadSvg('./svgs/animated.svg').then(animated => svgPlugin.addImage('animated', animated));

    map.addLayer({
        'id': 'lake-points',
        'type': 'symbol',
        'source': 'lake-points',
        'layout': {
            'icon-image': MaplibreSVGPlugin.stringifyConfig({
                baseImageId: 'animated',
                functions: [
                    {
                        name: 'replaceValues',
                        params: {
                            outerColor: '{outerColor}',
                            innerColor: '{innerColor}',
                            //outlineColor: 'white',
                            //featureName: '{name}',
                            //type: '{type}'
                        }
                    },
                    {
                        name: 'replaceValues',
                        params: {
                            //outerColor: '{outerColor}',
                            //innerColor: '{innerColor}',
                            outlineColor: 'white',
                            featureName: '{name}',
                            type: '{type}'
                        }
                    }
                ]
            })
        }
    });
});
