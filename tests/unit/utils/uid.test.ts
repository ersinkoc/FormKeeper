import { generateId, resetCounter } from '../../../src/utils/uid'

describe('generateId', () => {
  beforeEach(() => {
    resetCounter()
  })

  test('generates unique IDs', () => {
    const id1 = generateId()
    const id2 = generateId()
    const id3 = generateId()

    expect(id1).not.toBe(id2)
    expect(id2).not.toBe(id3)
    expect(id1).not.toBe(id3)
  })

  test('ID format is correct', () => {
    const id = generateId()
    expect(id).toMatch(/^fk-\d+-\d+$/)
  })

  test('increments counter', () => {
    const id1 = generateId()
    const id2 = generateId()

    const counter1 = parseInt(id1.split('-')[2]!)
    const counter2 = parseInt(id2.split('-')[2]!)

    expect(counter2).toBe(counter1 + 1)
  })

  test('includes timestamp', () => {
    const before = Date.now()
    const id = generateId()
    const after = Date.now()

    const timestamp = parseInt(id.split('-')[1]!)

    expect(timestamp).toBeGreaterThanOrEqual(before)
    expect(timestamp).toBeLessThanOrEqual(after)
  })

  test('resetCounter resets the counter', () => {
    generateId()
    generateId()
    generateId()

    resetCounter()

    const id = generateId()
    const counter = parseInt(id.split('-')[2]!)

    expect(counter).toBe(1)
  })
})
