import type { Query, StringQuery } from '../interfaces/Query';
import getQuery from './getQuery';

interface Options {
  saveOld?: boolean,
  saveHash?: boolean,
  saveEmpty?: boolean,
  replaceState?: boolean,
}

/**
 * @description
 * Set query to url.
 *
 * @param {Query} query Object to parse in url.
 * @param {?Object} params Object with params.
 * @param {?Boolean} params.saveOld Does save old query. Default: false.
 * @param {?Boolean} params.saveHash Does save hash. Default: true.
 * @param {?Boolean} params.saveEmpty Does save empty fields. Default: false.
 * @param {?Boolean} params.replaceState Doesn't save history in browser. Default: false.
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
function setQuery(query?: Query, options?: Options): void {
  const {
    saveOld,
    saveHash,
    saveEmpty,
    replaceState,
  } = {
    saveOld: true,
    saveHash: true,
    saveEmpty: false,
    replaceState: false,
    ...options,
  };

  const fixedQuery: StringQuery = query && query.constructor.name === 'Object'
    ? Object.entries(query).reduce((acc, [name, value]) => {
      const newValue = Array.isArray(value)
        ? [...new Set(value.flat(Infinity).map(String))]
        : value;

      return { ...acc, [name]: newValue };
    }, {})
    : {};

  const oldQuery = getQuery({ parse: false }) as StringQuery;
  const mergedQueries = [
    ...Object.entries<string | string[]>(fixedQuery),
    ...Object.entries<string | string[]>(oldQuery),
  ];

  const stableQuery = saveOld && Object.keys(oldQuery).length !== 0
    ? mergedQueries
      .reduce<StringQuery>((newQuery, [fieldName, fieldValue]) => {
      const doesExistInNew = fieldName in newQuery;
      const doesExistInOld = fieldName in oldQuery;

      if (doesExistInNew && !doesExistInOld) {
        const queryValue = newQuery[fieldName];
        const newQueryValue = [...new Set([
          Array.isArray(queryValue) ? queryValue : [queryValue],
          Array.isArray(fieldValue) ? fieldValue : [fieldValue],
        ].flat())];

        return {
          ...newQuery,
          [fieldName]: newQueryValue,
        };
      }

      if (doesExistInNew && doesExistInOld) {
        return newQuery;
      }

      return {
        ...newQuery,
        [fieldName]: fieldValue,
      };
    }, {})
    : fixedQuery;

  const newQueryString = Object.keys(stableQuery)
    .filter((key) => key !== '&')
    .sort((a, b) => a.localeCompare(b))
    .map((key) => {
      const value = stableQuery[key];

      if (Array.isArray(value)) {
        return value
          .map((arrayValue) => {
            if (saveEmpty) {
              return key ? `${encodeURIComponent(key)}=${encodeURIComponent(arrayValue)}` : '';
            }

            return key && arrayValue ? `${encodeURIComponent(key)}=${encodeURIComponent(arrayValue)}` : '';
          })
          .filter((queryItem) => queryItem)
          .join('&');
      }

      if (saveEmpty) {
        return key
          ? `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          : '';
      }

      return key && value
        ? `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        : '';
    })
    .filter(Boolean)
    .join('&');

  const hash = saveHash ? window.location.href.split('#')[1] : '';

  window.history[replaceState ? 'replaceState' : 'pushState'](
    {},
    document.title,
    newQueryString
      ? `?${newQueryString}${hash ? `#${hash}` : ''}`
      : window.location.href.split('?')[0].split('#')[0] + (hash ? `#${hash}` : ''),
  );
}

export default setQuery;
