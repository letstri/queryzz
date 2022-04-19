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
    ? Object.entries(query).reduce((acc, field) => {
      const fieldName = field[0];
      const fieldValue = Array.isArray(field[1])
        ? [...new Set(field[1].flat(Infinity).map(String))]
        : field[1];

      return { ...acc, [fieldName]: fieldValue };
    }, {})
    : {};

  const oldQuery = getQuery({ parse: false });
  const mergedQueries = [
    ...Object.entries<string | string[]>(fixedQuery),
    ...Object.entries<string | string[]>(oldQuery),
  ];

  const stableQuery = saveOld && Object.keys(oldQuery).length !== 0
    ? mergedQueries
      .reduce((newQuery: StringQuery, [fieldName, fieldValue]) => {
        const isFieldExistInNewQuery = fieldName in newQuery;
        const isFieldExistInOldQuery = fieldName in oldQuery;

        if (isFieldExistInNewQuery && !isFieldExistInOldQuery) {
          const valueInQuery = newQuery[fieldName];
          const newValueInQuery = [...new Set([
            Array.isArray(valueInQuery) ? valueInQuery : [valueInQuery],
            Array.isArray(fieldValue) ? fieldValue : [fieldValue],
          ].flat())];

          return {
            ...newQuery,
            [fieldName]: newValueInQuery,
          };
        }

        if (isFieldExistInNewQuery && isFieldExistInOldQuery) {
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
