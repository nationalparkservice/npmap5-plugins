export interface TagInfo {
    content: string;
    startColumn: number;
    endColumn: number;
    innerContent: string;
}

/**
 * Find all tags with the specified tagName in the given template.
 * @param template - A Handlebars template string.
 * @param tagName - The name of the tag to find.
 * @returns An array of Tag objects with content, startColumn, endColumn, and innerContent properties.
 */
export default function findTags(template: string, tagNames: string | string[], suppressErrors: boolean = false): TagInfo[] {
    // Convert string to an array with that string as the only element,
    // or filter out undefined values from the array if the input is already an array.
    // This ensures that the tagNames variable is always an array and never undefined.
    tagNames = typeof tagNames === 'string'
        ? [tagNames]
        : tagNames.filter(v => v !== undefined);
    const tagRegexp = new RegExp(`{{\\s*(?:([#\\/])\\s*)?(${tagNames.join('|')})(?:\\s+[^{]*?)?\\s*}}`, 'g');
    const line = template.replace(/\n/g, '');
    const stack: { match: RegExpMatchArray; startColumn: number }[] = [];
    const results = [];

    let match: RegExpMatchArray | null;

    while ((match = tagRegexp.exec(line)) !== null) {
        if (match[1] === '#') {
            // This is a start tag
            stack.push({ match, startColumn: (match.index || 0) + 1 });
        } else if (match[1] === '/') {
            // This is an end tag
            if (stack.length === 0) {
                // This is an end tag
                if (stack.length === 0) {
                    if (suppressErrors) {
                        return [];
                    } else {
                        throw new Error(`Mismatched start and end {{${tagNames.join(', ')}}} tags`);
                    }
                }
            }

            const startInfo = stack.pop() as { match: RegExpMatchArray; startColumn: number };
            const endColumn = ((match.index || 0) + match[0].length);
            const innerContent = line.slice((startInfo.startColumn + startInfo.match[0].length - 1), (match.index || 0));
            const content = line.slice(startInfo.startColumn - 1, endColumn);
            results.push({ content, startColumn: startInfo.startColumn, endColumn, innerContent });
        } else {
            // It's a standalone tag
            const startColumn = (match.index || 0) + 1;
            const endColumn = ((match.index || 0) + match[0].length);
            const content = line.slice(startColumn - 1, endColumn);
            const innerContent = '';
            results.push({ content, startColumn, endColumn, innerContent });
        }
    }

    return results;
}