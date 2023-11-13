[markdown-handlebars](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / default

# Class: default

[index](../modules/index.md).default

## Table of contents

### Constructors

- [constructor](index.default.md#constructor)

### Properties

- [currentError](index.default.md#currenterror)
- [currentParse](index.default.md#currentparse)
- [currentTemplate](index.default.md#currenttemplate)
- [lintHelper](index.default.md#linthelper)
- [options](index.default.md#options)
- [templates](index.default.md#templates)
- [defaultOptions](index.default.md#defaultoptions)

### Methods

- [\_generateTemplateDelegate](index.default.md#_generatetemplatedelegate)
- [\_helperWrapper](index.default.md#_helperwrapper)
- [\_templateHash](index.default.md#_templatehash)
- [applyHandlebarsTemplate](index.default.md#applyhandlebarstemplate)
- [convertMarkdown](index.default.md#convertmarkdown)
- [escapeExceptHandlebars](index.default.md#escapeexcepthandlebars)
- [reportError](index.default.md#reporterror)
- [templater](index.default.md#templater)

## Constructors

### constructor

• **new default**(`options?`): [`default`](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`MarkdownHandlebarsOptions`](../interfaces/index.MarkdownHandlebarsOptions.md) |

#### Returns

[`default`](index.default.md)

#### Defined in

[index.ts:67](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/index.ts#L67)

## Properties

### currentError

• `Optional` **currentError**: `string`

#### Defined in

[index.ts:49](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/index.ts#L49)

___

### currentParse

• `Optional` **currentParse**: `string`

#### Defined in

[index.ts:48](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/index.ts#L48)

___

### currentTemplate

• `Optional` **currentTemplate**: `string`

#### Defined in

[index.ts:50](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/index.ts#L50)

___

### lintHelper

• **lintHelper**: [`default`](lintHelper.default.md)

#### Defined in

[index.ts:47](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/index.ts#L47)

___

### options

• **options**: `Required`\<[`MarkdownHandlebarsOptions`](../interfaces/index.MarkdownHandlebarsOptions.md)\>

#### Defined in

[index.ts:46](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/index.ts#L46)

___

### templates

• **templates**: `Map`\<`string`, `HandlebarsTemplateDelegate`\<`any`\>\>

#### Defined in

[index.ts:45](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/index.ts#L45)

___

### defaultOptions

▪ `Static` **defaultOptions**: `Required`\<[`MarkdownHandlebarsOptions`](../interfaces/index.MarkdownHandlebarsOptions.md)\>

#### Defined in

[index.ts:52](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/index.ts#L52)

## Methods

### \_generateTemplateDelegate

▸ **_generateTemplateDelegate**(`template`, `options?`): `HandlebarsTemplateDelegate`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `template` | `string` |
| `options` | `CompileOptions` |

#### Returns

`HandlebarsTemplateDelegate`\<`any`\>

#### Defined in

[index.ts:154](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/index.ts#L154)

___

### \_helperWrapper

▸ **_helperWrapper**(`helper`): (`this`: `any`, ...`args`: `any`[]) => `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `helper` | `any` |

#### Returns

`fn`

▸ (`this`, `...args`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `any` |
| `...args` | `any`[] |

##### Returns

`any`

#### Defined in

[index.ts:84](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/index.ts#L84)

___

### \_templateHash

▸ **_templateHash**(`template`, `options`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `template` | `string` |
| `options` | `CompileOptions` |

#### Returns

`string`

#### Defined in

[index.ts:150](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/index.ts#L150)

___

### applyHandlebarsTemplate

▸ **applyHandlebarsTemplate**(`template`, `properties`, `runtimeOptions?`, `throwError?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `template` | `string` | `undefined` |
| `properties` | `Object` | `undefined` |
| `runtimeOptions` | `RuntimeOptions` | `undefined` |
| `throwError` | `boolean` | `false` |

#### Returns

`string`

#### Defined in

[index.ts:164](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/index.ts#L164)

___

### convertMarkdown

▸ **convertMarkdown**(`markdownText`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `markdownText` | `string` |

#### Returns

`string`

#### Defined in

[index.ts:250](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/index.ts#L250)

___

### escapeExceptHandlebars

▸ **escapeExceptHandlebars**(`template`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `template` | `string` |

#### Returns

`string`

#### Defined in

[index.ts:237](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/index.ts#L237)

___

### reportError

▸ **reportError**(`i`, `e`, `cleanedTemplate`, `lastErrorLine`, `throwError`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `number` |
| `e` | `any` |
| `cleanedTemplate` | `string` |
| `lastErrorLine` | `number` |
| `throwError` | `boolean` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `cleanedTemplate` | `string` |
| `errorLocation` | \{ `column`: `number` ; `endColumn`: `number` ; `endLine`: `number` ; `errMsg`: `string` ; `helperName`: `undefined` \| `string` = pos.helperName; `line`: `number` ; `message`: `string` ; `type`: `string`  } |
| `errorLocation.column` | `number` |
| `errorLocation.endColumn` | `number` |
| `errorLocation.endLine` | `number` |
| `errorLocation.errMsg` | `string` |
| `errorLocation.helperName` | `undefined` \| `string` |
| `errorLocation.line` | `number` |
| `errorLocation.message` | `string` |
| `errorLocation.type` | `string` |
| `errorStartLine` | `number` |
| `lastErrorLine` | `number` |

#### Defined in

[index.ts:201](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/index.ts#L201)

___

### templater

▸ **templater**(`expression`, `feature`, `map?`): `HTMLDivElement`

Evaluates an expression as HTML and returns a div element containing the rendered HTML.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `expression` | `string` \| `any`[] | The string or array of strings to evaluate. |
| `feature` | [`QueryFeature`](../modules/index.md#queryfeature) | - |
| `map?` | `Map` | The Maplibre map. |

#### Returns

`HTMLDivElement`

A div element containing the rendered HTML.

#### Defined in

[index.ts:112](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/index.ts#L112)
