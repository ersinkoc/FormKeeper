/**
 * React useForm Hook
 * Main hook for creating and using a form in React
 */

import { useRef, useEffect, useSyncExternalStore, useCallback } from 'react'
import { createForm, type Form } from '../../create-form'
import { deepEqual } from '../../utils/deep-equal'
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

  // Cache the snapshot to prevent unnecessary re-renders
  const snapshotRef = useRef<FormState<TValues> | null>(null)

  // Subscribe to form state changes
  const subscribe = useCallback(
    (callback: () => void) => {
      return form.on('state-change', callback)
    },
    [form]
  )

  const getSnapshot = useCallback((): FormState<TValues> => {
    const newSnapshot: FormState<TValues> = {
      values: form.getValues(),
      errors: form.getErrors(),
      touched: form.getTouched(),
      dirty: form.getDirty(),
      isValid: form.isValid(),
      isSubmitting: form.isSubmitting(),
      isSubmitSuccessful: form.isSubmitSuccessful(),
      submitCount: form.getSubmitCount(),
    }

    // Only return a new object if the snapshot actually changed
    if (!snapshotRef.current || !deepEqual(snapshotRef.current, newSnapshot)) {
      snapshotRef.current = newSnapshot
    }

    return snapshotRef.current
  }, [form])

  const formState = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  // Emit state-change events on value/error changes
  useEffect(() => {
    const emitStateChange = () => {
      form.emit({
        type: 'state-change',
        timestamp: Date.now(),
      } as any)
    }

    const unsubscribeChange = form.on('change', emitStateChange)
    const unsubscribeValidate = form.on('validate', emitStateChange)
    const unsubscribeSubmit = form.on('submit', emitStateChange)
    const unsubscribeSubmitSuccess = form.on('submit-success', emitStateChange)
    const unsubscribeSubmitError = form.on('submit-error', emitStateChange)
    const unsubscribeReset = form.on('reset', emitStateChange)

    return () => {
      unsubscribeChange()
      unsubscribeValidate()
      unsubscribeSubmit()
      unsubscribeSubmitSuccess()
      unsubscribeSubmitError()
      unsubscribeReset()
    }
  }, [form])

  // Create a stable returnValue reference
  const returnValueRef = useRef<UseFormReturn<TValues> | null>(null)

  // Create the return value once
  if (!returnValueRef.current) {
    returnValueRef.current = {
      ...form,
      formState: snapshotRef.current!,
      destroy: () => form.destroy(),
    } as UseFormReturn<TValues>
  }

  // Update formState on the existing object
  returnValueRef.current.formState = formState

  // Cleanup on unmount
  useEffect(() => {
    return () => returnValueRef.current!.destroy()
  }, [])

  return returnValueRef.current
}
