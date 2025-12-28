/**
 * Submit Handler Plugin
 * Handles form submission, validation, and error focusing
 */

import type {
  Plugin,
  FieldValues,
  FormErrors,
} from '../../types'
import type { Kernel } from '../../kernel/kernel'
import type { ValidationEngineAPI } from './validation-engine'
import type { StateManagerAPI } from './state-manager'
import type { FieldRegistryAPI } from './field-registry'

/**
 * Submit handler plugin API
 */
export interface SubmitHandlerAPI<_TValues extends FieldValues = FieldValues> {
  submit(): Promise<void>
  handleSubmit(e?: Event): Promise<void>
  isSubmitting(): boolean
  isSubmitSuccessful(): boolean
  getSubmitCount(): number
  setSubmitting(submitting: boolean): void
}

/**
 * Create submit handler plugin
 */
export function createSubmitHandlerPlugin<
  TValues extends FieldValues = FieldValues
>(): Plugin<TValues> {
  let _isSubmitting = false
  let _isSubmitSuccessful = false
  let _submitCount = 0
  let kernel: Kernel<TValues> | null = null
  let validationEngine: ValidationEngineAPI<TValues> | null = null
  let stateManager: StateManagerAPI<TValues> | null = null
  let fieldRegistry: FieldRegistryAPI | null = null

  const api: SubmitHandlerAPI<TValues> = {
    async handleSubmit(e?: Event): Promise<void> {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }

      await api.submit()
    },

    async submit(): Promise<void> {
      if (_isSubmitting || !kernel) return

      try {
        _isSubmitting = true
        _submitCount++
        _isSubmitSuccessful = false

        const values = stateManager?.getValues() ?? ({} as TValues)

        // Emit submit event
        kernel.emit({
          type: 'submit',
          values,
          timestamp: Date.now(),
        })

        // Validate all fields
        const isValid = await validationEngine?.validate()

        if (!isValid) {
          const errors = validationEngine?.getErrors() ?? ({} as FormErrors<TValues>)

          // Focus first error if enabled
          const options = kernel.getOptions()
          if (options.shouldFocusError) {
            focusFirstError(errors)
          }

          // Call error handler
          if (options.onError) {
            options.onError(errors)
          }

          // Emit submit-error event
          kernel.emit({
            type: 'submit-error',
            errors,
            timestamp: Date.now(),
          })

          return
        }

        // Call submit handler
        const options = kernel.getOptions()
        await options.onSubmit(values)

        _isSubmitSuccessful = true

        // Emit submit-success event
        kernel.emit({
          type: 'submit-success',
          values,
          timestamp: Date.now(),
        })
      } catch (error) {
        console.error('Submit error:', error)

        kernel?.emit({
          type: 'error',
          error: error as Error,
          context: 'submit',
          timestamp: Date.now(),
        })
      } finally {
        _isSubmitting = false
      }
    },

    isSubmitting(): boolean {
      return _isSubmitting
    },

    isSubmitSuccessful(): boolean {
      return _isSubmitSuccessful
    },

    getSubmitCount(): number {
      return _submitCount
    },

    setSubmitting(submitting: boolean): void {
      _isSubmitting = submitting
    },
  }

  function focusFirstError(errors: any): void {
    const firstErrorField = getFirstErrorField(errors)

    if (firstErrorField && fieldRegistry) {
      const element = fieldRegistry.getRef(firstErrorField)
      if (element && typeof element.focus === 'function') {
        element.focus()

        // Scroll into view if needed
        if (typeof element.scrollIntoView === 'function') {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }
  }

  function getFirstErrorField(errors: any, prefix = ''): string | null {
    for (const [key, value] of Object.entries(errors)) {
      const path = prefix ? `${prefix}.${key}` : key

      if (typeof value === 'string') {
        return path
      }

      if (typeof value === 'object' && value !== null) {
        const nested = getFirstErrorField(value, path)
        if (nested) return nested
      }
    }

    return null
  }

  return {
    name: 'submit-handler',
    version: '1.0.0',
    type: 'core',

    install(k: Kernel<TValues>) {
      kernel = k
      validationEngine = kernel.getPlugin<ValidationEngineAPI<TValues>>('validation-engine') ?? null
      stateManager = kernel.getPlugin<StateManagerAPI<TValues>>('state-manager') ?? null
      fieldRegistry = kernel.getPlugin<FieldRegistryAPI>('field-registry') ?? null
    },

    uninstall() {
      _isSubmitting = false
      _isSubmitSuccessful = false
      _submitCount = 0
      kernel = null
      validationEngine = null
      stateManager = null
      fieldRegistry = null
    },

    api: api as any,
  }
}
