import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Kernel } from '@/kernel/kernel'
import type { Plugin, FormOptions } from '@/types'

describe('Kernel', () => {
  let options: FormOptions<any>

  beforeEach(() => {
    options = {
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    }
  })

  it('should create an instance', () => {
    const kernel = new Kernel(options)
    expect(kernel).toBeInstanceOf(Kernel)
  })

  it('should register a plugin', () => {
    const kernel = new Kernel(options)
    const install = vi.fn()

    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'utility',
      install,
      uninstall: vi.fn(),
    }

    kernel.registerPlugin(plugin)

    expect(install).toHaveBeenCalledWith(kernel)
    expect(kernel.listPlugins()).toHaveLength(1)
  })

  it('should install plugins from options', () => {
    const install = vi.fn()

    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'utility',
      install,
      uninstall: vi.fn(),
    }

    const kernel = new Kernel({
      ...options,
      plugins: [plugin],
    })

    expect(install).toHaveBeenCalledWith(kernel)
  })

  it('should throw error on plugin install failure', () => {
    const kernel = new Kernel(options)

    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'utility',
      install: () => {
        throw new Error('Install error')
      },
      uninstall: vi.fn(),
    }

    expect(() => kernel.registerPlugin(plugin)).toThrow('Install error')
  })

  it('should store plugin API', () => {
    const kernel = new Kernel(options)

    const api = { someMethod: vi.fn() }
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall: vi.fn(),
      api,
    }

    kernel.registerPlugin(plugin)

    expect(kernel.getPlugin('test-plugin')).toBe(api)
  })

  it('should unregister a plugin', () => {
    const kernel = new Kernel(options)
    const uninstall = vi.fn()

    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall,
    }

    kernel.registerPlugin(plugin)
    kernel.unregisterPlugin('test-plugin')

    expect(uninstall).toHaveBeenCalled()
    expect(kernel.getPlugin('test-plugin')).toBeUndefined()
  })

  it('should handle errors during plugin uninstall', () => {
    const kernel = new Kernel(options)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall: () => {
        throw new Error('Uninstall error')
      },
    }

    kernel.registerPlugin(plugin)
    kernel.unregisterPlugin('test-plugin')

    expect(consoleError).toHaveBeenCalled()

    consoleError.mockRestore()
  })

  it('should handle unregister of non-existent plugin', () => {
    const kernel = new Kernel(options)
    expect(() => kernel.unregisterPlugin('non-existent')).not.toThrow()
  })

  it('should get a plugin by name', () => {
    const kernel = new Kernel(options)

    const api = { someMethod: vi.fn() }
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall: vi.fn(),
      api,
    }

    kernel.registerPlugin(plugin)

    expect(kernel.getPlugin('test-plugin')).toBe(api)
  })

  it('should return undefined for non-existent plugin', () => {
    const kernel = new Kernel(options)
    expect(kernel.getPlugin('non-existent')).toBeUndefined()
  })

  it('should list all plugins', () => {
    const kernel = new Kernel(options)

    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall: vi.fn(),
    }

    kernel.registerPlugin(plugin)

    const plugins = kernel.listPlugins()
    expect(plugins).toHaveLength(1)
    expect(plugins[0].name).toBe('test-plugin')
  })

  it('should emit events', () => {
    const kernel = new Kernel(options)
    const handler = vi.fn()

    kernel.on('change', handler)

    kernel.emit({
      type: 'change',
      name: 'email',
      value: 'test@example.com',
      prevValue: '',
    })

    expect(handler).toHaveBeenCalled()
  })

  it('should subscribe to events', () => {
    const kernel = new Kernel(options)
    const handler = vi.fn()

    const unsubscribe = kernel.on('change', handler)

    expect(typeof unsubscribe).toBe('function')
  })

  it('should unsubscribe from events', () => {
    const kernel = new Kernel(options)
    const handler = vi.fn()

    kernel.on('change', handler)
    kernel.off('change', handler)

    kernel.emit({
      type: 'change',
      name: 'email',
      value: 'test@example.com',
      prevValue: '',
    })

    expect(handler).not.toHaveBeenCalled()
  })

  it('should destroy kernel', () => {
    const kernel = new Kernel(options)
    const uninstall = vi.fn()

    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall,
    }

    kernel.registerPlugin(plugin)

    kernel.destroy()

    expect(uninstall).toHaveBeenCalled()
    expect(kernel.listPlugins()).toHaveLength(0)
  })

  it('should get form options', () => {
    const kernel = new Kernel(options)
    expect(kernel.getOptions()).toBe(options)
  })

  it('should get event bus', () => {
    const kernel = new Kernel(options)
    const eventBus = kernel.getEventBus()

    expect(eventBus).toBeDefined()
    expect(typeof eventBus.on).toBe('function')
    expect(typeof eventBus.emit).toBe('function')
  })
})
