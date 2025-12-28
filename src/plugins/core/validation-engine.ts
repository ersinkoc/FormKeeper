/**
 * Validation Engine Plugin
 * Handles sync and async validation with built-in and custom rules
 */

import type {
  Plugin,
  FieldValues,
  ValidationRules,
  FormErrors,
  ValidateFn,
  ValidateResult,
} from '../../types'
import type { Kernel } from '../../kernel/kernel'
import type { FieldRegistryAPI } from './field-registry'
import type { StateManagerAPI } from './state-manager'

/**
 * Validation engine plugin API
 */
export interface ValidationEngineAPI<TValues extends FieldValues> {
  validate(): Promise<boolean>
  validateField(name: string): Promise<boolean>
  getErrors(): FormErrors<TValues>
  getError(name: string): string | undefined
  setError(name: string, error: string): void
  clearError(name: string): void
  clearErrors(): void
  isValid(): boolean
  isValidating(): boolean
  isFieldValidating(name: string): boolean
}

/**
 * Create validation engine plugin
 */
export function createValidationEnginePlugin<
  TValues extends FieldValues = FieldValues
>(): Plugin<TValues> {
  let errors: FormErrors<TValues> = {} as FormErrors<TValues>
  const validating = new Set<string>()
  const abortControllers = new Map<string, AbortController>()
  let kernel: Kernel<TValues> | null = null
  let fieldRegistry: FieldRegistryAPI | null = null
  let stateManager: StateManagerAPI<TValues> | null = null

  const api: ValidationEngineAPI<TValues> = {
    async validate(): Promise<boolean> {
      if (!fieldRegistry || !stateManager) return true

      const fieldNames = fieldRegistry.getRegisteredNames()
      const results = await Promise.all(
        fieldNames.map((name) => api.validateField(name))
      )

      const isValid = results.every((result) => result === true)

      // Emit validate event
      kernel?.emit({
        type: 'validate',
        errors,
        isValid,
        timestamp: Date.now(),
      })

      return isValid
    },

    async validateField(name: string): Promise<boolean> {
      if (!fieldRegistry || !stateManager) return true

      // Abort previous validation for this field
      abortControllers.get(name)?.abort()

      const abortController = new AbortController()
      abortControllers.set(name, abortController)

      validating.add(name)

      try {
        const rules = fieldRegistry.getRules(name)
        const value = stateManager.getValue(name)

        // Run built-in rules
        const builtInError = await validateBuiltInRules(value, rules)
        if (builtInError) {
          api.setError(name, builtInError)
          return false
        }

        // Run custom validators
        if (rules?.validate) {
          const customError = await validateCustom(
            value,
            rules.validate,
            abortController.signal
          )
          if (customError) {
            api.setError(name, customError)
            return false
          }
        }

        // Clear error if all passed
        api.clearError(name)
        return true
      } finally {
        validating.delete(name)
        abortControllers.delete(name)
      }
    },

    getErrors(): FormErrors<TValues> {
      return errors
    },

    getError(name: string): string | undefined {
      const keys = name.split('.')
      let current: any = errors

      for (const key of keys) {
        if (current === undefined || current === null) return undefined
        current = current[key]
      }

      return typeof current === 'string' ? current : undefined
    },

    setError(name: string, error: string): void {
      const keys = name.split('.')
      let current: any = errors

      // Navigate to parent
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]!
        if (!(key in current)) {
          current[key] = {}
        }
        current = current[key]
      }

      // Set error
      const lastKey = keys[keys.length - 1]!
      current[lastKey] = error
    },

    clearError(name: string): void {
      const keys = name.split('.')
      let current: any = errors

      // Navigate to parent
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]!
        if (!(key in current)) return
        current = current[key]
      }

      // Clear error
      const lastKey = keys[keys.length - 1]!
      delete current[lastKey]
    },

    clearErrors(): void {
      errors = {} as FormErrors<TValues>
    },

    isValid(): boolean {
      return Object.keys(errors).length === 0
    },

    isValidating(): boolean {
      return validating.size > 0
    },

    isFieldValidating(name: string): boolean {
      return validating.has(name)
    },
  }

  async function validateBuiltInRules(
    value: any,
    rules?: ValidationRules
  ): Promise<string | undefined> {
    if (!rules) return undefined

    // Required
    if (rules.required) {
      const isEmpty =
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)

      if (isEmpty) {
        return typeof rules.required === 'string'
          ? rules.required
          : 'This field is required'
      }
    }

    // Min (for numbers)
    if (rules.min !== undefined && typeof value === 'number') {
      const min = typeof rules.min === 'object' ? rules.min.value : rules.min
      if (value < min) {
        return typeof rules.min === 'object'
          ? rules.min.message
          : `Value must be at least ${min}`
      }
    }

    // Max (for numbers)
    if (rules.max !== undefined && typeof value === 'number') {
      const max = typeof rules.max === 'object' ? rules.max.value : rules.max
      if (value > max) {
        return typeof rules.max === 'object'
          ? rules.max.message
          : `Value must be at most ${max}`
      }
    }

    // MinLength (for strings/arrays)
    if (rules.minLength !== undefined) {
      const minLength =
        typeof rules.minLength === 'object'
          ? rules.minLength.value
          : rules.minLength

      const length =
        typeof value === 'string' || Array.isArray(value) ? value.length : 0

      if (length < minLength) {
        return typeof rules.minLength === 'object'
          ? rules.minLength.message
          : `Must be at least ${minLength} characters`
      }
    }

    // MaxLength (for strings/arrays)
    if (rules.maxLength !== undefined) {
      const maxLength =
        typeof rules.maxLength === 'object'
          ? rules.maxLength.value
          : rules.maxLength

      const length =
        typeof value === 'string' || Array.isArray(value) ? value.length : 0

      if (length > maxLength) {
        return typeof rules.maxLength === 'object'
          ? rules.maxLength.message
          : `Must be at most ${maxLength} characters`
      }
    }

    // Pattern (for strings)
    if (rules.pattern && typeof value === 'string') {
      const pattern =
        rules.pattern instanceof RegExp ? rules.pattern : rules.pattern.value

      if (!pattern.test(value)) {
        return rules.pattern instanceof RegExp
          ? 'Invalid format'
          : rules.pattern.message
      }
    }

    return undefined
  }

  async function validateCustom(
    value: any,
    validate: ValidateFn | Record<string, ValidateFn>,
    signal: AbortSignal
  ): Promise<string | undefined> {
    const formValues = stateManager?.getValues() ?? ({} as TValues)

    if (typeof validate === 'function') {
      const result = await validate(value, formValues)
      if (signal.aborted) return undefined

      return normalizeValidateResult(result)
    }

    // Multiple validators
    for (const [, fn] of Object.entries(validate)) {
      const result = await fn(value, formValues)
      if (signal.aborted) return undefined

      const error = normalizeValidateResult(result)
      if (error) return error
    }

    return undefined
  }

  function normalizeValidateResult(result: ValidateResult): string | undefined {
    if (result === true || result === undefined) return undefined
    if (result === false) return 'Validation failed'
    return result
  }

  return {
    name: 'validation-engine',
    version: '1.0.0',
    type: 'core',

    install(k: Kernel<TValues>) {
      kernel = k

      // Get references to other plugins
      fieldRegistry = kernel.getPlugin<FieldRegistryAPI>('field-registry') ?? null
      stateManager = kernel.getPlugin<StateManagerAPI<TValues>>('state-manager') ?? null

      // Listen to mode-based validation triggers
      const options = kernel.getOptions()
      const mode = options.mode ?? 'onSubmit'

      if (mode === 'onChange' || mode === 'all') {
        kernel.on('change', (event) => {
          api.validateField(event.name)
        })
      }

      if (mode === 'onBlur' || mode === 'all') {
        kernel.on('blur', (event) => {
          api.validateField(event.name)
        })
      }
    },

    uninstall() {
      validating.clear()
      abortControllers.forEach((controller) => controller.abort())
      abortControllers.clear()
      errors = {} as FormErrors<TValues>
      kernel = null
      fieldRegistry = null
      stateManager = null
    },

    api: api as any,
  }
}
