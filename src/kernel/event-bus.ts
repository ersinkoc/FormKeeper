/**
 * Event Bus
 * Central event system for form and plugin communication
 */

import type {
  EventType,
  FormEvent,
  EventHandler,
  Unsubscribe,
  FieldValues,
} from '../types'

/**
 * Event bus for managing form events
 */
export class EventBus<TValues extends FieldValues = FieldValues> {
  private listeners: Map<EventType, Set<EventHandler<any, TValues>>> = new Map()

  /**
   * Subscribe to an event
   * @param eventType - Event type to listen for
   * @param handler - Handler function
   * @returns Unsubscribe function
   */
  on<E extends EventType>(
    eventType: E,
    handler: EventHandler<E, TValues>
  ): Unsubscribe {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }

    const handlers = this.listeners.get(eventType)!
    handlers.add(handler as EventHandler<any, TValues>)

    // Return unsubscribe function
    return () => this.off(eventType, handler)
  }

  /**
   * Unsubscribe from an event
   * @param eventType - Event type to stop listening for
   * @param handler - Handler function to remove
   */
  off<E extends EventType>(
    eventType: E,
    handler: EventHandler<E, TValues>
  ): void {
    const handlers = this.listeners.get(eventType)
    if (handlers) {
      handlers.delete(handler as EventHandler<any, TValues>)
    }
  }

  /**
   * Emit an event
   * @param event - Event to emit
   */
  emit(event: FormEvent<TValues>): void {
    const handlers = this.listeners.get(event.type)
    if (!handlers || handlers.size === 0) {
      return
    }

    // Call all handlers, catching errors to prevent one handler from breaking others
    handlers.forEach((handler) => {
      try {
        handler(event as any)
      } catch (error) {
        console.error(`Error in event handler for ${event.type}:`, error)
      }
    })
  }

  /**
   * Clear all listeners
   */
  clear(): void {
    this.listeners.clear()
  }

  /**
   * Get number of listeners for an event type
   * @param eventType - Event type
   * @returns Number of listeners
   */
  listenerCount(eventType: EventType): number {
    return this.listeners.get(eventType)?.size ?? 0
  }
}
