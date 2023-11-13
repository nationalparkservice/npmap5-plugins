[markdown-handlebars](../README.md) / [Modules](../modules.md) / utils/dayjs

# Module: utils/dayjs

## Table of contents

### Functions

- [default](utils_dayjs.md#default)

## Functions

### default

▸ **default**(`datetime`, `tz?`): `Dayjs`

Parses a datetime string and returns a Day.js object with the specified timezone.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `datetime` | `string` | `undefined` | The datetime string to parse. |
| `tz` | `string` | `'America/New_York'` | The timezone to convert the datetime string to (default: America/New_York). |

#### Returns

`Dayjs`

A Day.js object representing the parsed datetime string in the specified timezone.

#### Defined in

[utils/dayjs.ts:12](https://github.com/nationalparkservice/npmap5-plugins/blob/044451c/markdown-handlebars/src/utils/dayjs.ts#L12)
