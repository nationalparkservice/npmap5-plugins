// I can add new text here!

/*let size = 200;
let animatedSvg = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    // get rendering context for the map canvas when layer is added to the map
    onAdd: function () {
        const svgString = `
        <svg id="mySvg" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
          <circle id="myCircle" cx="50" cy="50" r="40" fill="blue">
            <animate attributeName="cx" from="50" to="150" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>`;
        this.canvas = document.createElement('canvas');
        canvas = this.canvas;
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');

        // Create an Image object with the SVG data as its source
        this.img = new Image();
        img = this.img;

        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const svgURL = URL.createObjectURL(svgBlob);

        // Create a promise to handle the image loading event
        const imageLoadPromise = new Promise((res, rej) => {
            img.onload = () => res();
            img.onerror = (e) => rej(e);
        });

        img.src = svgURL;
        document.body.appendChild(img);

        imageLoadPromise.then(() => console.log('loaded')).catch(e => console.log('error', e));
    },

    // called once before every frame where the icon will be used
    render: function () {
       
        // Create a hidden canvas element
        const canvas = this.canvas;

        // Draw the image onto the canvas
        const ctx = canvas.getContext("2d");

        ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);

        // Retrieve the ImageData from the canvas
        const imageData = ctx.getImageData(0, 0, this.width, this.height);
        //console.log('id', imageData);
        this.data = imageData.data;

        // continuously repaint the map, resulting in the smooth animation of the dot
        map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
    }
}*/


//////////////////////


// Create an Image object with the SVG data as its source
/*let img = new Image();

const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
const svgURL = URL.createObjectURL(svgBlob);
img.src = svgURL;

img.onload = () => {
    map.addImage('pulsing-dot', img, { pixelRatio: 2 });
*/
const svgStringstill = `
        <svg id="mySvg" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
          <circle id="myCircle" cx="50" cy="50" r="40" fill="blue">
          </circle>
        </svg>`;
svgPlugin.addImage('animated-svg', svgStringstill);
////////////////////////////


const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
          <circle cx="50" cy="50" r="40" fill="rgb(255,200,200)">
            <animate attributeName="r" from="17" to="50" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="50" r="16" stroke="white" fill="rgb(255,100,100)" stroke-width="2">
            <animate attributeName="stroke-width" values="3;1" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>`;

svgPlugin.addImage('animated-svg', svgString);
map.addSource('points', {
    'type': 'geojson',
    'data': {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        -112.26527818334093,
                        41.008894937803774
                    ]
                }
            }
        ]
    }
});
map.addLayer({
    'id': 'points',
    'type': 'symbol',
    'source': 'points',
    'layout': {
        'icon-image': 'animated-svg'
    }
});
//};

///////////////////////////////////////


const svgStringVars = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <circle cx="50" cy="50" r="40" fill="{outerColor}">
            <animate attributeName="r" from="17" to="50" dur="1s" repeatCount="4" />
            <animate attributeName="opacity" values="1;0" dur="1s" repeatCount="4" />
        </circle>
        <circle cx="50" cy="50" r="16" stroke="{outlineColor}" fill="{innerColor}" stroke-width="2">
            <animate attributeName="stroke-width" values="3;1" dur="1s" repeatCount="2" />
        </circle>
        <text x="50" y="25" text-anchor="middle">
            <tspan x="50" dy="1.2em">{type}</tspan>
            <tspan x="50" dy="1.2em">{featureName}</tspan>
        </text>
    </svg>`;

svgPlugin.addImage('animated-svg-vars', svgStringVars);
map.addSource('points', {
    'type': 'geojson',
    'data': {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'properties': {
                    'type': 'Lake',
                    'name': 'Salt Lake West',
                    'outerColor': '#64FF64',
                    'innerColor': '#C8FFC8'
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        -112.26527818334093,
                        41.008894937803774
                    ]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'type': 'Lake',
                    'name': 'Salt Lake East',
                    'outerColor': '#FF6464',
                    'innerColor': '#FFC8C8'
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        -112.16938658664499,
                        40.987481245547315
                    ],
                }
            }
        ]
    }
});
map.addLayer({
    'id': 'points',
    'type': 'symbol',
    'source': 'points',
    'layout': {
        'icon-image': MaplibreSVGPlugin.stringifyConfig({
            baseImageId: 'animated-svg-vars',
            functions: [
                {
                    name: 'replaceValues',
                    params: {
                        outerColor: '{outerColor}',
                        innerColor: '{innerColor}',
                        outlineColor: 'white',
                        featureName: '{name}',
                        type: '{type}'
                    }
                }
            ]
        })
    }
});


/////////////////
// Create the SVG element
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", "100");
svg.setAttribute("height", "100");

