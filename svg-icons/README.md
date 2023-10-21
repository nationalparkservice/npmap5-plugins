# Maplibre GL SVG Icons

This plugin is designed to work with Maplibre GL JS and provides additional functionality for handling SVG images as icons on your map. With this plugin, you can set custom colors for your SVG icons and provide a default image for cases when no image is found.

## Features

1. Add SVG images as icons to be used on the map
2. Specify CSS styles to apply to the SVGs (e.g., `stroke`, `fill`, and `color`)
3. Provide a "default" image to display when no image can be found, so you never have a map with missing symbols!
4. Change the color of any icon by converting the image to black and white and replacing the dark channel with the `fill` and the white channel with `stroke`. If the background color is not specified, the plugin will automatically choose white or black based on the luminance of the chosen foreground color.
5. Add custom functions that allow you to build SVGs on the fly

## Background

Dealing with icons in Maplibre has always been difficult. Sprites are really nice for loading images, but they don't support all use cases.

### Raster Images

Originally, the use case for this library was to `recolor` raster images, since the only supported way to change an icon's color is by using SDF. SDF files are a pain because they only accept one color, and they significantly reduce the icon quality. This library can recolor raster images. It does this by splitting the image into a black/white image and stroke maps to the white channel and fill maps to the black channel.

### SDF

This library allows you to use [SDFs](https://docs.mapbox.com/help/troubleshooting/using-recolorable-images-in-mapbox-maps/) if you want. I don't know why you'd want to, but you can. You can also convert SVGs to SDF. One thing to note is that if you have an SDF icon in a layer, all the icons must be SDF, including the default icon, so the library will automatically convert it for you. It's essential to pay attention to that because [`icon-color`](https://maplibre.org/maplibre-style-spec/layers/#paint-symbol-icon-color) from the layer paint property will also affect the color of the default icon in these situations. Even in situations where `applyStyleToDefaultImage` is set to false.

### SVGs

This library's primary intent now is to support SVGs in MapLibre. SVGs are vector and scale nicely, and it's easy to add them to the browser at the current user's pixel ratio, whatever that might be. SVGs can pick up values from CSS, so you can pass any CSS values to your SVG, including `stroke`, `fill`, `stroke-width`, and any other CSS parameter you can think of. You can also pass `color`, which maps to the special color `currentColor` inside the SVG.

## Assigning Values

You can't assign a color to the icons using the `icon-color` paint value unless you're using SDF. It would be nice if this library could override those fields, but it's outside of the scope. So the trick is to use very long query strings directly in the `icon-image` field. They typically look like this: `'icon-image': {icon}#?fill=red&stroke=blue`. There is a function called `MaplibreSVGPlugin.createQueryString` that will build this query string for you, making the code more readable (see the example).

Supported values are any of the fields initial interface:
[`pixelRatio`, `sdf`, `stretchX`, `stretchY`, `content`, `threshold`,`customTranformation`], any other values get passed in as CSS. For CSS values, tt will convert `camaelCaseCss` to `kebab-case-css` but you can use the `kebab-case` as well, I just find it harder to read, and many libraries seem to do that converstion. So you can use `strokeWidth` or `stroke-width`.

## customTransformations
You can pass your own function in so when an image is missing, you can add your own custom code. The example shows how to use this function to add a background to an existing SVG through code.

## Options

The MaplibreSVGPlugin constructor accepts the following options:

```typescript
interface MaplibreSVGPluginOptions {
        defaultImage: MaplibreImage | string, // Accepts any image that maplibre accepts as well as an SVG string
        defaultImageOptions: { // These are all the image options directly from maplibre
            pixelRatio: number; // Defaults to the current pixelRatio (via window.devicePixelRatio)
            sdf: boolean; // Defaults to false
            stretchX?: [number, number][] | undefined;
            stretchY?: [number, number][] | undefined;
            content?: [number, number, number, number] | undefined;
        },
        defaultColorOptions: { // This is for dealing with Recolored images only (so, raster)
            threshold: number // The luminance threshold to use as the split when converting a color image to black and white, default is 55
        },
        customTransformations: {} // This where you can create your own functions for any missing image
            [key]: {
              parameters: string[],
              fn: (icon: imageData (same format as defaultImage), options: {values from paramaters}, otherParameters: {all the other values in the string})
            }
        },
        applyStyleToDefaultImage: boolean
}
```
