<!-- omit in toc -->
# Handlebars Renderer for Files and Strings

Render Handlebars templates seamlessly from strings or files.

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ioncakephper/hbsr)[![npm](https://img.shields.io/npm/v/hbsr)](https://www.npmjs.com/package/hbsr)
[![Node.js CI](https://github.com/ioncakephper/hbsr/actions/workflows/node.js.yml/badge.svg)](https://github.com/ioncakephper/hbsr/actions/workflows/node.js.yml)
[![GitHub license](https://img.shields.io/github/license/ioncakephper/hbsr)](https://github.com/ioncakephper/hbsr/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/dm/hbsr)](https://www.npmjs.com/package/hbsr)
[![GitHub issues](https://img.shields.io/github/issues/ioncakephper/hbsr)](https://github.com/ioncakephper/hbsr/issues)
[![CodeFactor](https://www.codefactor.io/repository/github/ioncakephper/hbsr/badge)](https://www.codefactor.io/repository/github/ioncakephper/hbsr)
[![Maintainability](https://api.codeclimate.com/v1/badges/4a1f14b23bfad577d28d/maintainability)](https://codeclimate.com/github/ioncakephper/hbsr/maintainability)

<!-- omit in toc -->
## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [With a string template](#with-a-string-template)
  - [With a template file](#with-a-template-file)
- [Template options](#template-options)
- [Contributing](#contributing)
  - [Reporting Bugs \& Requesting Features](#reporting-bugs--requesting-features)
  - [Pull Requests](#pull-requests)
- [Licensing](#licensing)

## Installation

```bash
npm i hbsr
```

## Usage

### With a string template

```js
const hbsr = require('hbsr');

let source = `
Dear {{{firstName}}}:

I am looking forward so seeing you on {{{date}}}!

Sincerely,

{{{author}}}
`;

let data = {
    firstName: "John",
    date: "Nov 26, 1962",
    author: "Jill"
}

let result = hbsr.render(source, data);
console.log(result);
```

### With a template file

Create `templates/letter.hbs` with the following content:

```hbs
Dear {{{firstName}}}:

I am looking forward so seeing you on {{{date}}}!

Sincerely,

{{{author}}}
```

Create `sample.js` like this;

```js
const hbsr = require('hbsr');

let data = {
    firstName: "John",
    date: "Nov 26, 1962",
    author: "Jill"
}
let templateBasename = 'letter';

let result = hbsr.render_template(templateBasename, data);
console.log(result);
```

## Template options

Template options reside in `hbsr.options` property:

| Option               | Description                        | Default                                                 |
| -------------------- | ---------------------------------- | ------------------------------------------------------- |
| `template_path`      | Folder where template files reside | `./templates` -- relative to scripts execution location |
| `template_extension` | Template file extension            | `.hbs` -- extension added to `basename` parameter       |

```js
const hbsr = require('hbsr');

// displays ./templates
console.log(hbsr.options.template_path);

// displays
console.log(hbsr.options.template_extension)
```

Override default template options to match your preferences:

```js

const hbsr = require('hbsr');

hbsr.options.template_path = '../../templates'; // templates reside two levels up inside template folder

// Set the new default template file extension to append to basename
// hbsr.options.template_extension = '.handlebars'

let data = {};
let r = hbsr.render_template('page', data); // use the ../../templates/page.hbs template
```

Using extra parameter to specify template options to match your preferences:

```js
const hbsr = require('hbsr');

let data = {};
// Specify the template_path to in this instance
// and use the default template extension
let r = hbsr.render_template('page', data, {'template_path': '../../templates'})

```

## Contributing

Contributions are welcome and greatly appreciated! Whether it's reporting a bug, suggesting a new feature, 
or submitting a pull request, your input is valuable.

### Reporting Bugs & Requesting Features

Please use the [GitHub Issues](https://github.com/ioncakephper/hbsr/issues) to report bugs or request features. When creating an issue, please try to use the available templates and include as much detail as possible to help us understand and address the issue effectively.

### Pull Requests

If you'd like to contribute code, please follow these steps:

1. **Fork** the repository and create your branch from `main`.
2. **Install dependencies** by running `npm install`.
3. **Make your changes**. Please ensure your code follows the existing style and that all new features or bug fixes are covered by tests.
4. **Run tests** with `npm test` to ensure everything is working as expected and that code coverage
 is maintained or improved.
5. **Commit your changes** with a clear and descriptive commit message.
6. **Push** your branch to your fork.
7. **Open a pull request** to the `main` branch of the original repository. We'll review your contribution as soon as possible.

## Licensing

This package is released under the [MIT License](./LICENSE).


