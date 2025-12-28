# FormKeeper - Package Specification

**Version:** 1.0.0
**Date:** 2025-12-28
**Author:** Ersin KOÇ
**Status:** Draft

---

## 1. Package Identity

| Property | Value |
|----------|-------|
| **Name** | `@oxog/formkeeper` |
| **Version** | 1.0.0 |
| **License** | MIT |
| **Repository** | https://github.com/ersinkoc/formkeeper |
| **Documentation** | https://formkeeper.oxog.dev |
| **NPM** | https://www.npmjs.com/package/@oxog/formkeeper |

### 1.1 Description

Zero-dependency headless form state manager with micro-kernel plugin architecture.

FormKeeper is a lightweight, flexible form management library that handles field registration, validation, state tracking, and submission. Built on a micro-kernel architecture with a powerful plugin system, it supports nested fields, array fields, multi-step wizards, auto-save drafts, and async validation. Framework-agnostic core with dedicated adapters for React, Vue, and Svelte—all in under 5KB with zero runtime dependencies.

### 1.2 Keywords

```json
[
  "form",
  "forms",
  "form-validation",
  "form-management",
  "headless",
  "typescript",
  "react",
  "vue",
  "svelte",
  "zero-dependencies",
  "validation",
  "form-state",
  "wizard",
  "multi-step-form"
]
```

---

## 2. Core Requirements

### 2.1 NON-NEGOTIABLE Rules

#### 2.1.1 Zero Dependencies
```json
{
  "dependencies": {}
}
```
- MUST have ZERO runtime dependencies
- ALL functionality implemented from scratch
- NO external libraries allowed

#### 2.1.2 Bundle Size
- Core package: **< 5KB** minified + gzipped
- With all plugins: **< 10KB** minified + gzipped
- Must be tree-shakeable
- Each plugin independently importable

#### 2.1.3 Test Coverage
- **100%** line coverage
- **100%** branch coverage
- **100%** test success rate
- Use Vitest for testing
- Coverage report MUST show 100%

#### 2.1.4 TypeScript
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```
- Full strict mode enabled
- Generic type support for form values
- Type-safe field paths
- Inferred value types from paths

#### 2.1.5 Documentation
Must create FIRST before any code:
1. ✅ SPECIFICATION.md (this file)
2. IMPLEMENTATION.md
3. TASKS.md

---

## 3. Architecture

### 3.1 Micro-Kernel Architecture

```
┌─────────────────────────────────────────┐
│           KERNEL (Core Engine)          │
│  - Event Bus                            │
│  - Plugin Registry                      │
│  - State Coordinator                    │
│  - Public API Surface                   │
└─────────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
┌─────────┐   ┌──────────┐   ┌──────────┐
│  Core   │   │ Optional │   │Framework │
│ Plugins │   │ Plugins  │   │ Adapters │
└─────────┘   └──────────┘   └──────────┘
```

### 3.2 Plugin System

**Plugin Lifecycle:**
1. Registration → `install(kernel)`
2. Hook execution → `beforeValidate`, `afterSubmit`, etc.
3. Unregistration → `uninstall()`

**Plugin Types:**
- **Core Plugins** (5) - Always loaded, bundled with core
- **Optional Plugins** (6) - Imported separately
- **Framework Adapters** (3) - React, Vue, Svelte

---

## 4. Core Plugins (Always Loaded)

### 4.1 field-registry

**Purpose:** Field registration and ref management

**API:**
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
```

**Responsibilities:**
- Track registered fields
- Manage field refs for focus
- Handle nested paths (dot notation)
- Clean up on unregister

### 4.2 state-manager

**Purpose:** Values, touched, dirty state management

**API:**
```typescript
interface StateManagerAPI<TValues> {
  getValues(): TValues
  getValue(name: string): any
  setValue(name: string, value: any, options?: SetValueOptions): void
  setValues(values: DeepPartial<TValues>, options?: SetValueOptions): void
  getTouched(): TouchedFields<TValues>
  isTouched(name: string): boolean
  setTouched(name: string, touched?: boolean): void
  getDirty(): DirtyFields<TValues>
  isDirty(name?: string): boolean
  getDefaultValues(): TValues
  setDefaultValues(values: TValues): void
  reset(values?: DeepPartial<TValues>, options?: ResetOptions): void
  resetField(name: string, options?: ResetOptions): void
}
```

