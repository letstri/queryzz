import { Q as Query, S as StringQuery } from '../shared/queryzz.c9af6ff2.js';

/**
 * @description
 * Format query object to string.
 *
 * @param {Query} query - The query object to be formatted into a string.
 * @param {boolean} [encode] - Whether to encode special characters in the query values. Default: true.
 * @returns {string} The formatted query string.
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
declare function formatQuery(query: Query, encode?: boolean): string;

interface Options$1 {
    source?: string;
    arrays?: string[];
    parse?: boolean;
}
declare function getQuery<T = StringQuery>(options: Options$1 & {
    parse: false;
}): Partial<{
    [P in keyof T]: T[P] extends Array<infer _> ? string[] : string;
}>;
declare function getQuery<T = Query>(options?: string | Options$1): Partial<T>;

interface Options {
    saveOld?: boolean;
    saveHash?: boolean;
    saveEmpty?: boolean;
    replaceState?: boolean;
}
/**
 * @description
 * Set query to url.
 *
 * @param {Query} query - Object to parse into URL query parameters.
 * @param {Options} [options] - Configuration options.
 * @param {boolean} [options.saveOld] - Save old query parameters. Default: true
 * @param {boolean} [options.saveHash] - Save URL hash. Default: true
 * @param {boolean} [options.saveEmpty] - Save empty fields in the query. Default: false
 * @param {boolean} [options.replaceState] - Use replaceState instead of pushState. Default: true
 *
 * @example
 * setQuery({ test: 'value' })
 * // => /?test=value
 *
 * setQuery({ test: ['12', '34'] })
 * // => /?test=12&test=34
 *
 * // /?test=value&field=test
 * setQuery({ test: 'field' }, { saveOld: true })
 * // => /?test=value&test=field&field=test
 *
 * // /?test=value#someHash
 * setQuery({ test: 'value' }, { saveHash: false })
 * // => /?test=value
 */
declare function setQuery(query: Query, options?: Options): void;

export { formatQuery, getQuery, setQuery };
