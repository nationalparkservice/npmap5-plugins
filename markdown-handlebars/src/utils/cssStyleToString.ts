/**
 * Converts a partial CSSStyleDeclaration object to a CSS string.
 * @param styleDec - The CSSStyleDeclaration object to convert.
 * @returns The CSS string representation of the style declaration.
 */
export function getStyleStr(styleDec: Partial<CSSStyleDeclaration>): string {
    // Convert the style declaration object to an array of key-value pairs
    return Object.entries(styleDec)
        // Map each key-value pair to a string in the format "property:value"
        .map(([k, v]) => `${camelToKebab(k)}:${v}`)
        // Join the strings together with semicolons to form the final CSS string
        .join(';');
}

const camelToKebab = (str: string): string =>
    str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();