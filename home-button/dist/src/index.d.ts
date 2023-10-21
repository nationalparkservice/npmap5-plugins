import { ControlPosition, FitBoundsOptions, IControl, LngLatBoundsLike, LngLatLike, Map as MapLibraryMap } from 'maplibre-gl';
export type homeButtonOptions = {
    homePosition?: LngLatLike | null;
    zoom?: number | null;
    bounds?: LngLatBoundsLike | null;
    fitBoundsOptions?: FitBoundsOptions;
    icon?: SVGSVGElement;
};
export default class HomeButton implements IControl {
    _options: Required<homeButtonOptions>;
    div: HTMLDivElement | undefined;
    static DefaultOptions: Required<homeButtonOptions>;
    defaultOptions: Required<homeButtonOptions>;
    static createSvgElement(): SVGSVGElement;
    /**
     * Class constructor which calls the `setOptions` function to merge
     * the default options and user-provided options.
     *
     * @param {homeButtonOptions} options - The options provided by the user
     */
    constructor(options?: homeButtonOptions);
    /**
     * Sets the button options by merging the default options with user-provided options.
     * Overrides the default `fitBoundsOptions` if any are provided by the user.
     *
     * @param {homeButtonOptions} options - The options provided by the user
     * @returns {homeButtonOptions} - The merged options
     */
    setOptions(options: homeButtonOptions): Required<homeButtonOptions>;
    /**
     * Setter for the `options` property.
     *
     * @param {homeButtonOptions} options - The options provided by the user
     */
    set options(options: homeButtonOptions);
    /**
     * Creates a DOM div element with a child button element.
     * The div is assigned CSS classes for styling, and the button has ARIA attributes for accessibility.
     * The button also has an event listener to prevent the context menu from appearing on right click.
     *
     * @returns {HTMLDivElement} The created div element with its child button.
     */
    createDiv(): HTMLDivElement;
    /**
     * Adds the created div to the map and sets up its click behavior.
     * If the `bounds` option is set, the map will fit to these bounds when the div is clicked.
     * If the `bounds` option is not set, the map will fly to the `homePosition` at the specified `zoom` level.
     * If the `homePosition` and `zoom` level are not set, it defaults to the current map center and zoom level.
     *
     * @param {MapLibraryMap} map - The map to which the div is being added.
     * @returns {HTMLDivElement} The div that has been added to the map.
     */
    onAdd(map: MapLibraryMap): HTMLDivElement;
    /**
     * Removes the div from the DOM and resets the `div` property.
     * If `div` does not exist, the function simply exits.
     */
    onRemove(): void;
    getDefaultPosition(): ControlPosition;
}
