/**
 * Returns 'true' if all arguments are truthy, otherwise returns an empty string.
 * @param args The arguments to check.
 * @returns 'true' if all arguments are truthy, otherwise returns an empty string.
 */
export default function all(...args: any[]): string {
    // Remove the last argument (handlebars object)
    args.pop();

    // Check if all arguments are truthy
    return (args.length && args.every(Boolean)) ? 'true' : '';
}