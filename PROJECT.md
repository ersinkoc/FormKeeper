# FormKeeper - Zero-Dependency Headless Form State Manager

## Package Identity

- **NPM Package**: `@oxog/formkeeper`
- **GitHub Repository**: `https://github.com/ersinkoc/formkeeper`
- **Documentation Site**: `https://formkeeper.oxog.dev`
- **License**: MIT
- **Author**: Ersin KOÇ
- **Created**: 2025-12-28

**NO social media, Discord, email, or external links.**

## Package Description

Zero-dependency headless form state manager with micro-kernel plugin architecture.

FormKeeper is a lightweight, flexible form management library that handles field registration, validation, state tracking, and submission. Built on a micro-kernel architecture with a powerful plugin system, it supports nested fields, array fields, multi-step wizards, auto-save drafts, and async validation. Framework-agnostic core with dedicated adapters for React, Vue, and Svelte—all in under 5KB with zero runtime dependencies.

---

## NON-NEGOTIABLE RULES

These rules are ABSOLUTE and must be followed without exception:

### 1. ZERO DEPENDENCIES
```json
{
  "dependencies": {}  // MUST BE EMPTY - NO EXCEPTIONS
}
```
Implement EVERYTHING from scratch. No runtime dependencies allowed.

### 2. 100% TEST COVERAGE & 100% SUCCESS RATE
- Every line of code must be tested
- Every branch must be tested
- All tests must pass (100% success rate)
- Use Vitest for testing
- Coverage report must show 100%

### 3. DEVELOPMENT WORKFLOW
Create these documents FIRST, before any code:
1. **SPECIFICATION.md** - Complete package specification
2. **IMPLEMENTATION.md** - Architecture and design decisions
3. **TASKS.md** - Ordered task list with dependencies

Only after these documents are complete, implement the code following TASKS.md sequentially.

### 4. TYPESCRIPT STRICT MODE
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

### 5. NO EXTERNAL LINKS
- ❌ No social media (Twitter, LinkedIn, etc.)
- ❌ No Discord/Slack links
- ❌ No email addresses
- ❌ No donation/sponsor links
- ✅ Only GitHub repo and documentation site allowed

### 6. BUNDLE SIZE TARGET
- Core package: < 5KB minified + gzipped
- With all plugins: < 10KB
- Tree-shakeable

---

## ARCHITECTURE: MICRO-KERNEL + PLUGIN SYSTEM

### Kernel Responsibilities

```typescript
interface Kernel<TValues extends FieldValues = FieldValues> {
  // Field registration
  register<TName extends FieldPath<TValues>>(
    name: TName,
    rules?: ValidationRules
  ): FieldRegistration
  unregister(name: string): void
  
  // Values
  getValues(): TValues
  getValues<TName extends FieldPath<TValues>>(name: TName): FieldPathValue<TValues, TName>
  setValue<TName extends FieldPath<TValues>>(
    name: TName,
    value: FieldPathValue<TValues, TName>,
    options?: SetValueOptions
  ): void
  setValues(values: DeepPartial<TValues>, options?: SetValueOptions): void
  
  // Errors
  getErrors(): FormErrors<TValues>
  getError<TName extends FieldPath<TValues>>(name: TName): string | undefined
  setError<TName extends FieldPath<TValues>>(name: TName, error: string): void
  clearError<TName extends FieldPath<TValues>>(name: TName): void
  clearErrors(): void
  
  // Touched & Dirty
  getTouched(): TouchedFields<TValues>
  isTouched<TName extends FieldPath<TValues>>(name: TName): boolean
  setTouched<TName extends FieldPath<TValues>>(name: TName, touched?: boolean): void
  getDirty(): DirtyFields<TValues>
  isDirty<TName extends FieldPath<TValues>>(name?: TName): boolean
  
  // Validation
  validate(): Promise<boolean>
  validateField<TName extends FieldPath<TValues>>(name: TName): Promise<boolean>
  isValid(): boolean
  
  // Submit
  submit(): Promise<void>
  handleSubmit(e?: Event): Promise<void>
  isSubmitting(): boolean
  isSubmitSuccessful(): boolean
  getSubmitCount(): number
  
  // Reset
  reset(values?: DeepPartial<TValues>, options?: ResetOptions): void
  resetField<TName extends FieldPath<TValues>>(name: TName, options?: ResetOptions): void
  
  // Watch
  watch<TName extends FieldPath<TValues>>(
    name: TName,
    callback: WatchCallback<FieldPathValue<TValues, TName>>
  ): Unsubscribe
  watch(callback: WatchCallback<TValues>): Unsubscribe
  
  // Focus
  setFocus<TName extends FieldPath<TValues>>(name: TName): void
  
  // Array fields
  useFieldArray<TName extends FieldPath<TValues>>(
    name: TName
  ): FieldArrayReturn<TValues, TName>
  
  // Plugin management
  register(plugin: Plugin<TValues>): void
  unregister(pluginName: string): void
  getPlugin<P extends Plugin<TValues>>(name: string): P | undefined
  listPlugins(): PluginInfo[]
  
  // Event system
  emit(event: FormEvent<TValues>): void
  on<E extends EventType>(eventType: E, handler: EventHandler<E, TValues>): Unsubscribe
  off<E extends EventType>(eventType: E, handler: EventHandler<E, TValues>): void
  
  // Lifecycle
  destroy(): void
  
  // Configuration
  getOptions(): FormOptions<TValues>
}

interface FormOptions<TValues extends FieldValues> {
  initialValues: TValues
  validate?: FormValidateFn<TValues>
  onSubmit: SubmitHandler<TValues>
  onError?: ErrorHandler<TValues>
  mode?: ValidationMode
  reValidateMode?: ValidationMode
  shouldFocusError?: boolean
  shouldUnregister?: boolean
  delayError?: number
  plugins?: Plugin<TValues>[]
}

type ValidationMode = 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all'
type SubmitHandler<TValues> = (values: TValues) => void | Promise<void>
type ErrorHandler<TValues> = (errors: FormErrors<TValues>) => void
type FormValidateFn<TValues> = (values: TValues) => FormErrors<TValues> | Promise<FormErrors<TValues>>
```

### Field Types

```typescript
// Base field values type
type FieldValues = Record<string, any>

// Field path for nested access (e.g., 'user.profile.name')
type FieldPath<TValues> = string

// Get value type at path
type FieldPathValue<TValues, TPath extends FieldPath<TValues>> = any

// Deep partial for reset/setValues
type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

// Field registration return
interface FieldRegistration {
  name: string
  ref: (element: HTMLElement | null) => void
  onChange: (event: ChangeEvent) => void
  onBlur: (event: FocusEvent) => void
  onFocus: (event: FocusEvent) => void
  value: any
  disabled?: boolean
}

// Field state
interface FieldState {
  value: any
  error: string | undefined
  touched: boolean
  dirty: boolean
  validating: boolean
}

// Form errors
type FormErrors<TValues> = {
  [K in keyof TValues]?: TValues[K] extends object
    ? FormErrors<TValues[K]>
    : string
}

// Touched fields
type TouchedFields<TValues> = {
  [K in keyof TValues]?: TValues[K] extends object
    ? TouchedFields<TValues[K]>
    : boolean
}

// Dirty fields
type DirtyFields<TValues> = {
  [K in keyof TValues]?: TValues[K] extends object
    ? DirtyFields<TValues[K]>
    : boolean
}

// Set value options
interface SetValueOptions {
  shouldValidate?: boolean
  shouldDirty?: boolean
  shouldTouch?: boolean
}

// Reset options
interface ResetOptions {
  keepErrors?: boolean
  keepDirty?: boolean
  keepTouched?: boolean
  keepValues?: boolean
  keepDefaultValues?: boolean
  keepSubmitCount?: boolean
}
```

