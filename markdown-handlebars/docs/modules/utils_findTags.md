[markdown-handlebars](../README.md) / [Modules](../modules.md) / utils/findTags

# Module: utils/findTags

## Table of contents

### Interfaces

- [TagInfo](../interfaces/utils_findTags.TagInfo.md)

### Functions

- [default](utils_findTags.md#default)

## Functions

### default

▸ **default**(`template`, `tagNames`, `suppressErrors?`): [`TagInfo`](../interfaces/utils_findTags.TagInfo.md)[]

Find all tags with the specified tagName in the given template.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `template` | `string` | `undefined` | A Handlebars template string. |
| `tagNames` | `string` \| `string`[] | `undefined` | - |
| `suppressErrors` | `boolean` | `false` | - |

#### Returns

[`TagInfo`](../interfaces/utils_findTags.TagInfo.md)[]

An array of Tag objects with content, startColumn, endColumn, and innerContent properties.

#### Defined in

utils/findTags.ts:14
