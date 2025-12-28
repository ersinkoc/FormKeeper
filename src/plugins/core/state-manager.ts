/**
 * State Manager Plugin
 * Manages form values, touched, dirty state
 */

import { deepClone, deepGet, deepSet, deepEqual } from '../../utils'
import type {
  Plugin,
  FieldValues,
  DeepPartial,
  SetValueOptions,
  ResetOptions,
  TouchedFields,
  DirtyFields,
} from '../../types'
import type { Kernel } from '../../kernel/kernel'

/**
 * State manager plugin API
 */
export interface StateManagerAPI<TValues extends FieldValues> {
  getValues(): TValues
  getValues<K extends string>(name: K): any
  getValue(name: string): any
  setValue(name: string, value: any, options?: SetValueOptions): void
  setValues(values: DeepPartial<TValues>, options?: SetValueOptions): void
  getTouched(): TouchedFields<TValues>
  isTouched(name: string): boolean
  setTouched(name: string, touched?: boolean): void
  getDirty(): DirtyFields<TValues>
  isDirty(name?: string): boolean
  getDefaultValues(): TValues
  setDefaultValues(values: TValues): void
  reset(values?: DeepPartial<TValues>, options?: ResetOptions): void
  resetField(name: string, options?: ResetOptions): void
}

/**
 * Create state manager plugin
 */
export function createStateManagerPlugin<
  TValues extends FieldValues = FieldValues
>(initialValues: TValues): Plugin<TValues> {
  let values: TValues = deepClone(initialValues)
  let defaultValues: TValues = deepClone(initialValues)
  let touched: TouchedFields<TValues> = {}
  let dirty: DirtyFields<TValues> = {}
  let kernel: Kernel<TValues> | null = null

  const api: StateManagerAPI<TValues> = {
    getValues(name?: string): any {
      if (name) {
        return deepGet(values, name)
      }
      return values
    },

    getValue(name: string): any {
      return deepGet(values, name)
    },

    setValue(name: string, value: any, options?: SetValueOptions): void {
      const prevValue = deepGet(values, name)

      // Set new value
      deepSet(values, name, value)

      // Update dirty state
      const defaultValue = deepGet(defaultValues, name)
      const isDirty = !deepEqual(value, defaultValue)
      deepSet(dirty, name, isDirty)

      // Optionally mark as touched
      if (options?.shouldTouch) {
        deepSet(touched, name, true)
      }

      // Emit change event
      kernel?.emit({
        type: 'change',
        name,
        value,
        prevValue,
        timestamp: Date.now(),
      })

      // Optionally validate
      if (options?.shouldValidate) {
        // Validation will be triggered by validation-engine plugin listening to change event
      }
    },

    setValues(newValues: DeepPartial<TValues>, options?: SetValueOptions): void {
      // Merge new values
      Object.keys(newValues).forEach((key) => {
        const value = (newValues as any)[key]
        if (value !== undefined) {
          api.setValue(key, value, options)
        }
      })
    },

    getTouched(): TouchedFields<TValues> {
      return touched
    },

    isTouched(name: string): boolean {
      return deepGet(touched, name) === true
    },

    setTouched(name: string, value = true): void {
      deepSet(touched, name, value)
    },

    getDirty(): DirtyFields<TValues> {
      return dirty
    },

    isDirty(name?: string): boolean {
      if (!name) {
        // Check if ANY field is dirty
        return hasAnyDirty(dirty)
      }

      return deepGet(dirty, name) === true
    },

    getDefaultValues(): TValues {
      return defaultValues
    },

    setDefaultValues(newDefaultValues: TValues): void {
      defaultValues = deepClone(newDefaultValues)
    },

    reset(newValues?: DeepPartial<TValues>, options?: ResetOptions): void {
      // Determine what values to reset to
      const resetValues = newValues
        ? { ...defaultValues, ...newValues }
        : defaultValues

      // Reset values
      if (!options?.keepValues) {
        values = deepClone(resetValues)
      }

      // Reset touched
      if (!options?.keepTouched) {
        touched = {}
      }

      // Reset dirty
      if (!options?.keepDirty) {
        dirty = {}
      }

      // Update default values if provided
      if (newValues && !options?.keepDefaultValues) {
        defaultValues = deepClone(resetValues as TValues)
      }

      // Emit reset event
      kernel?.emit({
        type: 'reset',
        values: values,
        timestamp: Date.now(),
      })
    },

    resetField(name: string, options?: ResetOptions): void {
      const defaultValue = deepGet(defaultValues, name)

      // Reset value
      if (!options?.keepValues) {
        deepSet(values, name, defaultValue)
      }

      // Reset touched
      if (!options?.keepTouched) {
        deepSet(touched, name, false)
      }

      // Reset dirty
      if (!options?.keepDirty) {
        deepSet(dirty, name, false)
      }
    },
  }

  function hasAnyDirty(obj: any): boolean {
    if (typeof obj === 'boolean') return obj
    if (typeof obj !== 'object' || obj === null) return false

    return Object.values(obj).some((val) => hasAnyDirty(val))
  }

  return {
    name: 'state-manager',
    version: '1.0.0',
    type: 'core',

    install(k: Kernel<TValues>) {
      kernel = k
    },

    uninstall() {
      kernel = null
    },

    api: api as any,
  }
}
