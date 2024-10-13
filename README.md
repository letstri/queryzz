# queryzz.js

> queryzz - a lightweight JS library for manipulating URL query parameters. Get, set, and format queries easily.

[![npm version](https://badge.fury.io/js/queryzz.svg)](https://www.npmjs.com/package/queryzz)
[![](https://data.jsdelivr.com/v1/package/npm/queryzz/badge)](https://www.jsdelivr.com/package/npm/queryzz)

## Quick start

### Install

```shell
npm i queryzz
```

## Usage

```js
import { getQuery } from 'queryzz'

getQuery()
```

## Methods

### formatQuery

Format query string from an object.

```js
const query = { value: 'test', field: ['hi', 'hello'] }

formatQuery(query)
// => value=test&field=hi&field=hello
```

```js
const query = { value: 'https://google.com' }

formatQuery(query, true)
// => value=https%3A%2F%2Fgoogle.com
```

```js
const query = { value: 'https://google.com' }

formatQuery(query, false)
// => value=https://google.com
```

* * *

### getQuery

Get query from an url.

```js
// URL: /?value=test&field=hi&field=hello

getQuery()
// => { value: 'test', field: ['hi', 'hello'] }
```

```js
getQuery('value=test&field=hi&field=hello')

// => { value: 'test', field: ['hi', 'hello'] }
```

```js
// URL: /?value=test&field=hi

getQuery({ arrays: ['value'] })

// => { value: ['test'], field: 'hi' }
```

```js
// URL: /?value=test&field=hi&value=123&test=true

getQuery()

// => { value: ['test', 123], field: 'hi', test: true }
```

```js
getQuery({
  source: 'value=test&field=hi&value=123&test=true',
  parse: false
})

// => { value: ['test', '123'], field: 'hi', test: 'true' }
```

* * *

### setQuery

Set query to the url.

```js
setQuery({ test: 'value' })

// => URL: /?test=value
```

```js
setQuery({ test: ['12', '34'] })

// => URL: /?test=12&test=34
```

```js
// /?test=value&field=test

setQuery({ test: 'field' }, { saveOld: true })

// => URL: /?test=value&test=field&field=test
```

```js
// URL: /?test=value#someHash

setQuery({ test: 'value' }, { saveHash: false })

// => URL: /?test=value
```

## React

### useQuery

```js
const [search, setSearch] = useQuery('search')

setSearch('test')

// => URL: /?search=test
```

```js
// URL: /?search=test

const [search, setSearch] = useQuery('search', { array: true })

console.log(search)
// => ['test']

setSearch('test2')

// => URL: /?search=test&search=test2
```

```js
// URL: /?page=1

const [page, setPage] = useQuery('page', { parse: false })

console.log(page)
// => '1'
```

## Vue

### useQuery

```js
const search = useQuery('search')

search.value = 'test'

// => URL: /?search=test
```

```js
// URL: /?search=test

const search = useQuery('search', { array: true })

console.log(search.value)
// => ['test']

search.value = 'test2'

// => URL: /?search=test&search=test2
```

```js
// URL: /?page=1

const page = useQuery('page', { parse: false })

console.log(page.value)
// => '1'
```

## Author

© [letstri](https://letstri.dev), released under the [MIT](https://github.com/letstri/queryzz/blob/main/LICENSE) license.
