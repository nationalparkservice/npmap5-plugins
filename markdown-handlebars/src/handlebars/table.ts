import { HelperOptions } from "handlebars";
import anyToString from "../utils/anyToString";
import jsonAsList from "../utils/jsonAsList";

/**
 * This function creates a table row for a given key-value pair.
 * It checks if the value is a JSON and converts it to a list if it is.
 * 
 * @param key - The key to use as the label of the table cell.
 * @param value - The value to be displayed in the table cell.
 * @param options - The Handlebars helper options, which are passed to jsonAsList function.
 * @returns A string representing an HTML table row or undefined if valueAsString is falsy.
 */
function createRow(key: string, value: string, options: HelperOptions): string | undefined {
    const isJson = /^(\{.*\}|\[.*\])$/.test(value);
    let valueAsString = anyToString(value);
    if (isJson) {
        let element = jsonAsList(value, options);
        if (element) valueAsString = element.outerHTML;
    }

    return valueAsString ? `<tr><td style="font-weight: 700;">${key}</td><td>${valueAsString}</td></tr>` : undefined;
}

/**
 * This function takes an object or a string that can be parsed into an object, 
 * and generates an HTML table with each key-value pair represented as a row in the table.
 * 
 * @param rows - The input string or object that will be turned into an HTML table.
 * @param options - The Handlebars helper options.
 * @returns A string representing an HTML table.
 */
export default function table(rows: string | Record<string, unknown>, options: HelperOptions): string {
    if (!options) {
        options = rows as unknown as HelperOptions;
        rows = options.data?.feature?.properties || {};
    }

    const rowJson = typeof rows === 'object' ? rows : JSON.parse(rows.toString());

    const tableRows = [];
    for (let [key, value] of Object.entries(rowJson)) {
        const row = createRow(key, anyToString(value), options);
        if (anyToString(row).length > 0) {
            tableRows.push(row);
        }
    }

    return `<table>${tableRows.join('\n')}</table>`;
}