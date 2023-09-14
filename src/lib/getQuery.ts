import type { Query, StringQuery } from '../interfaces/Query';
import { tryToParse } from '../utils';

interface Options {
  link?: string;
  arrays?: string[];
  parse?: boolean;
}

// Signatures
export function getQuery<T = StringQuery>(
  options: Options & { parse: false },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
): Partial<{ [P in keyof T]: T[P] extends Array<infer _> ? string[] : string }>;
export function getQuery<T = Query>(options?: string | Options): Partial<T>;

/**
 * @description
 * Get query from url.
 *
 * @param {String | Options} options Can be null and link or query and object with params.
 * @param {String} options.link Link or query to parse. Default: window.location.search.
 * @param {Array} options.arrays Fields that must be arrays. Default: [].
 * @param {Boolean} options.parse Need to parse types. Default: true.
 * @returns {Query}
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
 * getQuery({ link: 'value=test&field=hi&value=123&test=true', parse: false })
 * // => { value: ['test', '123'], field: 'hi', test: 'true' }
 */
export function getQuery<T = Query>(options?: string | Options): Partial<T> {
  if (options && options.constructor.name !== 'String' && options.constructor.name !== 'Object') {
    throw new Error('[queryzz]: param is not an object or a string.');
  }

  const { search } = window.location;
  let link = (typeof options === 'string' ? options : options?.link) || search;

  if (options) {
    try {
      link = new URL(link).search;
    } catch (e) {
      if (typeof options === 'string' || typeof options?.link === 'string') {
        const [part1, part2] = link.split('?');
        const query = part2 || part1;

        if (query.split('&').length > 0) {
          link = query;
        }
      }
    }
  }

  const localOptions: Options = {
    link,
    parse: true,
    arrays: [],
    ...((typeof options === 'object' && options) || {}),
  };

  const arrays = Array.isArray(localOptions.arrays)
    ? localOptions.arrays.filter((item) => typeof item === 'string')
    : [];
  const stringQuery = link.startsWith('?') ? link.slice(1) : link;
  const filteredQuery = stringQuery.split('&').filter((part) => !!part && part.split('=')[1]);

  const startedQuery = arrays.reduce((acc, field) => ({ ...acc, [field]: [] }), {} as T);

  return filteredQuery.reduce((newQuery, part) => {
    const [key, value] = part.split('=');
    const formattedValue = localOptions.parse
      ? tryToParse(decodeURIComponent(value))
      : decodeURIComponent(value);

    if (key in (newQuery as Record<string, unknown>)) {
      const field = newQuery[key as keyof typeof newQuery];

      // If key already exists in formatted query,
      // push to that array or create new array with this key and value.
      return {
        ...newQuery,
        [key]: Array.isArray(field) ? [...field, formattedValue] : [field, formattedValue],
      };
    }

    return {
      ...newQuery,
      [key]: formattedValue,
    };
  }, startedQuery);
}
