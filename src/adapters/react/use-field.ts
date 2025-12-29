/**
 * React useField Hook
 * Subscribe to a specific field's state
 */

import { useEffect, useSyncExternalStore, useCallback, useRef } from 'react'
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

      const unsubscribeSubmitError = form.on('submit-error', () => {
        callback()
      })

      return () => {
        unsubscribeChange()
        unsubscribeBlur()
        unsubscribeValidate()
        unsubscribeSubmitError()
      }
    },
    [form, name]
  )

  const snapshotRef = useRef<{
    value: any
    error: string | undefined
    touched: boolean
    dirty: boolean
    validating: boolean
  } | null>(null)

  const getSnapshot = useCallback(() => {
    const newValue = form.getValues(name as any)
    const newError = form.getError(name as any)
    const newTouched = form.isTouched(name as any)
    const newDirty = form.isDirty(name as any)
    const newValidating = form.isFieldValidating(name)

    const current = snapshotRef.current
    if (
      !current ||
      current.value !== newValue ||
      current.error !== newError ||
      current.touched !== newTouched ||
      current.dirty !== newDirty ||
      current.validating !== newValidating
    ) {
      snapshotRef.current = {
        value: newValue,
        error: newError,
        touched: newTouched,
        dirty: newDirty,
        validating: newValidating,
      }
    }
    return snapshotRef.current!
  }, [form, name])

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
