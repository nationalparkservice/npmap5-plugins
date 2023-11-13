[markdown-handlebars](../README.md) / [Modules](../modules.md) / handlebars/table

# Module: handlebars/table

## Table of contents

### Functions

- [default](handlebars_table.md#default)

## Functions

### default

▸ **default**(`rows`, `options`): `string`

This function takes an object or a string that can be parsed into an object, 
and generates an HTML table with each key-value pair represented as a row in the table.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rows` | `string` \| `Record`\<`string`, `unknown`\> | The input string or object that will be turned into an HTML table. |
| `options` | `HelperOptions` | The Handlebars helper options. |

#### Returns

`string`

A string representing an HTML table.

#### Defined in

[handlebars/table.ts:33](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/handlebars/table.ts#L33)