### Validation Rules

```typescript
interface ValidationRules<TValue = any> {
  required?: boolean | string
  min?: number | { value: number; message: string }
  max?: number | { value: number; message: string }
  minLength?: number | { value: number; message: string }
  maxLength?: number | { value: number; message: string }
  pattern?: RegExp | { value: RegExp; message: string }
  validate?: ValidateFn<TValue> | Record<string, ValidateFn<TValue>>
  deps?: string[]  // Dependent fields (revalidate when they change)
}

type ValidateFn<TValue = any> = (
  value: TValue,
  formValues: FieldValues
) => ValidateResult | Promise<ValidateResult>

type ValidateResult = boolean | string | undefined

// Built-in rule messages
const defaultMessages = {
  required: 'This field is required',
  min: (min: number) => `Value must be at least ${min}`,
  max: (max: number) => `Value must be at most ${max}`,
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be at most ${max} characters`,
  pattern: 'Invalid format',
}
```

### Array Fields

```typescript
interface FieldArrayReturn<TValues extends FieldValues, TName extends FieldPath<TValues>> {
  fields: FieldArrayItem[]
  append: (value: ArrayFieldValue<TValues, TName>, options?: FieldArrayOptions) => void
  prepend: (value: ArrayFieldValue<TValues, TName>, options?: FieldArrayOptions) => void
  insert: (index: number, value: ArrayFieldValue<TValues, TName>, options?: FieldArrayOptions) => void
  remove: (index: number | number[]) => void
  swap: (indexA: number, indexB: number) => void
  move: (from: number, to: number) => void
  update: (index: number, value: ArrayFieldValue<TValues, TName>) => void
  replace: (values: ArrayFieldValue<TValues, TName>[]) => void
}

interface FieldArrayItem {
  id: string  // Unique key for React
  [key: string]: any
}

interface FieldArrayOptions {
  shouldFocus?: boolean
  focusIndex?: number
  focusName?: string
}
```

### Plugin Interface

```typescript
interface Plugin<TValues extends FieldValues = FieldValues> {
  // Identity
  name: string
  version: string
  type: 'core' | 'optional'
  
  // Lifecycle
  install(kernel: Kernel<TValues>): void | Promise<void>
  uninstall(): void | Promise<void>
  
  // Hooks (all optional)
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
  
  // Plugin can expose its own API
  api?: Record<string, unknown>
}

interface PluginInfo {
  name: string
  version: string
  type: 'core' | 'optional'
  enabled: boolean
}

// Form state for plugins
interface FormState<TValues> {
  values: TValues
  errors: FormErrors<TValues>
  touched: TouchedFields<TValues>
  dirty: DirtyFields<TValues>
  isValid: boolean
  isSubmitting: boolean
  isSubmitSuccessful: boolean
  submitCount: number
}
```

### Event Types

```typescript
type EventType =
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

interface RegisterEvent {
  type: 'register'
  name: string
  rules?: ValidationRules
  timestamp: number
}

interface ChangeEvent<TValue = any> {
  type: 'change'
  name: string
  value: TValue
  prevValue: TValue
  timestamp: number
}

interface BlurEvent {
  type: 'blur'
  name: string
  timestamp: number
}

interface FocusEvent {
  type: 'focus'
  name: string
  timestamp: number
}

interface ValidateEvent<TValues> {
  type: 'validate'
  name?: string  // undefined = form-level
  errors: FormErrors<TValues>
  isValid: boolean
  timestamp: number
}

interface SubmitEvent<TValues> {
  type: 'submit'
  values: TValues
  timestamp: number
}

interface SubmitSuccessEvent<TValues> {
  type: 'submit-success'
  values: TValues
  timestamp: number
}

interface SubmitErrorEvent<TValues> {
  type: 'submit-error'
  errors: FormErrors<TValues>
  timestamp: number
}

interface ResetEvent<TValues> {
  type: 'reset'
  values: TValues
  timestamp: number
}

interface ErrorEvent {
  type: 'error'
  error: Error
  context: string
  timestamp: number
}

type FormEvent<TValues> =
  | RegisterEvent
  | ChangeEvent
  | BlurEvent
  | FocusEvent
  | ValidateEvent<TValues>
  | SubmitEvent<TValues>
  | SubmitSuccessEvent<TValues>
  | SubmitErrorEvent<TValues>
  | ResetEvent<TValues>
  | ErrorEvent

type EventHandler<E extends EventType, TValues> = (
  event: Extract<FormEvent<TValues>, { type: E }>
) => void

type Unsubscribe = () => void
```

---

## CORE PLUGINS (5 Total - Always Loaded)

### 1. field-registry

Field registration and ref management.

```typescript
interface FieldRegistryAPI {
  register(name: string, rules?: ValidationRules): FieldRegistration
  unregister(name: string): void
  getField(name: string): FieldState | undefined
  getFields(): Map<string, FieldState>
  getRegisteredNames(): string[]
  isRegistered(name: string): boolean
  setRef(name: string, element: HTMLElement | null): void
  getRef(name: string): HTMLElement | null
}

interface FieldRegistryOptions {
  shouldUnregister?: boolean  // Unregister on unmount (default: false)
}
```

**Implementation Notes:**
- Store field refs for focus management
- Handle nested paths (user.profile.name)
- Track registration order
- Clean up on unregister

### 2. state-manager

Values, touched, dirty state management.

```typescript
interface StateManagerAPI<TValues> {
  // Values
  getValues(): TValues
  getValue(name: string): any
  setValue(name: string, value: any, options?: SetValueOptions): void
  setValues(values: DeepPartial<TValues>, options?: SetValueOptions): void
  
  // Touched
  getTouched(): TouchedFields<TValues>
  isTouched(name: string): boolean
  setTouched(name: string, touched?: boolean): void
  
  // Dirty
  getDirty(): DirtyFields<TValues>
  isDirty(name?: string): boolean
  
  // Initial values
  getDefaultValues(): TValues
  setDefaultValues(values: TValues): void
  
  // Reset
  reset(values?: DeepPartial<TValues>, options?: ResetOptions): void
  resetField(name: string, options?: ResetOptions): void
}

