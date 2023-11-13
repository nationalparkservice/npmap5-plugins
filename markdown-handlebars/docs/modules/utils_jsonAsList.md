[markdown-handlebars](../README.md) / [Modules](../modules.md) / utils/jsonAsList

# Module: utils/jsonAsList

## Table of contents

### Functions

- [default](utils_jsonAsList.md#default)

## Functions

### default

▸ **default**(`input`, `options`): `HTMLElement` \| `undefined`

Generates a nested HTML list (ul or ol) from a JSON string or object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `any` | The JSON string or object to convert to a list. |
| `options` | `HelperOptions` | The Handlebars options object. If options.hash.ul is true, all lists will be unordered. |

#### Returns

`HTMLElement` \| `undefined`

- The root element of the generated HTML list, or undefined if the input is null, undefined, or an empty string.

#### Defined in

[utils/jsonAsList.ts:10](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/utils/jsonAsList.ts#L10)
