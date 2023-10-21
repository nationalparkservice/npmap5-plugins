import findTags, { TagInfo } from './findTags';

describe('findTags', () => {
    test('finds multiple standalone tags', () => {
        const template = '{{name}} {{age}}';
        const result = findTags(template, ['name', 'age']);

        const expected: TagInfo[] = [
            { content: '{{name}}', startColumn: 1, endColumn: 8, innerContent: '' },
            { content: '{{age}}', startColumn: 10, endColumn: 16, innerContent: '' },
        ];

        expect(result).toEqual(expected);
    });

    test('finds start and end tags of matched tags', () => {
        const template = '{{#if loggedIn}}Welcome, {{name}}!{{/if}}';
        const result = findTags(template, 'if');

        const expected: TagInfo[] = [
            { content: '{{#if loggedIn}}Welcome, {{name}}!{{/if}}', startColumn: 1, endColumn: 41, innerContent: 'Welcome, {{name}}!' }
        ];

        expect(result).toEqual(expected);
    });

    test('throws an error for mismatched tags', () => {
        const template = '{{/if loggedIn}}Welcome, {{name}}{{/if}}';
        expect(() => findTags(template, 'if')).toThrowError('Mismatched start and end {{if}} tags');
    });

    test('finds single tag on multiline', () => {
        const template = 'line 1\nline 2\n{{name}}\nline3\nline4';
        const result = findTags(template, 'name');

        const expected: TagInfo[] = [
            {
                content: '{{name}}',
                startColumn: 13, endColumn: 20,
                innerContent: ''
            }
        ];

        expect(result).toEqual(expected);
    });

    test('finds single tag on multiline string', () => {
        const template = `{{#each items as |item|}}
{{fake}}
# {{item.title}}
* {{item.description}}
{{/each}}
    `;

        const result = findTags(template, 'fake');

        const expected: TagInfo[] = [{
            content: '{{fake}}',
            startColumn: 26,
            endColumn: 33,
            innerContent: ''
        }];

        expect(result).toEqual(expected);
    })

});