interface StateManagerOptions<TValues> {
  initialValues: TValues
}
```

**Implementation Notes:**
- Deep clone initial values
- Track dirty by comparing to initial
- Support dot notation for nested access
- Efficient updates with minimal cloning

### 3. validation-engine

Sync and async validation with rules.

```typescript
interface ValidationEngineAPI<TValues> {
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

interface ValidationEngineOptions {
  mode: ValidationMode
  reValidateMode: ValidationMode
  delayError?: number
}
```

**Validation Flow:**
```
Field Change
    ↓
Check mode (onChange/onBlur/etc)
    ↓
Run field rules (required, min, max, pattern)
    ↓
Run custom validate functions
    ↓
Run form-level validate
    ↓
Update errors state
```

**Implementation Notes:**
- Queue async validations
- Debounce rapid changes
- Support dependent field validation
- Abort previous validation on new input

### 4. array-fields

Dynamic field array management.

```typescript
interface ArrayFieldsAPI {
  useFieldArray(name: string): FieldArrayReturn<any, any>
  getArrayFields(name: string): FieldArrayItem[]
  appendField(name: string, value: any): void
  prependField(name: string, value: any): void
  insertField(name: string, index: number, value: any): void
  removeField(name: string, index: number | number[]): void
  swapFields(name: string, indexA: number, indexB: number): void
  moveField(name: string, from: number, to: number): void
  updateField(name: string, index: number, value: any): void
  replaceFields(name: string, values: any[]): void
}
```

**Implementation Notes:**
- Generate unique IDs for React keys
- Handle nested array fields
- Update validation on array changes
- Preserve touched/dirty state on reorder

### 5. submit-handler

Form submission handling.

```typescript
interface SubmitHandlerAPI<TValues> {
  submit(): Promise<void>
  handleSubmit(e?: Event): Promise<void>
  isSubmitting(): boolean
  isSubmitSuccessful(): boolean
  getSubmitCount(): number
  setSubmitting(submitting: boolean): void
}

interface SubmitHandlerOptions<TValues> {
  onSubmit: SubmitHandler<TValues>
  onError?: ErrorHandler<TValues>
  shouldFocusError?: boolean
}
```

**Submit Flow:**
```
handleSubmit()
    ↓
Prevent default
    ↓
Set isSubmitting = true
    ↓
Validate all fields
    ↓
[If invalid] → Focus first error, call onError
    ↓
[If valid] → Call onSubmit
    ↓
Set isSubmitSuccessful
    ↓
Set isSubmitting = false
```

---

## OPTIONAL PLUGINS (6 Total)

### 6. wizard

Multi-step form wizard.

```typescript
import { wizard } from '@oxog/formkeeper/plugins'

const form = createForm({
  initialValues: { ... },
  plugins: [wizard({
    steps: [
      { id: 'personal', fields: ['name', 'email'] },
      { id: 'address', fields: ['street', 'city', 'zip'] },
      { id: 'payment', fields: ['cardNumber', 'expiry', 'cvv'] },
    ],
    validateOnStepChange: true,
  })],
})

interface WizardOptions {
  steps: WizardStep[]
  validateOnStepChange?: boolean
  allowSkip?: boolean
  linear?: boolean  // Must complete steps in order
}

interface WizardStep {
  id: string
  fields: string[]
  validate?: () => Promise<boolean> | boolean
  canEnter?: () => boolean
  canLeave?: () => boolean
}

interface WizardAPI {
  // Navigation
  next(): Promise<boolean>
  prev(): boolean
  goTo(stepId: string): Promise<boolean>
  
  // State
  currentStep: WizardStep
  currentIndex: number
  steps: WizardStep[]
  isFirstStep: boolean
  isLastStep: boolean
  
  // Checks
  canNext(): boolean
  canPrev(): boolean
  canGoTo(stepId: string): boolean
  
  // Progress
  getProgress(): number  // 0-100
  getCompletedSteps(): string[]
  isStepComplete(stepId: string): boolean
  isStepValid(stepId: string): Promise<boolean>
}

// React usage
function MultiStepForm() {
  const form = useForm({ plugins: [wizard({ steps: [...] })] })
  const { currentStep, next, prev, isLastStep, getProgress } = form.wizard
  
  return (
    <div>
      <ProgressBar value={getProgress()} />
      
      {currentStep.id === 'personal' && <PersonalStep />}
      {currentStep.id === 'address' && <AddressStep />}
      {currentStep.id === 'payment' && <PaymentStep />}
      
      <div>
        <button onClick={prev} disabled={form.wizard.isFirstStep}>Back</button>
        {isLastStep ? (
          <button onClick={form.submit}>Submit</button>
        ) : (
          <button onClick={next}>Next</button>
        )}
      </div>
    </div>
  )
}
```

### 7. autosave

Auto-save form drafts to storage.

```typescript
import { autosave } from '@oxog/formkeeper/plugins'

const form = createForm({
  plugins: [autosave({
    key: 'contact-form-draft',
    storage: localStorage,
    debounce: 1000,
    exclude: ['password', 'cvv'],
    encrypt: false,
  })],
})

interface AutosaveOptions {
  key: string
  storage?: Storage  // Default: localStorage
  debounce?: number  // Default: 1000ms
  include?: string[]  // Only save these fields
  exclude?: string[]  // Don't save these fields
  serialize?: (values: any) => string
  deserialize?: (data: string) => any
  encrypt?: boolean
  encryptionKey?: string
  onSave?: (values: any) => void
  onRestore?: (values: any) => void
  onError?: (error: Error) => void
}

interface AutosaveAPI {
  save(): void
  restore(): boolean  // Returns true if draft found
  clear(): void
  hasDraft(): boolean
  getDraft(): any | null
  getLastSavedAt(): Date | null
  pause(): void
  resume(): void
  isPaused(): boolean
}

// Usage
form.autosave.hasDraft()  // true
form.autosave.restore()   // Restore saved values
form.autosave.clear()     // Clear draft
```

### 8. persist

Persist complete form state to storage.

```typescript
import { persist } from '@oxog/formkeeper/plugins'

const form = createForm({
  plugins: [persist({
    key: 'form-state',
    storage: sessionStorage,
    include: ['values', 'touched', 'errors'],
  })],
})

interface PersistOptions {
  key: string
  storage?: Storage
  include?: ('values' | 'touched' | 'dirty' | 'errors')[]
  debounce?: number
  version?: number
  migrate?: (oldState: any, oldVersion: number) => any
}

interface PersistAPI {
  save(): void
  restore(): boolean
  clear(): void
  getPersistedState(): any | null
}
```

### 9. schema

Schema-based validation integration.

```typescript
import { schema } from '@oxog/formkeeper/plugins'
import { z } from 'zod'  // Or any schema library

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const form = createForm({
  plugins: [schema({
    schema: userSchema,
    adapter: 'zod',  // 'zod' | 'yup' | 'custom'
  })],
})

interface SchemaOptions<TSchema> {
  schema: TSchema
  adapter: 'zod' | 'yup' | 'joi' | 'custom'
  parseAsync?: boolean
  abortEarly?: boolean
  customAdapter?: SchemaAdapter
}

interface SchemaAdapter {
  validate(schema: any, values: any): Promise<{ success: boolean; errors?: any }>
  getFieldError(errors: any, field: string): string | undefined
}

// Custom adapter example
const customAdapter: SchemaAdapter = {
  validate: async (schema, values) => {
    const result = schema.safeParse(values)
    return {
      success: result.success,
      errors: result.success ? undefined : result.error.issues,
    }
  },
  getFieldError: (errors, field) => {
    const issue = errors?.find((e: any) => e.path.join('.') === field)
    return issue?.message
  },
}
```

### 10. focus-manager

Focus management and error focusing.

```typescript
import { focusManager } from '@oxog/formkeeper/plugins'

const form = createForm({
  plugins: [focusManager({
    focusFirstError: true,
    scrollToError: true,
    scrollOffset: 100,
  })],
})

interface FocusManagerOptions {
  focusFirstError?: boolean
  scrollToError?: boolean
  scrollOffset?: number
  scrollBehavior?: ScrollBehavior
  focusOnMount?: string  // Field to focus on mount
}

interface FocusManagerAPI {
  focus(name: string): void
  focusFirstError(): void
  focusNext(): void
  focusPrev(): void
  getFocusedField(): string | null
  getTabOrder(): string[]
  setTabOrder(order: string[]): void
}
```

### 11. form-devtools

Visual debugging panel.

```typescript
import { formDevtools, FormDevtoolsPanel } from '@oxog/formkeeper/plugins'

const form = createForm({
  plugins: [formDevtools({
    position: 'bottom-right',
    shortcut: 'ctrl+shift+f',
  })],
})

// React component
<FormDevtoolsPanel />

interface FormDevtoolsOptions {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  shortcut: string
  draggable: boolean
  resizable: boolean
  theme: 'dark' | 'light' | 'auto'
  defaultOpen: boolean
}

interface FormDevtoolsAPI {
  open(): void
  close(): void
  toggle(): void
  isOpen(): boolean
}
```

**DevTools Panel Layout:**
```
┌─ FormKeeper DevTools ───────────── [_] [□] [×]
├─────────────────────────────────────────────────
│  Form: loginForm          Status: ⚠️ Invalid
│  Submit: 0 │ Dirty: 2 │ Touched: 1 │ Errors: 1
├─────────────────────────────────────────────────
│  📊 Values                              [Copy]
│  ┌──────────────────────────────────────────┐
│  │ {                                        │
│  │   "email": "test@example.com",           │
│  │   "password": "",                        │
│  │   "remember": false                      │
│  │ }                                        │
│  └──────────────────────────────────────────┘
├─────────────────────────────────────────────────
│  📋 Fields
│  ┌──────────────────────────────────────────┐
│  │ Field      │ Value  │ T │ D │ Error     │
│  ├────────────┼────────┼───┼───┼───────────│
│  │ ✅ email   │ test@..│ ✓ │ ✓ │ -         │
│  │ ❌ password│ ""     │ ✗ │ ✗ │ Required  │
│  │ ✅ remember│ false  │ ✗ │ ✗ │ -         │
│  └──────────────────────────────────────────┘
├─────────────────────────────────────────────────
│  ⚠️ Errors
│  ┌──────────────────────────────────────────┐
│  │ password: "Password is required"         │
│  └──────────────────────────────────────────┘
├─────────────────────────────────────────────────
│  [🔄 Reset] [📋 Copy] [🗑️ Clear] [⏸️ Pause]
└─────────────────────────────────────────────────
```

---

## FRAMEWORK ADAPTERS

### 12. React Adapter (`@oxog/formkeeper/react`)

```tsx
import {
  FormProvider,
  useForm,
  useFormContext,
  useField,
  useFieldArray,
  useWatch,
  useFormState,
  Controller,
} from '@oxog/formkeeper/react'

// useForm hook
function LoginForm() {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },
    validate: (values) => {
      const errors: FormErrors = {}
      if (!values.email) errors.email = 'Email is required'
      if (!values.password) errors.password = 'Password is required'
      return errors
    },
    onSubmit: async (values) => {
      await api.login(values)
    },
    mode: 'onBlur',
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <EmailField />
        <PasswordField />
        <RememberField />
        <SubmitButton />
      </form>
    </FormProvider>
  )
}

