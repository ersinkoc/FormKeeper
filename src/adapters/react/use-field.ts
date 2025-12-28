/**
 * React useField Hook
 * Subscribe to a specific field's state
 */

import { useEffect, useSyncExternalStore, useCallback } from 'react'
import { useFormContext } from './context'
import type {
  FieldRegistration,
  ValidationRules,
} from '../../types'

/**
 * useField options
 */
export interface UseFieldOptions extends ValidationRules {
  defaultValue?: any
}

/**
 * useField return type
 */
export interface UseFieldReturn {
  register: () => FieldRegistration
  value: any
  error: string | undefined
  touched: boolean
  dirty: boolean
  validating: boolean
  invalid: boolean
  setValue: (value: any) => void
  setError: (error: string) => void
  clearError: () => void
  setTouched: (touched?: boolean) => void
}

/**
 * Subscribe to a field's state
 * @param name - Field name
 * @param options - Field options with validation rules
 * @returns Field state and methods
 */
export function useField(
  name: string,
  options?: UseFieldOptions
): UseFieldReturn {
  const form = useFormContext()

  // Register field on mount, unregister on unmount
  useEffect(() => {
    form.register(name, options)

    return () => {
      const formOptions = form.getOptions()
      if (formOptions.shouldUnregister) {
        form.unregister(name)
      }
    }
  }, [form, name]) // Don't include options to avoid re-registration

  // Subscribe to field changes
  const subscribe = useCallback(
    (callback: () => void) => {
      const unsubscribeChange = form.on('change', (event: any) => {
        if (event.name === name) {
          callback()
        }
      })

      const unsubscribeBlur = form.on('blur', (event: any) => {
        if (event.name === name) {
          callback()
        }
      })

      const unsubscribeValidate = form.on('validate', () => {
        callback()
      })

      return () => {
        unsubscribeChange()
        unsubscribeBlur()
        unsubscribeValidate()
      }
    },
    [form, name]
  )

  const getSnapshot = useCallback(
    () => ({
      value: form.getValues(name as any),
      error: form.getError(name as any),
      touched: form.isTouched(name as any),
      dirty: form.isDirty(name as any),
      validating: form.isFieldValidating(name),
    }),
    [form, name]
  )

  const fieldState = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return {
    register: () => form.register(name, options),
    value: fieldState.value,
    error: fieldState.error,
    touched: fieldState.touched,
    dirty: fieldState.dirty,
    validating: fieldState.validating,
    invalid: !!fieldState.error,
    setValue: (value) => form.setValue(name as any, value),
    setError: (error) => form.setError(name as any, error),
    clearError: () => form.clearError(name as any),
    setTouched: (touched) => form.setTouched(name as any, touched),
  }
}
