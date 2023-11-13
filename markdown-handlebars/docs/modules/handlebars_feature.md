[markdown-handlebars](../README.md) / [Modules](../modules.md) / handlebars/feature

# Module: handlebars/feature

## Table of contents

### Functions

- [default](handlebars_feature.md#default)

## Functions

### default

▸ **default**(`handlebarsExpression`, `options`): `string` \| `object`

Handlebars helper function to extract data from a maplibre feature and use it in a provided template.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handlebarsExpression` | `string` | A string representing the Handlebars expression |
| `options` | `HelperOptions` | The options object automatically provided by Handlebars when invoking a helper. |

#### Returns

`string` \| `object`

The rendered template string after applying the Maplibre feature data.

**`Remarks`**

This helper function is designed to integrate Maplibre data with Handlebars templating.
The feature data is passed in the options object under the key `feature`.

**`Example`**

```hbs
{{feature "{{source}}" }}
```

#### Defined in

[handlebars/feature.ts:20](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/handlebars/feature.ts#L20)