// useField hook
function EmailField() {
  const {
    register,
    value,
    error,
    touched,
    dirty,
    validating,
  } = useField('email', {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format',
    },
  })

  return (
    <div className="field">
      <label htmlFor="email">Email</label>
      <input
        {...register()}
        type="email"
        id="email"
        className={error && touched ? 'error' : ''}
      />
      {touched && error && <span className="error-message">{error}</span>}
    </div>
  )
}

// useFormContext
function SubmitButton() {
  const { isSubmitting, isValid, isDirty } = useFormContext()
  
  return (
    <button
      type="submit"
      disabled={isSubmitting || !isDirty}
    >
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  )
}

// useWatch hook
function PriceCalculator() {
  const quantity = useWatch('quantity')
  const price = useWatch('price')
  const total = (quantity || 0) * (price || 0)
  
  return <div>Total: ${total.toFixed(2)}</div>
}

// useWatch with callback
function PriceLogger() {
  useWatch('price', (value, prevValue) => {
    console.log(`Price changed: ${prevValue} → ${value}`)
  })
  
  return null
}

// useFormState (subscribe to specific state)
function ErrorSummary() {
  const { errors, isValid, submitCount } = useFormState({
    select: ['errors', 'isValid', 'submitCount'],
  })
  
  if (isValid || submitCount === 0) return null
  
  return (
    <div className="error-summary">
      <h4>Please fix the following errors:</h4>
      <ul>
        {Object.entries(errors).map(([field, error]) => (
          <li key={field}>{error}</li>
        ))}
      </ul>
    </div>
  )
}

// Controller for custom inputs
function RatingField() {
  return (
    <Controller
      name="rating"
      rules={{ required: 'Rating is required', min: 1, max: 5 }}
      render={({ field, fieldState }) => (
        <div>
          <StarRating
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
          {fieldState.error && (
            <span className="error">{fieldState.error}</span>
          )}
        </div>
      )}
    />
  )
}

// useFieldArray
function ItemsList() {
  const { fields, append, remove, swap, move } = useFieldArray('items')

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="item-row">
          <ItemField index={index} />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append({ name: '', price: 0 })}>
        Add Item
      </button>
    </div>
  )
}

function ItemField({ index }: { index: number }) {
  const nameField = useField(`items.${index}.name`, { required: 'Required' })
  const priceField = useField(`items.${index}.price`, { min: 0 })

  return (
    <>
      <input {...nameField.register()} placeholder="Name" />
      <input {...priceField.register()} type="number" placeholder="Price" />
    </>
  )
}

// Types
interface UseFormOptions<TValues extends FieldValues> {
  initialValues: TValues
  validate?: FormValidateFn<TValues>
  onSubmit: SubmitHandler<TValues>
  onError?: ErrorHandler<TValues>
  mode?: ValidationMode
  reValidateMode?: ValidationMode
  shouldFocusError?: boolean
  shouldUnregister?: boolean
  delayError?: number
  plugins?: Plugin<TValues>[]
}

interface UseFormReturn<TValues extends FieldValues> {
  // Kernel methods
  register: Kernel<TValues>['register']
  setValue: Kernel<TValues>['setValue']
  setValues: Kernel<TValues>['setValues']
  getValues: Kernel<TValues>['getValues']
  setError: Kernel<TValues>['setError']
  clearErrors: Kernel<TValues>['clearErrors']
  reset: Kernel<TValues>['reset']
  setFocus: Kernel<TValues>['setFocus']
  
  // Form handlers
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  
  // State
  formState: FormState<TValues>
  
  // Plugins
  wizard?: WizardAPI  // If wizard plugin installed
  autosave?: AutosaveAPI  // If autosave plugin installed
}

