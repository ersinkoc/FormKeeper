/**
 * Plugin Registry
 * Manages plugin lifecycle and hook execution
 */

import type { Plugin, PluginInfo, FieldValues } from '../types'
import type { EventBus } from './event-bus'

/**
 * Plugin registry for managing form plugins
 */
export class PluginRegistry<TValues extends FieldValues = FieldValues> {
  private plugins: Map<string, Plugin<TValues>> = new Map()
  private eventBus: EventBus<TValues>

  constructor(eventBus: EventBus<TValues>) {
    this.eventBus = eventBus
  }

  /**
   * Register a plugin
   * @param plugin - Plugin to register
   */
  register(plugin: Plugin<TValues>): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered`)
    }

    this.plugins.set(plugin.name, plugin)

    // Register plugin hooks with event bus
    this.registerHooks(plugin)
  }

  /**
   * Unregister a plugin
   * @param name - Plugin name
   */
  unregister(name: string): void {
    this.plugins.delete(name)
  }

  /**
   * Unregister all plugins in reverse order
   */
  unregisterAll(): void {
    // Get plugins in reverse order for cleanup
    const pluginsArray = Array.from(this.plugins.values()).reverse()

    pluginsArray.forEach((plugin) => {
      try {
        plugin.uninstall()
      } catch (error) {
        console.error(`Error uninstalling plugin "${plugin.name}":`, error)
      }
    })

    this.plugins.clear()
  }

  /**
   * Get a plugin by name
   * @param name - Plugin name
   * @returns Plugin or undefined
   */
  get(name: string): Plugin<TValues> | undefined {
    return this.plugins.get(name)
  }

  /**
   * List all registered plugins
   * @returns Array of plugin info
   */
  list(): PluginInfo[] {
    return Array.from(this.plugins.values()).map((plugin) => ({
      name: plugin.name,
      version: plugin.version,
      type: plugin.type,
      enabled: true,
    }))
  }

  /**
   * Register plugin hooks with event bus
   * @param plugin - Plugin with hooks
   */
  private registerHooks(plugin: Plugin<TValues>): void {
    if (!plugin.hooks) return

    const { hooks } = plugin

    // Map value change hook to change event
    if (hooks.onValueChange) {
      this.eventBus.on('change', (event) => {
        hooks.onValueChange!(event.name, event.value, event.prevValue)
      })
    }

    // Map state change hook to state-change event
    if (hooks.onStateChange) {
      this.eventBus.on('state-change', (event: any) => {
        hooks.onStateChange!(event.state)
      })
    }
  }
}
