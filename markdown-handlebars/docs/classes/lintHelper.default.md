[markdown-handlebars](../README.md) / [Modules](../modules.md) / [lintHelper](../modules/lintHelper.md) / default

# Class: default

[lintHelper](../modules/lintHelper.md).default

## Table of contents

### Constructors

- [constructor](lintHelper.default.md#constructor)

### Properties

- [hbs](lintHelper.default.md#hbs)

### Methods

- [columnToLineCol](lintHelper.default.md#columntolinecol)
- [findFailingExp](lintHelper.default.md#findfailingexp)
- [parseErrorMessage](lintHelper.default.md#parseerrormessage)
- [toException](lintHelper.default.md#toexception)

## Constructors

### constructor

• **new default**(`hbs`): [`default`](lintHelper.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `hbs` | [`default`](index.default.md) |

#### Returns

[`default`](lintHelper.default.md)

#### Defined in

[lintHelper.ts:23](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/lintHelper.ts#L23)

## Properties

### hbs

• **hbs**: [`default`](index.default.md)

#### Defined in

[lintHelper.ts:22](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/lintHelper.ts#L22)

## Methods

### columnToLineCol

▸ **columnToLineCol**(`template`, `pos`): `Object`

Converts a character position to a line and column number in a template string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `template` | `string` | The template string. |
| `pos` | `number` | - |

#### Returns

`Object`

An object containing the line and column numbers.

| Name | Type |
| :------ | :------ |
| `column` | `number` |
| `line` | `number` |

**`Throws`**

An error if the character index is out of bounds.

#### Defined in

[lintHelper.ts:207](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/lintHelper.ts#L207)

___

### findFailingExp

▸ **findFailingExp**(`expressions`): `undefined` \| `number`

Find the failing expression index in the given array of expressions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `expressions` | [`TagInfo`](../interfaces/utils_findTags.TagInfo.md)[] | An array of expressions with content, startColumn, endColumn, and innerContent properties. |

#### Returns

`undefined` \| `number`

The index of the failing expression or undefined if no failing expression is found.

#### Defined in

[lintHelper.ts:188](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/lintHelper.ts#L188)

___

### parseErrorMessage

▸ **parseErrorMessage**(`message`, `template`): `Object`

Parse an error message and extract the error type, line, and column information.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | The error message to parse. |
| `template` | `string` | The template string where the error occurred. |

#### Returns

`Object`

An object containing the error type, line, and column information.

| Name | Type |
| :------ | :------ |
| `column` | `number` |
| `endColumn` | `number` |
| `endLine` | `number` |
| `errMsg` | `string` |
| `helperName` | `undefined` \| `string` |
| `line` | `number` |
| `message` | `string` |
| `type` | `string` |

#### Defined in

[lintHelper.ts:33](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/lintHelper.ts#L33)

___

### toException

▸ **toException**(`e`): `Exception`

Converts an error into a Handlebars exception.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `e` | `string` \| `Exception` \| `Error` | The error to convert to a Handlebars exception. |

#### Returns

`Exception`

The resulting Handlebars exception.

#### Defined in

[lintHelper.ts:227](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/lintHelper.ts#L227)
