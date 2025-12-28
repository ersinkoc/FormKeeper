/**
 * Deep clone utility
 * Clones objects, arrays, Date, RegExp, and primitives
 */

/**
 * Deep clone a value
 * @param value - Value to clone
 * @returns Cloned value
 */
export function deepClone<T>(value: T): T {
  // Handle null and primitives
  if (value === null || typeof value !== 'object') {
    return value
  }

  // Handle Date
  if (value instanceof Date) {
    return new Date(value.getTime()) as T
  }

  // Handle RegExp
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T
  }

  // Handle Array
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item)) as T
  }

  // Handle Object
  const cloned = {} as T
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      cloned[key] = deepClone(value[key])
    }
  }

  return cloned
}
