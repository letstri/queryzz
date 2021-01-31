# queryzz.js

> A collection of useful methods that are used by programmers every day. We decided to put all the methods together so as not to copy them from project to project.

[![npm version](https://badge.fury.io/js/queryzz.svg)](https://brooons.github.io/queryzz/)
[![](https://data.jsdelivr.com/v1/package/npm/queryzz/badge)](https://www.jsdelivr.com/package/npm/queryzz)

## Features

- Full TypeScript support
- Support all platforms
- Easy to use

## Table of Contents

- [Quick start](#quick-start)
  - [Install](#install)
  - [Initialization](#initialization)
- [Methods](#methods)
  - [formatQuery](#formatQuery)
  - [getQuery](#getQuery)
  - [setQuery](#setQuery)

## Quick start

### Install

We support all platforms.

#### npm

For module bundlers such as Webpack or Browserify.

```shell
npm i queryzz
```

#### Include with &lt;script&gt;

Download and install with `script`.

```html
<script src="queryzz.js"></script>
```

##### CDN

Recommended for learning purposes, you can use the latest version:

```html
<script src="https://cdn.jsdelivr.net/npm/queryzz/dist/queryzz.js"></script>
```

Recommended for production for avoiding unexpected breakage from newer versions:

```html
<script src="https://cdn.jsdelivr.net/npm/queryzz@1.0.0/dist/queryzz.js"></script>
```

For native ES Modules, there is also an ES Modules compatible build:

```html
<script type="module">
  import queryzz from 'https://cdn.jsdelivr.net/npm/queryzz@6.0.5/dist/queryzz.min.js';
</script>
```

### Initialization

#### ES6

queryzz as an ES6 module.

```js
import { getQuery } from 'queryzz';

getQuery();
```

#### Node

queryzz as a Node.js module

```js
const { getQuery } = require('queryzz');

getQuery();
```

#### Browser

Exports a global variable called `queryzz`. Use it like this

```html
<script>
  queryzz.getQuery();
</script>
```

#### AMD

queryzz as an AMD module. Use with Require.js, System.js, and so on.

```js
requirejs(['queryzz'], function(queryzz) {
  queryzz.getQuery();
});
```

## Methods

### formatQuery

Format query object to string.


#### Params
- `query`
  - Type: `IQuery`
  - Description: Query variable to format.
- `encode`
  - Type: `Boolean`
  - Description: Need to encode special characters. Default: true.

#### Returns
- `string`

#### Example
```JS
const query = { value: 'test', field: ['hi', 'hello'] };
formatQuery(query)
// => value=test&field=hi&field=hello

const query = { value: 'https://google.com' }
formatQuery(query, true)
// => value=https%3A%2F%2Fgoogle.com

const query = { value: 'https://google.com' }
formatQuery(query, false)
// => value=https://google.com
```
<a href="https://github.com/BrooonS/queryzz/blob/master/lib/formatQuery.js" target="_blank">Source code</a>
* * *
### getQuery

Get query from url.


#### Params
- `options`
  - Type: `String,IOptions`
  - Description: Can be null and link or query and object with params.
- `options.link`
  - Type: `String`
  - Description: Link or query to parse. Default: window.location.search.
- `options.arrays`
  - Type: `Array`
  - Description: Fields that must be arrays. Default: [].
- `options.parse`
  - Type: `Boolean`
  - Description: Need to parse types. Default: true.

#### Returns
- `IQuery`

#### Example
```JS
// URL: /?value=test&field=hi&field=hello
getQuery()
// => { value: 'test', field: ['hi', 'hello'] }

getQuery('value=test&field=hi&field=hello')
// => { value: 'test', field: ['hi', 'hello'] }

// URL: /?value=test&field=hi
getQuery({ arrays: ['value'] })
// => { value: ['test'], field: 'hi' }

// URL: /?value=test&field=hi&value=123&test=true
getQuery()
// => { value: ['test', 123], field: 'hi', test: true }

getQuery({ link: 'value=test&field=hi&value=123&test=true', parse: false })
// => { value: ['test', '123'], field: 'hi', test: 'true' }
```
<a href="https://github.com/BrooonS/queryzz/blob/master/lib/getQuery.js" target="_blank">Source code</a>
* * *
### setQuery

Set query to url.


#### Params
- `query`
  - Type: `IQuery`
  - Description: Object to parse in url.
- `params`
  - Type: `Object`
  - Description: Object with params.
- `params.saveOld`
  - Type: `Boolean`
  - Description: Does save old query. Default: false.
- `params.saveHash`
  - Type: `Boolean`
  - Description: Does save hash. Default: true.
- `params.saveEmpty`
  - Type: `Boolean`
  - Description: Does save empty fields. Default: false.
- `params.replaceState`
  - Type: `Boolean`
  - Description: Doesn&#x27;t save history in browser. Default: false.


#### Example
```JS
setQuery({ test: 'value' })
// => /?test=value

setQuery({ test: ['12', '34'] })
// => /?test=12&test=34

// /?test=value&field=test
setQuery({ test: 'field' }, { saveOld: true })
// => /?test=value&test=field&field=test

// /?test=value#someHash
setQuery({ test: 'value' }, { saveHash: false })
// => /?test=value
```
<a href="https://github.com/BrooonS/queryzz/blob/master/lib/setQuery.js" target="_blank">Source code</a>
* * *

&copy; Valery Strelets
