/**
 * React useForm Hook
 * Main hook for creating and using a form in React
 */

import { useRef, useEffect, useSyncExternalStore, useCallback } from 'react'
import { createForm, type Form } from '../../create-form'
import type {
  FormOptions,
  FieldValues,
  FormState,
} from '../../types'

/**
 * useForm options
 */
export type UseFormOptions<TValues extends FieldValues> = FormOptions<TValues>

/**
 * useForm return type
 */
export interface UseFormReturn<TValues extends FieldValues> extends Form<TValues> {
  formState: FormState<TValues>
}

/**
 * Create and manage a form instance in React
 * @param options - Form options
 * @returns Form instance with reactive state
 */
export function useForm<TValues extends FieldValues = FieldValues>(
  options: UseFormOptions<TValues>
): UseFormReturn<TValues> {
  // Create form instance once
  const formRef = useRef<Form<TValues>>()

  if (!formRef.current) {
    formRef.current = createForm(options)
  }

  const form = formRef.current

  // Subscribe to form state changes
  const subscribe = useCallback(
    (callback: () => void) => {
      return form.on('state-change', callback)
    },
    [form]
  )

  const getSnapshot = useCallback(
    (): FormState<TValues> => ({
      values: form.getValues(),
      errors: form.getErrors(),
      touched: form.getTouched(),
      dirty: form.getDirty(),
      isValid: form.isValid(),
      isSubmitting: form.isSubmitting(),
      isSubmitSuccessful: form.isSubmitSuccessful(),
      submitCount: form.getSubmitCount(),
    }),
    [form]
  )

  const formState = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  // Emit state-change events on value/error changes
  useEffect(() => {
    const unsubscribeChange = form.on('change', () => {
      form.emit({
        type: 'state-change',
        state: getSnapshot(),
        timestamp: Date.now(),
      } as any)
    })

    const unsubscribeValidate = form.on('validate', () => {
      form.emit({
        type: 'state-change',
        state: getSnapshot(),
        timestamp: Date.now(),
      } as any)
    })

    const unsubscribeSubmit = form.on('submit', () => {
      form.emit({
        type: 'state-change',
        state: getSnapshot(),
        timestamp: Date.now(),
      } as any)
    })

    const unsubscribeSubmitSuccess = form.on('submit-success', () => {
      form.emit({
        type: 'state-change',
        state: getSnapshot(),
        timestamp: Date.now(),
      } as any)
    })

    return () => {
      unsubscribeChange()
      unsubscribeValidate()
      unsubscribeSubmit()
      unsubscribeSubmitSuccess()
    }
  }, [form, getSnapshot])

  // Cleanup on unmount
  useEffect(() => {
    return () => form.destroy()
  }, [form])

  return {
    ...form,
    formState,
  }
}
