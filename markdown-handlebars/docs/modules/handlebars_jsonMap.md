[markdown-handlebars](../README.md) / [Modules](../modules.md) / handlebars/jsonMap

# Module: handlebars/jsonMap

## Table of contents

### Functions

- [default](handlebars_jsonMap.md#default)

## Functions

### default

▸ **default**(`input`, `template`, `options`): `string`

A Handlebars helper function that maps JSON data to a template.
The function first transforms any input data into an array, and then applies
the provided Handlebars template to each item in the array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `any` | The input data to map. If this is not an array, the function will transform it into one. |
| `template` | `string` | A Handlebars template string. This will be applied to each item in the array. |
| `options` | `HelperOptions` | The Handlebars helper options. |

#### Returns

`string`

A string containing the rendered template.

#### Defined in

[handlebars/jsonMap.ts:14](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/handlebars/jsonMap.ts#L14)
