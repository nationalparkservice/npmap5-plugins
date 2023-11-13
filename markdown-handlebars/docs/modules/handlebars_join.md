[markdown-handlebars](../README.md) / [Modules](../modules.md) / handlebars/join

# Module: handlebars/join

## Table of contents

### Functions

- [default](handlebars_join.md#default)

## Functions

### default

▸ **default**(`separator`, `...values`): `string`

A Handlebars helper function to join strings with a provided separator.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `separator` | `string` | The separator to use between string elements during the join operation. |
| `...values` | (`undefined` \| ``null`` \| `string`)[] \| [`any`[]] | The string values to join. |

#### Returns

`string`

- The resulting string after joining the input values with the provided separator.

#### Defined in

[handlebars/join.ts:11](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/handlebars/join.ts#L11)
