import IQuery from '../interfaces/IQuery';
/**
 * @description
 * Format query object to string.
 *
 * @param {IQuery} query Query variable to format.
 * @param {Boolean} encode Need to encode special characters. Default: true.
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
declare function formatQuery(query: IQuery, encode?: boolean): string;
export default formatQuery;
