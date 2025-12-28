import { PluginRegistry } from '@/kernel/plugin-registry'
import { EventBus } from '@/kernel/event-bus'
import type { Plugin } from '@/types'

describe('PluginRegistry', () => {
  let eventBus: EventBus
  let registry: PluginRegistry

  beforeEach(() => {
    eventBus = new EventBus()
    registry = new PluginRegistry(eventBus)
  })

  it('should create an instance', () => {
    expect(registry).toBeInstanceOf(PluginRegistry)
  })

  it('should register a plugin', () => {
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall: vi.fn(),
    }

    expect(() => registry.register(plugin)).not.toThrow()
    expect(registry.get('test-plugin')).toBe(plugin)
  })

  it('should throw error when registering duplicate plugin', () => {
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall: vi.fn(),
    }

    registry.register(plugin)

    expect(() => registry.register(plugin)).toThrow(
      'Plugin "test-plugin" is already registered'
    )
  })

  it('should unregister a plugin', () => {
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall: vi.fn(),
    }

    registry.register(plugin)
    registry.unregister('test-plugin')

    expect(registry.get('test-plugin')).toBeUndefined()
  })

  it('should get a registered plugin', () => {
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall: vi.fn(),
    }

    registry.register(plugin)

    expect(registry.get('test-plugin')).toBe(plugin)
  })

  it('should return undefined for non-existent plugin', () => {
    expect(registry.get('non-existent')).toBeUndefined()
  })

  it('should list all registered plugins', () => {
    const plugin1: Plugin = {
      name: 'plugin-1',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall: vi.fn(),
    }

    const plugin2: Plugin = {
      name: 'plugin-2',
      version: '2.0.0',
      type: 'validation',
      install: vi.fn(),
      uninstall: vi.fn(),
    }

    registry.register(plugin1)
    registry.register(plugin2)

    const list = registry.list()

    expect(list).toHaveLength(2)
    expect(list).toEqual([
      { name: 'plugin-1', version: '1.0.0', type: 'utility', enabled: true },
      { name: 'plugin-2', version: '2.0.0', type: 'validation', enabled: true },
    ])
  })

  it('should register plugin hooks with event bus', () => {
    const onValueChange = vi.fn()
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall: vi.fn(),
      hooks: {
        onValueChange,
      },
    }

    registry.register(plugin)

    eventBus.emit({
      type: 'change',
      name: 'email',
      value: 'test@example.com',
      prevValue: '',
    })

    expect(onValueChange).toHaveBeenCalledWith('email', 'test@example.com', '')
  })

  it('should register onStateChange hook', () => {
    const onStateChange = vi.fn()
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall: vi.fn(),
      hooks: {
        onStateChange,
      },
    }

    registry.register(plugin)

    const state = { isSubmitting: true, isValid: true, isDirty: false }
    eventBus.emit({
      type: 'state-change',
      state,
    } as any)

    expect(onStateChange).toHaveBeenCalledWith(state)
  })

  it('should handle plugins without hooks', () => {
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall: vi.fn(),
    }

    expect(() => registry.register(plugin)).not.toThrow()
  })

  it('should unregister all plugins', () => {
    const uninstall1 = vi.fn()
    const uninstall2 = vi.fn()

    const plugin1: Plugin = {
      name: 'plugin-1',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall: uninstall1,
    }

    const plugin2: Plugin = {
      name: 'plugin-2',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall: uninstall2,
    }

    registry.register(plugin1)
    registry.register(plugin2)

    registry.unregisterAll()

    expect(uninstall1).toHaveBeenCalled()
    expect(uninstall2).toHaveBeenCalled()
    expect(registry.list()).toHaveLength(0)
  })

  it('should handle errors during unregisterAll', () => {
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

    registry.register(plugin)
    registry.unregisterAll()

    expect(consoleError).toHaveBeenCalled()
    expect(registry.list()).toHaveLength(0)

    consoleError.mockRestore()
  })

  it('should unregister plugins in reverse order', () => {
    const order: string[] = []

    const plugin1: Plugin = {
      name: 'plugin-1',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall: () => order.push('plugin-1'),
    }

    const plugin2: Plugin = {
      name: 'plugin-2',
      version: '1.0.0',
      type: 'utility',
      install: vi.fn(),
      uninstall: () => order.push('plugin-2'),
    }

    registry.register(plugin1)
    registry.register(plugin2)

    registry.unregisterAll()

    expect(order).toEqual(['plugin-2', 'plugin-1'])
  })
})
