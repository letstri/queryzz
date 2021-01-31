import { tryToParse } from '../utils';
import IQuery from '../interfaces/IQuery';

const { hasOwnProperty } = Object.prototype;

interface IOptions {
  link?: string,
  arrays?: string[],
  parse?: boolean;
}

// Signatures
function getQuery(options: IOptions & { parse: false }): IQuery<string>;
function getQuery(options?: string | IOptions): IQuery;

/**
 * @description
 * Get query from url.
 *
 * @param {String | IOptions} options Can be null and link or query and object with params.
 * @param {String} options.link Link or query to parse. Default: window.location.search.
 * @param {Array} options.arrays Fields that must be arrays. Default: [].
 * @param {Boolean} options.parse Need to parse types. Default: true.
 * @returns {IQuery}
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
function getQuery(options?: string | IOptions): IQuery {
  if (options && options.constructor.name !== 'String' && options.constructor.name !== 'Object') {
    throw new Error('[queryzz]: param is not an object or string.');
  }

  let link = window.location.search;

  if (options) {
    try {
      const { search } = typeof options === 'string'
        ? new URL(options || link)
        : new URL(typeof options?.link === 'string' ? options.link || link : link);

      link = search;
    } catch (e) {
      if (typeof options === 'string' || (typeof options === 'object' && typeof options?.link === 'string')) {
        const splittedLink = (
          (
            typeof options === 'string'
              ? options
              : typeof options?.link === 'string' && options.link
          ) || link
        )
          .split('?');
        const query = splittedLink[1] || splittedLink[0];

        if (query.split('&').length > 0) {
          link = query;
        }
      }
    }
  }

  const localOptions: IOptions = {
    link,
    parse: true,
    arrays: [],
    ...(typeof options === 'object' ? options || {} : {}),
  };

  const query = link.startsWith('?') ? link.split('?')[1] : link;

  return query.split('&').reduce((newQuery, part) => {
    if (!part) {
      return newQuery;
    }

    const [key, value] = part.split('=');

    if (value === undefined) {
      return newQuery;
    }

    const formattedValue = localOptions.parse
      ? tryToParse(decodeURIComponent(value))
      : decodeURIComponent(value);

    if (hasOwnProperty.call(newQuery, key)) {
      const field = newQuery[key];

      // If key already exists in formatted query,
      // push to that array or create new array with this key and value.
      if (Array.isArray(field)) {
        return {
          ...newQuery,
          [key]: [...field, formattedValue],
        };
      }

      return {
        ...newQuery,
        [key]: [field, formattedValue],
      };
    }

    return {
      ...newQuery,
      [key]: formattedValue,
    };
  }, (Array.isArray(localOptions.arrays) // Start with empty arrays
    ? localOptions.arrays.filter((item) => typeof item === 'string')
    : []).reduce((acc, field) => ({
    ...acc,
    [field]: [],
  }), {} as IQuery));
}

export default getQuery;
