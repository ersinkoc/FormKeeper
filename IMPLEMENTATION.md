# FormKeeper - Implementation Guide

**Version:** 1.0.0
**Date:** 2025-12-28
**Author:** Ersin KOÇ
**Status:** Draft

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Kernel Implementation](#2-kernel-implementation)
3. [Plugin System](#3-plugin-system)
4. [Core Plugins](#4-core-plugins)
5. [Optional Plugins](#5-optional-plugins)
6. [Framework Adapters](#6-framework-adapters)
7. [Utility Functions](#7-utility-functions)
8. [Type System](#8-type-system)
9. [Performance Optimizations](#9-performance-optimizations)
10. [Testing Strategy](#10-testing-strategy)
11. [Build System](#11-build-system)
12. [Documentation Website](#12-documentation-website)

---

## 1. Architecture Overview

### 1.1 Design Philosophy

**Micro-Kernel Architecture:**
- Minimal core (kernel) with plugin-based extensions
- Single responsibility principle for each plugin
- Event-driven communication between components
- Zero coupling between plugins

**Key Principles:**
1. **Separation of Concerns** - Each plugin handles one responsibility
2. **Inversion of Control** - Kernel controls plugin lifecycle
3. **Event-Driven** - Loose coupling via event bus
4. **Composition over Inheritance** - Plugin composition
5. **Tree-Shakeable** - Independent plugin imports

### 1.2 Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         KERNEL                              │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐     │
│  │ Event Bus  │  │ Plugin      │  │ State            │     │
│  │            │  │ Registry    │  │ Coordinator      │     │
│  └────────────┘  └─────────────┘  └──────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Public API Surface                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌──────────────┐
│ Core Plugins  │  │Optional Plugin│  │  Framework   │
│               │  │               │  │  Adapters    │
│ - field-reg   │  │ - wizard      │  │              │
│ - state-mgr   │  │ - autosave    │  │ - React      │
│ - validation  │  │ - persist     │  │ - Vue        │
│ - array       │  │ - schema      │  │ - Svelte     │
│ - submit      │  │ - focus-mgr   │  │              │
│               │  │ - devtools    │  │              │
└───────────────┘  └───────────────┘  └──────────────┘
```

### 1.3 Data Flow

```
User Input
    │
    ▼
Field Registration (field-registry)
    │
    ▼
Value Change (state-manager)
    │
    ▼
Validation Trigger (validation-engine)
    │
    ▼
Error State Update
    │
    ▼
Re-render (Framework Adapter)
```

---

## 2. Kernel Implementation

### 2.1 File Structure

```
src/kernel/
├── index.ts              # Kernel exports
├── kernel.ts             # Main kernel class
├── event-bus.ts          # Event system
└── plugin-registry.ts    # Plugin management
```

### 2.2 Kernel Class

**File:** `src/kernel/kernel.ts`

```typescript
import { EventBus } from './event-bus'
import { PluginRegistry } from './plugin-registry'
import type { FormOptions, FieldValues, Plugin } from '../types'

export class Kernel<TValues extends FieldValues = FieldValues> {
  private eventBus: EventBus<TValues>
  private pluginRegistry: PluginRegistry<TValues>
  private options: FormOptions<TValues>
  private plugins: Map<string, any> = new Map()

  constructor(options: FormOptions<TValues>) {
    this.options = options
    this.eventBus = new EventBus()
    this.pluginRegistry = new PluginRegistry(this.eventBus)

    // Install core plugins automatically
    this.installCorePlugins()

    // Install user-provided plugins
    if (options.plugins) {
      options.plugins.forEach(plugin => this.registerPlugin(plugin))
    }
  }

  private installCorePlugins(): void {
    // Core plugins are installed in order
    const corePlugins = [
      'field-registry',
      'state-manager',
      'validation-engine',
      'array-fields',
      'submit-handler',
    ]

    // Import and install each core plugin
    // Implementation details in section 4
  }

  registerPlugin(plugin: Plugin<TValues>): void {
    this.pluginRegistry.register(plugin)
    plugin.install(this)

    // Store plugin API if available
    if (plugin.api) {
      this.plugins.set(plugin.name, plugin.api)
    }
  }

  unregisterPlugin(name: string): void {
    const plugin = this.pluginRegistry.get(name)
    if (plugin) {
      plugin.uninstall()
      this.pluginRegistry.unregister(name)
      this.plugins.delete(name)
    }
  }

  getPlugin<P = any>(name: string): P | undefined {
    return this.plugins.get(name) as P | undefined
  }

  emit<E extends EventType>(event: FormEvent<TValues>): void {
    this.eventBus.emit(event)
  }

  on<E extends EventType>(
    eventType: E,
    handler: EventHandler<E, TValues>
  ): Unsubscribe {
    return this.eventBus.on(eventType, handler)
  }

  off<E extends EventType>(
    eventType: E,
    handler: EventHandler<E, TValues>
  ): void {
    this.eventBus.off(eventType, handler)
  }

  destroy(): void {
    // Uninstall all plugins in reverse order
    this.pluginRegistry.unregisterAll()
    this.eventBus.clear()
    this.plugins.clear()
  }

  getOptions(): FormOptions<TValues> {
    return this.options
  }
}
```

### 2.3 Event Bus

**File:** `src/kernel/event-bus.ts`

```typescript
export class EventBus<TValues extends FieldValues = FieldValues> {
  private listeners: Map<EventType, Set<EventHandler<any, TValues>>> = new Map()

  on<E extends EventType>(
    eventType: E,
    handler: EventHandler<E, TValues>
  ): Unsubscribe {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }

    this.listeners.get(eventType)!.add(handler)

    return () => this.off(eventType, handler)
  }

  off<E extends EventType>(
    eventType: E,
    handler: EventHandler<E, TValues>
  ): void {
    this.listeners.get(eventType)?.delete(handler)
  }

  emit<E extends EventType>(event: FormEvent<TValues>): void {
    const handlers = this.listeners.get(event.type)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event)
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error)
        }
      })
    }
  }

  clear(): void {
    this.listeners.clear()
  }
}
```

### 2.4 Plugin Registry

**File:** `src/kernel/plugin-registry.ts`

```typescript
export class PluginRegistry<TValues extends FieldValues = FieldValues> {
  private plugins: Map<string, Plugin<TValues>> = new Map()
  private eventBus: EventBus<TValues>

  constructor(eventBus: EventBus<TValues>) {
    this.eventBus = eventBus
  }

  register(plugin: Plugin<TValues>): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} is already registered`)
    }

    this.plugins.set(plugin.name, plugin)

    // Register plugin hooks with event bus
    this.registerHooks(plugin)
  }

  private registerHooks(plugin: Plugin<TValues>): void {
    if (!plugin.hooks) return

    const { hooks } = plugin

    // Map hooks to events
    if (hooks.onValueChange) {
      this.eventBus.on('change', (e) => hooks.onValueChange!(e.name, e.value, e.prevValue))
    }

    if (hooks.onErrorChange) {
      this.eventBus.on('error', (e) => hooks.onErrorChange!(e.name, e.error))
    }

    // ... other hooks
  }

  unregister(name: string): void {
    this.plugins.delete(name)
  }

  unregisterAll(): void {
    // Uninstall in reverse order
    const pluginsArray = Array.from(this.plugins.values()).reverse()
    pluginsArray.forEach(plugin => plugin.uninstall())
    this.plugins.clear()
  }

  get(name: string): Plugin<TValues> | undefined {
    return this.plugins.get(name)
  }

  list(): PluginInfo[] {
    return Array.from(this.plugins.values()).map(plugin => ({
      name: plugin.name,
      version: plugin.version,
      type: plugin.type,
      enabled: true,
    }))
  }
}
```

---

## 3. Plugin System

### 3.1 Plugin Interface

```typescript
export interface Plugin<TValues extends FieldValues = FieldValues> {
  name: string
  version: string
  type: 'core' | 'optional'

  install(kernel: Kernel<TValues>): void | Promise<void>
  uninstall(): void | Promise<void>

  hooks?: {
    beforeRegister?: (name: string, rules?: ValidationRules) => ValidationRules | undefined
    afterRegister?: (name: string, field: FieldState) => void
    beforeValidate?: (values: TValues) => TValues
    afterValidate?: (errors: FormErrors<TValues>) => FormErrors<TValues>
    beforeSubmit?: (values: TValues) => TValues | false
    afterSubmit?: (values: TValues, success: boolean) => void
    beforeReset?: (values: DeepPartial<TValues>) => DeepPartial<TValues>
    afterReset?: () => void
    onValueChange?: (name: string, value: any, prevValue: any) => void
    onErrorChange?: (name: string, error: string | undefined) => void
    onStateChange?: (state: FormState<TValues>) => void
  }

  api?: Record<string, unknown>
}
```

### 3.2 Plugin Template

```typescript
export function createPlugin<TValues extends FieldValues>(
  config: PluginConfig<TValues>
): Plugin<TValues> {
  let kernel: Kernel<TValues> | null = null

  return {
    name: config.name,
    version: config.version || '1.0.0',
    type: config.type || 'optional',

    async install(k: Kernel<TValues>) {
      kernel = k

      if (config.onInstall) {
        await config.onInstall(kernel)
      }
    },

    async uninstall() {
      if (config.onUninstall) {
        await config.onUninstall()
      }

      kernel = null
    },

    hooks: config.hooks,
    api: config.api,
  }
}
```

### 3.3 Hook Execution Order

**Registration Flow:**
```
beforeRegister hook
    ↓
Register field in registry
    ↓
afterRegister hook
    ↓
Emit 'register' event
```

**Validation Flow:**
```
beforeValidate hook
    ↓
Run field validators
    ↓
Run form-level validator
    ↓
afterValidate hook
    ↓
Emit 'validate' event
```

**Submit Flow:**
```
beforeSubmit hook (can cancel)
    ↓
Validate form
    ↓
If valid → Call onSubmit
    ↓
afterSubmit hook
    ↓
Emit 'submit-success' or 'submit-error'
```

---

## 4. Core Plugins

### 4.1 field-registry

**File:** `src/plugins/core/field-registry.ts`

**Data Structures:**
```typescript
class FieldRegistry<TValues> {
  private fields: Map<string, FieldState> = new Map()
  private refs: Map<string, HTMLElement | null> = new Map()
  private rules: Map<string, ValidationRules> = new Map()

  register(name: string, rules?: ValidationRules): FieldRegistration {
    // Store field state
    this.fields.set(name, {
      value: this.getInitialValue(name),
      error: undefined,
      touched: false,
      dirty: false,
      validating: false,
    })

    if (rules) {
      this.rules.set(name, rules)
    }

    // Return registration object
    return {
      name,
      ref: (element) => this.setRef(name, element),
      onChange: (e) => this.handleChange(name, e),
      onBlur: () => this.handleBlur(name),
      onFocus: () => this.handleFocus(name),
      get value() {
        return this.fields.get(name)?.value
      },
    }
  }

  private handleChange(name: string, event: Event): void {
    const target = event.target as HTMLInputElement
    let value: any

    // Extract value based on input type
    if (target.type === 'checkbox') {
      value = target.checked
    } else if (target.type === 'number') {
      value = target.valueAsNumber
    } else if (target.type === 'file') {
      value = target.files
    } else {
      value = target.value
    }

    // Emit change event (state-manager will handle)
    this.emit('change', { name, value, prevValue: this.fields.get(name)?.value })
  }
}
```

**Key Implementation Details:**
- Use `Map` for O(1) field lookup
- Store refs using `WeakMap` where possible
- Support nested paths via dot notation
- Handle all input types (text, number, checkbox, file, etc.)

### 4.2 state-manager

**File:** `src/plugins/core/state-manager.ts`

**Data Structures:**
```typescript
class StateManager<TValues> {
  private values: TValues
  private defaultValues: TValues
  private touched: TouchedFields<TValues> = {}
  private dirty: DirtyFields<TValues> = {}

  constructor(initialValues: TValues) {
    this.values = deepClone(initialValues)
    this.defaultValues = deepClone(initialValues)
  }

  setValue(name: string, value: any, options?: SetValueOptions): void {
    const prevValue = this.getValue(name)

    // Set value using path utility
    deepSet(this.values, name, value)

    // Update dirty state
    const defaultValue = deepGet(this.defaultValues, name)
    const isDirty = !deepEqual(value, defaultValue)
    deepSet(this.dirty, name, isDirty)

    // Optionally touch
    if (options?.shouldTouch) {
      this.setTouched(name, true)
    }

    // Emit change event
    this.emit('change', {
      type: 'change',
      name,
      value,
      prevValue,
      timestamp: Date.now(),
    })

    // Optionally validate
    if (options?.shouldValidate) {
      this.kernel.validateField(name)
    }
  }

  isDirty(name?: string): boolean {
    if (!name) {
      // Check if ANY field is dirty
      return this.hasAnyDirty(this.dirty)
    }

    return deepGet(this.dirty, name) === true
  }

  private hasAnyDirty(obj: any): boolean {
    if (typeof obj === 'boolean') return obj
    if (typeof obj !== 'object' || obj === null) return false

    return Object.values(obj).some(val => this.hasAnyDirty(val))
  }
}
```

**Key Implementation Details:**
- Deep clone initial values to prevent mutation
- Use `deepEqual` for dirty comparison
- Support partial updates with `DeepPartial<T>`
- Efficient dirty checking with nested objects

### 4.3 validation-engine

**File:** `src/plugins/core/validation-engine.ts`

**Validation Flow:**
```typescript
class ValidationEngine<TValues> {
  private errors: FormErrors<TValues> = {}
  private validating: Set<string> = new Set()
  private abortControllers: Map<string, AbortController> = new Map()

  async validateField(name: string): Promise<boolean> {
    // Abort previous validation for this field
    this.abortControllers.get(name)?.abort()

    const abortController = new AbortController()
    this.abortControllers.set(name, abortController)

    this.validating.add(name)

    try {
      const field = this.fieldRegistry.getField(name)
      const rules = this.fieldRegistry.getRules(name)
      const value = field?.value

      // Run built-in rules
      const builtInError = await this.validateBuiltInRules(value, rules)
      if (builtInError) {
        this.setError(name, builtInError)
        return false
      }

      // Run custom validators
      if (rules?.validate) {
        const customError = await this.validateCustom(value, rules.validate, abortController.signal)
        if (customError) {
          this.setError(name, customError)
          return false
        }
      }

      // Clear error if all passed
      this.clearError(name)
      return true

    } finally {
      this.validating.delete(name)
      this.abortControllers.delete(name)
    }
  }

  private async validateBuiltInRules(
    value: any,
    rules?: ValidationRules
  ): Promise<string | undefined> {
    if (!rules) return undefined

    // Required
    if (rules.required) {
      if (value === undefined || value === null || value === '') {
        return typeof rules.required === 'string'
          ? rules.required
          : 'This field is required'
      }
    }

    // Min
    if (rules.min !== undefined) {
      const min = typeof rules.min === 'object' ? rules.min.value : rules.min
      if (typeof value === 'number' && value < min) {
        return typeof rules.min === 'object'
          ? rules.min.message
          : `Value must be at least ${min}`
      }
    }

    // Max
    if (rules.max !== undefined) {
      const max = typeof rules.max === 'object' ? rules.max.value : rules.max
      if (typeof value === 'number' && value > max) {
        return typeof rules.max === 'object'
          ? rules.max.message
          : `Value must be at most ${max}`
      }
    }

    // MinLength
    if (rules.minLength !== undefined) {
      const minLength = typeof rules.minLength === 'object'
        ? rules.minLength.value
        : rules.minLength
      if (typeof value === 'string' && value.length < minLength) {
        return typeof rules.minLength === 'object'
          ? rules.minLength.message
          : `Must be at least ${minLength} characters`
      }
    }

    // MaxLength
    if (rules.maxLength !== undefined) {
      const maxLength = typeof rules.maxLength === 'object'
        ? rules.maxLength.value
        : rules.maxLength
      if (typeof value === 'string' && value.length > maxLength) {
        return typeof rules.maxLength === 'object'
          ? rules.maxLength.message
          : `Must be at most ${maxLength} characters`
      }
    }

    // Pattern
    if (rules.pattern) {
      const pattern = typeof rules.pattern === 'object'
        ? rules.pattern.value
        : rules.pattern
      if (typeof value === 'string' && !pattern.test(value)) {
        return typeof rules.pattern === 'object'
          ? rules.pattern.message
          : 'Invalid format'
      }
    }

    return undefined
  }

  private async validateCustom(
    value: any,
    validate: ValidateFn | Record<string, ValidateFn>,
    signal: AbortSignal
  ): Promise<string | undefined> {
    const formValues = this.stateManager.getValues()

    if (typeof validate === 'function') {
      const result = await validate(value, formValues)
      if (signal.aborted) return undefined

      return this.normalizeValidateResult(result)
    }

    // Multiple validators
    for (const [key, fn] of Object.entries(validate)) {
      const result = await fn(value, formValues)
      if (signal.aborted) return undefined

      const error = this.normalizeValidateResult(result)
      if (error) return error
    }

    return undefined
  }

  private normalizeValidateResult(result: ValidateResult): string | undefined {
    if (result === true || result === undefined) return undefined
    if (result === false) return 'Validation failed'
    return result
  }
}
```

**Key Implementation Details:**
- Abort previous async validation on new input
- Short-circuit on first error (configurable)
- Support sync and async validators
- Debounce rapid validation calls
- Handle dependent field validation

### 4.4 array-fields

**File:** `src/plugins/core/array-fields.ts`

**Implementation:**
```typescript
class ArrayFields<TValues> {
  private arrays: Map<string, FieldArrayState> = new Map()

  useFieldArray(name: string): FieldArrayReturn<TValues, any> {
    if (!this.arrays.has(name)) {
      this.initializeArray(name)
    }

    const state = this.arrays.get(name)!

    return {
      fields: state.fields,
      append: (value, options) => this.append(name, value, options),
      prepend: (value, options) => this.prepend(name, value, options),
      insert: (index, value, options) => this.insert(name, index, value, options),
      remove: (index) => this.remove(name, index),
      swap: (indexA, indexB) => this.swap(name, indexA, indexB),
      move: (from, to) => this.move(name, from, to),
      update: (index, value) => this.update(name, index, value),
      replace: (values) => this.replace(name, values),
    }
  }

  private append(name: string, value: any, options?: FieldArrayOptions): void {
    const array = this.stateManager.getValue(name) || []
    const newArray = [...array, value]

    // Generate unique ID for React key
    const id = generateId()
    const state = this.arrays.get(name)!
    state.fields.push({ id, ...value })

    this.stateManager.setValue(name, newArray, { shouldValidate: true })

    // Optionally focus new field
    if (options?.shouldFocus) {
      const focusName = options.focusName || `${name}.${array.length}`
      this.kernel.setFocus(focusName)
    }
  }

  private remove(name: string, index: number | number[]): void {
    const array = this.stateManager.getValue(name) || []
    const indices = Array.isArray(index) ? index : [index]

    // Sort descending to avoid index shifting
    const sortedIndices = [...indices].sort((a, b) => b - a)

    const newArray = array.filter((_, i) => !sortedIndices.includes(i))

    const state = this.arrays.get(name)!
    state.fields = state.fields.filter((_, i) => !sortedIndices.includes(i))

    this.stateManager.setValue(name, newArray, { shouldValidate: true })

    // Update field paths for remaining items
    this.updateFieldPaths(name, newArray)
  }

  private swap(name: string, indexA: number, indexB: number): void {
    const array = this.stateManager.getValue(name) || []
    const newArray = [...array]

    // Swap values
    ;[newArray[indexA], newArray[indexB]] = [newArray[indexB], newArray[indexA]]

    const state = this.arrays.get(name)!
    ;[state.fields[indexA], state.fields[indexB]] = [state.fields[indexB], state.fields[indexA]]

    this.stateManager.setValue(name, newArray, { shouldValidate: true })
  }

  private move(name: string, from: number, to: number): void {
    const array = this.stateManager.getValue(name) || []
    const newArray = [...array]
    const [item] = newArray.splice(from, 1)
    newArray.splice(to, 0, item)

    const state = this.arrays.get(name)!
    const [field] = state.fields.splice(from, 1)
    state.fields.splice(to, 0, field)

    this.stateManager.setValue(name, newArray, { shouldValidate: true })
  }
}
```

**Key Implementation Details:**
- Generate stable unique IDs for React keys
- Preserve field state on reorder
- Update all field paths after remove
- Support nested array fields

### 4.5 submit-handler

**File:** `src/plugins/core/submit-handler.ts`

**Implementation:**
```typescript
class SubmitHandler<TValues> {
  private isSubmitting = false
  private isSubmitSuccessful = false
  private submitCount = 0

  async handleSubmit(e?: Event): Promise<void> {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    await this.submit()
  }

  async submit(): Promise<void> {
    if (this.isSubmitting) return

    try {
      this.isSubmitting = true
      this.submitCount++

      // Emit submit start
      this.emit('submit', {
        type: 'submit',
        values: this.stateManager.getValues(),
        timestamp: Date.now(),
      })

      // Validate all fields
      const isValid = await this.validationEngine.validate()

      if (!isValid) {
        const errors = this.validationEngine.getErrors()

        // Focus first error
        if (this.options.shouldFocusError) {
          this.focusFirstError()
        }

        // Call error handler
        if (this.options.onError) {
          this.options.onError(errors)
        }

        this.emit('submit-error', {
          type: 'submit-error',
          errors,
          timestamp: Date.now(),
        })

        return
      }

      // Call submit handler
      const values = this.stateManager.getValues()
      await this.options.onSubmit(values)

      this.isSubmitSuccessful = true

      this.emit('submit-success', {
        type: 'submit-success',
        values,
        timestamp: Date.now(),
      })

    } catch (error) {
      console.error('Submit error:', error)

      this.emit('error', {
        type: 'error',
        error: error as Error,
        context: 'submit',
        timestamp: Date.now(),
      })

    } finally {
      this.isSubmitting = false
    }
  }

  private focusFirstError(): void {
    const errors = this.validationEngine.getErrors()
    const firstErrorField = this.getFirstErrorField(errors)

    if (firstErrorField) {
      this.kernel.setFocus(firstErrorField)
    }
  }

  private getFirstErrorField(errors: any, prefix = ''): string | null {
    for (const [key, value] of Object.entries(errors)) {
      const path = prefix ? `${prefix}.${key}` : key

      if (typeof value === 'string') {
        return path
      }

      if (typeof value === 'object') {
        const nested = this.getFirstErrorField(value, path)
        if (nested) return nested
      }
    }

    return null
  }
}
```

---

## 5. Optional Plugins

### 5.1 wizard

**File:** `src/plugins/optional/wizard.ts`

**Implementation Strategy:**
- Track current step index
- Validate step fields on navigation
- Store step completion state
- Support linear and non-linear navigation

**Key Features:**
```typescript
class WizardPlugin {
  private currentIndex = 0
  private completedSteps: Set<string> = new Set()

  async next(): Promise<boolean> {
    const currentStep = this.steps[this.currentIndex]

    // Validate current step
    if (this.options.validateOnStepChange) {
      const isValid = await this.validateStep(currentStep)
      if (!isValid) return false
    }

    // Check canLeave
    if (currentStep.canLeave && !currentStep.canLeave()) {
      return false
    }

    // Mark step as completed
    this.completedSteps.add(currentStep.id)

    // Move to next step
    if (this.currentIndex < this.steps.length - 1) {
      this.currentIndex++

      const nextStep = this.steps[this.currentIndex]

      // Check canEnter
      if (nextStep.canEnter && !nextStep.canEnter()) {
        return false
      }

      return true
    }

    return false
  }

  private async validateStep(step: WizardStep): Promise<boolean> {
    // Validate all fields in step
    for (const fieldName of step.fields) {
      const isValid = await this.kernel.validateField(fieldName)
      if (!isValid) return false
    }

    // Run step-level validation
    if (step.validate) {
      return await step.validate()
    }

    return true
  }
}
```

### 5.2 autosave

**File:** `src/plugins/optional/autosave.ts`

**Implementation Strategy:**
- Debounce save operations
- Filter fields (include/exclude)
- Simple encryption support
- localStorage/sessionStorage

**Key Features:**
```typescript
class AutosavePlugin {
  private saveTimeout: NodeJS.Timeout | null = null
  private paused = false

  install(kernel: Kernel) {
    // Watch for value changes
    kernel.on('change', () => {
      if (!this.paused) {
        this.debouncedSave()
      }
    })

    // Restore on initialization
    this.restore()
  }

  private debouncedSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout)
    }

    this.saveTimeout = setTimeout(() => {
      this.save()
    }, this.options.debounce || 1000)
  }

  save(): void {
    const values = this.kernel.getValues()

    // Filter fields
    const filteredValues = this.filterValues(values)

    // Serialize
    const serialized = this.options.serialize
      ? this.options.serialize(filteredValues)
      : JSON.stringify(filteredValues)

    // Encrypt if needed
    const data = this.options.encrypt
      ? this.encrypt(serialized)
      : serialized

    // Save to storage
    this.storage.setItem(this.options.key, data)

    if (this.options.onSave) {
      this.options.onSave(filteredValues)
    }
  }

  restore(): boolean {
    const data = this.storage.getItem(this.options.key)
    if (!data) return false

    try {
      // Decrypt if needed
      const serialized = this.options.encrypt
        ? this.decrypt(data)
        : data

      // Deserialize
      const values = this.options.deserialize
        ? this.options.deserialize(serialized)
        : JSON.parse(serialized)

      // Restore values
      this.kernel.setValues(values)

      if (this.options.onRestore) {
        this.options.onRestore(values)
      }

      return true
    } catch (error) {
      console.error('Failed to restore autosaved data:', error)
      return false
    }
  }
}
```

### 5.3 schema

**File:** `src/plugins/optional/schema.ts`

**Adapter Pattern:**
```typescript
// Zod adapter
const zodAdapter: SchemaAdapter = {
  async validate(schema: z.ZodSchema, values: any) {
    const result = await schema.safeParseAsync(values)

    if (result.success) {
      return { success: true }
    }

    return {
      success: false,
      errors: result.error.issues,
    }
  },

  getFieldError(errors: z.ZodIssue[], field: string): string | undefined {
    const issue = errors.find(e => e.path.join('.') === field)
    return issue?.message
  },
}

// Yup adapter
const yupAdapter: SchemaAdapter = {
  async validate(schema: yup.Schema, values: any) {
    try {
      await schema.validate(values, { abortEarly: false })
      return { success: true }
    } catch (error) {
      return {
        success: false,
        errors: error.inner,
      }
    }
  },

  getFieldError(errors: any[], field: string): string | undefined {
    const error = errors.find(e => e.path === field)
    return error?.message
  },
}
```

---

## 6. Framework Adapters

### 6.1 React Adapter

**File:** `src/adapters/react/use-form.ts`

**Implementation:**
```typescript
import { useSyncExternalStore, useRef, useCallback } from 'react'
import { createForm } from '../../index'

export function useForm<TValues extends FieldValues>(
  options: UseFormOptions<TValues>
): UseFormReturn<TValues> {
  // Create form instance once
  const formRef = useRef<Form<TValues>>()

  if (!formRef.current) {
    formRef.current = createForm(options)
  }

  const form = formRef.current

  // Subscribe to form state changes
  const formState = useSyncExternalStore(
    useCallback(
      (callback) => form.on('state-change', callback),
      [form]
    ),
    () => ({
      values: form.getValues(),
      errors: form.getErrors(),
      touched: form.getTouched(),
      dirty: form.getDirty(),
      isValid: form.isValid(),
      isSubmitting: form.isSubmitting(),
      isSubmitSuccessful: form.isSubmitSuccessful(),
      submitCount: form.getSubmitCount(),
    })
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => form.destroy()
  }, [form])

  return {
    // Kernel methods
    register: form.register.bind(form),
    setValue: form.setValue.bind(form),
    // ... other methods

    // Form state
    formState,

    // Handlers
    handleSubmit: (e) => form.handleSubmit(e),

    // Plugins (if available)
    wizard: form.getPlugin('wizard'),
    autosave: form.getPlugin('autosave'),
  }
}
```

**File:** `src/adapters/react/use-field.ts`

```typescript
export function useField<TValue = any>(
  name: string,
  rules?: UseFieldOptions
): UseFieldReturn<TValue> {
  const form = useFormContext()

  // Subscribe to field changes
  const fieldState = useSyncExternalStore(
    useCallback(
      (callback) => {
        const unsubscribe = form.watch(name, callback)
        return unsubscribe
      },
      [form, name]
    ),
    () => ({
      value: form.getValues(name),
      error: form.getError(name),
      touched: form.isTouched(name),
      dirty: form.isDirty(name),
    })
  )

  // Register field on mount
  useEffect(() => {
    const registration = form.register(name, rules)

    return () => {
      if (form.getOptions().shouldUnregister) {
        form.unregister(name)
      }
    }
  }, [form, name, rules])

  return {
    register: () => form.register(name, rules),
    value: fieldState.value,
    error: fieldState.error,
    touched: fieldState.touched,
    dirty: fieldState.dirty,
    validating: form.isFieldValidating(name),
    invalid: !!fieldState.error,
    setValue: (value) => form.setValue(name, value),
    setError: (error) => form.setError(name, error),
    clearError: () => form.clearError(name),
    setTouched: (touched) => form.setTouched(name, touched),
  }
}
```

### 6.2 Vue Adapter

**File:** `src/adapters/vue/use-form.ts`

```typescript
import { ref, computed, onUnmounted } from 'vue'
import { createForm } from '../../index'

export function useForm<TValues extends FieldValues>(
  options: UseFormOptions<TValues>
) {
  const form = createForm(options)

  // Reactive state
  const values = ref(form.getValues())
  const errors = ref(form.getErrors())
  const touched = ref(form.getTouched())
  const dirty = ref(form.getDirty())
  const isSubmitting = ref(false)
  const isValid = computed(() => form.isValid())

  // Subscribe to changes
  form.on('state-change', () => {
    values.value = form.getValues()
    errors.value = form.getErrors()
    touched.value = form.getTouched()
    dirty.value = form.getDirty()
    isSubmitting.value = form.isSubmitting()
  })

  // Cleanup
  onUnmounted(() => {
    form.destroy()
  })

  return {
    // Kernel methods
    register: form.register.bind(form),
    setValue: form.setValue.bind(form),
    // ... other methods

    // Reactive state
    values,
    errors,
    touched,
    dirty,
    isSubmitting,
    isValid,

    // Handlers
    handleSubmit: (e?: Event) => form.handleSubmit(e),
  }
}
```

### 6.3 Svelte Adapter

**File:** `src/adapters/svelte/form-store.ts`

```typescript
import { writable, derived } from 'svelte/store'
import { createForm } from '../../index'

export function createFormStore<TValues extends FieldValues>(
  options: FormStoreOptions<TValues>
) {
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
  form.on('state-change', () => {
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

  return {
    subscribe: store.subscribe,

    // Kernel methods
    register: form.register.bind(form),
    setValue: form.setValue.bind(form),
    // ... other methods

    // Handlers
    handleSubmit: (e?: Event) => form.handleSubmit(e),

    // Cleanup
    destroy: () => form.destroy(),
  }
}
```

---

## 7. Utility Functions

### 7.1 Path Utilities

**File:** `src/utils/path.ts`

```typescript
export function deepGet(obj: any, path: string): any {
  if (!path) return obj

  const keys = parsePath(path)
  let result = obj

  for (const key of keys) {
    if (result === undefined || result === null) {
      return undefined
    }
    result = result[key]
  }

  return result
}

export function deepSet(obj: any, path: string, value: any): void {
  if (!path) return

  const keys = parsePath(path)
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!
    const nextKey = keys[i + 1]!

    if (!(key in current)) {
      // Create object or array based on next key
      current[key] = /^\d+$/.test(nextKey) ? [] : {}
    }

    current = current[key]
  }

  current[keys[keys.length - 1]!] = value
}

function parsePath(path: string): string[] {
  // Support both dot notation and bracket notation
  // 'user.profile.name' → ['user', 'profile', 'name']
  // 'items[0].name' → ['items', '0', 'name']

  return path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)
}
```

### 7.2 Deep Clone

**File:** `src/utils/deep-clone.ts`

```typescript
export function deepClone<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as T
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T
  }

  if (Array.isArray(value)) {
    return value.map(item => deepClone(item)) as T
  }

  const cloned = {} as T
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      cloned[key] = deepClone(value[key])
    }
  }

  return cloned
}
```

### 7.3 Deep Equal

**File:** `src/utils/deep-equal.ts`

```typescript
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true

  if (a === null || b === null) return false
  if (typeof a !== 'object' || typeof b !== 'object') return false

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString()
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, index) => deepEqual(item, b[index]))
  }

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  return keysA.every(key => deepEqual(a[key], b[key]))
}
```

### 7.4 UID Generator

**File:** `src/utils/uid.ts`

```typescript
let counter = 0

export function generateId(): string {
  return `fk-${Date.now()}-${++counter}`
}
```

### 7.5 Debounce

**File:** `src/utils/debounce.ts`

```typescript
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
```

---

## 8. Type System

### 8.1 Type Inference

**Goal:** Type-safe field paths with value inference

**Challenge:** TypeScript doesn't natively support dot notation type inference

**Solution:** Use template literal types (TS 4.1+)

```typescript
// Basic field path type
type FieldPath<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}` | `${K}.${FieldPath<T[K]>}`
          : `${K}`
        : never
    }[keyof T]
  : never

// Example:
type User = {
  name: string
  profile: {
    age: number
    address: {
      city: string
    }
  }
}

type UserPaths = FieldPath<User>
// 'name' | 'profile' | 'profile.age' | 'profile.address' | 'profile.address.city'
```

**Value Inference:**
```typescript
type FieldPathValue<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? FieldPathValue<T[K], R>
    : never
  : never

// Example:
type NameType = FieldPathValue<User, 'name'>  // string
type CityType = FieldPathValue<User, 'profile.address.city'>  // string
```

### 8.2 Generic Constraints

```typescript
// Ensure TValues is an object
export function createForm<TValues extends FieldValues>(
  options: FormOptions<TValues>
): Form<TValues> {
  // ...
}

// Constrain field name to valid paths
interface Form<TValues> {
  setValue<TName extends FieldPath<TValues>>(
    name: TName,
    value: FieldPathValue<TValues, TName>
  ): void
}
```

---

## 9. Performance Optimizations

### 9.1 React Optimizations

**Use `useSyncExternalStore`:**
- Built-in React 18 hook for external stores
- Automatic tearing prevention
- Concurrent mode safe

**Selective Re-renders:**
```typescript
// Subscribe only to specific fields
const email = useWatch('email')  // Only re-renders when email changes

// Subscribe to specific state properties
const { errors, isValid } = useFormState({
  select: ['errors', 'isValid']
})
```

**Field-Level Memoization:**
```typescript
const EmailField = memo(() => {
  const { register, error } = useField('email')
  return <input {...register()} />
})
```

### 9.2 Validation Optimizations

**Debounce Async Validation:**
```typescript
const debouncedValidate = debounce(async (value) => {
  return await checkEmailAvailability(value)
}, 500)
```

**Abort Previous Validations:**
```typescript
const abortController = new AbortController()
abortControllers.set(fieldName, abortController)

// On new validation:
prevAbortController?.abort()
```

**Dependent Field Batching:**
```typescript
// When password changes, also validate confirmPassword
{
  name: 'password',
  validate: async (value) => {
    // Validate password
    const isValid = await validatePassword(value)

    // Trigger confirmPassword validation
    if (form.getValue('confirmPassword')) {
      form.validateField('confirmPassword')
    }

    return isValid
  }
}
```

### 9.3 Memory Optimizations

**WeakMap for Refs:**
```typescript
// Use WeakMap to allow GC
private refs = new WeakMap<HTMLElement, string>()
```

**Cleanup on Unmount:**
```typescript
useEffect(() => {
  return () => {
    if (shouldUnregister) {
      form.unregister(name)
    }
  }
}, [])
```

---

## 10. Testing Strategy

### 10.1 Unit Tests

**Kernel Tests:**
- Plugin registration/unregistration
- Event emission/subscription
- Lifecycle management

**Plugin Tests:**
- Each plugin tested in isolation
- Mock kernel dependencies
- Test all public API methods

**Utility Tests:**
- Path utilities (deepGet, deepSet)
- Deep clone/equal
- Debounce

### 10.2 Integration Tests

**Form Validation:**
```typescript
test('validates form with nested fields', async () => {
  const form = createForm({
    initialValues: {
      user: {
        email: '',
        profile: {
          age: 0
        }
      }
    },
    validate: (values) => {
      const errors: any = {}
      if (!values.user.email) {
        errors.user = { email: 'Required' }
      }
      return errors
    },
    onSubmit: vi.fn(),
  })

  const isValid = await form.validate()
  expect(isValid).toBe(false)
  expect(form.getError('user.email')).toBe('Required')
})
```

**Array Fields:**
```typescript
test('handles array field operations', () => {
  const form = createForm({
    initialValues: { items: [] },
    onSubmit: vi.fn(),
  })

  const { append, remove, swap } = form.useFieldArray('items')

  append({ name: 'Item 1' })
  append({ name: 'Item 2' })
  expect(form.getValues('items')).toHaveLength(2)

  swap(0, 1)
  expect(form.getValues('items.0.name')).toBe('Item 2')

  remove(0)
  expect(form.getValues('items')).toHaveLength(1)
})
```

### 10.3 Framework Adapter Tests

**React Testing Library:**
```typescript
test('useForm subscribes to changes', () => {
  const { result } = renderHook(() => useForm({
    initialValues: { email: '' },
    onSubmit: vi.fn(),
  }))

  act(() => {
    result.current.setValue('email', 'test@example.com')
  })

  expect(result.current.formState.values.email).toBe('test@example.com')
  expect(result.current.formState.isDirty).toBe(true)
})
```

**Vue Testing Library:**
```typescript
test('useForm in Vue component', async () => {
  const wrapper = mount({
    setup() {
      const form = useForm({
        initialValues: { email: '' },
        onSubmit: vi.fn(),
      })
      return { form }
    },
    template: '<div />'
  })

  wrapper.vm.form.setValue('email', 'test@example.com')
  await nextTick()

  expect(wrapper.vm.form.values.email).toBe('test@example.com')
})
```

### 10.4 Coverage Requirements

```json
{
  "coverage": {
    "lines": 100,
    "functions": 100,
    "branches": 100,
    "statements": 100
  }
}
```

**Coverage Strategy:**
- Write tests alongside implementation
- Test error paths and edge cases
- Test async operations
- Test browser APIs (focus, refs)

---

## 11. Build System

### 11.1 tsup Configuration

**File:** `tsup.config.ts`

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'plugins/index': 'src/plugins/index.ts',
    'react/index': 'src/adapters/react/index.ts',
    'vue/index': 'src/adapters/vue/index.ts',
    'svelte/index': 'src/adapters/svelte/index.ts',
  },

  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: true,
  treeshake: true,
  splitting: false,
  sourcemap: true,

  external: [
    'react',
    'react-dom',
    'vue',
    'svelte',
  ],

  esbuildOptions(options) {
    options.mangleProps = /^_/
  },
})
```

### 11.2 Package.json Scripts

```json
{
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "prepublishOnly": "npm run build && npm run test:coverage"
  }
}
```

### 11.3 Bundle Analysis

**Size Budget:**
```json
{
  "@oxog/formkeeper": "5kb",
  "@oxog/formkeeper/plugins": "5kb",
  "@oxog/formkeeper/react": "3kb",
  "@oxog/formkeeper/vue": "3kb",
  "@oxog/formkeeper/svelte": "2kb"
}
```

**Monitor with:**
- bundlephobia.com
- esbuild metafile analysis
- size-limit CI checks

---

## 12. Documentation Website

### 12.1 Implementation Stack

**Dependencies:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "prismjs": "^1.29.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.5",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  }
}
```

### 12.2 Content Strategy

**Code Examples:**
- Use live, editable examples (CodeSandbox/StackBlitz embeds)
- Show package manager tabs (npm/yarn/pnpm)
- Framework tabs (React/Vue/Svelte)
- Copy button for code blocks

**Interactive Playground:**
- Form builder UI
- Schema editor (JSON)
- Live preview
- Export code (React/Vue/Svelte)
- Share URL support

**Documentation Structure:**
```
/docs
  /getting-started
    - installation
    - quick-start
    - basic-example

  /concepts
    - field-registration
    - validation
    - form-state
    - nested-fields
    - array-fields

  /api
    - createForm
    - useForm
    - useField
    - validation-rules

  /plugins
    - wizard
    - autosave
    - schema

  /guides
    - multi-step-forms
    - async-validation
    - custom-plugins
```

### 12.3 SEO & Performance

**Meta Tags:**
```html
<meta name="description" content="Zero-dependency headless form state manager with micro-kernel plugin architecture" />
<meta property="og:title" content="FormKeeper - Zero-dependency form state manager" />
<meta property="og:image" content="https://formkeeper.oxog.dev/og-image.png" />
```

**Performance:**
- Code splitting by route
- Image optimization
- Lazy load examples
- Preload critical fonts

---

## 13. Implementation Checklist

### Phase 1: Foundation
- [ ] Set up project structure
- [ ] Configure TypeScript
- [ ] Configure build system (tsup)
- [ ] Configure testing (Vitest)
- [ ] Implement type system
- [ ] Implement utility functions

### Phase 2: Kernel
- [ ] Implement Event Bus
- [ ] Implement Plugin Registry
- [ ] Implement Kernel class
- [ ] Write kernel tests (100% coverage)

### Phase 3: Core Plugins
- [ ] field-registry plugin
- [ ] state-manager plugin
- [ ] validation-engine plugin
- [ ] array-fields plugin
- [ ] submit-handler plugin
- [ ] Write plugin tests (100% coverage)

### Phase 4: Optional Plugins
- [ ] wizard plugin
- [ ] autosave plugin
- [ ] persist plugin
- [ ] schema plugin
- [ ] focus-manager plugin
- [ ] form-devtools plugin
- [ ] Write plugin tests (100% coverage)

### Phase 5: Framework Adapters
- [ ] React adapter
- [ ] Vue adapter
- [ ] Svelte adapter
- [ ] Write adapter tests (100% coverage)

### Phase 6: Documentation Website
- [ ] Set up Vite + React project
- [ ] Install shadcn/ui components
- [ ] Implement layout components
- [ ] Create all documentation pages
- [ ] Build interactive playground
- [ ] Deploy to GitHub Pages

### Phase 7: Polish
- [ ] Write comprehensive README
- [ ] Create examples
- [ ] Generate API documentation
- [ ] Bundle size optimization
- [ ] Performance profiling
- [ ] Final testing

---

**Document Status:** ✅ COMPLETE
**Next Step:** Create TASKS.md with ordered implementation tasks
