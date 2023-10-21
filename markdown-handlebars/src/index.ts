import Handlebars, { escapeExpression, Exception, RuntimeOptions } from 'handlebars';
import { GeoJSONFeature, LayerSpecification, LngLat, Map as maplibreMap } from 'maplibre-gl';
import simpleHash from './utils/simpleHash';
import customHelpers from './handlebars/index';
import LintHelper from './lintHelper';

// Import the markdown libraries
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';
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
    clickPoint?: LngLat
};

export interface MarkdownHandlebarsOptions {
    errorHandler?: (err: Exception) => void;
    template?: string;
    /**
     * More info on these can be found here:
     *   https://handlebarsjs.com/api-reference/compilation.html#handlebars-compile-template-options
     */
    handlebarsOptions?: CompileOptions,
    /**
     * More info here:
     *   https://handlebarsjs.com/api-reference/runtime-options.html
     */
    handlebarsRuntimeOptions?: RuntimeOptions,
    markdownOptions?: MarkdownOptions,
    handlebarsHelpers?: {
        [key: string]: Handlebars.HelperDelegate
    }
}

export default class MarkdownHandlebars {
    //Store the template in the class so we don't need to generate it each time
    templates: Map<string, HandlebarsTemplateDelegate<any>> = new Map();
    options: Required<MarkdownHandlebarsOptions>;
    lintHelper: LintHelper;
    currentParse?: string;
    currentError?: string;
    currentTemplate?: string;

    static defaultOptions: Required<MarkdownHandlebarsOptions> = {
        errorHandler: (exp) => { console.error(exp) },
        template: '',
        handlebarsOptions: {
            noEscape: true,
        },
        handlebarsHelpers: customHelpers,
        handlebarsRuntimeOptions: {},
        markdownOptions: {
            allowDangerousHtml: true,
            extensions: [gfm()],
            htmlExtensions: [gfmHtml()],
        }
    }

    constructor(options: MarkdownHandlebarsOptions = {}) {
        this.options = { ...MarkdownHandlebars.defaultOptions, ...options };
        if (options.template) {
            this._generateTemplateDelegate(options.template, options.handlebarsOptions);
        }
        this.lintHelper = new LintHelper(this);

        // Shim needed for handbars? maybe?
        (window as any).hb = Handlebars;

        //Register all the handlebars helpers
        Object.entries(this.options.handlebarsHelpers).forEach(([name, helper]) => {
            Handlebars.registerHelper(name, this._helperWrapper(helper) as any); // TODO helper wrapper
        });

    }

    _helperWrapper(helper: any) {
        const ctx = this;
        return function (this: any, ...args: any[]) {
            try {
                return helper.call(this, ...args);
            } catch (e) {
                const options = args[args.length - 1];
                const exc = new Exception(`Error with helper ${options.name} from line ${options.loc.start.line} col ${Math.max(options.loc.start.column, 1)} to line ${options.loc.end.line} col ${options.loc.end.column}:\n${(e as Exception).message}\n`)
                exc.stack = (e as Error).stack;
                exc.name = 'Helper Error';
                //console.log('HH', this, args, ctx)
                if (ctx.currentError !== ctx.currentParse) {
                    ctx.currentError = ctx.currentParse;
                    ctx.reportError(0, exc, ctx.currentTemplate || '', -1, false);
                }
            }
        }
    }
    /**
     * Evaluates an expression as HTML and returns a div element containing the rendered HTML.
     *
     * @param expression The string or array of strings to evaluate.
     * @param properties An object containing properties that can be used in handlebars.
     * @param featureState The feature state from the map.
     * @param map The Maplibre map.
     * @returns A div element containing the rendered HTML.
     */

