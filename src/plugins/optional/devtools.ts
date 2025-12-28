/**
 * Form DevTools Plugin
 * Developer tools integration for debugging forms
 */

import type {
  Plugin,
  FieldValues,
  FormEvent,
} from '../../types'
import type { Kernel } from '../../kernel/kernel'
import type { StateManagerAPI } from '../core/state-manager'
import type { ValidationEngineAPI } from '../core/validation-engine'

/**
 * DevTools log entry
 */
export interface DevToolsLogEntry {
  timestamp: number
  type: string
  data: any
}

/**
 * DevTools options
 */
export interface DevToolsOptions {
  /** Enable logging (default: true) */
  enabled?: boolean
  /** Maximum log entries to keep (default: 100) */
  maxLogs?: number
  /** Log to console (default: false) */
  logToConsole?: boolean
  /** Custom logger function */
  logger?: (entry: DevToolsLogEntry) => void
}

/**
 * Form snapshot
 */
export interface FormSnapshot {
  timestamp: number
  values: any
  errors: any
  touched: any
  dirty: any
  isValid: boolean
  isSubmitting: boolean
  submitCount: number
}

/**
 * DevTools plugin API
 */
export interface DevToolsAPI {
  /** Get all logs */
  getLogs(): DevToolsLogEntry[]
  /** Clear logs */
  clearLogs(): void
  /** Get current form snapshot */
  getSnapshot(): FormSnapshot
  /** Get all snapshots */
  getSnapshots(): FormSnapshot[]
  /** Enable/disable devtools */
  setEnabled(enabled: boolean): void
  /** Check if enabled */
  isEnabled(): boolean
  /** Export form data as JSON */
  exportJSON(): string
  /** Import form data from JSON */
  importJSON(data: string): void
}

/**
 * Create devtools plugin
 * @param options - DevTools options
 * @returns DevTools plugin
 */
export function createDevToolsPlugin<TValues extends FieldValues>(
  options: DevToolsOptions = {}
): Plugin<TValues> {
  let kernel: Kernel<TValues> | null = null
  let stateManager: StateManagerAPI<TValues> | null = null
  let validationEngine: ValidationEngineAPI<TValues> | null = null
  let enabled = options.enabled !== false
  const maxLogs = options.maxLogs ?? 100
  const logs: DevToolsLogEntry[] = []
  const snapshots: FormSnapshot[] = []

  function log(type: string, data: any): void {
    if (!enabled) return

    const entry: DevToolsLogEntry = {
      timestamp: Date.now(),
      type,
      data,
    }

    logs.push(entry)

    // Keep only last maxLogs entries
    if (logs.length > maxLogs) {
      logs.shift()
    }

    // Log to console if enabled
    if (options.logToConsole) {
      console.log(`[FormKeeper ${type}]`, data)
    }

    // Custom logger
    if (options.logger) {
      options.logger(entry)
    }
  }

  function createSnapshot(): FormSnapshot {
    if (!stateManager || !validationEngine || !kernel) {
      return {
        timestamp: Date.now(),
        values: {},
        errors: {},
        touched: {},
        dirty: {},
        isValid: true,
        isSubmitting: false,
        submitCount: 0,
      }
    }

    const submitHandler = kernel.getPlugin<any>('submit-handler')

    return {
      timestamp: Date.now(),
      values: stateManager.getValues(),
      errors: validationEngine.getErrors(),
      touched: stateManager.getTouched(),
      dirty: stateManager.getDirty(),
      isValid: validationEngine.isValid(),
      isSubmitting: submitHandler?.isSubmitting() ?? false,
      submitCount: submitHandler?.getSubmitCount() ?? 0,
    }
  }

  function handleEvent(event: FormEvent<TValues>): void {
    log(event.type, event)

    // Create snapshot on significant events
    if (['submit', 'reset', 'submit-success', 'submit-error'].includes(event.type)) {
      const snapshot = createSnapshot()
      snapshots.push(snapshot)

      // Keep only last 20 snapshots
      if (snapshots.length > 20) {
        snapshots.shift()
      }
    }
  }

  const api: DevToolsAPI = {
    getLogs(): DevToolsLogEntry[] {
      return [...logs]
    },

    clearLogs(): void {
      logs.length = 0
      snapshots.length = 0
    },

    getSnapshot(): FormSnapshot {
      return createSnapshot()
    },

    getSnapshots(): FormSnapshot[] {
      return [...snapshots]
    },

    setEnabled(value: boolean): void {
      enabled = value
    },

    isEnabled(): boolean {
      return enabled
    },

    exportJSON(): string {
      if (!stateManager) return '{}'

      const data = {
        values: stateManager.getValues(),
        defaultValues: stateManager.getDefaultValues(),
        timestamp: Date.now(),
      }

      return JSON.stringify(data, null, 2)
    },

    importJSON(data: string): void {
      if (!stateManager) return

      try {
        const parsed = JSON.parse(data)
        if (parsed.values) {
          stateManager.setValues(parsed.values)
        }
        log('import', { success: true })
      } catch (error) {
        log('import-error', { error: (error as Error).message })
      }
    },
  }

  return {
    name: 'devtools',
    version: '1.0.0',
    type: 'optional',

    install(k: Kernel<TValues>) {
      kernel = k
      stateManager = kernel.getPlugin<StateManagerAPI<TValues>>('state-manager') ?? null
      validationEngine = kernel.getPlugin<ValidationEngineAPI<TValues>>('validation-engine') ?? null

      // Log all events
      const eventTypes = [
        'register',
        'unregister',
        'change',
        'blur',
        'focus',
        'validate',
        'submit',
        'submit-success',
        'submit-error',
        'reset',
        'error',
      ] as const

      for (const eventType of eventTypes) {
        kernel.on(eventType as any, handleEvent as any)
      }

      // Expose to window for browser devtools
      if (typeof window !== 'undefined') {
        ;(window as any).__FORMKEEPER_DEVTOOLS__ = api
      }

      log('plugin-installed', { name: 'devtools' })
    },

    uninstall() {
      log('plugin-uninstalled', { name: 'devtools' })

      // Remove from window
      if (typeof window !== 'undefined') {
        delete (window as any).__FORMKEEPER_DEVTOOLS__
      }

      kernel = null
      stateManager = null
      validationEngine = null
      logs.length = 0
      snapshots.length = 0
    },

    api: api as any,
  }
}
