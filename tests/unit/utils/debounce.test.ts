import { debounce } from '../../../src/utils/debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('delays function execution', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(50)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('cancels previous call', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    debounced()
    debounced()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('passes arguments to function', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced('a', 'b', 'c')

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledWith('a', 'b', 'c')
  })

  test('preserves this context', () => {
    const obj = {
      value: 42,
      method: vi.fn(function (this: any) {
        return this.value
      }),
    }

    const debounced = debounce(obj.method, 100)
    debounced.call(obj)

    vi.advanceTimersByTime(100)
    expect(obj.method).toHaveBeenCalledTimes(1)
  })

  test('handles multiple calls with different delays', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    vi.advanceTimersByTime(50)

    debounced()
    vi.advanceTimersByTime(50)

    debounced()
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('allows subsequent calls after completion', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)

    debounced()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  test('works with zero delay', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 0)

    debounced()
    vi.advanceTimersByTime(0)

    expect(fn).toHaveBeenCalledTimes(1)
  })
})
