import type { Dispatch, SetStateAction } from 'react'
import type { Value } from '../types'
import { useEffect, useState } from 'react'
import { getQuery } from '../native/getQuery'
import { setQuery } from '../native/setQuery'

interface Options {
  parse?: boolean
  array?: boolean
}

export function useQuery<T extends Value>(key: string): [T | undefined, Dispatch<SetStateAction<T | undefined>>]
export function useQuery(key: string, options: Options & { parse: false }): [string | undefined, Dispatch<SetStateAction<string | undefined>>]

export function useQuery<T extends Value>(key: string, options?: Options) {
  if (!key) {
    throw new Error('[queryzz] useQuery: key is required')
  }

  const q = () => getQuery({
    parse: options?.parse,
    arrays: options?.array ? [key] : [],
  })

  const queryState = useState(q()[key] as T | undefined)

  useEffect(() => {
    const currentQuery = q()[key]

    if (currentQuery !== queryState[0]) {
      setQuery({ [key]: queryState[0]! })
    }
  }, [key, queryState])

  useEffect(() => {
    const listener = () => {
      const currentQuery = q()[key]

      if (currentQuery !== queryState[0]) {
        queryState[1](currentQuery as T)
      }
    }

    window.addEventListener('popstate', listener)
    return () => window.removeEventListener('popstate', listener)
  }, [])

  return queryState
}
