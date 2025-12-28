/**
 * Deep equality comparison
 * Compares objects, arrays, Date, RegExp, and primitives
 */

/**
 * Deep equality check
 * @param a - First value
 * @param b - Second value
 * @returns True if values are deeply equal
 */
export function deepEqual(a: any, b: any): boolean {
  // Same reference or same primitive value
  if (a === b) return true

  // One is null/undefined
  if (a === null || b === null) return false
  if (a === undefined || b === undefined) return false

  // Different types
  if (typeof a !== typeof b) return false

  // Not objects
  if (typeof a !== 'object') return false

  // Handle Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  // Handle RegExp
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString()
  }

  // Handle Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, index) => deepEqual(item, b[index]))
  }

  // One is array, one is not
  if (Array.isArray(a) !== Array.isArray(b)) return false

  // Handle Objects
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  return keysA.every((key) => deepEqual(a[key], b[key]))
}
