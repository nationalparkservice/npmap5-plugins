
import { Map as maplibreMap, Popup } from 'maplibre-gl';
import { QueryFeature, popupTemplate } from '.';
import BindPopup from './bindpopup';
import { colorTools, imageTools, icons, mapIconToImage, svgIcon } from './icons';

type MaplibreRGBAColor = {
    // maplibre uses a system where these colors are all percentages
    'r': number,
    'g': number,
    'b': number,
    'a': number
};
const toCSSRgba = (rgba: MaplibreRGBAColor | undefined) => {
    if (!rgba) return;
    return `rgba(${Math.round(rgba.r * 255)},${Math.round(rgba.g * 255)},${Math.round(rgba.b * 255)},${rgba.a})`;
};

type layerInfo = {
    groupName: string,
    popup: BindPopup,
    primaryKeys?: Array<string>,
    feature: QueryFeature,
    content: HTMLElement,
    textContent: string,
    symbolIcon?: string,
    groupIcon?: string,
    iconColor?: string;
    iconStroke?: string;
    iconStrokeWidth?: number;
};

export default function formatter(features: Array<QueryFeature>, _: popupTemplate, map?: maplibreMap, activePopups?: Map<'tooltip' | 'popup', Map<string, BindPopup>>, parentPopup?: Popup) {
    if (!map || !activePopups) {
        throw new Error('activePopups is required for the default multi popup')
    }

    const div = document.createElement('div');
    div.classList.add('maplibregl-popup-content-multipopup')
    const ulElement = document.createElement('ul');
    const layers = getLayers(features, map, activePopups, parentPopup);

    // Go through the groups and create the list
    Object.keys(layers).forEach(group => {
        const liElement = document.createElement('li');
        liElement.textContent = group;

        // Build the group info
        const ulSubElement = buildGroup(layers[group], map, div);

        liElement.appendChild(ulSubElement);
        ulElement.appendChild(liElement);
    })

    div.appendChild(ulElement);
    return div;
};

const getLayers = (features: Array<QueryFeature>, map: maplibreMap, activePopups: Map<'tooltip' | 'popup', Map<string, BindPopup>>, parentPopup?: Popup) => features.map(feature => {
    const popup = activePopups.get('popup')?.get(feature.layer.id);
    let iconColor =
        toCSSRgba((feature.layer.paint as any)[feature.layer.type + '-color']) || //circle-color, fill-color, etc
        toCSSRgba((feature.layer.paint as any)['icon-color']); //symbols have -color (and text-color, but we can ignore that)
    if (iconColor && (feature.layer.paint as any)[feature.layer.type + '-opacity'] !== undefined) {
        const newColor = new colorTools(iconColor);
        newColor.alpha = (feature.layer.paint as any)[feature.layer.type + '-opacity'];
        iconColor = newColor.rgbaString;
    }
    let iconStroke =
        toCSSRgba((feature.layer.paint as any)['circle-stroke-color']) ||
        toCSSRgba((feature.layer.paint as any)['fill-outline-color']);
    if (iconStroke && (feature.layer.paint as any)['circle-stroke-opacity'] !== undefined) {
        const newColor = new colorTools(iconStroke);
        newColor.alpha = (feature.layer.paint as any)['circle-stroke-opacity'];
        iconStroke = newColor.rgbaString;
    }
    let iconStrokeWidth = undefined;
    if (iconStroke) {
        iconStrokeWidth = (feature.layer.paint as any)['circle-stroke-width'] || 1;
    }

    const content = document.createElement('div');
    let textContent = '';

    let groupIcon; // Allow an icon to be defined in the popup config
    let symbolIcon;
    let groupName = feature.layer.id;

    if (popup) {
        // If the current layer has a popup, get its popup element, and put it in an internal div
        popup.show([0, 0], feature, content, map, undefined, false);

        // Look through that internal div and find the first child that has a text content
        // And use that textContent as the description
        textContent = [...content.children[0].children].map(child => child.textContent).filter(s => s && s.trim().length)[0] || '';

        // If there are no children inside the popup that have a text Content, use something generic
        // in this case "Symbol Feature"
        if (textContent.trim() === '') {
            textContent = feature.layer.type + ' Feature';
        }

        groupName = popup.options.groupName || groupName;
        groupIcon = popup.options.icon;

        // If the feature is a symbol, it may have an icon-image (it can also just be text), we should try to use its icon if it has one
        if (feature.layer.type === 'symbol') {
            symbolIcon = (feature.layer.layout as any)['icon-image']?.name;
        }

        // bind Events to parent
        parentPopup?.on('open', (e) => popup.popup.fire('open', e));
        parentPopup?.on('close', (e) => popup.popup.fire('close', e));

    }

    return {
        'groupName': groupName,
        'groupIcon': groupIcon,
        'symbolIcon': symbolIcon,
        'popup': popup,
        'primaryKeys': popup?.options.primaryKeys,
        'iconColor': iconColor,
        'iconStroke': iconStroke,
        'iconStrokeWidth': iconStrokeWidth,
        'content': content,
        'textContent': textContent,
        'feature': feature
    } as layerInfo;
}).reduce((layers, currentLayer) => {
    if (currentLayer.popup) {
        // Add this popup to the group
        layers[currentLayer.groupName] = layers[currentLayer.groupName] || [];
        layers[currentLayer.groupName].push(currentLayer);
    }
    return layers;
}, ({} as { [key: string]: Array<layerInfo> }));


