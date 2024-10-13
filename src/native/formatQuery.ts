import type { Query } from '../types'

/**
 * @description
 * Format query object to string.
 *
 * @param {Query} query Query variable to format.
 * @param {boolean} encode Need to encode special characters. Default: true.
 * @returns {string}
 *
 * @throws If query is not an object
 *
 * @example
 * const query = { value: 'test', field: ['hi', 'hello'] };
 * formatQuery(query)
 * // => value=test&field=hi&field=hello
 *
 * const query = { value: 'https://google.com' }
 * formatQuery(query, true)
 * // => value=https%3A%2F%2Fgoogle.com
 *
 * const query = { value: 'https://google.com' }
 * formatQuery(query, false)
 * // => value=https://google.com
 */
export function formatQuery(query: Query, encode = true): string {
  if (query.constructor.name !== 'Object') {
    throw new Error('[queryzz]: param is not an object.')
  }

  return Object.entries(query)
    .map(([key, value]) =>
      Array.isArray(value)
        ? value
          .map(item => `${key}=${encode ? encodeURIComponent(String(item)) : item}`)
          .join('&')
        : `${key}=${encode ? encodeURIComponent(String(value)) : value}`,
    )
    .join('&')
}
