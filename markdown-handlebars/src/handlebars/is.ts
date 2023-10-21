import { HelperOptions } from 'handlebars';

/**
 * A Handlebars helper function that acts as a ternary operator.
 * @param values The array of values: condition, trueValue, and falseValue (optional).
 * @returns The trueValue if the condition is true, or the falseValue if it's false.
 */
export default function is(...values: any[]): any {
    const options = values.pop() as HelperOptions;
    let [condition, trueValue, falseValue] = values;

    if (values.length === 2) {
        // No falseValue
        falseValue = '';
    } else if (values.length === 1) {
        // No trueValue and falseValue
        trueValue = '';
        falseValue = '';
    } else if (values.length === 0) {
        // Only options provided
        return '';
    }

    return condition ? trueValue : falseValue;
}
