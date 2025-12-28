/**
 * Persist Plugin
 * Saves and restores form values from localStorage or sessionStorage
 */

import type {
  Plugin,
  FieldValues,
  DeepPartial,
} from '../../types'
import type { Kernel } from '../../kernel/kernel'
import type { StateManagerAPI } from '../core/state-manager'

/**
 * Storage type
 */
export type StorageType = 'local' | 'session'

/**
 * Persist options
 */
export interface PersistOptions<TValues extends FieldValues> {
  /** Storage key */
  key: string

  /** Storage type (default: 'local') */
  storage?: StorageType

  /** Fields to exclude from persistence */
  exclude?: string[]

  /** Fields to include (if specified, only these fields are persisted) */
  include?: string[]

  /** Custom serializer */
  serialize?: (values: TValues) => string

  /** Custom deserializer */
  deserialize?: (data: string) => DeepPartial<TValues>

  /** Debounce delay for saving in milliseconds (default: 300) */
  debounceMs?: number

  /** Merge strategy when loading persisted data */
  merge?: 'replace' | 'merge'
}

/**
 * Persist plugin API
 */
export interface PersistAPI {
  /** Manually save current values */
  save(): void

  /** Manually load persisted values */
  load(): void

  /** Clear persisted data */
  clear(): void

  /** Check if data exists in storage */
  hasPersistedData(): boolean

  /** Get raw persisted data */
  getPersistedData(): string | null
}

/**
 * Create persist plugin
 * @param options - Persist options
 * @returns Persist plugin
 */
export function createPersistPlugin<TValues extends FieldValues>(
  options: PersistOptions<TValues>
): Plugin<TValues> {
  let kernel: Kernel<TValues> | null = null
  let stateManager: StateManagerAPI<TValues> | null = null
  let saveTimeout: ReturnType<typeof setTimeout> | null = null

  const storageType = options.storage ?? 'local'
  const debounceMs = options.debounceMs ?? 300
  const mergeStrategy = options.merge ?? 'merge'

  function getStorage(): Storage {
    if (typeof window === 'undefined') {
      throw new Error('Persist plugin requires a browser environment')
    }
    return storageType === 'local' ? localStorage : sessionStorage
  }

  function filterValues(values: TValues): Partial<TValues> {
    const filtered: any = {}

    for (const [key, value] of Object.entries(values)) {
      // Skip if in exclude list
      if (options.exclude?.includes(key)) {
        continue
      }

      // Skip if include list is specified and key not in it
      if (options.include && !options.include.includes(key)) {
        continue
      }

      filtered[key] = value
    }

    return filtered
  }

  function serialize(values: TValues): string {
    if (options.serialize) {
      return options.serialize(values)
    }

    const filtered = filterValues(values)
    return JSON.stringify(filtered)
  }

  function deserialize(data: string): DeepPartial<TValues> {
    if (options.deserialize) {
      return options.deserialize(data)
    }

    try {
      return JSON.parse(data) as DeepPartial<TValues>
    } catch (error) {
      console.error('Failed to parse persisted data:', error)
      return {} as DeepPartial<TValues>
    }
  }

  function saveToStorage(): void {
    if (!stateManager) return

    try {
      const values = stateManager.getValues()
      const serialized = serialize(values)
      getStorage().setItem(options.key, serialized)
    } catch (error) {
      console.error('Failed to persist form data:', error)
    }
  }

  function loadFromStorage(): void {
    if (!stateManager || !kernel) return

    try {
      const data = getStorage().getItem(options.key)
      if (!data) return

      const values = deserialize(data)

      if (mergeStrategy === 'replace') {
        stateManager.setValues(values)
      } else {
        // Merge with current values
        const currentValues = stateManager.getValues()
        const merged = { ...currentValues, ...values }
        stateManager.setValues(merged as DeepPartial<TValues>)
      }
    } catch (error) {
      console.error('Failed to load persisted data:', error)
    }
  }

  function debouncedSave(): void {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    saveTimeout = setTimeout(() => {
      saveToStorage()
      saveTimeout = null
    }, debounceMs)
  }

  const api: PersistAPI = {
    save(): void {
      if (saveTimeout) {
        clearTimeout(saveTimeout)
        saveTimeout = null
      }
      saveToStorage()
    },

    load(): void {
      loadFromStorage()
    },

    clear(): void {
      try {
        getStorage().removeItem(options.key)
      } catch (error) {
        console.error('Failed to clear persisted data:', error)
      }
    },

    hasPersistedData(): boolean {
      try {
        return getStorage().getItem(options.key) !== null
      } catch (error) {
        return false
      }
    },

    getPersistedData(): string | null {
      try {
        return getStorage().getItem(options.key)
      } catch (error) {
        console.error('Failed to get persisted data:', error)
        return null
      }
    },
  }

  return {
    name: 'persist',
    version: '1.0.0',
    type: 'optional',

    install(k: Kernel<TValues>) {
      kernel = k
      stateManager = kernel.getPlugin<StateManagerAPI<TValues>>('state-manager') ?? null

      // Load persisted data on install
      loadFromStorage()

      // Save on value changes
      kernel.on('change', () => {
        debouncedSave()
      })

      // Save immediately before page unload
      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', saveToStorage)
      }
    },

    uninstall() {
      // Clear any pending save
      if (saveTimeout) {
        clearTimeout(saveTimeout)
        saveTimeout = null
      }

      // Remove event listener
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', saveToStorage)
      }

      kernel = null
      stateManager = null
    },

    api: api as any,
  }
}
