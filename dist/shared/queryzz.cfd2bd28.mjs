function tryToParse(value) {
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "number" || typeof parsed === "boolean" || parsed === void 0 || parsed === null ? parsed : value;
  } catch {
    return value;
  }
}

function getQuery(options) {
  if (typeof window === "undefined") {
    return {};
  }
  if (options && options.constructor.name !== "String" && options.constructor.name !== "Object") {
    throw new Error("[queryzz]: param is not an object or a string.");
  }
  const { search } = window.location;
  let source = (typeof options === "string" ? options : options?.source) || search;
  if (options) {
    try {
      source = new URL(source).search;
    } catch {
      if (typeof options === "string" || typeof options?.source === "string") {
        const [part1, part2] = source.split("?");
        const query = part2 || part1;
        if (query.split("&").length > 0) {
          source = query;
        }
      }
    }
  }
  const localOptions = {
    source,
    parse: true,
    arrays: [],
    ...typeof options === "object" && options || {}
  };
  const arrays = Array.isArray(localOptions.arrays) ? localOptions.arrays.filter((item) => typeof item === "string") : [];
  const stringQuery = source.startsWith("?") ? source.slice(1) : source;
  const filteredQuery = stringQuery.split("&").filter((part) => !!part && part.split("=")[1]);
  const startedQuery = arrays.reduce((acc, field) => ({ ...acc, [field]: [] }), {});
  return filteredQuery.reduce((newQuery, part) => {
    const [key, value] = part.split("=");
    const formattedValue = localOptions.parse ? tryToParse(decodeURIComponent(value)) : decodeURIComponent(value);
    if (key in newQuery) {
      const field = newQuery[key];
      return {
        ...newQuery,
        [key]: Array.isArray(field) ? [...field, formattedValue] : [field, formattedValue]
      };
    }
    return {
      ...newQuery,
      [key]: formattedValue
    };
  }, startedQuery);
}

function setQuery(query, options) {
  if (typeof window === "undefined") {
    return;
  }
  const { saveOld, saveHash, saveEmpty, replaceState } = {
    saveOld: true,
    saveHash: true,
    saveEmpty: false,
    replaceState: true,
    ...options
  };
  const fixedQuery = query && query.constructor.name === "Object" ? Object.entries(query).reduce((acc, [name, value]) => {
    const newValue = Array.isArray(value) ? [...new Set(value.flat(Infinity).map(String))] : value;
    return { ...acc, [name]: newValue };
  }, {}) : {};
  const oldQuery = getQuery({ parse: false });
  const mergedQueries = [
    ...Object.entries(fixedQuery),
    ...Object.entries(oldQuery)
  ];
  const stableQuery = saveOld && Object.keys(oldQuery).length !== 0 ? mergedQueries.reduce((newQuery, [name, value]) => {
    const doesExistInNew = name in newQuery;
    const doesExistInOld = name in oldQuery;
    if (doesExistInNew && !doesExistInOld) {
      const queryValue = newQuery[name];
      const newQueryValue = [
        ...new Set(
          [
            Array.isArray(queryValue) ? queryValue : [queryValue],
            Array.isArray(value) ? value : [value]
          ].flat()
        )
      ];
      return {
        ...newQuery,
        [name]: newQueryValue
      };
    }
    if (doesExistInNew && doesExistInOld) {
      return newQuery;
    }
    return {
      ...newQuery,
      [name]: value
    };
  }, {}) : fixedQuery;
  const newQueryString = Object.entries(stableQuery).filter(([key]) => key !== "&").sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => {
    const getPart = (val) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
    const canSave = (val = value) => saveEmpty ? !!key : !!key && val !== null && val !== void 0 && val !== "";
    if (Array.isArray(value)) {
      return value.map((arrayValue) => canSave(arrayValue) ? getPart(arrayValue) : "").filter(Boolean).join("&");
    }
    return canSave() ? getPart(value) : "";
  }).filter(Boolean).join("&");
  const hash = saveHash ? window.location.href.split("#")[1] : "";
  window.history[replaceState ? "replaceState" : "pushState"](
    {},
    document.title,
    newQueryString ? `?${newQueryString}${hash ? `#${hash}` : ""}` : window.location.href.split("?")[0].split("#")[0] + (hash ? `#${hash}` : "")
  );
}

export { getQuery as g, setQuery as s };
