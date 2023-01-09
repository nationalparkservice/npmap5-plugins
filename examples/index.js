import { default as layerSelector } from "./layerSelector.js";
import '../dist/maplibre-gl-interactivity.js'

// Workaround since Maplibregl doesn't support SVG icons natively
const addSvgToMap = (name, svg, map, size) => new Promise((res, rej) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const pixelRatio = 8;//window.devicePixelRatio;
    const svgImg = new Image();

    size = size.map(s => s * pixelRatio);
    canvas.width = size[0];
    canvas.height = size[1];

    svgImg.onload = () => {
        ctx.drawImage(svgImg, 0, 0, size[0], size[1]);
        const data = ctx.getImageData(
            0,
            0,
            size[0],
            size[1]
        );
        map.addImage(name, data, {
            pixelRatio: pixelRatio,
            sdf: true
        });
        res(data);
    }
    svgImg.src = svg;
});
////////////////////////////////

const map = new maplibregl.Map({
    container: 'map', // container id
    hash: true,
    style: 'https://demotiles.maplibre.org/style.json', // style URL
    center: [-56.1738, 46.7861], // starting position [lng, lat]
    zoom: 12 // starting zoom
});
window._map = map; // FOR DEBUG

// Add the popup listener
const popupListener = new Interactivity(maplibregl, map);

// Use a prefix so the layer selector can find our layers
const layerIdPrefix = 'example-layer-';