interface UseFieldOptions extends ValidationRules {
  defaultValue?: any
}

interface UseFieldReturn {
  register: () => FieldRegistration
  value: any
  error: string | undefined
  touched: boolean
  dirty: boolean
  validating: boolean
  invalid: boolean
  setValue: (value: any) => void
  setError: (error: string) => void
  clearError: () => void
  setTouched: (touched?: boolean) => void
}

interface ControllerProps {
  name: string
  rules?: ValidationRules
  defaultValue?: any
  render: (props: ControllerRenderProps) => React.ReactElement
}

interface ControllerRenderProps {
  field: {
    name: string
    value: any
    onChange: (value: any) => void
    onBlur: () => void
    ref: React.Ref<any>
  }
  fieldState: {
    error: string | undefined
    touched: boolean
    dirty: boolean
    invalid: boolean
  }
  formState: FormState<any>
}
```

### 13. Vue Adapter (`@oxog/formkeeper/vue`)

```typescript
import {
  createForm,
  useForm,
  useField,
  useFieldArray,
  useWatch,
  useFormState,
  provideForm,
  injectForm,
} from '@oxog/formkeeper/vue'

// Composition API
const form = useForm({
  initialValues: { email: '', password: '' },
  onSubmit: async (values) => { ... },
})

// Field
const email = useField('email', {
  required: 'Email is required',
})

// Template usage
<template>
  <form @submit.prevent="form.handleSubmit">
    <div>
      <input
        v-bind="email.register()"
        type="email"
        :class="{ error: email.touched && email.error }"
      />
      <span v-if="email.touched && email.error" class="error">
        {{ email.error }}
      </span>
    </div>
    
    <button type="submit" :disabled="form.isSubmitting">
      {{ form.isSubmitting ? 'Submitting...' : 'Submit' }}
    </button>
  </form>
</template>

<script setup>
import { useForm, useField } from '@oxog/formkeeper/vue'

const form = useForm({
  initialValues: { email: '', password: '' },
  onSubmit: async (values) => {
    await api.login(values)
  },
})

const email = useField('email', { required: 'Required' })
const password = useField('password', { required: 'Required', minLength: 8 })
</script>

// useWatch
const price = useWatch('price')  // Ref<number>

// useFormState
const { errors, isValid, isSubmitting } = useFormState()

// Provide/Inject pattern
// Parent
provideForm(form)

// Child
const form = injectForm()
```

### 14. Svelte Adapter (`@oxog/formkeeper/svelte`)

```typescript
import {
  createFormStore,
  fieldStore,
  formState,
} from '@oxog/formkeeper/svelte'

// Create form store
const form = createFormStore({
  initialValues: { email: '', password: '' },
  onSubmit: async (values) => {
    await api.login(values)
  },
})

// Svelte component
<script>
  import { createFormStore, fieldStore } from '@oxog/formkeeper/svelte'
  
  const form = createFormStore({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      await api.login(values)
    },
  })
  
  const email = fieldStore(form, 'email', { required: 'Required' })
  const password = fieldStore(form, 'password', { required: 'Required' })
</script>

