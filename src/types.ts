/**
 * FormKeeper - Type Definitions
 * Zero-dependency headless form state manager
 * @packageDocumentation
 */

// ============================================================================
// BASE TYPES
// ============================================================================

/**
 * Base type for all form values - must be an object
 */
export type FieldValues = Record<string, any>

/**
 * Represents a path to a field in the form values object
 * Supports dot notation (e.g., 'user.profile.name')
 */
export type FieldPath<_TValues extends FieldValues = FieldValues> = string

/**
 * Gets the value type at a specific field path
 */
export type FieldPathValue<
  _TValues extends FieldValues = FieldValues,
  _TPath extends FieldPath<_TValues> = FieldPath<_TValues>
> = any

/**
 * Makes all properties in T optional recursively
 */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T

// ============================================================================
// FIELD TYPES
// ============================================================================

/**
 * Field registration object returned by register()
 */
export interface FieldRegistration {
  /** Field name */
  name: string
  /** Ref callback for DOM element */
  ref: (element: HTMLElement | null) => void
  /** Change event handler */
  onChange: (event: any) => void
  /** Blur event handler */
  onBlur: (event: any) => void
  /** Focus event handler */
  onFocus: (event: any) => void
  /** Current field value */
  value: any
  /** Whether field is disabled */
  disabled?: boolean
}

/**
 * Internal field state
 */
export interface FieldState {
  /** Current value */
  value: any
  /** Current error message */
  error: string | undefined
  /** Whether field has been touched (blurred) */
  touched: boolean
  /** Whether field value differs from initial value */
  dirty: boolean
  /** Whether field is currently being validated */
  validating: boolean
}

/**
 * Form errors object with nested structure matching form values
 */
export type FormErrors<TValues extends FieldValues> = {
  [K in keyof TValues]?: TValues[K] extends object
    ? FormErrors<TValues[K]>
    : string
}

/**
 * Touched fields object with nested structure matching form values
 */
export type TouchedFields<TValues extends FieldValues> = {
  [K in keyof TValues]?: TValues[K] extends object
    ? TouchedFields<TValues[K]>
    : boolean
}

/**
 * Dirty fields object with nested structure matching form values
 */
