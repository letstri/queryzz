function O(r, s = !0) {
  if (r.constructor.name !== "Object")
    throw new Error("[queryzz]: param is not an object.");
  return Object.entries(r).map(
    ([c, i]) => Array.isArray(i) ? i.map((u) => `${c}=${s ? encodeURIComponent(String(u)) : u}`).join("&") : `${c}=${s ? encodeURIComponent(String(i)) : i}`
  ).join("&");
}
const b = (r) => {
  try {
    const s = JSON.parse(r);
    return typeof s == "number" || typeof s == "boolean" || s === void 0 || s === null ? s : r;
  } catch {
    return r;
  }
};
function A(r) {
  if (r && r.constructor.name !== "String" && r.constructor.name !== "Object")
    throw new Error("[queryzz]: param is not an object or a string.");
  const { search: s } = window.location;
  let c = (typeof r == "string" ? r : r == null ? void 0 : r.link) || s;
  if (r)
    try {
      c = new URL(c).search;
    } catch {
      if (typeof r == "string" || typeof (r == null ? void 0 : r.link) == "string") {
        const [y, f] = c.split("?"), l = f || y;
        l.split("&").length > 0 && (c = l);
      }
    }
  const i = {
    link: c,
    parse: !0,
    arrays: [],
    ...typeof r == "object" && r || {}
  }, u = Array.isArray(i.arrays) ? i.arrays.filter((n) => typeof n == "string") : [], m = (c.startsWith("?") ? c.slice(1) : c).split("&").filter((n) => !!n && n.split("=")[1]), p = u.reduce((n, y) => ({ ...n, [y]: [] }), {});
  return m.reduce((n, y) => {
    const [f, l] = y.split("="), t = i.parse ? b(decodeURIComponent(l)) : decodeURIComponent(l);
    if (f in n) {
      const e = n[f];
      return {
        ...n,
        [f]: Array.isArray(e) ? [...e, t] : [e, t]
      };
    }
    return {
      ...n,
      [f]: t
    };
  }, p);
}
function S(r, s) {
  const { saveOld: c, saveHash: i, saveEmpty: u, replaceState: h } = {
    saveOld: !0,
    saveHash: !0,
    saveEmpty: !1,
    replaceState: !1,
    ...s
  }, m = r && r.constructor.name === "Object" ? Object.entries(r).reduce((t, [e, o]) => {
    const d = Array.isArray(o) ? [...new Set(o.flat(1 / 0).map(String))] : o;
    return { ...t, [e]: d };
  }, {}) : {}, p = A({ parse: !1 }), n = [
    ...Object.entries(m),
    ...Object.entries(p)
  ], y = c && Object.keys(p).length !== 0 ? n.reduce((t, [e, o]) => {
    const d = e in t, a = e in p;
    if (d && !a) {
      const g = t[e], j = [
        ...new Set(
          [
            Array.isArray(g) ? g : [g],
            Array.isArray(o) ? o : [o]
          ].flat()
        )
      ];
      return {
        ...t,
        [e]: j
      };
    }
    return d && a ? t : {
      ...t,
      [e]: o
    };
  }, {}) : m, f = Object.entries(y).filter(([t]) => t !== "&").sort(([t], [e]) => t.localeCompare(e)).map(([t, e]) => {
    const o = (a) => `${encodeURIComponent(t)}=${encodeURIComponent(a)}`, d = (a = e) => u ? !!t : !!t && a !== null && a !== void 0 && a !== "";
    return Array.isArray(e) ? e.map((a) => d(a) ? o(a) : "").filter(Boolean).join("&") : d() ? o(e) : "";
  }).filter(Boolean).join("&"), l = i ? window.location.href.split("#")[1] : "";
  window.history[h ? "replaceState" : "pushState"](
    {},
    document.title,
    f ? `?${f}${l ? `#${l}` : ""}` : window.location.href.split("?")[0].split("#")[0] + (l ? `#${l}` : "")
  );
}
export {
  O as formatQuery,
  A as getQuery,
  S as setQuery
};