**Responsibilities:**
- Store and manage form values
- Track touched state
- Track dirty state (compare to initial)
- Support nested field access
- Handle reset operations

### 4.3 validation-engine

**Purpose:** Sync and async validation with rules

**API:**
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
```

**Validation Rules:**
```typescript
interface ValidationRules<TValue = any> {
  required?: boolean | string
  min?: number | { value: number; message: string }
  max?: number | { value: number; message: string }
  minLength?: number | { value: number; message: string }
  maxLength?: number | { value: number; message: string }
  pattern?: RegExp | { value: RegExp; message: string }
  validate?: ValidateFn<TValue> | Record<string, ValidateFn<TValue>>
  deps?: string[]
}
```

**Responsibilities:**
- Execute validation rules
- Run custom validators
- Handle async validation
- Manage validation state
- Support dependent field validation

### 4.4 array-fields

**Purpose:** Dynamic field array management

**API:**
```typescript
interface FieldArrayReturn<TValues, TName> {
  fields: FieldArrayItem[]
  append: (value: any, options?: FieldArrayOptions) => void
  prepend: (value: any, options?: FieldArrayOptions) => void
  insert: (index: number, value: any, options?: FieldArrayOptions) => void
  remove: (index: number | number[]) => void
  swap: (indexA: number, indexB: number) => void
  move: (from: number, to: number) => void
  update: (index: number, value: any) => void
  replace: (values: any[]) => void
}
```

**Responsibilities:**
- Generate unique IDs for React keys
- Handle array operations
- Update field paths
- Preserve state on reorder

### 4.5 submit-handler

**Purpose:** Form submission handling

**API:**
```typescript
interface SubmitHandlerAPI<TValues> {
  submit(): Promise<void>
  handleSubmit(e?: Event): Promise<void>
  isSubmitting(): boolean
  isSubmitSuccessful(): boolean
  getSubmitCount(): number
  setSubmitting(submitting: boolean): void
}
```

**Submit Flow:**
1. Prevent default
2. Set `isSubmitting = true`
3. Validate all fields
4. If invalid → focus first error, call `onError`
5. If valid → call `onSubmit`
6. Set `isSubmitSuccessful`
7. Set `isSubmitting = false`

---

## 5. Optional Plugins

### 5.1 wizard

**Purpose:** Multi-step form wizard

**Import:** `@oxog/formkeeper/plugins`

**API:**
```typescript
interface WizardAPI {
  next(): Promise<boolean>
  prev(): boolean
  goTo(stepId: string): Promise<boolean>
  currentStep: WizardStep
  currentIndex: number
  steps: WizardStep[]
  isFirstStep: boolean
  isLastStep: boolean
  canNext(): boolean
  canPrev(): boolean
  canGoTo(stepId: string): boolean
  getProgress(): number
  getCompletedSteps(): string[]
  isStepComplete(stepId: string): boolean
  isStepValid(stepId: string): Promise<boolean>
}
```

### 5.2 autosave

**Purpose:** Auto-save form drafts to storage

**Import:** `@oxog/formkeeper/plugins`

**API:**
```typescript
interface AutosaveAPI {
  save(): void
  restore(): boolean
  clear(): void
  hasDraft(): boolean
  getDraft(): any | null
  getLastSavedAt(): Date | null
  pause(): void
  resume(): void
  isPaused(): boolean
}
```

### 5.3 persist

**Purpose:** Persist complete form state to storage

**Import:** `@oxog/formkeeper/plugins`

**API:**
```typescript
interface PersistAPI {
  save(): void
  restore(): boolean
  clear(): void
  getPersistedState(): any | null
}
```

### 5.4 schema

**Purpose:** Schema-based validation integration (Zod, Yup, Joi)

**Import:** `@oxog/formkeeper/plugins`

**API:**
```typescript
interface SchemaOptions<TSchema> {
  schema: TSchema
  adapter: 'zod' | 'yup' | 'joi' | 'custom'
  parseAsync?: boolean
  abortEarly?: boolean
  customAdapter?: SchemaAdapter
}
```

### 5.5 focus-manager

**Purpose:** Focus management and error focusing

**Import:** `@oxog/formkeeper/plugins`

**API:**
```typescript
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

