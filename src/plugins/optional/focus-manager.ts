/**
 * Focus Manager Plugin
 * Advanced focus management for forms
 */

import type {
  Plugin,
  FieldValues,
} from '../../types'
import type { Kernel } from '../../kernel/kernel'
import type { FieldRegistryAPI } from '../core/field-registry'

/**
 * Focus manager options
 */
export interface FocusManagerOptions {
  /** Focus first field on mount (default: false) */
  focusOnMount?: boolean
  /** Focus first error on validation failure (default: true) */
  focusOnError?: boolean
  /** Scroll to focused field (default: true) */
  scrollToField?: boolean
  /** Scroll behavior (default: 'smooth') */
  scrollBehavior?: ScrollBehavior
  /** Scroll block position (default: 'center') */
  scrollBlock?: ScrollLogicalPosition
}

/**
 * Focus manager plugin API
 */
export interface FocusManagerAPI {
  /** Focus field by name */
  focus(name: string): void
  /** Focus first field */
  focusFirst(): void
  /** Focus last field */
  focusLast(): void
  /** Focus next field */
  focusNext(): void
  /** Focus previous field */
  focusPrevious(): void
  /** Focus first field with error */
  focusFirstError(): void
  /** Get currently focused field name */
  getFocusedField(): string | null
  /** Get field tab order */
  getTabOrder(): string[]
}

/**
 * Create focus manager plugin
 * @param options - Focus manager options
 * @returns Focus manager plugin
 */
export function createFocusManagerPlugin<TValues extends FieldValues>(
  options: FocusManagerOptions = {}
): Plugin<TValues> {
  let kernel: Kernel<TValues> | null = null
  let fieldRegistry: FieldRegistryAPI | null = null
  let focusedField: string | null = null

  function scrollToElement(element: HTMLElement): void {
    if (options.scrollToField !== false && typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({
        behavior: options.scrollBehavior ?? 'smooth',
        block: options.scrollBlock ?? 'center',
      })
    }
  }

  function focusElement(name: string): void {
    if (!fieldRegistry) return

    const element = fieldRegistry.getRef(name)
    if (element && typeof element.focus === 'function') {
      element.focus()
      focusedField = name
      scrollToElement(element)
    }
  }

  function getFieldOrder(): string[] {
    if (!fieldRegistry) return []
    return fieldRegistry.getRegisteredNames()
  }

  const api: FocusManagerAPI = {
    focus(name: string): void {
      focusElement(name)
    },

    focusFirst(): void {
      const fields = getFieldOrder()
      if (fields.length > 0) {
        focusElement(fields[0]!)
      }
    },

    focusLast(): void {
      const fields = getFieldOrder()
      if (fields.length > 0) {
        focusElement(fields[fields.length - 1]!)
      }
    },

    focusNext(): void {
      const fields = getFieldOrder()
      if (fields.length === 0) return

      if (!focusedField) {
        api.focusFirst()
        return
      }

      const currentIndex = fields.indexOf(focusedField)
      if (currentIndex >= 0 && currentIndex < fields.length - 1) {
        focusElement(fields[currentIndex + 1]!)
      }
    },

    focusPrevious(): void {
      const fields = getFieldOrder()
      if (fields.length === 0) return

      if (!focusedField) {
        api.focusLast()
        return
      }

      const currentIndex = fields.indexOf(focusedField)
      if (currentIndex > 0) {
        focusElement(fields[currentIndex - 1]!)
      }
    },

    focusFirstError(): void {
      if (!kernel) return

      const validationEngine = kernel.getPlugin<any>('validation-engine')
      if (!validationEngine) return

      const fields = getFieldOrder()

      for (const field of fields) {
        const error = validationEngine.getError(field)
        if (error) {
          focusElement(field)
          break
        }
      }
    },

    getFocusedField(): string | null {
      return focusedField
    },

    getTabOrder(): string[] {
      return getFieldOrder()
    },
  }

  return {
    name: 'focus-manager',
    version: '1.0.0',
    type: 'optional',

    install(k: Kernel<TValues>) {
      kernel = k
      fieldRegistry = kernel.getPlugin<FieldRegistryAPI>('field-registry') ?? null

      // Focus first field on mount if enabled
      if (options.focusOnMount) {
        setTimeout(() => {
          api.focusFirst()
        }, 0)
      }

      // Focus first error on validation failure
      if (options.focusOnError !== false) {
        kernel.on('submit-error', () => {
          api.focusFirstError()
        })
      }

      // Track focused field
      if (typeof document !== 'undefined') {
        document.addEventListener('focusin', (event) => {
          const target = event.target as HTMLElement
          const fields = getFieldOrder()

          for (const field of fields) {
            const element = fieldRegistry?.getRef(field)
            if (element === target) {
              focusedField = field
              break
            }
          }
        })
      }
    },

    uninstall() {
      kernel = null
      fieldRegistry = null
      focusedField = null
    },

    api: api as any,
  }
}
