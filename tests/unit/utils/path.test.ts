import { describe, test, expect } from 'vitest'
import { parsePath, deepGet, deepSet } from '../../../src/utils/path'

describe('parsePath', () => {
  test('parses dot notation', () => {
    expect(parsePath('user.profile.name')).toEqual(['user', 'profile', 'name'])
  })

  test('parses bracket notation', () => {
    expect(parsePath('items[0].name')).toEqual(['items', '0', 'name'])
  })

  test('parses mixed notation', () => {
    expect(parsePath('users[0].profile.addresses[1].city')).toEqual([
      'users',
      '0',
      'profile',
      'addresses',
      '1',
      'city',
    ])
  })

  test('handles empty path', () => {
    expect(parsePath('')).toEqual([])
  })

  test('handles single key', () => {
    expect(parsePath('email')).toEqual(['email'])
  })

  test('filters empty segments', () => {
    expect(parsePath('user..name')).toEqual(['user', 'name'])
  })
})

describe('deepGet', () => {
  test('retrieves nested value', () => {
    const obj = { user: { profile: { name: 'John' } } }
    expect(deepGet(obj, 'user.profile.name')).toBe('John')
  })

  test('retrieves array value', () => {
    const obj = { items: [{ name: 'A' }, { name: 'B' }] }
    expect(deepGet(obj, 'items[0].name')).toBe('A')
    expect(deepGet(obj, 'items[1].name')).toBe('B')
  })

  test('returns undefined for missing path', () => {
    const obj = { user: { name: 'John' } }
    expect(deepGet(obj, 'user.profile.name')).toBeUndefined()
  })

  test('returns undefined for null object', () => {
    expect(deepGet(null, 'user.name')).toBeUndefined()
  })

  test('returns undefined for undefined object', () => {
    expect(deepGet(undefined, 'user.name')).toBeUndefined()
  })

  test('returns object itself for empty path', () => {
    const obj = { name: 'John' }
    expect(deepGet(obj, '')).toBe(obj)
  })

  test('retrieves top-level value', () => {
    const obj = { email: 'test@example.com' }
    expect(deepGet(obj, 'email')).toBe('test@example.com')
  })

  test('handles null values in path', () => {
    const obj = { user: null }
    expect(deepGet(obj, 'user.name')).toBeUndefined()
  })
})

describe('deepSet', () => {
  test('sets nested value', () => {
    const obj: any = {}
    deepSet(obj, 'user.profile.name', 'John')
    expect(obj).toEqual({ user: { profile: { name: 'John' } } })
  })

  test('sets array value', () => {
    const obj: any = {}
    deepSet(obj, 'items[0].name', 'A')
    expect(obj).toEqual({ items: [{ name: 'A' }] })
  })

  test('creates intermediate objects', () => {
    const obj: any = {}
    deepSet(obj, 'a.b.c.d', 'value')
    expect(obj).toEqual({ a: { b: { c: { d: 'value' } } } })
  })

  test('creates intermediate arrays', () => {
    const obj: any = {}
    deepSet(obj, 'items[0][1].name', 'value')
    expect(obj).toEqual({ items: [[undefined, { name: 'value' }]] })
  })

  test('updates existing value', () => {
    const obj = { user: { name: 'John' } }
    deepSet(obj, 'user.name', 'Jane')
    expect(obj).toEqual({ user: { name: 'Jane' } })
  })

  test('sets top-level value', () => {
    const obj: any = {}
    deepSet(obj, 'email', 'test@example.com')
    expect(obj).toEqual({ email: 'test@example.com' })
  })

  test('handles empty path', () => {
    const obj = { name: 'John' }
    deepSet(obj, '', 'value')
    expect(obj).toEqual({ name: 'John' })
  })

  test('handles null object', () => {
    expect(() => deepSet(null, 'user.name', 'John')).not.toThrow()
  })

  test('handles undefined object', () => {
    expect(() => deepSet(undefined, 'user.name', 'John')).not.toThrow()
  })

  test('overwrites non-object values', () => {
    const obj: any = { user: 'string' }
    deepSet(obj, 'user.name', 'John')
    expect(obj).toEqual({ user: { name: 'John' } })
  })
})
