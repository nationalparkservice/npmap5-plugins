import Handlebars from "handlebars";

/**
 * Helper function to extract and convert JSON values from an object using Handlebars expressions.
 * @param exp The expression to extract the JSON values.
 * @returns The converted JSON values.
 */
export default function json(this: any, exp: string): string | object {
    const regex = /^(\{.*\}|\[.*\])$/;

    let jsonValue = {};
    let subexps: string[] = [];
    if (regex.test(exp)) {
        // JSON obj passed in
        try {
            jsonValue = JSON.parse(exp);
        } finally { }
    } else {
        const [root, ...rest] = exp.split('.');
        subexps = rest;
        // Parse the JSON value from the root path of the expression
        try {
            jsonValue = JSON.parse(this[root] || '{}');
        } finally { }
    }

    if (subexps.length) {
        // Extract the remaining Handlebars expressions and convert them to their corresponding JSON values
        const handlebarsExpression = '{{' + subexps.join('.') + '}}';
        return Handlebars.compile(handlebarsExpression)(jsonValue);
    } else {
        return jsonValue;
    }
}