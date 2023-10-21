[markdown-handlebars](../README.md) / [Modules](../modules.md) / handlebars/truncate

# Module: handlebars/truncate

## Table of contents

### Functions

- [default](handlebars_truncate.md#default)

## Functions

### default

▸ **default**(`this`, `str`, `length`, `finalCharacter?`, `options?`): `string`

Truncates a string to a certain length, and adds an ellipsis or a given final character if truncated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | `any` | - |
| `str` | `any` | The string to truncate. |
| `length` | `any` | The maximum length of the truncated string. |
| `finalCharacter?` | `string` | Optional. The final character to add if truncated. |
| `options?` | `HelperOptions` | Optional. Additional options for the Handlebars helper. |

#### Returns

`string`

The truncated string with the specified options and formatting.

#### Defined in

handlebars/truncate.ts:14
