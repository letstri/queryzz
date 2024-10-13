import type { Query, StringQuery } from '../types'
import { tryToParse } from '../utils'

interface Options {
  source?: string
  arrays?: string[]
  parse?: boolean
}

export function getQuery<T = StringQuery>(
  options: Options & { parse: false },
): Partial<{ [P in keyof T]: T[P] extends Array<infer _> ? string[] : string }>
export function getQuery<T = Query>(options?: string | Options): Partial<T>

/**
 * @description
 * Get query from url.
 *
 * @param {string | Options} options - Optional. Can be a string representing the query or an Options object.
 * @param {string} [options.source] - The source string to parse. Default: window.location.search.
 * @param {string[]} [options.arrays] - An array of field names that should always be treated as arrays. Default: [].
 * @param {boolean} [options.parse] - Whether to parse values into their appropriate types. Default: true.
 * @returns {Query} An object containing the parsed query parameters.
 *
 * @example
 * // URL: /?value=test&field=hi&field=hello
 * getQuery()
 * // => { value: 'test', field: ['hi', 'hello'] }
 *
 * getQuery('value=test&field=hi&field=hello')
 * // => { value: 'test', field: ['hi', 'hello'] }
 *
 * // URL: /?value=test&field=hi
 * getQuery({ arrays: ['value'] })
 * // => { value: ['test'], field: 'hi' }
 *
 * // URL: /?value=test&field=hi&value=123&test=true
 * getQuery()
 * // => { value: ['test', 123], field: 'hi', test: true }
 *
 * getQuery({ source: 'value=test&field=hi&value=123&test=true', parse: false })
 * // => { value: ['test', '123'], field: 'hi', test: 'true' }
 */
export function getQuery<T = Query>(options?: string | Options): Partial<T> {
  if (typeof window === 'undefined') {
    return {}
  }

  if (options && options.constructor.name !== 'String' && options.constructor.name !== 'Object') {
    throw new Error('[queryzz]: param is not an object or a string.')
  }

  const { search } = window.location
  let source = (typeof options === 'string' ? options : options?.source) || search

  if (options) {
    try {
      source = new URL(source).search
    }
    catch {
      if (typeof options === 'string' || typeof options?.source === 'string') {
        const [part1, part2] = source.split('?')
        const query = part2 || part1

        if (query.split('&').length > 0) {
          source = query
        }
      }
    }
  }

  const localOptions: Options = {
    source,
    parse: true,
    arrays: [],
    ...((typeof options === 'object' && options) || {}),
  }

  const arrays = Array.isArray(localOptions.arrays)
    ? localOptions.arrays.filter(item => typeof item === 'string')
    : []
  const stringQuery = source.startsWith('?') ? source.slice(1) : source
  const filteredQuery = stringQuery.split('&').filter(part => !!part && part.split('=')[1])

  const startedQuery = arrays.reduce((acc, field) => ({ ...acc, [field]: [] }), {} as T)

  return filteredQuery.reduce((newQuery, part) => {
    const [key, value] = part.split('=')
    const formattedValue = localOptions.parse
      ? tryToParse(decodeURIComponent(value))
      : decodeURIComponent(value)

    if (key in (newQuery as Record<string, unknown>)) {
      const field = newQuery[key as keyof typeof newQuery]

      // If key already exists in formatted query,
      // push to that array or create new array with this key and value.
      return {
        ...newQuery,
        [key]: Array.isArray(field) ? [...field, formattedValue] : [field, formattedValue],
      }
    }

    return {
      ...newQuery,
      [key]: formattedValue,
    }
  }, startedQuery)
}
