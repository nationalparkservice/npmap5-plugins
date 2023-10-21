import Handlebars, { Exception, RuntimeOptions } from 'handlebars';
import { GeoJSONFeature, LayerSpecification, LngLat, Map as maplibreMap } from 'maplibre-gl';
import LintHelper from './lintHelper';
import { Options as MarkdownOptions } from 'micromark-util-types';
export type QueryFeature = GeoJSONFeature & {
    layer: Omit<LayerSpecification, 'source'> & {
        source: string;
    };
    source: string;
    sourceLayer?: string | undefined;
    state: {
        [key: string]: any;
    };
    clickPoint?: LngLat;
};
export interface MarkdownHandlebarsOptions {
    errorHandler?: (err: Exception) => void;
    template?: string;
    /**
     * More info on these can be found here:
     *   https://handlebarsjs.com/api-reference/compilation.html#handlebars-compile-template-options
     */
    handlebarsOptions?: CompileOptions;
    /**
     * More info here:
     *   https://handlebarsjs.com/api-reference/runtime-options.html
     */
    handlebarsRuntimeOptions?: RuntimeOptions;
    markdownOptions?: MarkdownOptions;
    handlebarsHelpers?: {
        [key: string]: Handlebars.HelperDelegate;
    };
}
export default class MarkdownHandlebars {
    templates: Map<string, HandlebarsTemplateDelegate<any>>;
    options: Required<MarkdownHandlebarsOptions>;
    lintHelper: LintHelper;
    currentParse?: string;
    currentError?: string;
    currentTemplate?: string;
    static defaultOptions: Required<MarkdownHandlebarsOptions>;
    constructor(options?: MarkdownHandlebarsOptions);
    _helperWrapper(helper: any): (this: any, ...args: any[]) => any;
    /**
     * Evaluates an expression as HTML and returns a div element containing the rendered HTML.
     *
     * @param expression The string or array of strings to evaluate.
     * @param properties An object containing properties that can be used in handlebars.
     * @param featureState The feature state from the map.
     * @param map The Maplibre map.
     * @returns A div element containing the rendered HTML.
     */
    templater(expression: string | Array<any>, feature: QueryFeature, map?: maplibreMap): HTMLDivElement;
    _templateHash(template: string, options: CompileOptions): string;
    _generateTemplateDelegate(template: string, options?: CompileOptions): HandlebarsTemplateDelegate<any>;
    applyHandlebarsTemplate(template: string, properties: {
        [key: string]: any;
    }, runtimeOptions?: RuntimeOptions, throwError?: boolean): string;
    reportError(i: number, e: any, cleanedTemplate: string, lastErrorLine: number, throwError: boolean): {
        cleanedTemplate: string;
        errorLocation: {
            column: number;
            endColumn: number;
            endLine: number;
            errMsg: string;
            line: number;
            type: string;
            helperName: string | undefined;
            message: string;
        };
        lastErrorLine: number;
        errorStartLine: number;
    };
    escapeExceptHandlebars(template: string): string;
    convertMarkdown(markdownText: string): string;
}
