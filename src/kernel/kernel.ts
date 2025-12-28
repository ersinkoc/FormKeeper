/**
 * Kernel
 * Core form engine with plugin architecture
 */

import { EventBus } from './event-bus'
import { PluginRegistry } from './plugin-registry'
import type {
  FormOptions,
  FieldValues,
  Plugin,
  PluginInfo,
  EventType,
  FormEvent,
  EventHandler,
  Unsubscribe,
} from '../types'

/**
 * Kernel class - core form engine
 */
export class Kernel<TValues extends FieldValues = FieldValues> {
  private eventBus: EventBus<TValues>
  private pluginRegistry: PluginRegistry<TValues>
  private options: FormOptions<TValues>
  private plugins: Map<string, any> = new Map()

  constructor(options: FormOptions<TValues>) {
    this.options = options
    this.eventBus = new EventBus<TValues>()
    this.pluginRegistry = new PluginRegistry<TValues>(this.eventBus)

    // Install core plugins
    this.installCorePlugins()

    // Install user-provided plugins
    if (options.plugins && options.plugins.length > 0) {
      options.plugins.forEach((plugin) => this.registerPlugin(plugin))
    }
  }

  /**
   * Install core plugins
   * @private
   */
  private installCorePlugins(): void {
    // Core plugins will be installed here
    // They are loaded automatically as part of the kernel
  }

  /**
   * Register a plugin
   * @param plugin - Plugin to register
   */
  registerPlugin(plugin: Plugin<TValues>): void {
    // Register with registry
    this.pluginRegistry.register(plugin)

    // Install plugin
    try {
      plugin.install(this)
    } catch (error) {
      console.error(`Error installing plugin "${plugin.name}":`, error)
      throw error
    }

    // Store plugin API if available
    if (plugin.api) {
      this.plugins.set(plugin.name, plugin.api)
    }
  }

  /**
   * Unregister a plugin
   * @param name - Plugin name
   */
  unregisterPlugin(name: string): void {
    const plugin = this.pluginRegistry.get(name)
    if (plugin) {
      try {
        plugin.uninstall()
      } catch (error) {
        console.error(`Error uninstalling plugin "${name}":`, error)
      }

      this.pluginRegistry.unregister(name)
      this.plugins.delete(name)
    }
  }

  /**
   * Get a plugin by name
   * @param name - Plugin name
   * @returns Plugin API or undefined
   */
  getPlugin<P = any>(name: string): P | undefined {
    return this.plugins.get(name) as P | undefined
  }

  /**
   * List all registered plugins
   * @returns Array of plugin info
   */
  listPlugins(): PluginInfo[] {
    return this.pluginRegistry.list()
  }

  /**
   * Emit an event
   * @param event - Event to emit
   */
  emit(event: FormEvent<TValues>): void {
    this.eventBus.emit(event)
  }

  /**
   * Subscribe to an event
   * @param eventType - Event type
   * @param handler - Event handler
   * @returns Unsubscribe function
   */
  on<E extends EventType>(
    eventType: E,
    handler: EventHandler<E, TValues>
  ): Unsubscribe {
    return this.eventBus.on(eventType, handler)
  }

  /**
   * Unsubscribe from an event
   * @param eventType - Event type
   * @param handler - Event handler
   */
  off<E extends EventType>(
    eventType: E,
    handler: EventHandler<E, TValues>
  ): void {
    this.eventBus.off(eventType, handler)
  }

  /**
   * Destroy the kernel
   * Cleans up all plugins and listeners
   */
  destroy(): void {
    // Uninstall all plugins
    this.pluginRegistry.unregisterAll()

    // Clear event bus
    this.eventBus.clear()

    // Clear plugin APIs
    this.plugins.clear()
  }

  /**
   * Get form options
   * @returns Form options
   */
  getOptions(): FormOptions<TValues> {
    return this.options
  }

  /**
   * Get event bus (for plugins)
   * @internal
   */
  getEventBus(): EventBus<TValues> {
    return this.eventBus
  }
}