// Create the circle element
const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
circle.setAttribute("cx", "50");
circle.setAttribute("cy", "50");
circle.setAttribute("r", "40");
circle.setAttribute("fill", "blue");

// Create the circle2 element
const circle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
circle2.setAttribute("cx", "50");
circle2.setAttribute("cy", "50");
circle2.setAttribute("r", "20");
circle2.setAttribute("fill", "green");


// Create the animate element
const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
animate.setAttribute("attributeName", "cx");
animate.setAttribute("from", "50");
animate.setAttribute("to", "150");
animate.setAttribute("dur", "2s");
animate.setAttribute("repeatCount", "indefinite");

// Create the animate element
const animate2 = document.createElementNS("http://www.w3.org/2000/svg", "animate");
animate2.setAttribute("attributeName", "cx");
animate2.setAttribute("from", "50");
animate2.setAttribute("to", "-50");
animate2.setAttribute("dur", "3s");
animate2.setAttribute("repeatCount", "indefinite");


// Append the animate element to the circle
circle.appendChild(animate);
circle2.appendChild(animate2);

// Append the circle to the SVG
svg.appendChild(circle);
svg.appendChild(circle2);
//svg.style.opacity = '0';
//document.body.appendChild(svg);


function replaceWithAnimVal(svgElement) {
    const newSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    [...svgElement.attributes].forEach(({ name, value }) => newSvg.setAttribute(name, value));

    const queue = [...svgElement.children].map(child => ({ 'parent': newSvg, 'child': child }));

    while (queue.length > 0) {
        const { parent, child } = queue.shift();
        let newChild;

        if (child.nodeType === Node.ELEMENT_NODE) {
            newChild = document.createElementNS("http://www.w3.org/2000/svg", child.tagName);
            [...child.attributes].forEach(({ name, value }) => {
                const animVal = child[name]?.animVal;
                const newValue = animVal !== undefined
                    ? (animVal.value !== undefined ? animVal.value : animVal)
                    : value;
                newChild.setAttribute(name, newValue);
            });
        } else if (child.nodeType === Node.TEXT_NODE) {
            newChild = document.createTextNode(child.textContent);
        }

        if (newChild) {
            parent.appendChild(newChild);
            if (child.children && child.children.length) {
                queue.push(...[...child.children].map(child2 => ({ 'parent': newChild, 'child': child2 })));
            }
        }
    }

    return newSvg;
}



replaceWithAnimVal(svg).outerHTML;







/////////////////////////////
function replaceWithAnimVal(svgElement) {
    // Get all elements within the SVG

    const newSvg = document.createElement('svg');
    [...svgElement.attributes].forEach(({ name, value }) => newSvg.setAttribute(name, value));
    const children = [...svgElement.children].map(child => ({ 'parent': newSvg, child }));
    while (children.length > 0) {
        const { parent, child } = children.pop();
        const newChild = document.createElement(child.tagName);
        [...child.attributes].forEach(({ name, value }) => {
            const newValue = child[name]?.animVal?.value || child[name]?.animVal || value;
            newChild.setAttribute(name, newValue);
            /*if (value instanceof SVGAnimatedLength) {
                newChild.setAttribute(name, value.animVal.value);
            }
            else if (value instanceof SVGAnimatedNumber) {
                newChild.setAttribute(name, value.animVal);
            } else {
                newChild.setAttribute(name, value);
            }*/
        });
        parent.appendChild(newChild)
        if (child.children.length) {
            children.push(...[...child.children].map(child2 => ({ 'parent': child, 'child': child2 })));
        }
    }


    return newSvg;
}
replaceWithAnimVal(svg).outerHTML;



//////////////////////////

function replaceWithAnimVal(svgElement: SVGElement) {
    const newSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    [...svgElement.attributes].forEach(({ name, value }) => newSvg.setAttribute(name, value));

    const queue = [...svgElement.children].map(child => ({ 'parent': newSvg, 'child': child }));

    while (queue.length > 0) {
        const { parent, child } = queue.shift() as any;
        let newChild: any;

        if (child.nodeType === Node.ELEMENT_NODE) {
            newChild = document.createElementNS("http://www.w3.org/2000/svg", child.tagName);
            [...child.attributes].forEach(({ name, value }) => {
                const animVal = child[name]?.animVal;
                const newValue = animVal !== undefined
                    ? (animVal.value !== undefined ? animVal.value : animVal)
                    : value;
                newChild.setAttribute(name, newValue);
            });
        } else if (child.nodeType === Node.TEXT_NODE) {
            newChild = document.createTextNode(child.textContent);
        }

        if (newChild) {
            parent.appendChild(newChild);
            if (child.children && child.children.length) {
                queue.push(...[...child.children].map(child2 => ({ 'parent': newChild, 'child': child2 })));
            }
        }
    }
    return newSvg;
}
