import { EventBus } from '@/kernel/event-bus'
import type { FormEvent } from '@/types'

describe('EventBus', () => {
  it('should create an instance', () => {
    const bus = new EventBus()
    expect(bus).toBeInstanceOf(EventBus)
  })

  it('should subscribe to events', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    const unsubscribe = bus.on('change', handler)
    expect(typeof unsubscribe).toBe('function')
    expect(bus.listenerCount('change')).toBe(1)
  })

  it('should emit events to subscribers', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    bus.on('change', handler)

    const event: FormEvent = {
      type: 'change',
      name: 'email',
      value: 'test@example.com',
      prevValue: '',
    }

    bus.emit(event)

    expect(handler).toHaveBeenCalledWith(event)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should emit events to multiple subscribers', () => {
    const bus = new EventBus()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    bus.on('change', handler1)
    bus.on('change', handler2)

    const event: FormEvent = {
      type: 'change',
      name: 'email',
      value: 'test@example.com',
      prevValue: '',
    }

    bus.emit(event)

    expect(handler1).toHaveBeenCalledWith(event)
    expect(handler2).toHaveBeenCalledWith(event)
  })

  it('should unsubscribe using returned function', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    const unsubscribe = bus.on('change', handler)
    unsubscribe()

    expect(bus.listenerCount('change')).toBe(0)

    const event: FormEvent = {
      type: 'change',
      name: 'email',
      value: 'test@example.com',
      prevValue: '',
    }

    bus.emit(event)
    expect(handler).not.toHaveBeenCalled()
  })

  it('should unsubscribe using off method', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    bus.on('change', handler)
    bus.off('change', handler)

    expect(bus.listenerCount('change')).toBe(0)
  })

  it('should handle unsubscribe from non-existent event', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    expect(() => bus.off('change', handler)).not.toThrow()
  })

  it('should not emit to non-existent listeners', () => {
    const bus = new EventBus()

    const event: FormEvent = {
      type: 'change',
      name: 'email',
      value: 'test@example.com',
      prevValue: '',
    }

    expect(() => bus.emit(event)).not.toThrow()
  })

  it('should catch errors in event handlers', () => {
    const bus = new EventBus()
    const errorHandler = vi.fn(() => {
      throw new Error('Handler error')
    })
    const successHandler = vi.fn()

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    bus.on('change', errorHandler)
    bus.on('change', successHandler)

    const event: FormEvent = {
      type: 'change',
      name: 'email',
      value: 'test@example.com',
      prevValue: '',
    }

    bus.emit(event)

    expect(errorHandler).toHaveBeenCalledWith(event)
    expect(successHandler).toHaveBeenCalledWith(event)
    expect(consoleError).toHaveBeenCalled()

    consoleError.mockRestore()
  })

  it('should clear all listeners', () => {
    const bus = new EventBus()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    bus.on('change', handler1)
    bus.on('submit', handler2)

    expect(bus.listenerCount('change')).toBe(1)
    expect(bus.listenerCount('submit')).toBe(1)

    bus.clear()

    expect(bus.listenerCount('change')).toBe(0)
    expect(bus.listenerCount('submit')).toBe(0)
  })

  it('should return correct listener count', () => {
    const bus = new EventBus()

    expect(bus.listenerCount('change')).toBe(0)

    bus.on('change', vi.fn())
    expect(bus.listenerCount('change')).toBe(1)

    bus.on('change', vi.fn())
    expect(bus.listenerCount('change')).toBe(2)
  })

  it('should return 0 for non-existent event type', () => {
    const bus = new EventBus()
    expect(bus.listenerCount('change')).toBe(0)
  })

  it('should handle multiple event types', () => {
    const bus = new EventBus()
    const changeHandler = vi.fn()
    const submitHandler = vi.fn()

    bus.on('change', changeHandler)
    bus.on('submit', submitHandler)

    const changeEvent: FormEvent = {
      type: 'change',
      name: 'email',
      value: 'test@example.com',
      prevValue: '',
    }

    const submitEvent: FormEvent = {
      type: 'submit',
      values: { email: 'test@example.com' },
    }

    bus.emit(changeEvent)
    bus.emit(submitEvent)

    expect(changeHandler).toHaveBeenCalledWith(changeEvent)
    expect(submitHandler).toHaveBeenCalledWith(submitEvent)
    expect(changeHandler).toHaveBeenCalledTimes(1)
    expect(submitHandler).toHaveBeenCalledTimes(1)
  })
})
