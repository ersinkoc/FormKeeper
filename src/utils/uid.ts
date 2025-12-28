/**
 * Unique ID generator for array field items
 */

let counter = 0

/**
 * Generate a unique ID
 * Format: fk-{timestamp}-{counter}
 * @returns Unique ID string
 */
export function generateId(): string {
  return `fk-${Date.now()}-${++counter}`
}

/**
 * Reset counter (for testing)
 * @internal
 */
export function resetCounter(): void {
  counter = 0
}