<form on:submit|preventDefault={$form.handleSubmit}>
  <div>
    <input
      {...$email.register()}
      type="email"
      class:error={$email.touched && $email.error}
    />
    {#if $email.touched && $email.error}
      <span class="error">{$email.error}</span>
    {/if}
  </div>
  
  <div>
    <input
      {...$password.register()}
      type="password"
    />
    {#if $password.touched && $password.error}
      <span class="error">{$password.error}</span>
    {/if}
  </div>
  
  <button type="submit" disabled={$form.isSubmitting}>
    {$form.isSubmitting ? 'Submitting...' : 'Submit'}
  </button>
</form>

// Store types
interface FormStore<TValues> extends Readable<FormStoreValue<TValues>> {
  register: Kernel<TValues>['register']
  setValue: Kernel<TValues>['setValue']
  setError: Kernel<TValues>['setError']
  reset: Kernel<TValues>['reset']
  submit: Kernel<TValues>['submit']
  handleSubmit: (e?: Event) => Promise<void>
}

interface FormStoreValue<TValues> {
  values: TValues
  errors: FormErrors<TValues>
  touched: TouchedFields<TValues>
  dirty: DirtyFields<TValues>
  isValid: boolean
  isSubmitting: boolean
  isSubmitSuccessful: boolean
  submitCount: number
}

interface FieldStore extends Readable<FieldStoreValue> {
  register: () => FieldRegistration
  setValue: (value: any) => void
  setError: (error: string) => void
  clearError: () => void
  setTouched: (touched?: boolean) => void
}

interface FieldStoreValue {
  value: any
  error: string | undefined
  touched: boolean
  dirty: boolean
  validating: boolean
}
```

---

## PUBLIC API (Vanilla JS)

```typescript
// Main exports
import {
  // Factory
  createForm,
  
  // Types
  type Form,
  type FormOptions,
  type FieldValues,
  type FieldPath,
  type FieldRegistration,
  type FieldState,
  type FormErrors,
  type ValidationRules,
  type Plugin,
} from '@oxog/formkeeper'

// Create form
const form = createForm<FormValues>({
  initialValues: {
    email: '',
    password: '',
    profile: {
      name: '',
      age: 0,
    },
    items: [],
  },
  
  validate: (values) => {
    const errors: FormErrors<FormValues> = {}
    if (!values.email) errors.email = 'Required'
    return errors
  },
  
  onSubmit: async (values) => {
    await api.submit(values)
  },
  
  mode: 'onBlur',
  shouldFocusError: true,
  plugins: [],
})

// Register fields
const emailField = form.register('email', {
  required: 'Email is required',
  pattern: { value: /email-regex/, message: 'Invalid email' },
})

const nameField = form.register('profile.name', {
  required: 'Name is required',
  minLength: { value: 2, message: 'Min 2 chars' },
})

// Values
form.getValues()                    // All values
form.getValues('email')             // Single value
form.setValue('email', 'test@example.com')
form.setValues({ email: 'test@example.com', password: '123' })

// Errors
form.getErrors()                    // All errors
form.getError('email')              // Single error
form.setError('email', 'Already exists')
form.clearError('email')
form.clearErrors()

// State
form.isTouched('email')
form.isDirty('email')
form.isDirty()                      // Any field dirty
form.isValid()
form.isSubmitting()

// Validation
await form.validate()               // Validate all
await form.validateField('email')   // Validate one

// Submit
await form.submit()
form.handleSubmit(event)            // For form onSubmit

// Reset
form.reset()
form.reset({ email: 'default@example.com' })
form.resetField('email')

// Watch
const unwatch = form.watch('email', (value, prevValue) => {
  console.log('Email changed:', value)
})

// Array fields
const { fields, append, remove } = form.useFieldArray('items')
append({ name: '', price: 0 })
remove(0)

// Events
form.on('change', (e) => console.log('Changed:', e.name, e.value))
form.on('submit', (e) => console.log('Submitted:', e.values))
form.on('error', (e) => console.error('Error:', e))

// Focus
form.setFocus('email')

// Cleanup
form.destroy()
```

---

## TECHNICAL REQUIREMENTS

- **Runtime**: Browser + Node.js (SSR safe)
- **Module Format**: ESM + CJS (dual package)
- **Node.js Version**: >= 18 (for build/test)
- **TypeScript Version**: >= 5.0, strict mode
- **Bundle Size**: < 5KB core, < 10KB with plugins
- **Full Generic Support**: Type-safe field paths

### Package Exports

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./plugins": {
      "import": "./dist/plugins/index.js",
      "require": "./dist/plugins/index.cjs"
    },
    "./react": {
      "import": "./dist/react/index.js",
      "require": "./dist/react/index.cjs"
    },
    "./vue": {
      "import": "./dist/vue/index.js",
      "require": "./dist/vue/index.cjs"
    },
    "./svelte": {
      "import": "./dist/svelte/index.js",
      "require": "./dist/svelte/index.cjs"
    }
  }
}
```

### Peer Dependencies

```json
{
  "peerDependencies": {
    "react": ">=17.0.0",
    "vue": ">=3.0.0",
    "svelte": ">=3.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true },
    "vue": { "optional": true },
    "svelte": { "optional": true }
  }
}
```

---

## PROJECT STRUCTURE

```
formkeeper/
├── src/
│   ├── index.ts                    # Main entry, exports
│   ├── types.ts                    # All type definitions
│   │
│   ├── kernel/                     # Micro-kernel core
│   │   ├── index.ts
│   │   ├── kernel.ts               # Kernel implementation
│   │   ├── event-bus.ts            # Event system
│   │   └── plugin-registry.ts      # Plugin management
│   │
│   ├── plugins/                    # All plugins
│   │   ├── index.ts                # Optional plugins export
│   │   ├── core/                   # Core plugins (bundled)
│   │   │   ├── index.ts
│   │   │   ├── field-registry.ts
│   │   │   ├── state-manager.ts
│   │   │   ├── validation-engine.ts
│   │   │   ├── array-fields.ts
│   │   │   └── submit-handler.ts
│   │   │
│   │   └── optional/               # Optional plugins
│   │       ├── index.ts
│   │       ├── wizard.ts
│   │       ├── autosave.ts
│   │       ├── persist.ts
│   │       ├── schema.ts
│   │       ├── focus-manager.ts
│   │       └── form-devtools/
│   │           ├── index.ts
│   │           ├── panel.tsx
│   │           ├── components/
│   │           │   ├── values-view.tsx
│   │           │   ├── fields-table.tsx
│   │           │   ├── errors-view.tsx
│   │           │   └── controls.tsx
│   │           ├── styles/
│   │           │   └── panel.css
│   │           └── utils/
│   │               ├── shadow-dom.ts
│   │               ├── draggable.ts
│   │               └── resizable.ts
│   │
│   ├── adapters/                   # Framework adapters
│   │   ├── react/
│   │   │   ├── index.ts
│   │   │   ├── provider.tsx
│   │   │   ├── context.ts
│   │   │   ├── use-form.ts
│   │   │   ├── use-field.ts
│   │   │   ├── use-field-array.ts
│   │   │   ├── use-watch.ts
│   │   │   ├── use-form-state.ts
│   │   │   └── controller.tsx
│   │   │
│   │   ├── vue/
│   │   │   ├── index.ts
│   │   │   ├── use-form.ts
│   │   │   ├── use-field.ts
│   │   │   ├── use-field-array.ts
│   │   │   ├── use-watch.ts
│   │   │   ├── use-form-state.ts
│   │   │   └── provide-inject.ts
│   │   │
│   │   └── svelte/
│   │       ├── index.ts
│   │       ├── form-store.ts
│   │       ├── field-store.ts
│   │       └── form-state.ts
│   │
│   └── utils/                      # Internal utilities
│       ├── index.ts
│       ├── path.ts                 # Dot notation path utils
│       ├── deep-get.ts
│       ├── deep-set.ts
│       ├── deep-clone.ts
│       ├── deep-equal.ts
│       ├── uid.ts
│       └── debounce.ts
│
├── tests/
│   ├── unit/
│   │   ├── kernel/
│   │   ├── plugins/
│   │   │   ├── core/
│   │   │   └── optional/
│   │   ├── adapters/
│   │   │   ├── react/
│   │   │   ├── vue/
│   │   │   └── svelte/
│   │   └── utils/
│   ├── integration/
│   │   ├── form-validation.test.ts
│   │   ├── array-fields.test.ts
│   │   ├── nested-fields.test.ts
│   │   ├── wizard.test.ts
│   │   └── autosave.test.ts
│   └── fixtures/
│       ├── test-forms.ts
│       └── test-schemas.ts
│
├── examples/
│   ├── vanilla/
│   │   ├── basic-form/
│   │   ├── validation/
│   │   └── array-fields/
│   ├── react/
│   │   ├── login-form/
│   │   ├── registration/
│   │   ├── multi-step/
│   │   └── dynamic-form/
│   ├── vue/
│   │   ├── login-form/
│   │   └── checkout/
│   └── svelte/
│       ├── login-form/
│       └── survey/
│
├── website/                        # React + Vite documentation site
│   └── [See WEBSITE section below]
│
├── SPECIFICATION.md
├── IMPLEMENTATION.md
├── TASKS.md
├── README.md
├── CHANGELOG.md
├── LICENSE
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── vitest.config.ts
```

---

## DOCUMENTATION WEBSITE

Build a modern, responsive documentation site for `https://formkeeper.oxog.dev`

### Technology Stack

| Tech | Version | Purpose |
|------|---------|---------|
| **React** | 18+ | UI framework |
| **Vite** | 5+ | Build tool |
| **TypeScript** | 5+ | Type safety |
| **Tailwind CSS** | 3+ | Styling |
| **shadcn/ui** | Latest | UI components |
| **React Router** | 6+ | Routing |
| **Prism.js** | Latest | Syntax highlighting |
| **Framer Motion** | Latest | Animations |

### GitHub Pages Deployment

```yaml
# .github/workflows/deploy-website.yml
name: Deploy Website

on:
  push:
    branches: [main]
    paths:
      - 'website/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: cd website && npm ci
        
      - name: Build
        run: cd website && npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./website/dist
          cname: formkeeper.oxog.dev
```

### Website Structure

```
website/
├── public/
│   ├── favicon.svg
│   ├── og-image.png
│   └── robots.txt
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── form.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Layout.tsx
│   │   │
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── LiveDemo.tsx
│   │   │   ├── Comparison.tsx
│   │   │   ├── Frameworks.tsx
│   │   │   └── CTA.tsx
│   │   │
│   │   ├── docs/
│   │   │   ├── DocPage.tsx
│   │   │   ├── TableOfContents.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── CopyButton.tsx
│   │   │   ├── PackageManagerTabs.tsx
│   │   │   ├── FrameworkTabs.tsx
│   │   │   ├── ApiTable.tsx
│   │   │   ├── PropsTable.tsx
│   │   │   └── Callout.tsx
│   │   │
│   │   ├── examples/
│   │   │   ├── ExampleCard.tsx
│   │   │   ├── ExampleViewer.tsx
│   │   │   └── LiveEditor.tsx
│   │   │
│   │   ├── playground/
│   │   │   ├── PlaygroundEditor.tsx
│   │   │   ├── PlaygroundPreview.tsx
│   │   │   ├── FormBuilder.tsx
│   │   │   └── SchemaEditor.tsx
│   │   │
│   │   └── shared/
│   │       ├── Logo.tsx
│   │       ├── ThemeToggle.tsx
│   │       ├── SearchDialog.tsx
│   │       ├── GitHubLink.tsx
│   │       └── ScrollToTop.tsx
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── docs/
│   │   │   ├── GettingStarted.tsx
│   │   │   ├── Installation.tsx
│   │   │   ├── QuickStart.tsx
│   │   │   ├── concepts/
│   │   │   │   ├── FieldRegistration.tsx
│   │   │   │   ├── Validation.tsx
│   │   │   │   ├── FormState.tsx
│   │   │   │   ├── NestedFields.tsx
│   │   │   │   ├── ArrayFields.tsx
│   │   │   │   └── ErrorHandling.tsx
│   │   │   ├── api/
│   │   │   │   ├── CreateForm.tsx
│   │   │   │   ├── UseForm.tsx
│   │   │   │   ├── UseField.tsx
│   │   │   │   ├── UseFieldArray.tsx
│   │   │   │   ├── UseWatch.tsx
│   │   │   │   ├── Controller.tsx
│   │   │   │   └── ValidationRules.tsx
│   │   │   ├── plugins/
│   │   │   │   ├── CorePlugins.tsx
│   │   │   │   ├── Wizard.tsx
│   │   │   │   ├── Autosave.tsx
│   │   │   │   ├── Schema.tsx
│   │   │   │   ├── DevTools.tsx
│   │   │   │   └── CustomPlugins.tsx
│   │   │   ├── frameworks/
│   │   │   │   ├── React.tsx
│   │   │   │   ├── Vue.tsx
│   │   │   │   └── Svelte.tsx
│   │   │   └── guides/
│   │   │       ├── MultiStepForms.tsx
│   │   │       ├── DynamicForms.tsx
│   │   │       ├── AsyncValidation.tsx
│   │   │       ├── CustomInputs.tsx
│   │   │       └── Testing.tsx
│   │   ├── Examples.tsx
│   │   ├── Playground.tsx
│   │   └── NotFound.tsx
│   │
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useSearch.ts
│   │   └── useScrollSpy.ts
│   │
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── docs-config.ts
│   │
│   └── styles/
│       └── globals.css
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── components.json
```

### Design System

```css
/* Color Palette - Dark Theme */
:root {
  --background: #09090b;
  --foreground: #fafafa;
  
  --card: #18181b;
  --card-foreground: #fafafa;
  
  --primary: #3b82f6;               /* Blue - Form/Input theme */
  --primary-foreground: #ffffff;
  
  --secondary: #27272a;
  --secondary-foreground: #fafafa;
  
  --muted: #27272a;
  --muted-foreground: #a1a1aa;
  
  --accent: #3b82f6;
  --accent-foreground: #ffffff;
  
  --destructive: #ef4444;
  --success: #22c55e;
  --warning: #f59e0b;
  
  --border: #27272a;
  --ring: #3b82f6;
}

/* Form-specific colors */
--form-valid: #22c55e;
--form-invalid: #ef4444;
--form-warning: #f59e0b;
--form-focus: #3b82f6;
--form-disabled: #52525b;
```

### Hero Section

```tsx
// src/components/home/Hero.tsx
import { motion } from 'framer-motion'
import { FileText, Check, Zap, Box } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10" />
      
      {/* Animated form icons */}
      <motion.div className="absolute inset-0 pointer-events-none">
        {/* Floating input, checkbox, form icons */}
      </motion.div>
      
      {/* Main content */}
      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1 }}
        >
          <FileText className="w-24 h-24 mx-auto text-blue-500" />
        </motion.div>
        
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Form<span className="text-blue-500">Keeper</span>
        </motion.h1>
        
        <motion.p className="text-xl md:text-2xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Zero-dependency headless form state manager.
          <br />
          Under 5KB. Full power.
        </motion.p>
        
        {/* Stats badges */}
        <motion.div className="flex flex-wrap justify-center gap-4 mt-8">
          <Badge variant="secondary">
            <Zap className="w-4 h-4 mr-1" /> &lt; 5KB
          </Badge>
          <Badge variant="secondary">
            <Box className="w-4 h-4 mr-1" /> Zero Deps
          </Badge>
          <Badge variant="secondary">
            <Check className="w-4 h-4 mr-1" /> 100% TypeScript
          </Badge>
        </motion.div>
        
        {/* CTA buttons */}
        <motion.div className="flex justify-center gap-4 mt-8">
          <Button size="lg" asChild>
            <Link to="/docs/getting-started">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="https://github.com/ersinkoc/formkeeper">
              <GitHubIcon className="mr-2 w-4 h-4" /> GitHub
            </a>
          </Button>
        </motion.div>
        
        {/* Install command */}
        <motion.div className="mt-12">
          <CodeBlock language="bash" className="max-w-md mx-auto">
            npm install @oxog/formkeeper
          </CodeBlock>
        </motion.div>
        
        {/* Live form demo */}
        <motion.div className="mt-16 max-w-xl mx-auto">
          <LiveFormDemo />
        </motion.div>
      </div>
    </section>
  )
}

function LiveFormDemo() {
  return (
    <Card className="p-6 text-left">
      <h3 className="text-lg font-semibold mb-4">Try it live</h3>
      {/* Interactive form demo */}
      <form className="space-y-4">
        <div>
          <Label htmlFor="demo-email">Email</Label>
          <Input id="demo-email" type="email" placeholder="Enter your email" />
        </div>
        <div>
          <Label htmlFor="demo-password">Password</Label>
          <Input id="demo-password" type="password" placeholder="Enter password" />
        </div>
        <Button type="submit" className="w-full">Submit</Button>
      </form>
      {/* Show form state in real-time */}
      <div className="mt-4 p-3 bg-muted rounded-md text-sm">
        <pre>{`{ isValid: true, isDirty: false }`}</pre>
      </div>
    </Card>
  )
}
```

### Required Pages

1. **Home** (`/`)
   - Hero with live demo
   - Features grid
   - Size comparison
   - Framework support

2. **Getting Started** (`/docs/getting-started`)
   - Installation
   - Quick start
   - Basic example

3. **Concepts** (`/docs/concepts/*`)
   - Field Registration
   - Validation
   - Form State
   - Nested Fields
   - Array Fields
   - Error Handling

4. **API Reference** (`/docs/api/*`)
   - createForm
   - useForm (React)
   - useField
   - useFieldArray
   - useWatch
   - Controller
   - Validation Rules

5. **Plugins** (`/docs/plugins/*`)
   - Core Plugins
   - Wizard
   - Autosave
   - Schema
   - DevTools
   - Custom Plugins

6. **Frameworks** (`/docs/frameworks/*`)
   - React
   - Vue
   - Svelte

7. **Guides** (`/docs/guides/*`)
   - Multi-step Forms
   - Dynamic Forms
   - Async Validation
   - Custom Inputs
   - Testing

8. **Examples** (`/examples`)
   - Login Form
   - Registration
   - Checkout
   - Survey
   - Dynamic Form Builder

9. **Playground** (`/playground`)
   - Interactive form builder
   - Schema editor
   - Live preview
   - Export code

### Website package.json

```json
{
  "name": "formkeeper-website",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "prismjs": "^1.29.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/prismjs": "^1.26.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

---

## README.md

````markdown
# FormKeeper

<div align="center">
  <img src="website/public/logo.svg" alt="FormKeeper" width="120" />
  <h3>Zero-dependency headless form state manager</h3>
  <p>
    <a href="https://formkeeper.oxog.dev">Documentation</a> •
    <a href="https://formkeeper.oxog.dev/docs/getting-started">Getting Started</a> •
    <a href="https://formkeeper.oxog.dev/examples">Examples</a> •
    <a href="https://formkeeper.oxog.dev/playground">Playground</a>
  </p>
</div>

<div align="center">

[![npm version](https://img.shields.io/npm/v/@oxog/formkeeper.svg)](https://www.npmjs.com/package/@oxog/formkeeper)
[![npm downloads](https://img.shields.io/npm/dm/@oxog/formkeeper.svg)](https://www.npmjs.com/package/@oxog/formkeeper)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@oxog/formkeeper)](https://bundlephobia.com/package/@oxog/formkeeper)
[![license](https://img.shields.io/npm/l/@oxog/formkeeper.svg)](LICENSE)

</div>

---

## Features

- 📝 **Headless** - Bring your own UI
- ⚡ **Tiny** - Under 5KB minified + gzipped
- 🔌 **Zero Dependencies** - No runtime dependencies
- 🎯 **Type-Safe** - Full TypeScript support with generics
- ✅ **Validation** - Sync and async validation
- 🌳 **Nested Fields** - Deep object support
- 📋 **Array Fields** - Dynamic field lists
- 🧙 **Wizard** - Multi-step forms (plugin)
- 💾 **Auto-save** - Draft persistence (plugin)
- ⚛️ **React/Vue/Svelte** - First-class adapters

## Installation

```bash
npm install @oxog/formkeeper
```

## Quick Start

### React

```tsx
import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

function LoginForm() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      await api.login(values)
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <EmailField />
        <PasswordField />
        <button type="submit" disabled={form.formState.isSubmitting}>
          Login
        </button>
      </form>
    </FormProvider>
  )
}

