[markdown-handlebars](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / MarkdownHandlebarsOptions

# Interface: MarkdownHandlebarsOptions

[index](../modules/index.md).MarkdownHandlebarsOptions

## Table of contents

### Properties

- [errorHandler](index.MarkdownHandlebarsOptions.md#errorhandler)
- [handlebarsHelpers](index.MarkdownHandlebarsOptions.md#handlebarshelpers)
- [handlebarsOptions](index.MarkdownHandlebarsOptions.md#handlebarsoptions)
- [handlebarsRuntimeOptions](index.MarkdownHandlebarsOptions.md#handlebarsruntimeoptions)
- [markdownOptions](index.MarkdownHandlebarsOptions.md#markdownoptions)
- [template](index.MarkdownHandlebarsOptions.md#template)

## Properties

### errorHandler

• `Optional` **errorHandler**: (`err`: `Exception`) => `void`

#### Type declaration

▸ (`err`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Exception` |

##### Returns

`void`

#### Defined in

index.ts:25

___

### handlebarsHelpers

• `Optional` **handlebarsHelpers**: `Object`

#### Index signature

▪ [key: `string`]: `Handlebars.HelperDelegate`

#### Defined in

index.ts:38

___

### handlebarsOptions

• `Optional` **handlebarsOptions**: `CompileOptions`

More info on these can be found here:
  https://handlebarsjs.com/api-reference/compilation.html#handlebars-compile-template-options

#### Defined in

index.ts:31

___

### handlebarsRuntimeOptions

• `Optional` **handlebarsRuntimeOptions**: `RuntimeOptions`

More info here:
  https://handlebarsjs.com/api-reference/runtime-options.html

#### Defined in

index.ts:36

___

### markdownOptions

• `Optional` **markdownOptions**: `Options`

#### Defined in

index.ts:37

___

### template

• `Optional` **template**: `string`

#### Defined in

index.ts:26