map.on('load', () => {

    // Add a "symbol", "circle", "line", "fill" to test all types

    const lighthouseSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' 
    width='22' height='22' xml:space='preserve'%3E%3Cpath 
    d='M8 8h6l2 14H6L8 8zM7 7h8v1H7V7zm4-7 4 3H7l4-3zm2 4 8-1v4l-8-1V4zM9 4 1 3v4l8-1V4z'/%3E%3C/svg%3E`;
    const airplaneSVG = `data:image/svg+xml,%3Csvg width='512' height='512' xmlns='http://www.w3.org/2000/svg' 
    aria-hidden='true' class='iconify iconify--fxemoji'%3E%3Cpath fill='%23707D7F' 
    d='M282.257 108.203h-33.322c-6.922 0-12.533-5.611-12.533-12.533s5.611-12.533 12.533-12.533h33.322c6.922 0 
    12.533 5.611 12.533 12.533s-5.611 12.533-12.533 12.533zm58.356 33.29c0-6.922-5.611-12.533-12.533-12.533h-33.323c-6.922 
    0-12.533 5.611-12.533 12.533s5.611 12.533 12.533 12.533h33.323c6.922 0 12.533-5.611 12.533-12.533zm-33.769 
    279.09c0-6.922-5.611-12.533-12.533-12.533h-33.322c-6.922 0-12.533 5.611-12.533 12.533s5.611 12.533 12.533 
    12.533h33.322c6.921 0 12.533-5.611 12.533-12.533zm45.823-45.822c0-6.922-5.611-12.533-12.533-12.533h-33.323c-6.922 
    0-12.533 5.611-12.533 12.533s5.611 12.533 12.533 12.533h33.323c6.922 0 12.533-5.611 12.533-12.533z'/%3E%3Cpath fill='%238DC5D8' 
    d='m47.652 190.785 30.932 63.496c2.38 4.885 2.275 10.402.232 15.009l-26.578 59.143c-3.919 8.721-14.165 12.613-22.886 
    8.694-7.116-3.198-11.017-10.609-10.083-17.966l.675-5.241 8.601-67.222.491 31.719-13.213-72.128-.873-4.768c-1.729-9.436
     4.52-18.487 13.956-20.216 7.838-1.435 15.415 2.652 18.746 9.48zm336.345 23.286L210.025 40.099a7.498 7.498 0 0 
     0-5.302-2.196h-35.078c-7.984 0-10.438 10.818-3.235 14.263l24.246 11.596a7.5 7.5 0 0 1 2.853 2.387l100.984 
     154.134m12.053 75.687L205.562 450.104a7.484 7.484 0 0 1-2.853 2.387l-24.246 11.596c-7.203 3.445-4.749 14.263
      3.235 14.263h35.078c1.989 0 3.896-.79 5.302-2.196L396.05 302.182'/%3E%3Cpath fill='%23C9D6D6' d='m507.79 261.784-1.339
       2.086c-.442.716-.99 1.472-1.642 2.416l-1.055 1.516-1.207 1.614c-1.71 2.361-3.818 4.929-6.297 7.93a147.032 147.032 0 0 
       1-8.519 9.191c-3.191 3.187-6.724 6.369-10.57 9.604-3.846 3.24-8.006 6.877-12.451 9.523-2.222 1.32-4.516 2.412-6.877 
       3.191-2.361.788-4.79 1.294-7.283 1.628-4.986.699-10.229 1.459-15.699 2.152-10.941 1.421-22.793 2.774-35.33 3.804-12.536 1.035-25.757 1.742-39.433 
       2.065-6.838.173-13.79.287-20.828.32-7.037.055-14.16.105-21.34.096-14.36-.013-28.948.058-43.535.447l-21.853.546c-7.265.165-14.502.41-21.682.473-14.36.186-28.492-.014-42.168-1.009a402.678 
       402.678 0 0 1-39.433-4.776 468.652 468.652 0 0 1-18.263-3.46c-5.898-1.178-11.596-2.571-17.067-4.243-5.47-1.692-10.713-3.563-15.699-5.629a168.99 
       168.99 0 0 1-14.16-6.671c-8.889-4.691-16.639-9.77-23.021-14.6-6.382-4.86-11.397-9.32-14.816-12.683l-2.262-2.275-1.642-1.745-1.339-1.513a3.684 
       3.684 0 0 1 0-4.881l1.339-1.513 1.642-1.745 2.262-2.275c3.419-3.363 8.434-7.824 14.816-12.683 6.382-4.83 14.132-9.909 23.021-14.6a169.774 
       169.774 0 0 1 14.16-6.671c4.986-2.066 10.229-3.937 15.699-5.629 5.47-1.673 11.169-3.066 17.067-4.243 5.898-1.24 11.995-2.4 18.263-3.46a402.947 
       402.947 0 0 1 39.433-4.776c13.676-.995 27.808-1.195 42.168-1.009 7.18.064 14.417.308 21.682.473l21.853.546c14.588.389 29.176.46 43.535.447 
       7.18-.009 14.303.042 21.34.096 7.037.033 13.989.147 20.828.32 13.676.323 26.896 1.03 39.433 2.065 12.536 1.03 24.389 2.383 35.33 3.804 5.47.693 
       10.713 1.453 15.699 2.152 2.493.334 4.922.84 7.283 1.628 2.361.778 4.655 1.87 6.877 3.191 4.445 2.646 8.605 6.284 12.451 9.523 3.846 3.236 7.379 
       6.418 10.57 9.605a147.313 147.313 0 0 1 8.519 9.191c2.479 3 4.587 5.569 6.297 7.93l1.207 1.614 1.055 1.516c.652.944 1.2 1.7 1.642 2.416l1.339 
       2.086a4.526 4.526 0 0 1 0 4.884z'/%3E%3Cpath fill='%23707D7F' 
       d='m137.859 259.344-.395.722a14.62 14.62 0 0 1-1.153 1.68c-.252.357-.534.644-.845.971l-.487.516-.528.464c-.732.594-1.573 1.144-2.516 
       1.498-.942.366-1.986.454-3.122.666l-3.677.622-8.818 1.484-10.434 1.648-11.645 1.69a671.275 671.275 0 0 1-12.453 1.597c-4.241.493-8.549.988-12.857 1.399-4.308.417-8.616.865-12.857 
        1.214l-12.453 1.053-5.949.476c-1.944.136-3.845.369-5.696.342-1.851-.023-3.652-.313-5.394-.938-1.742-.611-3.425-1.46-5.04-2.282a113.018 113.018 
        0 0 1-8.818-5.083c-1.313-.836-2.541-1.71-3.677-2.469-1.136-.77-2.179-1.594-3.122-2.276a82.498 82.498 0 0 1-4.375-3.566L0 259.344l1.548-1.427a84.377 84.377 
        0 0 1 4.375-3.566c.942-.682 1.986-1.506 3.122-2.276 1.136-.759 2.364-1.633 3.677-2.469a112.699 112.699 0 0 1 8.818-5.083c1.616-.822 3.298-1.671 5.04-2.282 
        1.742-.625 3.542-.915 5.394-.938 1.851-.028 3.753.206 5.696.342l5.949.476 12.453 1.053c4.241.349 8.549.797 12.857 1.214 4.308.411 8.616.906 12.857 1.399 
        4.241.506 8.414 1.037 12.453 1.597l11.645 1.69 10.434 1.648 8.818 1.484 3.677.622c1.136.212 2.179.3 3.122.666.942.354 1.784.904 2.516 1.498l.528.464.487.516c.31.327.592.614.845.971a14.62 
        14.62 0 0 1 1.153 1.68l.395.721zm280.221-22.407c1.669 1.558 4.004 3.688 6.491 6.156 2.475 2.462 5.107 5.325 6.98 8.251.936 1.462 1.663 2.918 2.163 4.316.496 
        1.406.738 2.765.823 4.217.004.183.02.365.033.548l.012.137.002.017c-.006.307.01-.401.008-.316l-.002.058-.004.115-.014.461-.023.921-.004.215-.015.091-.023.182a3.487 
        3.487 0 0 0-.017.37l-.072.52c-.024.364-.112.707-.178 1.058a15.627 15.627 0 0 1-1.489 4.205c-1.445 2.837-3.854 5.701-6.273 8.114a87.267 87.267 0 0 1-3.522 3.34c-1.11 
        1.01-2.132 1.889-2.988 2.641l-2.789 2.424s1.349.466 3.747.689c2.395.223 5.849.228 9.957-.798 2.042-.531 4.269-1.29 6.531-2.504a26.307 26.307 0 0 0 6.699-5.066 23.586 
        23.586 0 0 0 5.146-8.282 19.56 19.56 0 0 0 
        .752-2.464c.102-.424.214-.824.3-1.273l.213-1.451.093-.73.043-.365.019-.244.053-.92.024-.46.006-.115.009-.472-.009-.324-.048-1.295c-.2-3.455-1.176-6.955-2.758-9.926-1.574-2.984-3.66-5.44-5.846-7.366-4.411-3.861-9.125-5.742-13.127-6.764-4.029-1.006-7.448-1.106-9.837-.972-2.391.133-3.761.526-3.761.526s1.018.989 
        2.695 2.535z'/%3E%3C/svg%3E`;
    addSvgToMap('lighthouse', lighthouseSVG, map, [22, 22]).finally(() =>
        addSvgToMap('airplane', airplaneSVG, map, [22, 22]).finally(() => {

            // Symbol
            const symbolName = 'Lighthouses (symbol)';
            const symbolLink = './data/st_pierre_phares.geojson';
            map.addSource(symbolName, {
                'type': 'geojson',
                'data': symbolLink,
            });
            map.addLayer({
                'id': layerIdPrefix + symbolName,
                'type': 'symbol',
                'source': symbolName,
                'minzoom': 0,
                'maxzoom': 20,
                'layout': {
                    'icon-image': ['get', 'man_made'],
                    'text-field': ['coalesce', ['string', ['get', 'name']], ['string', ['get', 'man_made']]],
                    'text-size': 12,
                    'text-anchor': 'top',
                    'text-offset': [0, 1]
                },
                'paint': {
                    'icon-color': '#999900'
                }
            });
            popupListener.addPopup(layerIdPrefix + symbolName, {
                header: ['format', ['image', 'lighthouse']],
                body: '{name}'
            }, {
                'groupName': 'Lighthouses',
                'icon': 'airplane',
                'highlightFeature': true
            });
            popupListener.addTooltip(layerIdPrefix + symbolName, {
                'body': ['coalesce', ['string', ['get', 'name']], ['string', ['get', 'man_made']]]
            }, {});


            const circleName = 'Capes (circle)';
            const circleLink = './data/st_pierre_capes.geojson';
            map.addSource(circleName, {
                'type': 'geojson',
                'data': circleLink,
            });
            map.addLayer({
                'id': layerIdPrefix + circleName,
                'type': 'circle',
                'source': circleName,
                'minzoom': 0,
                'maxzoom': 20,
                'paint': {
                    'circle-color': '#2222AA',
                    'circle-opacity': 0.6,
                    'circle-radius': 10,
                    'circle-stroke-color': '#000077',
                    'circle-stroke-opacity': 1,
                    'circle-stroke-width': 4
                }
            });
            popupListener.addPopup(layerIdPrefix + circleName, '{name}', {});
            popupListener.addTooltip(layerIdPrefix + circleName, {
                'header': 'Cape', 'body': ["format",
                    "LargeText", { "font-scale": 1.2 },
                    "SmallerText", { "font-scale": 0.8 }
                ]
            }, {
                'highlightFeature': true
            });


            const lineName = 'Highways (line)';
            const lineLink = './data/st_pierre_highways.geojson';
            map.addSource(lineName, {
                'type': 'geojson',
                'data': lineLink,
            });
            map.addLayer({
                'id': layerIdPrefix + lineName,
                'type': 'line',
                'source': lineName,
                'minzoom': 0,
                'maxzoom': 20,
                'paint': {
                    'line-color': '#DDDDAA',
                    'line-opacity': 1,
                    'line-width': 5
                }
            });
            popupListener.addPopup(layerIdPrefix + lineName, '{name}', {
                'primaryKeys': ['name']
            });
            popupListener.addTooltip(layerIdPrefix + lineName, '{name}', {
                'highlightFeature': true,
                'primaryKeys': ['name']
            });


            const fillName = 'Woods (polygon)';
            const fillLink = './data/st_pierre_boisée.geojson';
            map.addSource(fillName, {
                'type': 'geojson',
                'data': fillLink,
            });
            map.addLayer({
                'id': layerIdPrefix + fillName,
                'type': 'fill',
                'source': fillName,
                'minzoom': 0,
                'maxzoom': 20,
                'paint': {
                    'fill-color': '#66FF66',
                    //'fill-opacity': 1,
                    'fill-outline-color': '#ff0000',
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        1,
                        0.5
                    ]
                }
            });
            popupListener.addPopup(layerIdPrefix + fillName, '{natural}', {
                'primaryKeys': ['natural']
            });
            popupListener.addTooltip(layerIdPrefix + fillName, '{natural}', {
                'primaryKeys': ['natural'],
                'highlightFeature': true
            });

        }));
});

// After the last frame rendered before the map enters an "idle" state,
//  add the toggle fields / layer selector
map.on('idle', () => {
    // Add the layer selector
    layerSelector(map, layerIdPrefix);
});
