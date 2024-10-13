import { useState, useEffect } from 'react';
import { g as getQuery, s as setQuery } from '../shared/queryzz.cfd2bd28.mjs';

function useQuery(key) {
  const queryState = useState(getQuery()[key]);
  useEffect(() => {
    const currentQuery = getQuery()[key];
    if (currentQuery !== queryState[0]) {
      setQuery({ [key]: queryState[0] });
    }
  }, [key, queryState]);
  useEffect(() => {
    const listener = () => {
      const currentQuery = getQuery()[key];
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
