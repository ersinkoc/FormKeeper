/**
 * Path utilities for nested object access
 * Supports dot notation (user.profile.name) and bracket notation (items[0].name)
 */

/**
 * Parse a path string into an array of keys
 * @param path - Path string (e.g., 'user.profile.name' or 'items[0].name')
 * @returns Array of keys
 */
export function parsePath(path: string): string[] {
  if (!path) return []

  // Convert bracket notation to dot notation: items[0] -> items.0
  const normalized = path.replace(/\[(\d+)\]/g, '.$1')

  // Split by dots and filter empty strings
  return normalized.split('.').filter(Boolean)
}

/**
 * Get a value from an object using a path string
 * @param obj - Object to get value from
 * @param path - Path string (e.g., 'user.profile.name')
 * @returns Value at path, or undefined if not found
 */
export function deepGet(obj: any, path: string): any {
  if (!path) return obj
  if (obj === null || obj === undefined) return undefined

  const keys = parsePath(path)
  let result = obj

  for (const key of keys) {
    if (result === null || result === undefined) {
      return undefined
    }
    result = result[key]
  }

  return result
}

/**
 * Set a value in an object using a path string
 * Creates intermediate objects/arrays as needed
 * @param obj - Object to set value in (mutated)
 * @param path - Path string (e.g., 'user.profile.name')
 * @param value - Value to set
 */
export function deepSet(obj: any, path: string, value: any): void {
  if (!path) return
  if (obj === null || obj === undefined) return

  const keys = parsePath(path)
  let current = obj

  // Navigate to parent of target
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!
    const nextKey = keys[i + 1]!

    // Create intermediate object or array if needed, or overwrite non-object values
    if (
      !(key in current) ||
      current[key] === null ||
      current[key] === undefined ||
      typeof current[key] !== 'object'
    ) {
      // Check if next key is a number to decide between array or object
      current[key] = /^\d+$/.test(nextKey) ? [] : {}
    }

    current = current[key]
  }

  // Set the final value
  const lastKey = keys[keys.length - 1]!
  current[lastKey] = value
}
