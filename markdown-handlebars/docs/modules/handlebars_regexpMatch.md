[markdown-handlebars](../README.md) / [Modules](../modules.md) / handlebars/regexpMatch

# Module: handlebars/regexpMatch

## Table of contents

### Functions

- [default](handlebars_regexpMatch.md#default)

## Functions

### default

▸ **default**(`str`, `exp`): `RegExpMatchArray` \| ``null``

Searches a string for a regular expression match and returns the result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | The string to search for a match. |
| `exp` | `string` | The regular expression to search for. |

#### Returns

`RegExpMatchArray` \| ``null``

An array of matched substrings, or null if no match was found.

**`Throws`**

An error if the regular expression is invalid.

#### Defined in

handlebars/regexpMatch.ts:10
