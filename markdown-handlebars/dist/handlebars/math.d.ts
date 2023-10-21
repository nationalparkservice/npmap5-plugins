export declare const operators: {
    '+': (a: number, b: number) => number;
    '-': (a: number, b: number) => number;
    '*': (a: number, b: number) => number;
    '/': (a: number, b: number) => number;
    '%': (a: number, b: number) => number;
    '&': (a: number, b: number) => number;
    '|': (a: number, b: number) => number;
    '^': (a: number, b: number) => number;
    '<<': (a: number, b: number) => number;
    '>>': (a: number, b: number) => number;
};
/**
 * Provides access to the Math class functions.
 * @param fnName The name of the Math class function to call.
 * @param num The number to pass as the argument to the Math function.
 * @returns The result of calling the specified Math function with the given number.
 * @throws {Exception} If an invalid Math function name is provided.
 */
export default function math(this: any, fnName: string, ...values: any): number;
