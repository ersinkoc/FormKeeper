/**
 * React useFormState Hook
 * Subscribe to form state
 */

import { useSyncExternalStore, useCallback } from 'react'
import { useFormContext } from './context'
import type { FormState, FieldValues } from '../../types'

/**
 * useFormState options
 */
export interface UseFormStateOptions {
  /** Select specific state properties to subscribe to */
  select?: (keyof FormState<any>)[]
}

/**
 * Subscribe to form state
 * @param options - Options
 * @returns Form state
 */
export function useFormState<TValues extends FieldValues = FieldValues>(
  options?: UseFormStateOptions
): FormState<TValues> {
  const form = useFormContext<TValues>()

  const subscribe = useCallback(
    (callback: () => void) => {
      return form.on('state-change', callback)
    },
    [form]
  )

  const getSnapshot = useCallback((): FormState<TValues> => {
    const state: FormState<TValues> = {
      values: form.getValues(),
      errors: form.getErrors(),
      touched: form.getTouched(),
      dirty: form.getDirty(),
      isValid: form.isValid(),
      isSubmitting: form.isSubmitting(),
      isSubmitSuccessful: form.isSubmitSuccessful(),
      submitCount: form.getSubmitCount(),
    }

    // Filter by selected properties if specified
    if (options?.select) {
      const filtered: any = {}
      options.select.forEach((key) => {
        filtered[key] = state[key]
      })
      return filtered as FormState<TValues>
    }

    return state
  }, [form, options])

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