const buildGroup = (group: Array<layerInfo>, map: maplibreMap, parent: HTMLElement) => {
    const ulSubElement = document.createElement('ul');
    group.forEach(layer => {
        const liSubElement = document.createElement('li');
        const liAnchorElement = document.createElement('a');

        // Deal with the image
        const imageName = layer.symbolIcon || layer.groupIcon;
        let img;
        if (imageName) {
            // There's a named image, pull it from the map
            // Will throw an error if no image found
            try {
                img = mapIconToImage(imageName, map, layer.iconColor);
            } catch (e) {
                img = undefined;
            }
        }

        if (!img) {
            // No image was pulled from the name, so create a generic one from an SVG
            let svg = new svgIcon(icons[layer.feature.layer.type] || icons.symbol);
            if (layer.iconColor) {
                const fillColor = new colorTools(layer.iconColor).rgbaString;
                const strokeColor = layer.iconStroke && new colorTools(layer.iconStroke).rgbaString;
                svg = svg.recolor(
                    [[undefined, fillColor]],
                    (strokeColor && layer.feature.layer.type === 'circle') ? [[undefined, strokeColor]] : undefined,
                    layer.iconStrokeWidth
                );
            }
            img = new imageTools();
            img.element.src = svg.dataUrl;
        }

        // Add a background color to the image to contrast its content
        img.setContrastingBackgroundColor(5);

        liAnchorElement.textContent = ' ' + layer.textContent; // TODO, use CSS, not a space
        liAnchorElement.href = '#';
        liAnchorElement.tabIndex = 0;
        liAnchorElement.addEventListener('click', (e) => {
            e.preventDefault();
            displaySubLayer(layer, parent, map);
        }, false);
        liSubElement.appendChild(img.element);
        liSubElement.appendChild(liAnchorElement);
        ulSubElement.appendChild(liSubElement);
    });
    return ulSubElement;
};

const displaySubLayer = (layer: layerInfo, parent: HTMLElement, map?: maplibreMap) => {
    // Cache the current content
    const oldContent = [...parent.children];

    let highlightLayer: string | undefined;
    if (map && layer.popup.options.highlightFeature) {
        highlightLayer = layer.popup.highlightFeature(layer.feature, map);
    }
    const removeHighlight = () => {
        // Remove the highlight
        if (map && highlightLayer) {
            if (map.getLayer(highlightLayer)) map.removeLayer(highlightLayer);
            if (map.getSource(highlightLayer)) map.removeSource(highlightLayer);
        }
    };
    layer.popup.popup.once('close', (e) => {
        removeHighlight()
    });

    // Create the back button
    const backButton = document.createElement('a');
    backButton.href = '';
    backButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Remove the display content
        [...parent.children].forEach(child => parent.removeChild(child));
        // Add the cached content back
        oldContent.forEach(child => parent.appendChild(child));
        removeHighlight();
    }, false);
    backButton.textContent = '« Back';

    // Remove the current content
    [...parent.children].forEach(child => parent.removeChild(child));

    // Add the new content
    parent.appendChild(layer.content);

    // Add the back button
    parent.appendChild(backButton);
}