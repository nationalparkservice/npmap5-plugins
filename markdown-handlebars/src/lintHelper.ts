import { Exception } from "handlebars";
import MarkdownHandlebars from ".";
import findTags, { TagInfo } from "./utils/findTags";

export interface ErrorPosition {
    column?: number;
    endColumn?: number;
    endLine?: number;
    errMsg?: string;
    helperName?: string;
    line?: number;
    origError?: string;
    type?: string;
}

export interface ErrorType {
    regexp: RegExp;
    getPosition: (match: RegExpMatchArray) => ErrorPosition;
}

export default class LintHelper {
    hbs: MarkdownHandlebars;
    constructor(hbs: MarkdownHandlebars) {
        this.hbs = hbs;
    }

    /**
     * Parse an error message and extract the error type, line, and column information.
     * @param message - The error message to parse.
     * @param template - The template string where the error occurred.
     * @returns An object containing the error type, line, and column information.
     */
    parseErrorMessage(message: string, template: string) {
        // Define error types and their corresponding regular expressions and position extractors
        let pos: ErrorPosition = {};

        // Define error types and their corresponding regular expressions and position extractors
        const errorTypes: Record<string, ErrorType> = {
            parse: {
                regexp: /^Parse error on line (\d+):\n?(.+?)?$/s,
                getPosition: (match: RegExpMatchArray): (typeof pos) => ({ line: (Number(match[1]) || 1), origError: match[2] }),
            },
            'mismatched helper': {
                regexp: /^(.+?) doesn't match (.+?) - (\d+):(\d+)$/,
                getPosition: (match: RegExpMatchArray): (typeof pos) => {
                    const [, tag1, tag2, reportedLine, reportedCol] = match;
                    const tags = findTags(template, [tag1, tag2], true);
                    const idx = this.findFailingExp(tags);

                    const defaultPosition = {
                        column: Number(reportedCol),
                        helperName: match[1],
                        line: Number(reportedLine),
                        origError: `${tag1} doesn't match ${tag2} - ${reportedLine}:${reportedCol}`,
                    };

                    if (idx !== undefined) {
                        // Default to the first one found
                        const start = this.columnToLineCol(template, tags[idx].startColumn);
                        const end = this.columnToLineCol(template, tags[idx].endColumn);

                        return {
                            ...defaultPosition,
                            line: start.line,
                            column: start.column,
                            endLine: end.line,
                            endColumn: end.column,
                        };
                    } else {
                        return defaultPosition
                    }

                }
            },
            'unknown helper': {
                regexp: /^Missing helper: "(.+?)"$/,
                getPosition: (match: RegExpMatchArray): (typeof pos) => {
                    const helperName = match[1];
                    const tags = findTags(template, helperName, true);

                    if (tags.length) {
                        const start = this.columnToLineCol(template, tags[0].startColumn);
                        const end = this.columnToLineCol(template, tags[0].endColumn);

                        return {
                            line: start.line,
                            column: start.column,
                            endLine: end.line,
                            endColumn: end.column,
                            origError: `Helper command ${helperName} does not exist`,
                            helperName: match[1]
                        };
                    } else {
                        return {
                            origError: `Helper command ${helperName} does not exist`,
                            helperName: match[1]
                        }
                    }
                },
            },
            helper: {
                regexp: /^Error with helper (.+?) from line (\d+) col (\d+) to line (\d+) col (\d+):\n(.+?)\n/,
                getPosition: (match: RegExpMatchArray): (typeof pos) => ({
                    column: Number(match[3]),
                    endColumn: Number(match[5]),
                    endLine: Number(match[4]),
                    helperName: match[1],
                    line: Number(match[2]),
                    origError: match[6],
                }),
            },
            iterator: {
                regexp: /^Must pass iterator to (.+)/,
                getPosition: (match: RegExpMatchArray): (typeof pos) => {
                    // Try to find that iterator in the string
                    const iterators = findTags(template, match[1].replace(/^#/, ''), true);
                    const idx = this.findFailingExp(iterators);

                    if (idx !== undefined) {
                        // Default to the first one found
                        const start = this.columnToLineCol(template, iterators[idx].startColumn);
                        const end = this.columnToLineCol(template, iterators[idx].endColumn);

                        return {
                            line: start.line,
                            column: start.column,
                            endLine: end.line,
                            endColumn: end.column,
                            origError: match[6],
                            helperName: match[1]
                        };
                    } else {
                        return {
                            origError: `Must pass iterator to ${match[1]}`,
                            helperName: match[1]
                        }
                    }
                },
            }
        };

        const lines = template.replace(/\\/g, ' ').split('\n');
        const maxExtent: Required<ErrorPosition & { errMsg: string }> = {
            column: 1,
            endColumn: Infinity,
            endLine: lines.length,
            errMsg: message,
            line: 1,
            type: 'unknown',
            origError: message,
            helperName: 'unknown'
        };

        // Find the error type and position in the message
        for (const [type, { regexp, getPosition }] of Object.entries(errorTypes)) {
            const match = message.match(regexp);
            if (match) {
                pos = { type, ...getPosition(match) };
                break;
            }
        }

        // Ensure position values are within valid bounds
        const finalPosition = {
            column: Math.max(maxExtent.column, pos.column || -Infinity),
            endColumn: Math.min(maxExtent.endColumn, pos.endColumn || Infinity),
            endLine: Math.min(maxExtent.endLine, pos.endLine || Infinity),
            errMsg: pos.origError || maxExtent.origError,
            line: Math.max(maxExtent.line, pos.line || -Infinity),
            type: pos.type || maxExtent.type,
            helperName: pos.helperName
        };
        finalPosition.column = Math.min(finalPosition.column, lines[finalPosition.line - 1].length);
        finalPosition.endColumn = Math.min(finalPosition.endColumn, lines[finalPosition.endLine - 1].length);

        return {
            message: `${finalPosition.type} error from line ${finalPosition.line} column ${finalPosition.column} to line ${finalPosition.endLine} column ${finalPosition.endColumn}:${finalPosition.errMsg ? `\n${finalPosition.errMsg}` : ''}`,
            ...finalPosition,
        };
    }


    /**
     * Find the failing expression index in the given array of expressions.
     * @param expressions - An array of expressions with content, startColumn, endColumn, and innerContent properties.
     * @returns The index of the failing expression or undefined if no failing expression is found.
     */
    findFailingExp(expressions: TagInfo[]): number | undefined {
        for (let i = 0; i < expressions.length; i++) {
            const template = expressions[i].content.replace(expressions[i].innerContent, '');
            try {
                this.hbs.applyHandlebarsTemplate(template, {}, this.hbs.options.handlebarsRuntimeOptions, true);
            } catch (e) {
                return i;
            }
        }
        return undefined;
    }

    /**
     * Converts a character position to a line and column number in a template string.
     * @param template The template string.
     * @param column The position of the character.
     * @returns An object containing the line and column numbers.
     * @throws An error if the character index is out of bounds.
     */
    columnToLineCol(template: string, pos: number): { 'line': number, 'column': number } {
        const lines = template.replace(/\\/g, '').split('\n');
        let currentPos = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (pos > currentPos && pos <= (currentPos + line.length)) {
                return { line: i + 1, column: pos - currentPos };
            }
            currentPos += line.length;
        }

        throw new Error('Character index is out of bounds');
    }

    /**
     * Converts an error into a Handlebars exception.
     * @param e - The error to convert to a Handlebars exception.
     * @returns The resulting Handlebars exception.
     */
    toException(e: string | Exception | Error): Exception {
        let exceptionError = new Exception('');

        if (typeof e === 'string') {
            // If the input is a string, set its message as the message of the exception
            exceptionError.message = e;
        } else if (e instanceof Error) {
            // If the input is an Error, set its message, name, and stack as those of the exception
            exceptionError.message = e.message;
            exceptionError.name = e.name;
            exceptionError.stack = e.stack;
        } else {
            // Otherwise, assume it is already a Handlebars exception
            exceptionError = e;
        }

        return exceptionError;
    }

}