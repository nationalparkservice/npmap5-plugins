import { HelperOptions } from 'handlebars';
import n from '../utils/anyToNumber';

const operators: Record<string, (v1: any, v2: any) => boolean> = {
    '!=': (v1, v2) => v1 != v2,
    '!==': (v1, v2) => v1 !== v2,
    '==': (v1, v2) => v1 == v2,
    '===': (v1, v2) => v1 === v2,
    '<': (v1, v2) => n(v1) < n(v2),
    '<=': (v1, v2) => n(v1) <= n(v2),
    '>': (v1, v2) => n(v1) > n(v2),
    '>=': (v1, v2) => n(v1) >= n(v2),
    '&&': (v1, v2) => v1 && v2,
    '||': (v1, v2) => v1 || v2,
    '!!': (v1, v2) => !!v1 !== !!v2
};

export default function ifCond(
    this: any,
    v1: any,
    operator: string,
    v2: any,
    options: HelperOptions
): string {
    // Check if the second parameter is an object (it should be options)
    if (typeof operator === 'object' && operator !== null) {
        options = operator;
        operator = '!!';
        v2 = undefined;
    }

    const operation = operators[operator];
    const inverse = options.inverse ? options.inverse : () => '';
    return operation ? (operation(v1, v2) ? options.fn(this) : inverse(this)) : inverse(this);
}