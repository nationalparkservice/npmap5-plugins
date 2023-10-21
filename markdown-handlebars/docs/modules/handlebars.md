[markdown-handlebars](../README.md) / [Modules](../modules.md) / handlebars

# Module: handlebars

## Table of contents

### Variables

- [default](handlebars.md#default)

## Variables

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `all` | (...`args`: `any`[]) => `string` |
| `any` | (...`args`: `any`[]) => `boolean` |
| `coalesce` | (...`values`: `any`[]) => `string` |
| `color` | (`this`: `any`, `color`: `string`, `options`: `HelperOptions`) => `string` |
| `datetime` | (`datetime`: `any`, `format`: `string`, `tz?`: `string`) => `string` |
| `each` | (`this`: `any`, `ctx`: `any`, `options`: `HelperOptions`) => `string` |
| `feature` | (`handlebarsExpression`: `string`, `options`: `HelperOptions`) => `string` \| `object` |
| `hash` | (`options`: `HelperOptions`) => { `[key: string]`: `unknown`;  } |
| `htmlElement` | (`this`: `any`, `type`: keyof `HTMLElementTagNameMap`, `options`: `HelperOptions`) => `string` |
| `icon` | (`iconName`: `string`, ...`args`: `any`[]) => `string` |
| `ifCompare` | (`v1`: `any`, `operator`: `string`, `v2`: `any`) => `string` |
| `ifCond` | (`this`: `any`, `v1`: `any`, `operator`: `string`, `v2`: `any`, `options`: `HelperOptions`) => `string` |
| `is` | (...`values`: `any`[]) => `any` |
| `join` | (`separator`: `string`, ...`values`: (`undefined` \| ``null`` \| `string`)[] \| [`any`[]]) => `string` |
| `json` | (`this`: `any`, `exp`: `string`) => `string` \| `object` |
| `jsonMap` | (`input`: `any`, `template`: `string`, `options`: `HelperOptions`) => `string` |
| `link` | (`url`: `string`, `text`: `string`) => `string` |
| `math` | (`this`: `any`, `fnName`: `string`, ...`values`: `any`) => `number` |
| `regexpMatch` | (`str`: `string`, `exp`: `string`) => `RegExpMatchArray` \| ``null`` |
| `regexpReplace` | (`str`: `string`, `exp`: `string`, `replacement`: `string`) => `string` |
| `set` | (`this`: { `[key: string]`: `any`;  }, `options`: `HelperOptions`) => `void` |
| `split` | (`str`: `string`, `options`: `HelperOptions`) => `string`[] \| ``""`` |
| `table` | (`rows`: `string` \| `Record`<`string`, `unknown`\>, `options`: `HelperOptions`) => `string` |
| `timediff` | (`datetime1`: `any`, `tz1`: `string`, `datetime2`: `any`, `tz2`: `string`) => `number` |
| `timediffStr` | (`datetime1`: `any`, `tz1`: `string`, `datetime2`: `any`, `tz2`: `string`) => `string` |
| `toInt` | (`str`: `string`) => `number` |
| `toLowerCase` | (`str`: `string`) => `string` |
| `toString` | (`value`: `any`, `options`: `HelperOptions`) => `string` |
| `toTitleCase` | (`str`: `string`) => `string` |
| `toUpperCase` | (`str`: `string`) => `string` |
| `truncate` | (`this`: `any`, `str`: `any`, `length`: `any`, `finalCharacter?`: `string`, `options?`: `HelperOptions`) => `string` |

#### Defined in

handlebars/index.ts:33