export type DirtyFields<TValues extends FieldValues> = {
  [K in keyof TValues]?: TValues[K] extends object
    ? DirtyFields<TValues[K]>
    : boolean
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

/**
 * Validation function result
 */
export type ValidateResult = boolean | string | undefined

/**
 * Validation function
 */
export type ValidateFn<TValue = any> = (
  value: TValue,
  formValues: FieldValues
) => ValidateResult | Promise<ValidateResult>

/**
 * Validation rules for a field
 */
export interface ValidationRules<TValue = any> {
  /** Field is required */
  required?: boolean | string

  /** Minimum value (for numbers) */
  min?: number | { value: number; message: string }

  /** Maximum value (for numbers) */
  max?: number | { value: number; message: string }

  /** Minimum length (for strings/arrays) */
  minLength?: number | { value: number; message: string }

  /** Maximum length (for strings/arrays) */
  maxLength?: number | { value: number; message: string }

  /** Pattern to match (for strings) */
  pattern?: RegExp | { value: RegExp; message: string }

  /** Custom validation function(s) */
  validate?: ValidateFn<TValue> | Record<string, ValidateFn<TValue>>

  /** Dependent fields that should trigger revalidation */
  deps?: string[]
}

// ============================================================================
// FORM OPTIONS
// ============================================================================

/**
 * Validation mode - when to validate
 */
export type ValidationMode =
  | 'onSubmit'   // Only validate on submit
  | 'onBlur'     // Validate on blur
  | 'onChange'   // Validate on every change
  | 'onTouched'  // Validate after first blur, then on change
  | 'all'        // Validate on all events

/**
 * Submit handler function
 */
export type SubmitHandler<TValues extends FieldValues> = (
  values: TValues
) => void | Promise<void>

/**
 * Error handler function
 */
export type ErrorHandler<TValues extends FieldValues> = (
  errors: FormErrors<TValues>
) => void

/**
 * Form-level validation function
 */
export type FormValidateFn<TValues extends FieldValues> = (
  values: TValues
) => FormErrors<TValues> | Promise<FormErrors<TValues>>

/**
 * Options for setValue()
 */
export interface SetValueOptions {
  /** Whether to validate after setting value */
  shouldValidate?: boolean
  /** Whether to mark field as dirty */
  shouldDirty?: boolean
  /** Whether to mark field as touched */
  shouldTouch?: boolean
}

/**
 * Options for reset()
 */
export interface ResetOptions {
  /** Keep errors after reset */
  keepErrors?: boolean
  /** Keep dirty state after reset */
  keepDirty?: boolean
  /** Keep touched state after reset */
  keepTouched?: boolean
  /** Keep current values after reset */
  keepValues?: boolean
  /** Keep default values after reset */
  keepDefaultValues?: boolean
  /** Keep submit count after reset */
  keepSubmitCount?: boolean
}

/**
 * Form configuration options
 */
export interface FormOptions<TValues extends FieldValues> {
  /** Initial form values */
  initialValues: TValues

  /** Form-level validation function */
  validate?: FormValidateFn<TValues>

  /** Submit handler */
  onSubmit: SubmitHandler<TValues>

  /** Error handler (called when submit fails validation) */
  onError?: ErrorHandler<TValues>

  /** When to validate fields */
  mode?: ValidationMode

  /** When to revalidate fields after first validation */
  reValidateMode?: ValidationMode

  /** Whether to focus first field with error on submit */
  shouldFocusError?: boolean

  /** Whether to unregister fields on unmount */
  shouldUnregister?: boolean

  /** Delay before showing errors (ms) */
  delayError?: number

  /** Plugins to install */
  plugins?: Plugin<TValues>[]
}

// ============================================================================
// ARRAY FIELD TYPES
// ============================================================================

/**
 * Array field item with unique ID for React keys
 */
export interface FieldArrayItem {
  /** Unique ID for React key */
  id: string
  /** Field data */
  [key: string]: any
}

/**
 * Options for array field operations
 */
export interface FieldArrayOptions {
  /** Whether to focus the field after operation */
  shouldFocus?: boolean
  /** Index to focus */
  focusIndex?: number
  /** Field name to focus */
  focusName?: string
}

/**
 * Array field return type
 */
export interface FieldArrayReturn<
  _TValues extends FieldValues = FieldValues,
  _TName extends FieldPath<_TValues> = FieldPath<_TValues>
> {
  /** Array of fields with unique IDs */
  fields: FieldArrayItem[]

  /** Append item to end of array */
  append: (
    value: any,
    options?: FieldArrayOptions
  ) => void

  /** Prepend item to start of array */
  prepend: (
    value: any,
    options?: FieldArrayOptions
  ) => void

  /** Insert item at index */
  insert: (
    index: number,
    value: any,
    options?: FieldArrayOptions
  ) => void

  /** Remove item(s) at index/indices */
  remove: (index: number | number[]) => void

  /** Swap two items */
  swap: (indexA: number, indexB: number) => void

  /** Move item from one index to another */
  move: (from: number, to: number) => void

  /** Update item at index */
  update: (index: number, value: any) => void

  /** Replace entire array */
  replace: (values: any[]) => void
}

// ============================================================================
// EVENT TYPES
// ============================================================================

/**
 * Event types
 */
export type EventType =
  | 'register'
  | 'unregister'
  | 'change'
  | 'blur'
  | 'focus'
  | 'validate'
  | 'submit'
  | 'submit-success'
  | 'submit-error'
  | 'reset'
  | 'error'
  | 'state-change'

/**
 * Base event interface
 */
export interface BaseEvent {
  type: EventType
  timestamp: number
}

/**
 * Field registration event
 */
export interface RegisterEvent extends BaseEvent {
  type: 'register'
  name: string
  rules?: ValidationRules
}

/**
 * Field unregistration event
 */
export interface UnregisterEvent extends BaseEvent {
  type: 'unregister'
  name: string
}

/**
 * Field value change event
 */
export interface ChangeEvent<TValue = any> extends BaseEvent {
  type: 'change'
  name: string
  value: TValue
  prevValue: TValue
}

/**
 * Field blur event
 */
export interface BlurEvent extends BaseEvent {
  type: 'blur'
  name: string
}

/**
 * Field focus event
 */
export interface FocusEvent extends BaseEvent {
  type: 'focus'
  name: string
}

/**
 * Validation event
 */
export interface ValidateEvent<TValues extends FieldValues> extends BaseEvent {
  type: 'validate'
  name?: string
  errors: FormErrors<TValues>
  isValid: boolean
}

/**
 * Submit event
 */
export interface SubmitEvent<TValues extends FieldValues> extends BaseEvent {
  type: 'submit'
  values: TValues
}

/**
 * Submit success event
 */
export interface SubmitSuccessEvent<TValues extends FieldValues> extends BaseEvent {
  type: 'submit-success'
  values: TValues
}

/**
 * Submit error event
 */
export interface SubmitErrorEvent<TValues extends FieldValues> extends BaseEvent {
  type: 'submit-error'
  errors: FormErrors<TValues>
}

/**
 * Reset event
 */
export interface ResetEvent<TValues extends FieldValues> extends BaseEvent {
  type: 'reset'
  values: TValues
}

/**
 * Error event
 */
export interface ErrorEvent extends BaseEvent {
  type: 'error'
  error: Error
  context: string
}

/**
 * Union of all event types
 */
export type FormEvent<TValues extends FieldValues> =
  | RegisterEvent
  | UnregisterEvent
  | ChangeEvent
  | BlurEvent
  | FocusEvent
  | ValidateEvent<TValues>
  | SubmitEvent<TValues>
  | SubmitSuccessEvent<TValues>
  | SubmitErrorEvent<TValues>
  | ResetEvent<TValues>
  | ErrorEvent

/**
 * Event handler function
 */
export type EventHandler<E extends EventType, TValues extends FieldValues> = (
  event: Extract<FormEvent<TValues>, { type: E }>
) => void

/**
 * Unsubscribe function
 */
export type Unsubscribe = () => void

// ============================================================================
// FORM STATE
// ============================================================================

/**
 * Form state for plugins and external consumption
 */
export interface FormState<TValues extends FieldValues> {
  /** Current form values */
  values: TValues
  /** Current errors */
  errors: FormErrors<TValues>
  /** Touched fields */
  touched: TouchedFields<TValues>
  /** Dirty fields */
  dirty: DirtyFields<TValues>
  /** Whether form is valid */
  isValid: boolean
  /** Whether form is submitting */
  isSubmitting: boolean
  /** Whether last submit was successful */
  isSubmitSuccessful: boolean
  /** Number of submit attempts */
  submitCount: number
}

// ============================================================================
// PLUGIN TYPES
// ============================================================================

/**
 * Plugin hook functions
 */
export interface PluginHooks<TValues extends FieldValues> {
  /** Before field registration */
  beforeRegister?: (name: string, rules?: ValidationRules) => ValidationRules | undefined

  /** After field registration */
  afterRegister?: (name: string, field: FieldState) => void

  /** Before validation */
  beforeValidate?: (values: TValues) => TValues

  /** After validation */
  afterValidate?: (errors: FormErrors<TValues>) => FormErrors<TValues>

  /** Before submit (can cancel by returning false) */
  beforeSubmit?: (values: TValues) => TValues | false

  /** After submit */
  afterSubmit?: (values: TValues, success: boolean) => void

  /** Before reset */
  beforeReset?: (values: DeepPartial<TValues>) => DeepPartial<TValues>

  /** After reset */
  afterReset?: () => void

  /** On value change */
  onValueChange?: (name: string, value: any, prevValue: any) => void

  /** On error change */
  onErrorChange?: (name: string, error: string | undefined) => void

  /** On state change */
  onStateChange?: (state: FormState<TValues>) => void
}

/**
 * Plugin interface
 */
export interface Plugin<TValues extends FieldValues = FieldValues> {
  /** Plugin name (must be unique) */
  name: string

  /** Plugin version */
  version: string

  /** Plugin type */
  type: 'core' | 'optional'

  /** Install function */
  install(kernel: any): void | Promise<void>

  /** Uninstall function */
  uninstall(): void | Promise<void>

  /** Plugin hooks */
  hooks?: PluginHooks<TValues>

  /** Plugin API (exposed to form instance) */
  api?: Record<string, unknown>
}

/**
 * Plugin info
 */
export interface PluginInfo {
  name: string
  version: string
  type: 'core' | 'optional'
  enabled: boolean
}

// ============================================================================
// WATCH TYPES
// ============================================================================

/**
 * Watch callback function
 */
export type WatchCallback<TValue = any> = (
  value: TValue,
  prevValue: TValue
) => void
