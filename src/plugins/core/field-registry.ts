/**
 * Field Registry Plugin
 * Handles field registration, refs, and event binding
 */

import type {
  Plugin,
  FieldValues,
  ValidationRules,
  FieldRegistration,
  FieldState,
} from '../../types'
import type { Kernel } from '../../kernel/kernel'

/**
 * Field registry plugin API
 */
export interface FieldRegistryAPI {
  register(name: string, rules?: ValidationRules): FieldRegistration
  unregister(name: string): void
  getField(name: string): FieldState | undefined
  getFields(): Map<string, FieldState>
  getRegisteredNames(): string[]
  isRegistered(name: string): boolean
  setRef(name: string, element: HTMLElement | null): void
  getRef(name: string): HTMLElement | null
  getRules(name: string): ValidationRules | undefined
}

/**
 * Create field registry plugin
 */
export function createFieldRegistryPlugin<
  TValues extends FieldValues = FieldValues
>(): Plugin<TValues> {
  const fields = new Map<string, FieldState>()
  const refs = new Map<string, HTMLElement | null>()
  const rules = new Map<string, ValidationRules>()
  let kernel: Kernel<TValues> | null = null

  const api: FieldRegistryAPI = {
    register(name: string, validationRules?: ValidationRules): FieldRegistration {
      // Store field state
      if (!fields.has(name)) {
        fields.set(name, {
          value: undefined,
          error: undefined,
          touched: false,
          dirty: false,
          validating: false,
        })
      }

      // Store validation rules
      if (validationRules) {
        rules.set(name, validationRules)
      }

      // Emit register event
      kernel?.emit({
        type: 'register',
        name,
        rules: validationRules,
        timestamp: Date.now(),
      })

      // Return registration object
      return {
        name,
        ref: (element) => api.setRef(name, element),
        onChange: (event) => handleChange(name, event),
        onBlur: () => handleBlur(name),
        onFocus: () => handleFocus(name),
        get value() {
          return fields.get(name)?.value
        },
      }
    },

    unregister(name: string): void {
      fields.delete(name)
      refs.delete(name)
      rules.delete(name)

      kernel?.emit({
        type: 'unregister',
        name,
        timestamp: Date.now(),
      })
    },

    getField(name: string): FieldState | undefined {
      return fields.get(name)
    },

    getFields(): Map<string, FieldState> {
      return fields
    },

    getRegisteredNames(): string[] {
      return Array.from(fields.keys())
    },

    isRegistered(name: string): boolean {
      return fields.has(name)
    },

    setRef(name: string, element: HTMLElement | null): void {
      refs.set(name, element)
    },

    getRef(name: string): HTMLElement | null {
      return refs.get(name) ?? null
    },

    getRules(name: string): ValidationRules | undefined {
      return rules.get(name)
    },
  }

  function handleChange(name: string, event: any): void {
    const field = fields.get(name)
    if (!field) return

    const prevValue = field.value
    let value: any

    // Extract value from event
    if (event && event.target) {
      const target = event.target as HTMLInputElement

      if (target.type === 'checkbox') {
        value = target.checked
      } else if (target.type === 'number' || target.type === 'range') {
        value = target.valueAsNumber
      } else if (target.type === 'file') {
        value = target.files
      } else {
        value = target.value
      }
    } else {
      // Direct value (for controlled components)
      value = event
    }

    // Update field value
    field.value = value

    // Emit change event
    kernel?.emit({
      type: 'change',
      name,
      value,
      prevValue,
      timestamp: Date.now(),
    })
  }

  function handleBlur(name: string): void {
    const field = fields.get(name)
    if (!field) return

    // Mark as touched
    field.touched = true

    // Emit blur event
    kernel?.emit({
      type: 'blur',
      name,
      timestamp: Date.now(),
    })
  }

  function handleFocus(name: string): void {
    kernel?.emit({
      type: 'focus',
      name,
      timestamp: Date.now(),
    })
  }

  return {
    name: 'field-registry',
    version: '1.0.0',
    type: 'core',

    install(k: Kernel<TValues>) {
      kernel = k
    },

    uninstall() {
      fields.clear()
      refs.clear()
      rules.clear()
      kernel = null
    },

    api: api as any,
  }
}
