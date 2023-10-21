import { Exception, HelperOptions } from 'handlebars';
import anyToString from '../utils/anyToString';
import toKeyValueArray from '../utils/toKeyValueArray';

/**
 * Registers the 'each' helper function for the given Handlebars instance.
 * @param this The Handlebars this instance. 
 * @param ctx The context object or value to iterate over.
 * @param options The Handlebars helper options, including the main template function and the inverse function.
 * @returns A string containing the result of applying the template function to the context object or value.
 */
export default function (
    this: any,
    ctx: any,
    options: HelperOptions
): string {
    if (!options) {
        throw new Exception("Must pass iterator to #each");
    }

    const { fn, inverse, data } = options;

    let returnValues: string[] = [];

    // If a function is passed in, run that function
    if (typeof ctx === 'function') {
        ctx = typeof ctx === "function" ? ctx.call(this) : ctx;
    } else if (typeof ctx === 'string') {
        // If a string comes in, it might be a JSON object, so check
        try {
            ctx = JSON.parse(ctx);
        } finally { }
    }

    // Add a _parent to the data
    const dataWithParent = { ...data, _parent: data };

    if (ctx !== undefined && ctx !== null) {
        if (typeof ctx === 'object') {
            const ctxArray = toKeyValueArray(ctx);
            if (ctxArray) {
                returnValues = ctxArray.map(([key, value], index, array) => {
                    const augmentedData = {
                        ...{
                            key,
                            index,
                            value,
                            first: index === 0,
                            last: index === array.length - 1,
                        },
                        ...(dataWithParent || {})
                    };
                    return fn(value, {
                        data: augmentedData,
                        blockParams: [value, key],
                    });
                })
            }
        } else {
            // It's not iterable, so just return it as a string
            returnValues = [(anyToString(ctx))];
        }
    }

    return returnValues.length ? returnValues.join('') : inverse(this)
}