import type { Value } from './types'

export function tryToParse(value: string): Value {
  try {
    const parsed = JSON.parse(value)

    return typeof parsed === 'number'
      || typeof parsed === 'boolean'
      || parsed === undefined
      || parsed === null
      ? parsed
      : value
  }
  catch {
    return value
  }
}
