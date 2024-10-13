export { g as getQuery, s as setQuery } from '../shared/queryzz.cfd2bd28.mjs';

function formatQuery(query, encode = true) {
  if (query.constructor.name !== "Object") {
    throw new Error("[queryzz]: param is not an object.");
  }
  return Object.entries(query).map(
    ([key, value]) => Array.isArray(value) ? value.map((item) => `${key}=${encode ? encodeURIComponent(String(item)) : item}`).join("&") : `${key}=${encode ? encodeURIComponent(String(value)) : value}`
  ).join("&");
}

export { formatQuery };
