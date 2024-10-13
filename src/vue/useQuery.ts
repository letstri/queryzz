import type { Value } from '../types'
import { onMounted, ref, type Ref, watch } from 'vue'
import { getQuery } from '../native/getQuery'
import { setQuery } from '../native/setQuery'

interface Options {
  parse?: boolean
  array?: boolean
}

export function useQuery<T extends Value>(key: string): Ref<T | undefined>
export function useQuery(key: string, options: Options & { parse: false }): Ref<string | undefined>
export function useQuery<T extends Value>(key: string, options: Options & { array: true }): Ref<T[]>
export function useQuery(key: string, options: Options & { array: true, parse: false }): Ref<string[]>
export function useQuery<T extends Value>(key: string, options: Options): Ref<T | undefined>

export function useQuery<T extends Value>(key: string, options?: Options) {
  if (!key) {
    throw new Error('[queryzz] useQuery: key is required')
  }

  const q = () => getQuery({
    parse: options?.parse,
    arrays: options?.array ? [key] : [],
  })

  const queryState = ref(q()[key] as T | undefined)

  watch(queryState, () => {
    const currentQuery = q()[key]

    if (currentQuery !== queryState.value) {
      setQuery({ [key]: queryState.value })
    }
  })

  onMounted(() => {
    const listener = () => {
      const currentQuery = q()[key]

      if (currentQuery !== queryState.value) {
        queryState.value = currentQuery as T
      }
    }

    window.addEventListener('popstate', listener)
    return () => window.removeEventListener('popstate', listener)
  })

  return queryState
}