function EmailField() {
  const { register, error, touched } = useField('email', {
    required: 'Email is required',
    pattern: { value: /^\S+@\S+$/, message: 'Invalid email' },
  })

  return (
    <div>
      <input {...register()} type="email" />
      {touched && error && <span>{error}</span>}
    </div>
  )
}
```

### Vanilla JS

```typescript
import { createForm } from '@oxog/formkeeper'

const form = createForm({
  initialValues: { email: '', password: '' },
  onSubmit: async (values) => {
    await api.login(values)
  },
})

const emailInput = document.querySelector('#email')
const { onChange, onBlur } = form.register('email', { required: true })

emailInput.addEventListener('change', onChange)
emailInput.addEventListener('blur', onBlur)

document.querySelector('form').addEventListener('submit', form.handleSubmit)
```

## Comparison

| Feature | FormKeeper | react-hook-form | Formik |
|---------|-----------|-----------------|--------|
| Bundle Size | **< 5KB** | ~40KB | ~50KB |
| Dependencies | **0** | 0 | 5+ |
| TypeScript | ✅ | ✅ | Partial |
| Vue/Svelte | ✅ | ❌ | ❌ |
| Wizard Plugin | ✅ | ❌ | ❌ |
| Auto-save | ✅ | ❌ | ❌ |

## Documentation

Visit [formkeeper.oxog.dev](https://formkeeper.oxog.dev) for full documentation.

## License

MIT © [Ersin KOÇ](https://github.com/ersinkoc)
````

---

## CHANGELOG.md

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-12-28

### Added
- Initial release
- Core form management (register, values, errors, submit)
- Field-level validation with built-in rules
- Form-level validation
- Async validation support
- Nested field support (dot notation)
- Array fields (append, remove, swap, move)
- Watch API for field changes
- Reset functionality
- Focus management
- Wizard plugin for multi-step forms
- Autosave plugin for draft persistence
- Persist plugin for form state persistence
- Schema plugin for external validation libraries
- Focus manager plugin
- Form DevTools panel
- React adapter (useForm, useField, useFieldArray, useWatch, Controller)
- Vue adapter (useForm, useField, useFieldArray, useWatch)
- Svelte adapter (createFormStore, fieldStore)
- Full TypeScript support with generics
- 100% test coverage
- Documentation website

### Security
- No external dependencies
- Input sanitization
```