    templater(
        expression: string | Array<any>,
        feature: QueryFeature,
        map?: maplibreMap
    ): HTMLDivElement {
        // Create a div to hold the rendered HTML
        const div = document.createElement('div');
        this.currentParse = simpleHash(JSON.stringify(expression) + JSON.stringify(feature));

        // Set the HTML content of the div element and return it.
        expression = Array.isArray(expression) ? expression.join('\n') : expression;
        this.currentTemplate = expression;
        const runtimeVariables = {
            map,
            feature,
            geometry: feature.geometry,
            lat: feature.clickPoint?.lat,
            lng: feature.clickPoint?.lng
        };

        const runtimeOptions = this.options.handlebarsRuntimeOptions;
        runtimeOptions.data = {
            ...(runtimeOptions.data || {}),
            ...runtimeVariables
        }

        const html = this.convertMarkdown(
            this.applyHandlebarsTemplate(
                this.escapeExceptHandlebars(expression),
                (feature.properties || {}),
                runtimeOptions
            )
        );

        div.innerHTML = html;
        return div;
    };

    _templateHash(template: string, options: CompileOptions) {
        return simpleHash([template, JSON.stringify(options)].join('\n'));
    }

    _generateTemplateDelegate(template: string, options = this.options.handlebarsOptions): HandlebarsTemplateDelegate<any> {
        // Check if this has already been generated
        let delegate = this.templates.get(this._templateHash(template, options || {}));
        if (!delegate) {
            delegate = Handlebars.compile(template, options);
            this.templates.set(this._templateHash(template, options || {}), delegate);
        }
        return delegate;
    }

    applyHandlebarsTemplate(
        template: string,
        properties: { [key: string]: any },
        runtimeOptions: RuntimeOptions = this.options.handlebarsRuntimeOptions,
        throwError: boolean = false
    ): string {
        let returnValue = '';
        let lastErrorLine = -1; // Track the last error line to avoid duplicate error reporting
        let cleanedTemplate = template;
        const templateLines = template.split("\n").length;

        // Loop through the template, attempting to render it. If it fails, remove the problematic line and try again.
        for (let i = 0; i < templateLines; i++) {
            // Generate the Handlebars template delegate
            const delegate = this._generateTemplateDelegate(cleanedTemplate, this.options.handlebarsOptions);

            try {
                // Attempt to render the template
                returnValue = delegate(properties, runtimeOptions);
                // If successful, break the loop
                break;
            } catch (e) {

                const nextError = this.reportError(i, e, cleanedTemplate, lastErrorLine, throwError);

                // If the error is on the first line, give up
                if (lastErrorLine === nextError.errorLocation.line && nextError.errorStartLine === 1) {
                    break;
                }

                lastErrorLine = nextError.errorStartLine;
            }
        }
        //console.log('returnValue', returnValue);
        return returnValue;
    }

    reportError(i: number, e: any, cleanedTemplate: string, lastErrorLine: number, throwError: boolean) {
        // Convert the error into an exception
        const exception = this.lintHelper.toException(e as any);
        if (throwError) throw exception;

        const errorLocation = this.lintHelper.parseErrorMessage(exception.message, cleanedTemplate);
        const errorStartLine = errorLocation.line || 1; // Unknown error, start on line 1
        exception.message = errorLocation.message;

        // Report the first error using the errorHandler
        if (i === 0) {
            this.options.errorHandler(exception);
        }

        // Remove the problematic line from the template
        cleanedTemplate = cleanedTemplate
            .split('\n')
            .map((s, i) => i === errorStartLine - 1 ? '' : s)
            .join('\n');

        // If the error is on the same line as before, clear the line before it
        if (lastErrorLine === errorLocation.line) {
            cleanedTemplate = cleanedTemplate
                .split('\n')
                .filter((_, i) => i !== Math.max(errorStartLine - 1, 0))
                .join('\n');
        }

        return {
            cleanedTemplate,
            errorLocation,
            lastErrorLine,
            errorStartLine
        }
    }

    escapeExceptHandlebars(template: string): string {
        const parts = template.split(/({{[\s\S]*?}})/);
        return parts
            .map(part => {
                if (part.startsWith('{{') && part.endsWith('}}')) {
                    return part; // leave handlebars expression as is
                } else {
                    return escapeExpression(part); // escape non-handlebars text
                }
            })
            .join('');
    }

    convertMarkdown(markdownText: string) {
        return micromark(markdownText, this.options.markdownOptions);
    };
}
