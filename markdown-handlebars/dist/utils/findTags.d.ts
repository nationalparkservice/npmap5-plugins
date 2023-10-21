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
export default function findTags(template: string, tagNames: string | string[], suppressErrors?: boolean): TagInfo[];
