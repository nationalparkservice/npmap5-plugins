/**
 * Class representing a color with RGBA values.
 */
export declare class Color {
    rgbaObj: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    /**
     * Create a new Color object.
     * @param rgba An object containing RGBA values { r, g, b, a }.
     */
    constructor(rgba: {
        r: number;
        g: number;
        b: number;
        a: number;
    });
    /**
     * Create a Color object from RGB values.
     * @param rgb An object containing RGB values { r, g, b }.
     * @returns A Color object with the corresponding RGBA values and an alpha of 1.
     */
    static fromRgb(rgb: {
        r: number;
        g: number;
        b: number;
    }): Color;
    static isLight(color: Color, threshold?: number): boolean;
    get isLight(): boolean;
    /**
     * Calculate the contrast color between two CSS color strings.
     * @param colorA First CSS color string.
     * @param colorB Second CSS color string.
     * @returns A Color object with the contrasting color.
     */
    static contrastColor(colorA: string, colorB: string): Color;
    /**
     * Converts any CSS color string to an RGB color.
     *
     * @param cssColor The CSS color string.
     * @returns A Color object with the corresponding RGBA values.
     */
    static fromCssColorToRgb(cssColor: string): Color;
    get r(): number;
    get g(): number;
    get b(): number;
    get a(): number;
    set r(r: number);
    set g(g: number);
    set b(b: number);
    set a(a: number);
    /**
     * Converts the color to rgba.
     *
     * @returns A string containing the rgba(r,g,b,a) values.
     */
    get rgba(): string;
    /**
     * Converts the color to rgba.
     *
     * @returns An array containing the rgba(r,g,b,a) values.
     */
    get rgbaArray(): number[];
    /**
     * Converts the color to rgba.
     *
     * @returns An array containing the rgba(r,g,b,a) values, with the a in the range from 0-255.
     */
    get rgbaArray255(): number[];
    /**
     * Converts the color to hex.
     *
     * @returns A string containing the #RRGGBBAA values.
     */
    get hex(): string;
}
