/**
 * Array Fields Plugin
 * Manages dynamic array field operations
 */

import { generateId } from '../../utils'
import type {
  Plugin,
  FieldValues,
  FieldArrayReturn,
  FieldArrayItem,
  FieldArrayOptions,
} from '../../types'
import type { Kernel } from '../../kernel/kernel'
import type { StateManagerAPI } from './state-manager'

interface FieldArrayState {
  fields: FieldArrayItem[]
}

/**
 * Array fields plugin API
 */
export interface ArrayFieldsAPI {
  useFieldArray(name: string): FieldArrayReturn<any, any>
}

/**
 * Create array fields plugin
 */
export function createArrayFieldsPlugin<
  TValues extends FieldValues = FieldValues
>(): Plugin<TValues> {
  const arrays = new Map<string, FieldArrayState>()
  let kernel: Kernel<TValues> | null = null
  let stateManager: StateManagerAPI<TValues> | null = null

  const api: ArrayFieldsAPI = {
    useFieldArray(name: string): FieldArrayReturn<any, any> {
      if (!arrays.has(name)) {
        initializeArray(name)
      }

      const state = arrays.get(name)!

      return {
        fields: state.fields,
        append: (value, options) => append(name, value, options),
        prepend: (value, options) => prepend(name, value, options),
        insert: (index, value, options) => insert(name, index, value, options),
        remove: (index) => remove(name, index),
        swap: (indexA, indexB) => swap(name, indexA, indexB),
        move: (from, to) => move(name, from, to),
        update: (index, value) => update(name, index, value),
        replace: (values) => replace(name, values),
      }
    },
  }

  function initializeArray(name: string): void {
    const currentValue = stateManager?.getValue(name) ?? []
    const fields = Array.isArray(currentValue)
      ? currentValue.map((item) => ({ id: generateId(), ...item }))
      : []

    arrays.set(name, { fields })
  }

  function append(
    name: string,
    value: any,
    options?: FieldArrayOptions
  ): void {
    const state = arrays.get(name)!
    const array = stateManager?.getValue(name) ?? []

    // Add to array
    const newArray = [...array, value]
    stateManager?.setValue(name, newArray, { shouldValidate: true })

    // Add to fields with unique ID
    state.fields.push({ id: generateId(), ...value })

    // Handle focus
    if (options?.shouldFocus) {
      // Focus handling will be done by focus-manager plugin if available
      // const focusName = options.focusName ?? `${name}.${array.length}`
    }
  }

  function prepend(
    name: string,
    value: any,
    options?: FieldArrayOptions
  ): void {
    const state = arrays.get(name)!
    const array = stateManager?.getValue(name) ?? []

    // Prepend to array
    const newArray = [value, ...array]
    stateManager?.setValue(name, newArray, { shouldValidate: true })

    // Prepend to fields
    state.fields.unshift({ id: generateId(), ...value })

    // Handle focus
    if (options?.shouldFocus) {
      // Focus handling will be done by focus-manager plugin if available
      // const focusName = options.focusName ?? `${name}.0`
    }
  }

  function insert(
    name: string,
    index: number,
    value: any,
    options?: FieldArrayOptions
  ): void {
    const state = arrays.get(name)!
    const array = stateManager?.getValue(name) ?? []

    // Insert into array
    const newArray = [...array]
    newArray.splice(index, 0, value)
    stateManager?.setValue(name, newArray, { shouldValidate: true })

    // Insert into fields
    state.fields.splice(index, 0, { id: generateId(), ...value })

    // Handle focus
    if (options?.shouldFocus) {
      // Focus handling will be done by focus-manager plugin if available
      // const focusName = options.focusName ?? `${name}.${index}`
    }
  }

  function remove(name: string, index: number | number[]): void {
    const state = arrays.get(name)!
    const array = stateManager?.getValue(name) ?? []
    const indices = Array.isArray(index) ? index : [index]

    // Sort descending to avoid index shifting
    const sortedIndices = [...indices].sort((a, b) => b - a)

    // Remove from array
    const newArray = array.filter((_: any, i: number) => !sortedIndices.includes(i))
    stateManager?.setValue(name, newArray, { shouldValidate: true })

    // Remove from fields
    state.fields = state.fields.filter((_, i) => !sortedIndices.includes(i))
  }

  function swap(name: string, indexA: number, indexB: number): void {
    const state = arrays.get(name)!
    const array = stateManager?.getValue(name) ?? []

    // Swap in array
    const newArray = [...array]
    ;[newArray[indexA], newArray[indexB]] = [newArray[indexB], newArray[indexA]]
    stateManager?.setValue(name, newArray, { shouldValidate: true })

    // Swap in fields
    ;[state.fields[indexA], state.fields[indexB]] = [
      state.fields[indexB]!,
      state.fields[indexA]!,
    ]
  }

  function move(name: string, from: number, to: number): void {
    const state = arrays.get(name)!
    const array = stateManager?.getValue(name) ?? []

    // Move in array
    const newArray = [...array]
    const [item] = newArray.splice(from, 1)
    newArray.splice(to, 0, item)
    stateManager?.setValue(name, newArray, { shouldValidate: true })

    // Move in fields
    const [field] = state.fields.splice(from, 1)
    state.fields.splice(to, 0, field!)
  }

  function update(name: string, index: number, value: any): void {
    const state = arrays.get(name)!
    const array = stateManager?.getValue(name) ?? []

    // Update in array
    const newArray = [...array]
    newArray[index] = value
    stateManager?.setValue(name, newArray, { shouldValidate: true })

    // Update in fields (preserve ID)
    const field = state.fields[index]
    if (field) {
      state.fields[index] = { ...field, ...value }
    }
  }

  function replace(name: string, values: any[]): void {
    const state = arrays.get(name)!

    // Replace array
    stateManager?.setValue(name, values, { shouldValidate: true })

    // Replace fields
    state.fields = values.map((value) => ({ id: generateId(), ...value }))
  }

  return {
    name: 'array-fields',
    version: '1.0.0',
    type: 'core',

    install(k: Kernel<TValues>) {
      kernel = k
      stateManager = kernel.getPlugin<StateManagerAPI<TValues>>('state-manager') ?? null
    },

    uninstall() {
      arrays.clear()
      kernel = null
      stateManager = null
    },

    api: api as any,
  }
}
