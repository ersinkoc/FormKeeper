import { deepClone } from '../../../src/utils/deep-clone'

describe('deepClone', () => {
  test('clones primitives', () => {
    expect(deepClone(42)).toBe(42)
    expect(deepClone('hello')).toBe('hello')
    expect(deepClone(true)).toBe(true)
    expect(deepClone(null)).toBe(null)
    expect(deepClone(undefined)).toBe(undefined)
  })

  test('clones Date', () => {
    const date = new Date('2025-01-01')
    const cloned = deepClone(date)

    expect(cloned).toEqual(date)
    expect(cloned).not.toBe(date)
    expect(cloned instanceof Date).toBe(true)
  })

  test('clones RegExp', () => {
    const regex = /test/gi
    const cloned = deepClone(regex)

    expect(cloned).toEqual(regex)
    expect(cloned).not.toBe(regex)
    expect(cloned instanceof RegExp).toBe(true)
    expect(cloned.source).toBe('test')
    expect(cloned.flags).toBe('gi')
  })

  test('clones arrays', () => {
    const arr = [1, 2, [3, 4]]
    const cloned = deepClone(arr)

    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
    expect(cloned[2]).not.toBe(arr[2])
  })

  test('clones objects', () => {
    const obj = { a: 1, b: { c: 2 } }
    const cloned = deepClone(obj)

    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj)
    expect(cloned.b).not.toBe(obj.b)
  })

  test('clones complex nested structures', () => {
    const complex = {
      name: 'John',
      age: 30,
      profile: {
        email: 'john@example.com',
        addresses: [
          { city: 'NYC', zip: '10001' },
          { city: 'LA', zip: '90001' },
        ],
      },
      dates: [new Date('2025-01-01'), new Date('2025-12-31')],
      regex: /test/i,
    }

    const cloned = deepClone(complex)

    expect(cloned).toEqual(complex)
    expect(cloned).not.toBe(complex)
    expect(cloned.profile).not.toBe(complex.profile)
    expect(cloned.profile.addresses).not.toBe(complex.profile.addresses)
    expect(cloned.dates[0]).not.toBe(complex.dates[0])
  })

  test('clones arrays with mixed types', () => {
    const arr = [1, 'string', { a: 1 }, [1, 2], new Date(), /test/]
    const cloned = deepClone(arr)

    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
  })

  test('clones empty objects and arrays', () => {
    expect(deepClone({})).toEqual({})
    expect(deepClone([])).toEqual([])
  })

  test('preserves object property types', () => {
    const obj = {
      num: 42,
      str: 'hello',
      bool: true,
      null: null,
      undef: undefined,
    }

    const cloned = deepClone(obj)

    expect(typeof cloned.num).toBe('number')
    expect(typeof cloned.str).toBe('string')
    expect(typeof cloned.bool).toBe('boolean')
    expect(cloned.null).toBe(null)
    expect(cloned.undef).toBe(undefined)
  })
})
