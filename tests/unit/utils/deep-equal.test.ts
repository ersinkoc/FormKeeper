import { deepEqual } from '../../../src/utils/deep-equal'

describe('deepEqual', () => {
  test('compares primitives', () => {
    expect(deepEqual(1, 1)).toBe(true)
    expect(deepEqual(1, 2)).toBe(false)
    expect(deepEqual('hello', 'hello')).toBe(true)
    expect(deepEqual('hello', 'world')).toBe(false)
    expect(deepEqual(true, true)).toBe(true)
    expect(deepEqual(true, false)).toBe(false)
  })

  test('compares null and undefined', () => {
    expect(deepEqual(null, null)).toBe(true)
    expect(deepEqual(undefined, undefined)).toBe(true)
    expect(deepEqual(null, undefined)).toBe(false)
    expect(deepEqual(null, 0)).toBe(false)
    expect(deepEqual(undefined, 0)).toBe(false)
  })

  test('compares objects', () => {
    expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true)
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false)
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false)
  })

  test('compares nested objects', () => {
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true)
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false)
    expect(deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(true)
  })

  test('compares arrays', () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
    expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false)
    expect(deepEqual([1, 2, 3], [1, 2])).toBe(false)
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false)
  })

  test('compares nested arrays', () => {
    expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true)
    expect(deepEqual([1, [2, 3]], [1, [2, 4]])).toBe(false)
  })

  test('compares Date objects', () => {
    const date1 = new Date('2025-01-01')
    const date2 = new Date('2025-01-01')
    const date3 = new Date('2025-12-31')

    expect(deepEqual(date1, date2)).toBe(true)
    expect(deepEqual(date1, date3)).toBe(false)
  })

  test('compares RegExp objects', () => {
    expect(deepEqual(/test/gi, /test/gi)).toBe(true)
    expect(deepEqual(/test/gi, /test/i)).toBe(false)
    expect(deepEqual(/test/i, /other/i)).toBe(false)
  })

  test('compares mixed types', () => {
    expect(deepEqual(1, '1')).toBe(false)
    expect(deepEqual([], {})).toBe(false)
    expect(deepEqual(null, {})).toBe(false)
    expect(deepEqual(undefined, {})).toBe(false)
  })

  test('compares complex structures', () => {
    const obj1 = {
      name: 'John',
      age: 30,
      profile: {
        email: 'john@example.com',
        addresses: [
          { city: 'NYC', zip: '10001' },
          { city: 'LA', zip: '90001' },
        ],
      },
    }

    const obj2 = {
      name: 'John',
      age: 30,
      profile: {
        email: 'john@example.com',
        addresses: [
          { city: 'NYC', zip: '10001' },
          { city: 'LA', zip: '90001' },
        ],
      },
    }

    const obj3 = {
      name: 'Jane',
      age: 30,
      profile: {
        email: 'john@example.com',
        addresses: [
          { city: 'NYC', zip: '10001' },
          { city: 'LA', zip: '90001' },
        ],
      },
    }

    expect(deepEqual(obj1, obj2)).toBe(true)
    expect(deepEqual(obj1, obj3)).toBe(false)
  })

  test('compares same reference', () => {
    const obj = { a: 1 }
    expect(deepEqual(obj, obj)).toBe(true)
  })

  test('compares empty objects and arrays', () => {
    expect(deepEqual({}, {})).toBe(true)
    expect(deepEqual([], [])).toBe(true)
    expect(deepEqual({}, [])).toBe(false)
  })

  test('compares objects with different key counts', () => {
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
    expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false)
  })
})
