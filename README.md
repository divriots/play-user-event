# Template ES Module

This is a template for creating ES Module

## Table of Contents

- [Install](#install)
- [Usage](#usage)

## Install

This project uses [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

```sh
$ npm install --save template-module-ts
```

```javascript
// using ES6 modules
import { countLetter } from "@wcd/template-module-ts";
```

or

```html
<script type="module" src="https://unpkg.com/@wcd/template-module-ts"></script>
```

## Usage

```js
import { countLetter } from "@wcd/template-module-ts";

const hello_world_count = countLetter("Hello world");

// get count of a particular letter
hello_world_count["w"];
```
