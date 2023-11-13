[markdown-handlebars](../README.md) / [Modules](../modules.md) / handlebars/timediff

# Module: handlebars/timediff

## Table of contents

### Functions

- [default](handlebars_timediff.md#default)

## Functions

### default

▸ **default**(`datetime1`, `tz1`, `datetime2`, `tz2`): `number`

Calculates the time difference between two dates in the specified time zones, in seconds.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `datetime1` | `any` | The first date and time, in ISO format or as a Date object. |
| `tz1` | `string` | The time zone of datetime1. |
| `datetime2` | `any` | The second date and time, in ISO format or as a Date object. |
| `tz2` | `string` | The time zone of datetime2. |

#### Returns

`number`

The time difference between datetime1 and datetime2, in seconds.

#### Defined in

[handlebars/timediff.ts:12](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/handlebars/timediff.ts#L12)
