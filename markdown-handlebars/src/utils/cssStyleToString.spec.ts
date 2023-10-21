import { getStyleStr } from "./cssStyleToString";

// Jest tests for the getStyleStr function
describe('getStyleStr', () => {
    test('returns an empty string for an empty style declaration', () => {
        expect(getStyleStr({})).toBe('');
    });

    test('converts a style declaration to a CSS string', () => {
        expect(
            getStyleStr({
                display: 'inline-block',
                maxWidth: '100px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                verticalAlign: 'middle',
                textOverflow: 'ellipsis',
            })
        ).toBe(
            'display:inline-block;max-width:100px;white-space:nowrap;overflow:hidden;vertical-align:middle;text-overflow:ellipsis'
        );
    });

    test('converts camelCase property names to kebab-case', () => {
        expect(getStyleStr({ backgroundColor: 'red', fontSize: '16px' })).toBe(
            'background-color:red;font-size:16px'
        );
    });
});
