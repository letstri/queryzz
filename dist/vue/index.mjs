import { ref, watch, onMounted } from 'vue';
import { s as setQuery, g as getQuery } from '../shared/queryzz.cfd2bd28.mjs';

function useQuery(key, options) {
  if (!key) {
    throw new Error("[queryzz] useQuery: key is required");
  }
  const q = () => getQuery({
    parse: options?.parse,
    arrays: options?.array ? [key] : []
  });
  const queryState = ref(q()[key]);
  watch(queryState, () => {
    const currentQuery = q()[key];
    if (currentQuery !== queryState.value) {
      setQuery({ [key]: queryState.value });
    }
  });
  onMounted(() => {
    const listener = () => {
      const currentQuery = q()[key];
      if (currentQuery !== queryState.value) {
        queryState.value = currentQuery;
      }
    };
    window.addEventListener("popstate", listener);
    return () => window.removeEventListener("popstate", listener);
  });
  return queryState;
}

export { useQuery };
