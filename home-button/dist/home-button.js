'use strict';

class HomeButton {
    static createSvgElement() {
        // Create the SVG element
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 576 512");
        svg.setAttribute("fill", "#333");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.setAttribute("class", "feather feather-home");
        svg.setAttribute("width", '80%');
        // Create the path for the house
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z");
        // Append the path and polyline to the SVG
        svg.appendChild(path);
        return svg;
    }
    /**
     * Class constructor which calls the `setOptions` function to merge
     * the default options and user-provided options.
     *
     * @param {homeButtonOptions} options - The options provided by the user
     */
    constructor(options = {}) {
        this.defaultOptions = HomeButton.DefaultOptions;
        this._options = this.setOptions(options);
    }
    /**
     * Sets the button options by merging the default options with user-provided options.
     * Overrides the default `fitBoundsOptions` if any are provided by the user.
     *
     * @param {homeButtonOptions} options - The options provided by the user
     * @returns {homeButtonOptions} - The merged options
     */
    setOptions(options) {
        // Merge fitBoundsOptions from default and user-provided options
        const fitBoundsOptions = {
            ...this.defaultOptions.fitBoundsOptions,
            ...options.fitBoundsOptions
        };
        // Merge all options
        this._options = {
            ...this.defaultOptions,
            ...options,
            fitBoundsOptions
        };
        return this._options;
    }
    /**
     * Setter for the `options` property.
     *
     * @param {homeButtonOptions} options - The options provided by the user
     */
    set options(options) {
        this.setOptions(options);
    }
    /**
     * Creates a DOM div element with a child button element.
     * The div is assigned CSS classes for styling, and the button has ARIA attributes for accessibility.
     * The button also has an event listener to prevent the context menu from appearing on right click.
     *
     * @returns {HTMLDivElement} The created div element with its child button.
     */
    createDiv() {
        const div = document.createElement("div");
        div.className = "maplibregl-ctrl maplibregl-ctrl-group";
        const button = document.createElement("button");
        // Add ARIA attributes to the button for accessibility
        button.setAttribute('aria-label', 'Pan/zoom to initial extent'); // For screen readers
        button.alt = 'Pan/zoom to initial extent'; // For legacy screen readers
        button.appendChild(this._options.icon);
        div.appendChild(button);
        div.addEventListener("contextmenu", (e) => e.preventDefault());
        this.div = div;
        return this.div;
    }
    /**
     * Adds the created div to the map and sets up its click behavior.
     * If the `bounds` option is set, the map will fit to these bounds when the div is clicked.
     * If the `bounds` option is not set, the map will fly to the `homePosition` at the specified `zoom` level.
     * If the `homePosition` and `zoom` level are not set, it defaults to the current map center and zoom level.
     *
     * @param {MapLibraryMap} map - The map to which the div is being added.
     * @returns {HTMLDivElement} The div that has been added to the map.
     */
    onAdd(map) {
        // Create the div
        const div = this.createDiv();
        // Destructure the options for cleaner code
        let { bounds, fitBoundsOptions } = this._options;
        // If the homePosition and zoom options are not set, use the current map center and zoom level
        const center = this._options.homePosition || map.getCenter();
        const zoom = this._options.zoom || map.getZoom();
        // Add a click event listener to the div
        div.addEventListener("click", () => {
            // If the bounds option is set, fit the map to these bounds
            if (bounds) {
                map.fitBounds(bounds, fitBoundsOptions);
            }
            // If bounds option is not set, fly the map to the home position or current map center at the specified zoom level
            else {
                map.flyTo({
                    center,
                    zoom,
                    // Merge in the fitBoundsOptions, but exclude 'linear' and 'maxZoom' properties as they are not compatible with flyTo
                    ...{
                        ...fitBoundsOptions,
                        linear: undefined,
                        maxZoom: undefined
                    }
                });
            }
        });
        // Return the div to be added to the map
        return div;
    }
    /**
     * Removes the div from the DOM and resets the `div` property.
     * If `div` does not exist, the function simply exits.
     */
    onRemove() {
        // Check if this.div exists
        if (this.div) {
            // If it does, remove the div from the DOM
            this.div.remove();
        }
        // Reset the div property to undefined
        this.div = undefined;
    }
    getDefaultPosition() {
        return 'top-left';
    }
}
HomeButton.DefaultOptions = {
    homePosition: null,
    zoom: null,
    bounds: null,
    fitBoundsOptions: {
        pitch: 0,
        bearing: 0
    },
    icon: HomeButton.createSvgElement()
};

module.exports = HomeButton;