### 5.6 form-devtools

**Purpose:** Visual debugging panel

**Import:** `@oxog/formkeeper/plugins`

**API:**
```typescript
interface FormDevtoolsAPI {
  open(): void
  close(): void
  toggle(): void
  isOpen(): boolean
}
```

---

## 6. Framework Adapters

### 6.1 React (`@oxog/formkeeper/react`)

**Exports:**
```typescript
export {
  FormProvider,
  useForm,
  useFormContext,
  useField,
  useFieldArray,
  useWatch,
  useFormState,
  Controller,
}
```

**Peer Dependencies:**
```json
{
  "react": ">=17.0.0"
}
```

### 6.2 Vue (`@oxog/formkeeper/vue`)

**Exports:**
```typescript
export {
  createForm,
  useForm,
  useField,
  useFieldArray,
  useWatch,
  useFormState,
  provideForm,
  injectForm,
}
```

**Peer Dependencies:**
```json
{
  "vue": ">=3.0.0"
}
```

### 6.3 Svelte (`@oxog/formkeeper/svelte`)

**Exports:**
```typescript
export {
  createFormStore,
  fieldStore,
  formState,
}
```

**Peer Dependencies:**
```json
{
  "svelte": ">=3.0.0"
}
```

---

## 7. Public API (Vanilla JS)

### 7.1 Core Exports

```typescript
import {
  createForm,
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
```

### 7.2 Main Factory

```typescript
function createForm<TValues extends FieldValues>(
  options: FormOptions<TValues>
): Form<TValues>
```

### 7.3 Kernel Interface

```typescript
interface Form<TValues> {
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
  registerPlugin(plugin: Plugin<TValues>): void
  unregisterPlugin(pluginName: string): void
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
```

---

## 8. Type System

### 8.1 Core Types

```typescript
type FieldValues = Record<string, any>
type FieldPath<TValues> = string
type FieldPathValue<TValues, TPath extends FieldPath<TValues>> = any
type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

interface FieldRegistration {
  name: string
  ref: (element: HTMLElement | null) => void
  onChange: (event: ChangeEvent) => void
  onBlur: (event: FocusEvent) => void
  onFocus: (event: FocusEvent) => void
  value: any
  disabled?: boolean
}

interface FieldState {
  value: any
  error: string | undefined
  touched: boolean
  dirty: boolean
  validating: boolean
}

type FormErrors<TValues> = {
  [K in keyof TValues]?: TValues[K] extends object
    ? FormErrors<TValues[K]>
    : string
}

type TouchedFields<TValues> = {
  [K in keyof TValues]?: TValues[K] extends object
    ? TouchedFields<TValues[K]>
    : boolean
}

type DirtyFields<TValues> = {
  [K in keyof TValues]?: TValues[K] extends object
    ? DirtyFields<TValues[K]>
    : boolean
}
```

### 8.2 Options Types

```typescript
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

interface SetValueOptions {
  shouldValidate?: boolean
  shouldDirty?: boolean
  shouldTouch?: boolean
}

interface ResetOptions {
  keepErrors?: boolean
  keepDirty?: boolean
  keepTouched?: boolean
  keepValues?: boolean
  keepDefaultValues?: boolean
  keepSubmitCount?: boolean
}
```

### 8.3 Event Types

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

## 9. Package Exports

