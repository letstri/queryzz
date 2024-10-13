import type { Value } from '../types'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { getQuery } from '../native/getQuery'
import { setQuery } from '../native/setQuery'

interface Options {
  parse?: boolean
  array?: boolean
}

type UseState<T> = [T, Dispatch<SetStateAction<T>>]

export function useQuery<T extends Value>(key: string): UseState<T | undefined>
export function useQuery(key: string, options: Options & { parse: false }): UseState<string | undefined>
export function useQuery<T extends Value>(key: string, options: Options & { array: true }): UseState<T[]>
export function useQuery(key: string, options: Options & { array: true, parse: false }): UseState<string[]>
export function useQuery<T extends Value>(key: string, options: Options): UseState<T | undefined>

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
