# npmap5-markdown-handlebars

`npmap5-markdown-handlebars` is a library that provides a method for rendering Markdown with handlebars annotations as HTML and can use icons from the MapLibreGL library (TODO).

## Installation

To install npmap5-markdown-handlebars, run the following command:

```bash
npm install npmap5-markdown-handlebars
```

## Usage
To use npmap5-markdown-handlebars, you can import the default class and create a new instance:

```javascript
import MarkdownHandlebars from 'npmap5-markdown-handlebars';

const markdownHandlebars = new MarkdownHandlebars();
```

Then, you can call the evaluateHtml method to render Markdown with handlebars annotations as HTML:

```javascript
const html = markdownHandlebars.evaluateHtml('# Hello, {{name}}!', { name: 'world' });
```

By default, evaluateHtml returns a HTMLDivElement containing the rendered HTML. The method takes four parameters:

    expression - The string to evaluate as Markdown with handlebars annotations.
    properties - An object containing properties that can be used in handlebars.
    featureState - The feature state from the Maplibre map (optional).
    map - The Maplibre map (optional, used for icons).

## Documentation

For full details on the custom handlebars functions see [typedoc the docs](./dist/docs/modules.md).

To (re)build the docs

```bash
npm run build-docs
```

## Examples

Here is an example of using npmap5-markdown-handlebars to render Markdown with handlebars annotations as HTML:

```javascript
import MarkdownHandlebars from 'npmap5-markdown-handlebars';

const markdownHandlebars = new MarkdownHandlebars();

const html = markdownHandlebars.evaluateHtml('# Hello, {{name}}!', { name: 'world' });
```

## Building

Production Build:

```bash
npm run build-prod
```

License

npmap5-markdown-handlebars is a United States government work and is in the [public domain in the United States](https://www.usa.gov/government-works). 
