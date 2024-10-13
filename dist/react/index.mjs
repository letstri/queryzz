import { useState, useEffect } from 'react';
import { s as setQuery, g as getQuery } from '../shared/queryzz.cfd2bd28.mjs';

function useQuery(key, options) {
  if (!key) {
    throw new Error("[queryzz] useQuery: key is required");
  }
  const q = () => getQuery({
    parse: options?.parse,
    arrays: options?.array ? [key] : []
  });
  const queryState = useState(q()[key]);
  useEffect(() => {
    const currentQuery = q()[key];
    if (currentQuery !== queryState[0]) {
      setQuery({ [key]: queryState[0] });
    }
  }, [key, queryState]);
  useEffect(() => {
    const listener = () => {
      const currentQuery = q()[key];
      if (currentQuery !== queryState[0]) {
        queryState[1](currentQuery);
      }
    };
    window.addEventListener("popstate", listener);
    return () => window.removeEventListener("popstate", listener);
  }, []);
  return queryState;
}

export { useQuery };
