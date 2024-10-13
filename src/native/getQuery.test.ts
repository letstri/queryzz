import { afterEach, describe, expect, it } from 'vitest'
import { getQuery } from './getQuery'

afterEach(() => {
  window.location.search = ''
})

describe('[getQuery]: test simple get query', () => {
  it('get simple query', () => {
    window.location.search = '?test=123'

    const query1 = getQuery()
    const query2 = getQuery('test=123')
    const query3 = getQuery('?test=123')

    expect(query1).toEqual({ test: 123 })
    expect(query2).toEqual({ test: 123 })
    expect(query3).toEqual({ test: 123 })
  })

  it('get simple query from url', () => {
    const query = getQuery('http://google.com/?test=123')

    expect(query).toEqual({ test: 123 })
  })

  it('get simple query from unusual url', () => {
    const query = getQuery('google.com/?test=123')

    expect(query).toEqual({ test: 123 })
  })
})

describe('[getQuery]: test parse', () => {
  it('get simple query with parse', () => {
    const query = getQuery({ source: 'test=123&bool=false' })

    expect(query).toEqual({ test: 123, bool: false })
  })

  it('get simple query without parse', () => {
    const query = getQuery({ source: 'test=123&bool=false', parse: false })

    expect(query).toEqual({ test: '123', bool: 'false' })

    window.location.search = '?test=123&bool=false'

    const query2 = getQuery({ parse: false })

    expect(query2).toEqual({ test: '123', bool: 'false' })
  })

  it('get simple bool query', () => {
    window.location.search = '?bool=true&bool=false'

    const query = getQuery()

    expect(query).toEqual({ bool: [true, false] })

    const query2 = getQuery({ parse: false })

    expect(query2).toEqual({ bool: ['true', 'false'] })
  })
})

describe('[getQuery]: test get query with arrays', () => {
  it('get empty arrays', () => {
    const query = getQuery({ arrays: ['array'] })

    expect(query).toEqual({ array: [] })
  })

  it('get array', () => {
    window.location.search = '?test=123&test=456'

    const query1 = getQuery()
    const query2 = getQuery({ parse: false })

    expect(query1).toEqual({ test: [123, 456] })
    expect(query2).toEqual({ test: ['123', '456'] })
  })
})

describe('[getQuery]: special tests', () => {
  it('get object as string', () => {
    window.location.search = '?test={}'

    const query = getQuery()

    expect(query).toEqual({ test: '{}' })
  })

  it('get array as string', () => {
    window.location.search = '?test=[]'

    const query = getQuery()

    expect(query).toEqual({ test: '[]' })
  })

  it('get hard query', () => {
    window.location.search
      = '?test=123&test=456&redirect=https%3A%2F%2Fgoogle.com&bool=false&empty=null'

    const query1 = getQuery({ arrays: ['empty'] })
    const query2 = getQuery({ parse: false, arrays: ['empty'] })

    expect(query1).toEqual({
      test: [123, 456],
      redirect: 'https://google.com',
      bool: false,
      empty: [null],
    })
    expect(query2).toEqual({
      test: ['123', '456'],
      redirect: 'https://google.com',
      bool: 'false',
      empty: ['null'],
    })
  })
})
