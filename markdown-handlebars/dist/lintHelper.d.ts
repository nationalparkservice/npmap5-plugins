import { Exception } from "handlebars";
import MarkdownHandlebars from ".";
import { TagInfo } from "./utils/findTags";
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
    constructor(hbs: MarkdownHandlebars);
    /**
     * Parse an error message and extract the error type, line, and column information.
     * @param message - The error message to parse.
     * @param template - The template string where the error occurred.
     * @returns An object containing the error type, line, and column information.
     */
    parseErrorMessage(message: string, template: string): {
        column: number;
        endColumn: number;
        endLine: number;
        errMsg: string;
        line: number;
        type: string;
        helperName: string | undefined;
        message: string;
    };
    /**
     * Find the failing expression index in the given array of expressions.
     * @param expressions - An array of expressions with content, startColumn, endColumn, and innerContent properties.
     * @returns The index of the failing expression or undefined if no failing expression is found.
     */
    findFailingExp(expressions: TagInfo[]): number | undefined;
    /**
     * Converts a character position to a line and column number in a template string.
     * @param template The template string.
     * @param column The position of the character.
     * @returns An object containing the line and column numbers.
     * @throws An error if the character index is out of bounds.
     */
    columnToLineCol(template: string, pos: number): {
        'line': number;
        'column': number;
    };
    /**
     * Converts an error into a Handlebars exception.
     * @param e - The error to convert to a Handlebars exception.
     * @returns The resulting Handlebars exception.
     */
    toException(e: string | Exception | Error): Exception;
}
