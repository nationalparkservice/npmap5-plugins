[markdown-handlebars](../README.md) / [Modules](../modules.md) / handlebars/htmlElement

# Module: handlebars/htmlElement

## Table of contents

### Functions

- [default](handlebars_htmlElement.md#default)

## Functions

### default

▸ **default**(`this`, `type`, `options`): `string`

A Handlebars helper that creates an HTML element with the specified tag name and attributes,
sets its inner HTML to the content rendered by the helper, and returns the outer HTML of the element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | `any` | The context object passed to the Handlebars helper. |
| `type` | keyof `HTMLElementTagNameMap` | The tag name of the element to create (e.g. "div", "span", etc.). |
| `options` | `HelperOptions` | The options object passed to the Handlebars helper, which contains the content to render. |

#### Returns

`string`

The outer HTML of the created element, including its tag name, attributes, and inner HTML content.

#### Defined in

[handlebars/htmlElement.ts:22](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/handlebars/htmlElement.ts#L22)
