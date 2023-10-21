# Maplibre Home Button

This project provides a control for MapLibre GL JS that adds a "Home" button to a map. When clicked, this button will return the map view to a pre-defined home position. 

## Usage

See Example 

## Options

The `HomeButton` class accepts an `options` object with the following properties:

- `homePosition` (optional): The position (as `[longitude, latitude]`) that the map will fly to when the "Home" button is clicked and no bounds are provided.
- `zoom` (optional): The zoom level that the map will fly to when the "Home" button is clicked and no bounds are provided.
- `bounds` (optional): The bounds (as `[[west, south], [east, north]]`) that the map will fit to when the "Home" button is clicked. This overrides the `homePosition` and `zoom` options.
- `fitBoundsOptions` (optional): Options for the `fitBounds` function. Any option accepted by MapLibre's `fitBounds` function can be included here.
- `icon` (optional): An SVG element to use as the button icon.