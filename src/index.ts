/**
 * FormKeeper
 * Zero-dependency headless form state manager
 * @packageDocumentation
 */

// Main factory
export { createForm, type Form } from './create-form'

// Type exports
export type {
  // Base types
  FieldValues,
  FieldPath,
  FieldPathValue,
  DeepPartial,

  // Field types
  FieldRegistration,
  FieldState,
  FormErrors,
  TouchedFields,
  DirtyFields,

  // Validation types
  ValidationRules,
  ValidateFn,
  ValidateResult,

  // Form options
  FormOptions,
  ValidationMode,
  SubmitHandler,
  ErrorHandler,
  FormValidateFn,
  SetValueOptions,
  ResetOptions,

  // Array field types
  FieldArrayReturn,
  FieldArrayItem,
  FieldArrayOptions,

  // Event types
  EventType,
  FormEvent,
  EventHandler,
  Unsubscribe,

  // Plugin types
  Plugin,
  PluginHooks,
  PluginInfo,

  // Form state
  FormState,

  // Watch types
  WatchCallback,
} from './types'

// Plugin utilities (for creating custom plugins)
export { Kernel } from './kernel/kernel'
export { EventBus } from './kernel/event-bus'
export { PluginRegistry } from './kernel/plugin-registry'
