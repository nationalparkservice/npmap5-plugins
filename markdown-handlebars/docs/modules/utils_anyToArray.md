[markdown-handlebars](../README.md) / [Modules](../modules.md) / utils/anyToArray

# Module: utils/anyToArray

## Table of contents

### Functions

- [default](utils_anyToArray.md#default)

## Functions

### default

▸ **default**(`value`): { `key`: `string` \| `number` ; `value`: `any`  }[]

Converts any input value into an array. 
If the input is an object or a JSON string, it will be converted into a key-value array.
If the input is a non-object, non-array value, it will be returned as an array with a single element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | The input value to convert. |

#### Returns

{ `key`: `string` \| `number` ; `value`: `any`  }[]

An array representing the key (or index) and value

**`Throws`**

If a JSON string is malformed and can't be parsed.

#### Defined in

utils/anyToArray.ts:13
