/**
 * Svelte Adapter
 * Stores for Svelte integration
 * @packageDocumentation
 */

import { writable, type Readable } from 'svelte/store'
import { createForm, type Form } from '../../create-form'
import type {
  FormOptions,
  FieldValues,
  FormState,
  ValidationRules,
} from '../../types'

/**
 * Form store value
 */
export interface FormStoreValue<TValues extends FieldValues> {
  values: TValues
  errors: any
  touched: any
  dirty: any
  isValid: boolean
  isSubmitting: boolean
  isSubmitSuccessful: boolean
  submitCount: number
}

/**
 * Form store interface
 */
export interface FormStore<TValues extends FieldValues> extends Readable<FormStoreValue<TValues>> {
  register: Form<TValues>['register']
  setValue: Form<TValues>['setValue']
  setValues: Form<TValues>['setValues']
  getValues: Form<TValues>['getValues']
  setError: Form<TValues>['setError']
  clearErrors: Form<TValues>['clearErrors']
  reset: Form<TValues>['reset']
  submit: Form<TValues>['submit']
  handleSubmit: Form<TValues>['handleSubmit']
  useFieldArray: Form<TValues>['useFieldArray']
  destroy: Form<TValues>['destroy']
}

/**
 * Create a form store
 * @param options - Form options
 * @returns Form store
 */
export function createFormStore<TValues extends FieldValues = FieldValues>(
  options: FormOptions<TValues>
): FormStore<TValues> {
  const form = createForm(options)

  // Create writable store
  const store = writable<FormStoreValue<TValues>>({
    values: form.getValues(),
    errors: form.getErrors(),
    touched: form.getTouched(),
    dirty: form.getDirty(),
    isValid: form.isValid(),
    isSubmitting: form.isSubmitting(),
    isSubmitSuccessful: form.isSubmitSuccessful(),
    submitCount: form.getSubmitCount(),
  })

  // Subscribe to form changes
  form.on('change', () => {
    store.set({
      values: form.getValues(),
      errors: form.getErrors(),
      touched: form.getTouched(),
      dirty: form.getDirty(),
      isValid: form.isValid(),
      isSubmitting: form.isSubmitting(),
      isSubmitSuccessful: form.isSubmitSuccessful(),
      submitCount: form.getSubmitCount(),
    })
  })

  form.on('blur', () => {
    store.update((s) => ({
      ...s,
      touched: form.getTouched(),
    }))
  })

  form.on('validate', () => {
    store.update((s) => ({
      ...s,
      errors: form.getErrors(),
      isValid: form.isValid(),
    }))
  })

  form.on('submit', () => {
    store.update((s) => ({
      ...s,
      isSubmitting: true,
    }))
  })

  form.on('submit-success', () => {
    store.update((s) => ({
      ...s,
      isSubmitting: false,
      isSubmitSuccessful: true,
      submitCount: form.getSubmitCount(),
    }))
  })

  form.on('submit-error', () => {
    store.update((s) => ({
      ...s,
      isSubmitting: false,
    }))
  })

  return {
    subscribe: store.subscribe,
    register: form.register.bind(form),
    setValue: form.setValue.bind(form),
    setValues: form.setValues.bind(form),
    getValues: form.getValues.bind(form),
    setError: form.setError.bind(form),
    clearErrors: form.clearErrors.bind(form),
    reset: form.reset.bind(form),
    submit: form.submit.bind(form),
    handleSubmit: form.handleSubmit.bind(form),
    useFieldArray: form.useFieldArray.bind(form),
    destroy: form.destroy.bind(form),
  }
}

/**
 * Field store value
 */
export interface FieldStoreValue {
  value: any
  error: string | undefined
  touched: boolean
  dirty: boolean
  validating: boolean
}

/**
 * Field store interface
 */
export interface FieldStore extends Readable<FieldStoreValue> {
  register: () => any
  setValue: (value: any) => void
  setError: (error: string) => void
  clearError: () => void
  setTouched: (touched?: boolean) => void
}

/**
 * Create a field store
 * @param form - Form instance
 * @param name - Field name
 * @param rules - Validation rules
 * @returns Field store
 */
export function fieldStore(
  form: Form<any>,
  name: string,
  rules?: ValidationRules
): FieldStore {
  const store = writable<FieldStoreValue>({
    value: form.getValues(name as any),
    error: form.getError(name as any),
    touched: form.isTouched(name as any),
    dirty: form.isDirty(name as any),
    validating: form.isFieldValidating(name),
  })

  // Subscribe to field changes
  form.on('change', (event) => {
    if (event.name === name) {
      store.update((s) => ({
        ...s,
        value: event.value,
        dirty: form.isDirty(name as any),
      }))
    }
  })

  form.on('blur', (event) => {
    if (event.name === name) {
      store.update((s) => ({
        ...s,
        touched: true,
      }))
    }
  })

  form.on('validate', () => {
    store.update((s) => ({
      ...s,
      error: form.getError(name as any),
    }))
  })

  return {
    subscribe: store.subscribe,
    register: () => form.register(name, rules),
    setValue: (value) => form.setValue(name as any, value),
    setError: (error) => form.setError(name as any, error),
    clearError: () => form.clearError(name as any),
    setTouched: (touched) => form.setTouched(name as any, touched),
  }
}

/**
 * Form state store
 */
export function formState<TValues extends FieldValues>(
  form: Form<TValues>
): Readable<FormState<TValues>> {
  const store = writable<FormState<TValues>>({
    values: form.getValues(),
    errors: form.getErrors(),
    touched: form.getTouched(),
    dirty: form.getDirty(),
    isValid: form.isValid(),
    isSubmitting: form.isSubmitting(),
    isSubmitSuccessful: form.isSubmitSuccessful(),
    submitCount: form.getSubmitCount(),
  })

  form.on('state-change', (event: any) => {
    store.set(event.state)
  })

  return {
    subscribe: store.subscribe,
  }
}
