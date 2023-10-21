/**
 * Class representing a color with RGBA values.
 */
export class Color {
    rgbaObj: { r: number, g: number, b: number, a: number };

    /**
     * Create a new Color object.
     * @param rgba An object containing RGBA values { r, g, b, a }.
     */
    constructor(rgba: { r: number, g: number, b: number, a: number }) {
        this.rgbaObj = rgba;
    }

    /**
     * Create a Color object from RGB values.
     * @param rgb An object containing RGB values { r, g, b }.
     * @returns A Color object with the corresponding RGBA values and an alpha of 1.
     */
    static fromRgb(rgb: { r: number, g: number, b: number }): Color {
        const { r, g, b } = rgb;
        return new Color({ r, b, g, a: 1 });
    }

    static isLight(color: Color, threshold: number = 186) {
        // https://stackoverflow.com/questions/946544/good-text-foreground-color-for-a-given-background-color/946734#946734
        return ((color.r * 0.299 + color.g * 0.587 + color.b * 0.114) > threshold)
    }
    get isLight() {
        return Color.isLight(this);
    }

    /**
     * Calculate the contrast color between two CSS color strings.
     * @param colorA First CSS color string.
     * @param colorB Second CSS color string.
     * @returns A Color object with the contrasting color.
     */
    static contrastColor(colorA: string, colorB: string): Color {
        let colorBIsLight: boolean = false;
        if (colorA === 'auto' && colorB !== 'auto') {
            colorBIsLight = Color.fromCssColorToRgb(colorB).isLight;
        }
        return colorBIsLight ? Color.fromRgb({ 'r': 0, 'g': 0, 'b': 0 }) : Color.fromRgb({ 'r': 255, 'g': 255, 'b': 255 });
    };

    /**
     * Converts any CSS color string to an RGB color.
     *
     * @param cssColor The CSS color string.
     * @returns A Color object with the corresponding RGBA values.
     */
    static fromCssColorToRgb(cssColor: string): Color {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;

        // Get the 2D rendering context
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return new Color({ r: 0, g: 0, b: 0, a: 0 });
        }

        // Set the fillStyle to the input color and fill a single pixel
        ctx.fillStyle = cssColor;
        ctx.fillRect(0, 0, 1, 1);

        // Get the color of the single pixel
        const imageData = ctx.getImageData(0, 0, 1, 1);
        const [r, g, b, a] = imageData.data;

        return new Color({ r, g, b, a: Math.round(a / 255) });
    }

    get r() {
        return this.rgbaObj.r;
    }
    get g() {
        return this.rgbaObj.g;
    }
    get b() {
        return this.rgbaObj.b;
    }
    get a() {
        return this.rgbaObj.a;
    }

    set r(r: number) {
        this.rgbaObj.r = r;
    }
    set g(g: number) {
        this.rgbaObj.g = g;
    }
    set b(b: number) {
        this.rgbaObj.b = b;
    }
    set a(a: number) {
        this.rgbaObj.a = a;
    }


    /**
     * Converts the color to rgba.
     *
     * @returns A string containing the rgba(r,g,b,a) values.
     */
    get rgba() {
        const { r, g, b, a } = this.rgbaObj;
        return `rgba(${r},${g},${b},${a})`
    }

    /**
     * Converts the color to rgba.
     *
     * @returns An array containing the rgba(r,g,b,a) values.
     */
    get rgbaArray() {
        const { r, g, b, a } = this.rgbaObj;
        return [r, g, b, a];
    }

    /**
     * Converts the color to rgba.
     *
     * @returns An array containing the rgba(r,g,b,a) values, with the a in the range from 0-255.
     */
    get rgbaArray255() {
        const { r, g, b, a } = this.rgbaObj;
        return [r, g, b, Math.round(a * 255)];
    }

    /**
     * Converts the color to hex.
     *
     * @returns A string containing the #RRGGBBAA values.
     */
    get hex() {
        let [r, g, b, a] = this.rgbaArray255;
        // Helper function to convert a single channel value to a two-digit hexadecimal string
        const toHex = (value: number): string => value.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
    }
}