---

## IMPLEMENTATION CHECKLIST

Before starting implementation:
- [ ] Create SPECIFICATION.md with complete package spec
- [ ] Create IMPLEMENTATION.md with architecture design
- [ ] Create TASKS.md with ordered task list

During implementation:
- [ ] Implement kernel first (foundation)
- [ ] Implement core plugins (5)
- [ ] Implement optional plugins (6)
- [ ] Implement framework adapters (React, Vue, Svelte)
- [ ] Build Form DevTools panel
- [ ] Maintain 100% test coverage throughout
- [ ] Write JSDoc for all public APIs
- [ ] Build documentation website

Before completion:
- [ ] All tests passing (100% success rate)
- [ ] Coverage report shows 100%
- [ ] Bundle size < 5KB core
- [ ] README.md complete
- [ ] CHANGELOG.md initialized
- [ ] Website fully functional
- [ ] Website deploys to GitHub Pages
- [ ] Package builds without errors
- [ ] Tree-shaking works correctly
- [ ] All framework adapters tested
- [ ] Examples work correctly
- [ ] Playground functional

---

## CRITICAL IMPLEMENTATION NOTES

### Performance First
- Minimize re-renders (especially in React)
- Use refs for field elements
- Batch state updates
- Debounce rapid validation

### Path Utilities
- Support dot notation: `user.profile.name`
- Support bracket notation: `items[0].name`
- Implement efficient deep get/set
- Handle undefined paths gracefully

### Validation
- Run field rules in order
- Short-circuit on first error (optional)
- Support async validation
- Debounce async validation
- Cancel previous validation on new input

### Array Fields
- Generate stable unique IDs
- Preserve state on reorder
- Handle nested arrays
- Update paths on remove

### Type Safety
- Generic form values type
- Type-safe field paths
- Infer value type from path
- Type-safe validation rules

### Framework Adapters
- React: Use useSyncExternalStore
- Vue: Use ref() and computed()
- Svelte: Implement Writable store
- All: Proper cleanup on unmount

### Testing
- Test all validation rules
- Test nested field paths
- Test array operations
- Test async validation
- Test form submission
- Test reset functionality
- Mock DOM for field refs

---

## BEGIN IMPLEMENTATION

Start by creating SPECIFICATION.md with the complete package specification. Then proceed with IMPLEMENTATION.md and TASKS.md before writing any actual code.

Remember: This package will be published to NPM. It must be production-ready, zero-dependency, fully tested, and professionally documented.

Bundle size is critical - stay under 5KB for core. The website should showcase form capabilities with interactive examples and a playground.

**Date: 2025-12-28**
**Author: Ersin KOÇ**
**Repository: github.com/ersinkoc/formkeeper**
**Website: formkeeper.oxog.dev**