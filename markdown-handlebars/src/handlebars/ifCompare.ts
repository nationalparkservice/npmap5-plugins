// ifCompare.ts
import { HelperOptions } from 'handlebars';

type OperatorFunction = (v1: any, v2: any) => boolean;

const operators: Record<string, OperatorFunction> = {
    '!=': (v1, v2) => v1 != v2,
    '!==': (v1, v2) => v1 !== v2,
    '==': (v1, v2) => v1 == v2,
    '===': (v1, v2) => v1 === v2,
    '<': (v1, v2) => v1 < v2,
    '<=': (v1, v2) => v1 <= v2,
    '>': (v1, v2) => v1 > v2,
    '>=': (v1, v2) => v1 >= v2,
    '&&': (v1, v2) => v1 && v2,
    '||': (v1, v2) => v1 || v2
};

export default function ifCompare(
    v1: any,
    operator: string,
    v2: any
): string {
    const operation = operators[operator];
    return operation ? (operation(v1, v2) ? 'true' : '') : '';
};
