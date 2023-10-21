[markdown-handlebars](../README.md) / [Modules](../modules.md) / handlebars/regexpReplace

# Module: handlebars/regexpReplace

## Table of contents

### Functions

- [default](handlebars_regexpReplace.md#default)

## Functions

### default

▸ **default**(`str`, `exp`, `replacement`): `string`

Replaces all occurrences of a regular expression in a string with a specified replacement.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | The string to search for matches. |
| `exp` | `string` | The regular expression to search for. |
| `replacement` | `string` | The replacement string to use. |

#### Returns

`string`

The input string with all matches of the regular expression replaced with the replacement string.

**`Throws`**

An error if the regular expression is invalid.

#### Defined in

handlebars/regexpReplace.ts:11
