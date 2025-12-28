/**
 * Autosave Plugin
 * Automatically saves form values with configurable debounce
 */

import { debounce } from '../../utils'
import type {
  Plugin,
  FieldValues,
  FormEvent,
  Unsubscribe,
} from '../../types'
import type { Kernel } from '../../kernel/kernel'
import type { StateManagerAPI } from '../core/state-manager'

/**
 * Autosave options
 */
export interface AutosaveOptions<TValues extends FieldValues> {
  /** Callback to save form values */
  onSave: (values: TValues) => void | Promise<void>

  /** Debounce delay in milliseconds (default: 1000) */
  debounceMs?: number

  /** Only autosave when form is valid (default: false) */
  onlyWhenValid?: boolean

  /** Custom condition to determine if save should happen */
  shouldSave?: (values: TValues) => boolean
}

/**
 * Autosave plugin API
 */
export interface AutosaveAPI {
  /** Manually trigger save */
  save(): Promise<void>

  /** Enable autosave */
  enable(): void

  /** Disable autosave */
  disable(): void

  /** Check if autosave is enabled */
  isEnabled(): boolean

  /** Get last save timestamp */
  getLastSaveTime(): number | null

  /** Check if currently saving */
  isSaving(): boolean
}

/**
 * Create autosave plugin
 * @param options - Autosave options
 * @returns Autosave plugin
 */
export function createAutosavePlugin<TValues extends FieldValues>(
  options: AutosaveOptions<TValues>
): Plugin<TValues> {
  let kernel: Kernel<TValues> | null = null
  let stateManager: StateManagerAPI<TValues> | null = null
  let enabled = true
  let saving = false
  let lastSaveTime: number | null = null
  let unsubscribeChange: Unsubscribe | null = null

  const debounceMs = options.debounceMs ?? 1000

  // Debounced save function
  const debouncedSave = debounce(async () => {
    await performSave()
  }, debounceMs)

  async function performSave(): Promise<void> {
    if (!enabled || saving || !stateManager || !kernel) return

    const values = stateManager.getValues()

    // Check if form is valid (if required)
    if (options.onlyWhenValid) {
      const validationEngine = kernel.getPlugin<any>('validation-engine')
      if (validationEngine && !validationEngine.isValid()) {
        return
      }
    }

    // Check custom condition
    if (options.shouldSave && !options.shouldSave(values)) {
      return
    }

    try {
      saving = true

      // Emit autosave-start event
      kernel.emit({
        type: 'error', // Using error type as base, would ideally add custom event types
        error: new Error('autosave-start'),
        context: 'autosave',
        timestamp: Date.now(),
      })

      await options.onSave(values)

      lastSaveTime = Date.now()

      // Emit autosave-success event
      kernel.emit({
        type: 'error',
        error: new Error('autosave-success'),
        context: 'autosave',
        timestamp: Date.now(),
      })
    } catch (error) {
      // Emit autosave-error event
      kernel.emit({
        type: 'error',
        error: error as Error,
        context: 'autosave',
        timestamp: Date.now(),
      })
    } finally {
      saving = false
    }
  }

  function handleChange(event: FormEvent<TValues>): void {
    if (event.type === 'change' && enabled) {
      debouncedSave()
    }
  }

  const api: AutosaveAPI = {
    async save(): Promise<void> {
      // Cancel any pending debounced save
      debouncedSave.cancel()
      await performSave()
    },

    enable(): void {
      enabled = true
    },

    disable(): void {
      enabled = false
      // Cancel any pending saves
      debouncedSave.cancel()
    },

    isEnabled(): boolean {
      return enabled
    },

    getLastSaveTime(): number | null {
      return lastSaveTime
    },

    isSaving(): boolean {
      return saving
    },
  }

  return {
    name: 'autosave',
    version: '1.0.0',
    type: 'optional',

    install(k: Kernel<TValues>) {
      kernel = k
      stateManager = kernel.getPlugin<StateManagerAPI<TValues>>('state-manager') ?? null

      // Listen to change events
      unsubscribeChange = kernel.on('change', handleChange as any)
    },

    uninstall() {
      // Unsubscribe from events
      unsubscribeChange?.()
      unsubscribeChange = null

      // Cancel any pending saves
      debouncedSave.cancel()

      kernel = null
      stateManager = null
      enabled = false
      saving = false
      lastSaveTime = null
    },

    api: api as any,
  }
}
