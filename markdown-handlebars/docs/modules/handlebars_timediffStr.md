[markdown-handlebars](../README.md) / [Modules](../modules.md) / handlebars/timediffStr

# Module: handlebars/timediffStr

## Table of contents

### Functions

- [default](handlebars_timediffStr.md#default)
- [parseTime2](handlebars_timediffStr.md#parsetime2)

## Functions

### default

▸ **default**(`datetime1`, `tz1`, `datetime2`, `tz2`): `string`

Calculates the time difference between two dates in the specified time zones.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `datetime1` | `any` | The first date and time, in ISO format or as a Date object. |
| `tz1` | `string` | The time zone of datetime1. |
| `datetime2` | `any` | The second date and time, in ISO format or as a Date object. |
| `tz2` | `string` | The time zone of datetime2. |

#### Returns

`string`

A string representing the time difference between datetime1 and datetime2, in human-readable format.

#### Defined in

[handlebars/timediffStr.ts:34](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/handlebars/timediffStr.ts#L34)

___

### parseTime2

▸ **parseTime2**(`tz1`, `datetime2`, `tz2?`): `Dayjs`

Parses a date string or object using the specified time zone, or the user's time zone if none is provided.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tz1` | `string` | The time zone to use for parsing the date string or object. |
| `datetime2` | `any` | The date string or object to parse. |
| `tz2?` | `string` | Optional. The time zone to use for parsing datetime2, if it is a string. |

#### Returns

`Dayjs`

A Day.js object representing the parsed date and time.

#### Defined in

[handlebars/timediffStr.ts:10](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/handlebars/timediffStr.ts#L10)
