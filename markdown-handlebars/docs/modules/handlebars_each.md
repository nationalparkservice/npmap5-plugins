[markdown-handlebars](../README.md) / [Modules](../modules.md) / handlebars/each

# Module: handlebars/each

## Table of contents

### Functions

- [default](handlebars_each.md#default)

## Functions

### default

▸ **default**(`this`, `ctx`, `options`): `string`

Registers the 'each' helper function for the given Handlebars instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | `any` | The Handlebars this instance. |
| `ctx` | `any` | The context object or value to iterate over. |
| `options` | `HelperOptions` | The Handlebars helper options, including the main template function and the inverse function. |

#### Returns

`string`

A string containing the result of applying the template function to the context object or value.

#### Defined in

[handlebars/each.ts:12](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/handlebars/each.ts#L12)
