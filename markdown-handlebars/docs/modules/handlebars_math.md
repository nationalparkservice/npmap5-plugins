[markdown-handlebars](../README.md) / [Modules](../modules.md) / handlebars/math

# Module: handlebars/math

## Table of contents

### Variables

- [operators](handlebars_math.md#operators)

### Functions

- [default](handlebars_math.md#default)

## Variables

### operators

• `Const` **operators**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `%` | (`a`: `number`, `b`: `number`) => `number` |
| `&` | (`a`: `number`, `b`: `number`) => `number` |
| `*` | (`a`: `number`, `b`: `number`) => `number` |
| `+` | (`a`: `number`, `b`: `number`) => `number` |
| `-` | (`a`: `number`, `b`: `number`) => `number` |
| `/` | (`a`: `number`, `b`: `number`) => `number` |
| `<<` | (`a`: `number`, `b`: `number`) => `number` |
| `>>` | (`a`: `number`, `b`: `number`) => `number` |
| `^` | (`a`: `number`, `b`: `number`) => `number` |
| \| | (`a`: `number`, `b`: `number`) => `number` |

#### Defined in

handlebars/math.ts:4

## Functions

### default

▸ **default**(`this`, `fnName`, `...values`): `number`

Provides access to the Math class functions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | `any` | - |
| `fnName` | `string` | The name of the Math class function to call. |
| `...values` | `any` | - |

#### Returns

`number`

The result of calling the specified Math function with the given number.

**`Throws`**

If an invalid Math function name is provided.

#### Defined in

handlebars/math.ts:24
