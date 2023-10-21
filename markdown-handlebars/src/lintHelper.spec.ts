import { Exception } from "handlebars";
import LintHelper from "./lintHelper";
import { TagInfo } from "./utils/findTags";

const lintHelper = new LintHelper({
    applyHandlebarsTemplate: jest.fn(),
    options: {
        handlebarsRuntimeOptions: {},
    },
} as any);

// parseErrorMessage
describe('parseErrorMessage', () => {
    const template = `{{#each items as |item|}}
{{fake}}
# {{item.title}}
* {{item.description}}
{{/each}}
    `;

    it('should return an object with correct properties and values', () => {
        const message = 'Missing helper: "fake"';
        const result = lintHelper.parseErrorMessage(message, template);

        expect(result).toHaveProperty('type', 'unknown helper');
        expect(result).toHaveProperty('line', 2);
        expect(result).toHaveProperty('column', 1);
        expect(result).toHaveProperty('endLine', 2);
        expect(result).toHaveProperty('endColumn', 8);
        expect(result).toHaveProperty('errMsg', 'Helper command fake does not exist');
    });

    it('should return an object with correct properties and values when there is a parse error', () => {
        const message = 'Parse error on line 3:\nUnexpected token }';
        const result = lintHelper.parseErrorMessage(message, template);

        expect(result).toHaveProperty('type', 'parse');
        expect(result).toHaveProperty('line', 3);
        expect(result).toHaveProperty('column', 1);
        expect(result).toHaveProperty('errMsg', 'Unexpected token }');
    });

    it('should return an object with correct properties and values when there is a helper error', () => {
        const message = 'Error with helper each from line 2 col 4 to line 4 col 12:\nCannot read property \'length\' of undefined\n';
        const result = lintHelper.parseErrorMessage(message, template);

        expect(result).toHaveProperty('type', 'helper');
        expect(result).toHaveProperty('line', 2);
        expect(result).toHaveProperty('column', 4);
        expect(result).toHaveProperty('endLine', 4);
        expect(result).toHaveProperty('endColumn', 12);
        expect(result).toHaveProperty('helperName', 'each');
        expect(result).toHaveProperty('errMsg', 'Cannot read property \'length\' of undefined');
    });

    it('parseErrorMessage returns expected output', () => {
        const message = 'Must pass iterator to someCommand';
        const template = '{{#someCommand}}\n{{/someCommand}}';
        const result = lintHelper.parseErrorMessage(message, template);

        expect(result).toHaveProperty('column', 1);
        expect(result).toHaveProperty('endColumn', 16);
        expect(result).toHaveProperty('endLine', 2);
        expect(result).toHaveProperty('errMsg', "Must pass iterator to someCommand");
        expect(result).toHaveProperty('line', 1);
        expect(result).toHaveProperty('message', 'iterator error from line 1 column 1 to line 2 column 16:\nMust pass iterator to someCommand');
    });

    it('parseErrorMessage returns expected output for helper error', () => {
        const message = 'Error with helper someHelper from line 2 col 3 to line 2 col 11:\nsome error message\n';

        const template = '{{#someHelper}}\n{{/someHelper}}';
        const result = lintHelper.parseErrorMessage(message, template);

        expect(result).toEqual({
            message: 'helper error from line 2 column 3 to line 2 column 11:\nsome error message',
            type: 'helper',
            helperName: 'someHelper',
            line: 2,
            column: 3,
            endLine: 2,
            endColumn: 11,
            errMsg: 'some error message'
        });
    });

});

// findFailingExp
describe('findFailingExp', () => {
    it('should return undefined when all expressions succeed', () => {
        const expressions = [
            { content: '{{foo}}', innerContent: 'foo' },
            { content: '{{bar}}', innerContent: 'bar' },
            { content: '{{baz}}', innerContent: 'baz' },
        ];

        const result = lintHelper.findFailingExp(expressions as any);

        expect(result).toBeUndefined();
        expect(lintHelper.hbs.applyHandlebarsTemplate).toHaveBeenCalledTimes(3);
    });

    it('should return the index of the first expression that fails', () => {
        const expressions = [
            { content: '{{foo}}', innerContent: 'foo' },
            { content: '{{bar}}', innerContent: 'bar' },
            { content: '{{baz}}', innerContent: 'baz' },
        ];

        // Mock the `applyHandlebarsTemplate` function to throw an error on the second call
        (lintHelper.hbs.applyHandlebarsTemplate as any)
            .mockReturnValueOnce(null)
            .mockImplementationOnce(() => {
                throw new Error('Failed to apply template');
            })
            .mockReturnValueOnce(null);

        const result = lintHelper.findFailingExp(expressions as any);

        expect(result).toBe(1);
        expect(lintHelper.hbs.applyHandlebarsTemplate).toHaveBeenCalledTimes(2);
    });

    it('should return undefined if there are no expressions', () => {
        const expressions: TagInfo[] = [];

        const result = lintHelper.findFailingExp(expressions);

        expect(result).toBeUndefined();
        expect(lintHelper.hbs.applyHandlebarsTemplate).not.toHaveBeenCalled();
    });
});

// columnToLineCol
describe('columnToLineCol', () => {
    const { columnToLineCol } = lintHelper;
    it('converts a character position to a line and column number in a template string', () => {
        const template = 'Line 1\nLine 2\nLine 3';
        expect(columnToLineCol(template, 5)).toEqual({ line: 1, column: 5 });
        expect(columnToLineCol(template, 10)).toEqual({ line: 2, column: 4 });
        expect(columnToLineCol(template, 13)).toEqual({ line: 3, column: 1 });
        expect(columnToLineCol(template, 15)).toEqual({ line: 3, column: 3 });
    })
});

// toException
describe('toException', () => {
    const { toException } = lintHelper;
    it('should convert a string to a Handlebars exception', () => {
        const result = toException('Test message');
        expect(result).toBeInstanceOf(Exception);
        expect(result.message).toEqual('Test message');
    });

    it('should convert an Error to a Handlebars exception', () => {
        const error = new Error('Test error');
        const result = toException(error);
        expect(result).toBeInstanceOf(Exception);
        expect(result.message).toEqual('Test error');
        expect(result.name).toEqual('Error');
        expect(result.stack).toBeDefined();
    });
});