### 9.1 package.json exports

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./plugins": {
      "import": "./dist/plugins/index.js",
      "require": "./dist/plugins/index.cjs",
      "types": "./dist/plugins/index.d.ts"
    },
    "./react": {
      "import": "./dist/react/index.js",
      "require": "./dist/react/index.cjs",
      "types": "./dist/react/index.d.ts"
    },
    "./vue": {
      "import": "./dist/vue/index.js",
      "require": "./dist/vue/index.cjs",
      "types": "./dist/vue/index.d.ts"
    },
    "./svelte": {
      "import": "./dist/svelte/index.js",
      "require": "./dist/svelte/index.cjs",
      "types": "./dist/svelte/index.d.ts"
    }
  }
}
```

### 9.2 Module Formats

- **ESM** (`.js`) - ES Module format
- **CJS** (`.cjs`) - CommonJS format
- **Types** (`.d.ts`) - TypeScript declarations

---

## 10. Build & Test

### 10.1 Build Tool

**tsup** - Fast TypeScript bundler

```typescript
// tsup.config.ts
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
})
```

### 10.2 Test Framework

**Vitest** - Fast unit test framework

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['tests/**', '**/*.test.ts'],
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
  },
})
```

### 10.3 TypeScript Config

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

---

## 11. Performance Requirements

### 11.1 Bundle Size

| Package | Size Limit |
|---------|-----------|
| Core (`@oxog/formkeeper`) | < 5KB |
| Core + All Plugins | < 10KB |
| React Adapter | < 3KB |
| Vue Adapter | < 3KB |
| Svelte Adapter | < 2KB |

### 11.2 Runtime Performance

- Field registration: O(1)
- Value get/set: O(1) for direct paths, O(n) for nested
- Validation: O(n) where n = number of fields
- Array operations: O(1) for most ops

### 11.3 Memory

- Minimal state duplication
- Efficient deep cloning only when necessary
- Clean up on field unregister
- Weak refs where applicable

---

## 12. Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

**Required Features:**
- ES2020
- Proxy
- WeakMap
- Promise
- async/await

---

## 13. Documentation Website

### 13.1 Technology Stack

| Technology | Purpose |
|-----------|---------|
| React 18+ | UI framework |
| Vite 5+ | Build tool |
| TypeScript 5+ | Type safety |
| Tailwind CSS 3+ | Styling |
| shadcn/ui | UI components |
| React Router 6+ | Routing |
| Prism.js | Syntax highlighting |
| Framer Motion | Animations |

### 13.2 Deployment

- **Platform:** GitHub Pages
- **URL:** https://formkeeper.oxog.dev
- **CNAME:** formkeeper.oxog.dev
- **CI/CD:** GitHub Actions

### 13.3 Required Pages

1. Home - Hero, features, live demo
2. Getting Started - Installation, quick start
3. Concepts - Core concepts explained
4. API Reference - Complete API docs
5. Plugins - All plugins documented
6. Frameworks - React, Vue, Svelte guides
7. Guides - Multi-step forms, async validation, etc.
8. Examples - Working examples
9. Playground - Interactive form builder

---

## 14. Quality Gates

### 14.1 Pre-Commit

- ✅ TypeScript compilation succeeds
- ✅ All tests pass (100%)
- ✅ ESLint passes
- ✅ Prettier formatting correct

### 14.2 Pre-Release

- ✅ Coverage report shows 100%
- ✅ Bundle size < 5KB core
- ✅ All examples work
- ✅ Documentation complete
- ✅ CHANGELOG updated
- ✅ Version bumped

### 14.3 Post-Release

- ✅ NPM package published
- ✅ GitHub release created
- ✅ Website deployed
- ✅ Documentation live

---

## 15. Success Criteria

This specification is considered complete when:

- [x] All sections documented
- [ ] IMPLEMENTATION.md created
- [ ] TASKS.md created
- [ ] All core features specified
- [ ] All plugin features specified
- [ ] All framework adapters specified
- [ ] Type system fully defined
- [ ] Build system specified
- [ ] Test requirements clear
- [ ] Quality gates defined

---

**Document Status:** ✅ COMPLETE
**Next Step:** Create IMPLEMENTATION.md
