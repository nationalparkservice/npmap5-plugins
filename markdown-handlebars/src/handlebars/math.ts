import { Exception } from "handlebars";
import anyToString from "../utils/anyToString";

export const operators = {
    '+': (a: number, b: number) => a + b,
    '-': (a: number, b: number) => a - b,
    '*': (a: number, b: number) => a * b,
    '/': (a: number, b: number) => a / b,
    '%': (a: number, b: number) => a % b,
    '&': (a: number, b: number) => a & b,
    '|': (a: number, b: number) => a | b,
    '^': (a: number, b: number) => Math.pow(a, b),
    '<<': (a: number, b: number) => a << b,
    '>>': (a: number, b: number) => a >> b
}

/**
 * Provides access to the Math class functions.
 * @param fnName The name of the Math class function to call.
 * @param num The number to pass as the argument to the Math function.
 * @returns The result of calling the specified Math function with the given number.
 * @throws {Exception} If an invalid Math function name is provided.
 */
export default function math(this: any, fnName: string, ...values: any): number {
    // Get the specified Math function by name
    fnName = anyToString(fnName);
    values.pop();  // Remove the Handlebars Object
    values = values.flatMap((item: any) => Array.isArray(item) ? item : [item]);

    const mathFn =
        (Math as any)[fnName.toLowerCase()] ||
        (Math as any)[fnName.toUpperCase()] ||
        (operators as any)[fnName];

    if (typeof mathFn === 'function') {
        return mathFn(...values);
    } else if (typeof mathFn === 'number') {
        return mathFn;
    } else {
        throw new Exception(`Invalid Math function name: ${fnName ? fnName : 'undefined'}`);
    }
}
