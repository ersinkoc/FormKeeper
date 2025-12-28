/**
 * Schema Plugin
 * Integration with schema validation libraries (Zod, Yup, Joi, etc.)
 */

import type {
  Plugin,
  FieldValues,
} from '../../types'
import type { Kernel } from '../../kernel/kernel'
import type { ValidationEngineAPI } from '../core/validation-engine'
import type { StateManagerAPI } from '../core/state-manager'

/**
 * Schema validation result
 */
export interface SchemaValidationResult {
  success: boolean
  errors?: Record<string, string>
}

/**
 * Schema validator interface
 * Abstraction for different schema libraries
 */
export interface SchemaValidator<TValues extends FieldValues> {
  /** Validate the entire form values */
  validate(values: TValues): Promise<SchemaValidationResult> | SchemaValidationResult
  /** Validate a single field (optional) */
  validateField?(name: string, value: any): Promise<SchemaValidationResult> | SchemaValidationResult
}

/**
 * Zod schema adapter
 */
export function zodAdapter<TValues extends FieldValues>(
  schema: any
): SchemaValidator<TValues> {
  return {
    validate(values: TValues): SchemaValidationResult {
      const result = schema.safeParse(values)

      if (result.success) {
        return { success: true }
      }

      const errors: Record<string, string> = {}
      if (result.error?.issues) {
        for (const issue of result.error.issues) {
          const path = issue.path.join('.')
          errors[path] = issue.message
        }
      }

      return { success: false, errors }
    },

    validateField(name: string, value: any): SchemaValidationResult {
      try {
        const fieldSchema = schema.shape?.[name]
        if (!fieldSchema) {
          return { success: true }
        }

        const result = fieldSchema.safeParse(value)
        if (result.success) {
          return { success: true }
        }

        return {
          success: false,
          errors: { [name]: result.error.issues[0]?.message ?? 'Validation failed' },
        }
      } catch {
        return { success: true }
      }
    },
  }
}

/**
 * Yup schema adapter
 */
export function yupAdapter<TValues extends FieldValues>(
  schema: any
): SchemaValidator<TValues> {
  return {
    async validate(values: TValues): Promise<SchemaValidationResult> {
      try {
        await schema.validate(values, { abortEarly: false })
        return { success: true }
      } catch (error: any) {
        const errors: Record<string, string> = {}

        if (error.inner) {
          for (const err of error.inner) {
            if (err.path) {
              errors[err.path] = err.message
            }
          }
        } else if (error.path) {
          errors[error.path] = error.message
        }

        return { success: false, errors }
      }
    },

    async validateField(name: string, value: any): Promise<SchemaValidationResult> {
      try {
        await schema.validateAt(name, { [name]: value })
        return { success: true }
      } catch (error: any) {
        return {
          success: false,
          errors: { [name]: error.message },
        }
      }
    },
  }
}

/**
 * Joi schema adapter
 */
export function joiAdapter<TValues extends FieldValues>(
  schema: any
): SchemaValidator<TValues> {
  return {
    validate(values: TValues): SchemaValidationResult {
      const result = schema.validate(values, { abortEarly: false })

      if (!result.error) {
        return { success: true }
      }

      const errors: Record<string, string> = {}
      if (result.error.details) {
        for (const detail of result.error.details) {
          const path = detail.path.join('.')
          errors[path] = detail.message
        }
      }

      return { success: false, errors }
    },

    validateField(name: string, value: any): SchemaValidationResult {
      try {
        const result = schema.extract(name).validate(value)

        if (!result.error) {
          return { success: true }
        }

        return {
          success: false,
          errors: { [name]: result.error.message },
        }
      } catch {
        return { success: true }
      }
    },
  }
}

/**
 * Schema plugin options
 */
export interface SchemaOptions<TValues extends FieldValues> {
  /** Schema validator */
  validator: SchemaValidator<TValues>
  /** Validate on change (default: false) */
  validateOnChange?: boolean
  /** Validate on blur (default: true) */
  validateOnBlur?: boolean
  /** Validate on submit (default: true) */
  validateOnSubmit?: boolean
}

/**
 * Schema plugin API
 */
export interface SchemaAPI {
  /** Manually trigger schema validation */
  validate(): Promise<boolean>
  /** Validate single field against schema */
  validateField(name: string): Promise<boolean>
}

/**
 * Create schema plugin
 * @param options - Schema options
 * @returns Schema plugin
 */
export function createSchemaPlugin<TValues extends FieldValues>(
  options: SchemaOptions<TValues>
): Plugin<TValues> {
  let kernel: Kernel<TValues> | null = null
  let validationEngine: ValidationEngineAPI<TValues> | null = null
  let stateManager: StateManagerAPI<TValues> | null = null

  async function performValidation(): Promise<boolean> {
    if (!validationEngine || !stateManager) return true

    const values = stateManager.getValues()
    const result = await options.validator.validate(values)

    if (result.success) {
      // Clear all errors
      validationEngine.clearErrors()
      return true
    }

    // Set errors from schema validation
    if (result.errors) {
      validationEngine.clearErrors()
      for (const [field, message] of Object.entries(result.errors)) {
        validationEngine.setError(field, message)
      }
    }

    return false
  }

  async function performFieldValidation(name: string): Promise<boolean> {
    if (!validationEngine || !stateManager) return true

    if (!options.validator.validateField) {
      // Fall back to full validation
      return performValidation()
    }

    const value = stateManager.getValue(name)
    const result = await options.validator.validateField(name, value)

    if (result.success) {
      validationEngine.clearError(name)
      return true
    }

    if (result.errors && result.errors[name]) {
      validationEngine.setError(name, result.errors[name]!)
    }

    return false
  }

  const api: SchemaAPI = {
    async validate(): Promise<boolean> {
      return performValidation()
    },

    async validateField(name: string): Promise<boolean> {
      return performFieldValidation(name)
    },
  }

  return {
    name: 'schema',
    version: '1.0.0',
    type: 'optional',

    install(k: Kernel<TValues>) {
      kernel = k
      validationEngine = kernel.getPlugin<ValidationEngineAPI<TValues>>('validation-engine') ?? null
      stateManager = kernel.getPlugin<StateManagerAPI<TValues>>('state-manager') ?? null

      // Validate on change
      if (options.validateOnChange) {
        kernel.on('change', (event: any) => {
          performFieldValidation(event.name)
        })
      }

      // Validate on blur
      if (options.validateOnBlur !== false) {
        kernel.on('blur', (event: any) => {
          performFieldValidation(event.name)
        })
      }

      // Validate on submit
      if (options.validateOnSubmit !== false) {
        kernel.on('submit', () => {
          performValidation()
        })
      }
    },

    uninstall() {
      kernel = null
      validationEngine = null
      stateManager = null
    },

    api: api as any,
  }
}
