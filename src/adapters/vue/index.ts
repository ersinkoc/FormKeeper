/**
 * Vue Adapter
 * Composables for Vue 3 integration
 * @packageDocumentation
 */

import { ref, computed, onUnmounted, type Ref, type ComputedRef } from 'vue'
import { createForm, type Form } from '../../create-form'
import type {
  FormOptions,
  FieldValues,
  ValidationRules,
  FormState,
  FieldArrayReturn,
  WatchCallback,
} from '../../types'

/**
 * useForm composable
 */
export function useForm<TValues extends FieldValues = FieldValues>(
  options: FormOptions<TValues>
) {
  const form = createForm(options)

  // Reactive state
  const values = ref(form.getValues()) as Ref<TValues>
  const errors = ref(form.getErrors())
  const touched = ref(form.getTouched())
  const dirty = ref(form.getDirty())
  const isValid = ref(form.isValid())
  const isSubmitting = ref(form.isSubmitting())
  const isSubmitSuccessful = ref(form.isSubmitSuccessful())
  const submitCount = ref(form.getSubmitCount())

  // Subscribe to changes
  form.on('change', () => {
    values.value = form.getValues()
    dirty.value = form.getDirty()
  })

  form.on('blur', () => {
    touched.value = form.getTouched()
  })

  form.on('validate', () => {
    errors.value = form.getErrors()
    isValid.value = form.isValid()
  })

  form.on('submit', () => {
    isSubmitting.value = true
  })

  form.on('submit-success', () => {
    isSubmitting.value = false
    isSubmitSuccessful.value = true
    submitCount.value = form.getSubmitCount()
  })

  form.on('submit-error', () => {
    isSubmitting.value = false
  })

  // Cleanup
  onUnmounted(() => {
    form.destroy()
  })

  return {
    // Form methods
    register: form.register.bind(form),
    setValue: form.setValue.bind(form),
    setValues: form.setValues.bind(form),
    getValues: form.getValues.bind(form),
    setError: form.setError.bind(form),
    clearError: form.clearError.bind(form),
    clearErrors: form.clearErrors.bind(form),
    validate: form.validate.bind(form),
    validateField: form.validateField.bind(form),
    reset: form.reset.bind(form),
    resetField: form.resetField.bind(form),
    submit: form.submit.bind(form),
    handleSubmit: form.handleSubmit.bind(form),
    useFieldArray: form.useFieldArray.bind(form),
    watch: form.watch.bind(form),
    setFocus: form.setFocus.bind(form),

    // Reactive state
    values,
    errors,
    touched,
    dirty,
    isValid,
    isSubmitting,
    isSubmitSuccessful,
    submitCount,

    // Raw form instance
    form,
  }
}

/**
 * useField composable
 */
export function useField(name: string, rules?: ValidationRules) {
  const form = (globalThis as any).__VUE_FORM_CONTEXT__ as Form<any> | undefined

  if (!form) {
    throw new Error('useField must be used within a form context')
  }

  const value = ref(form.getValues(name as any))
  const error = ref(form.getError(name as any))
  const touched = ref(form.isTouched(name as any))
  const dirty = ref(form.isDirty(name as any))
  const validating = ref(form.isFieldValidating(name))

  // Subscribe to field changes
  form.on('change', (event) => {
    if (event.name === name) {
      value.value = event.value
      dirty.value = form.isDirty(name as any)
    }
  })

  form.on('blur', (event) => {
    if (event.name === name) {
      touched.value = true
    }
  })

  form.on('validate', () => {
    error.value = form.getError(name as any)
  })

  // Register field
  const registration = form.register(name, rules)

  onUnmounted(() => {
    const options = form.getOptions()
    if (options.shouldUnregister) {
      form.unregister(name)
    }
  })

  return {
    register: () => registration,
    value,
    error,
    touched,
    dirty,
    validating,
    invalid: computed(() => !!error.value),
    setValue: (val: any) => form.setValue(name as any, val),
    setError: (err: string) => form.setError(name as any, err),
    clearError: () => form.clearError(name as any),
    setTouched: (val?: boolean) => form.setTouched(name as any, val),
  }
}

/**
 * provideForm - Provide form instance to child components
 */
export function provideForm<TValues extends FieldValues>(form: Form<TValues>) {
  ;(globalThis as any).__VUE_FORM_CONTEXT__ = form
}

/**
 * injectForm - Inject form instance from parent
 */
export function injectForm<TValues extends FieldValues = FieldValues>(): Form<TValues> {
  const form = (globalThis as any).__VUE_FORM_CONTEXT__ as Form<TValues> | undefined

  if (!form) {
    throw new Error('injectForm must be used within a form provider')
  }

  return form
}

/**
 * useWatch composable
 */
export function useWatch<TValue = any>(name: string): ComputedRef<TValue>
export function useWatch<TValue = any>(
  name: string,
  callback: WatchCallback<TValue>
): void
export function useWatch<TValue = any>(
  nameOrCallback: string | WatchCallback,
  callback?: WatchCallback<TValue>
): ComputedRef<TValue> | void {
  const form = injectForm()

  if (typeof nameOrCallback === 'string' && !callback) {
    const value = ref(form.getValues(nameOrCallback as any))

    form.on('change', (event) => {
      if (event.name === nameOrCallback) {
        value.value = event.value
      }
    })

    return computed(() => value.value)
  }

  if (typeof nameOrCallback === 'string' && callback) {
    form.watch(nameOrCallback as any, callback)
    return
  }
}

/**
 * useFormState composable
 */
export function useFormState<TValues extends FieldValues = FieldValues>() {
  const form = injectForm<TValues>()

  const state = ref<FormState<TValues>>({
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
    state.value = event.state
  })

  return state
}

/**
 * useFieldArray composable
 */
export function useFieldArray(name: string): FieldArrayReturn<any, any> {
  const form = injectForm()
  return form.useFieldArray(name)
}
