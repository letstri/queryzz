import { useEffect, useState } from 'react'
import { getQuery } from '../native/getQuery'
import { setQuery } from '../native/setQuery'

export function useQuery(key: string) {
  const queryState = useState(getQuery()[key])

  useEffect(() => {
    const currentQuery = getQuery()[key]

    if (currentQuery !== queryState[0]) {
      setQuery({ [key]: queryState[0]! })
    }
  }, [key, queryState])

  useEffect(() => {
    const listener = () => {
      const currentQuery = getQuery()[key]

      if (currentQuery !== queryState[0]) {
        queryState[1](currentQuery)
      }
    }

    window.addEventListener('popstate', listener)
    return () => window.removeEventListener('popstate', listener)
  }, [])

  return queryState
}
