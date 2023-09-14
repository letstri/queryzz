import type { Query } from '../interfaces/Query';
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
 * @param {Query} query Object to parse in url.
 * @param {?Object} params Object with params.
 * @param {?Boolean} params.saveOld Does save old query. Default: true.
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
export declare function setQuery(query?: Query, options?: Options): void;
export {};
