import { CodeBlock } from '@/components/code/CodeBlock'

export default function Types() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">TypeScript Types</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Complete reference of TypeScript types exported by FormKeeper for full type safety.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Core Types</h2>

        <h3 className="text-xl font-semibold mb-3 mt-6">FormOptions</h3>
        <p className="text-muted-foreground mb-4">
          Configuration options for creating a form:
        </p>
        <CodeBlock
          code={`interface FormOptions<TValues extends FieldValues> {
  initialValues: TValues
  onSubmit: (values: TValues) => Promise<void> | void
  onError?: (errors: FormErrors<TValues>) => void
  mode?: 'onSubmit' | 'onChange' | 'onBlur'
  shouldFocusError?: boolean
  shouldUnregister?: boolean
}`}
          language="typescript"
        />

        <h3 className="text-xl font-semibold mb-3 mt-8">FieldValues</h3>
        <p className="text-muted-foreground mb-4">
          Base type for form values - any object with string keys:
        </p>
        <CodeBlock
          code={`type FieldValues = Record<string, any>`}
          language="typescript"
        />

        <h3 className="text-xl font-semibold mb-3 mt-8">FieldPath</h3>
        <p className="text-muted-foreground mb-4">
          Type-safe field paths including nested paths:
        </p>
        <CodeBlock
          code={`// For { user: { name: string } }
type Paths = FieldPath<{ user: { name: string } }>
// Results in: 'user' | 'user.name'`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Validation Types</h2>

        <h3 className="text-xl font-semibold mb-3">ValidationRules</h3>
        <p className="text-muted-foreground mb-4">
          Rules that can be applied to field registration:
        </p>
        <CodeBlock
          code={`interface ValidationRules {
  required?: string | boolean
  min?: { value: number; message: string }
  max?: { value: number; message: string }
  minLength?: { value: number; message: string }
  maxLength?: { value: number; message: string }
  pattern?: { value: RegExp; message: string }
  validate?: ValidatorFn | Record<string, ValidatorFn>
}

type ValidatorFn = (value: any) =>
  | boolean
  | string
  | Promise<boolean | string>`}
          language="typescript"
        />

        <h3 className="text-xl font-semibold mb-3 mt-8">FormErrors</h3>
        <p className="text-muted-foreground mb-4">
          Error object structure matching form values:
        </p>
        <CodeBlock
          code={`type FormErrors<TValues> = {
  [K in keyof TValues]?: TValues[K] extends object
    ? FormErrors<TValues[K]>
    : string
}`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Field Types</h2>

        <h3 className="text-xl font-semibold mb-3">FieldRegistration</h3>
        <p className="text-muted-foreground mb-4">
          Return value from <code className="text-primary">register()</code>:
        </p>
        <CodeBlock
          code={`interface FieldRegistration {
  name: string
  ref: (element: HTMLElement | null) => void
  onChange: (event: Event) => void
  onBlur: (event: Event) => void
  value: any
}`}
          language="typescript"
        />

        <h3 className="text-xl font-semibold mb-3 mt-8">TouchedFields & DirtyFields</h3>
        <p className="text-muted-foreground mb-4">
          Track which fields have been touched or modified:
        </p>
        <CodeBlock
          code={`type TouchedFields<TValues> = {
  [K in keyof TValues]?: TValues[K] extends object
    ? TouchedFields<TValues[K]>
    : boolean
}

type DirtyFields<TValues> = {
  [K in keyof TValues]?: TValues[K] extends object
    ? DirtyFields<TValues[K]>
    : boolean
}`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Array Field Types</h2>

        <h3 className="text-xl font-semibold mb-3">FieldArrayReturn</h3>
        <p className="text-muted-foreground mb-4">
          Return value from <code className="text-primary">useFieldArray()</code>:
        </p>
        <CodeBlock
          code={`interface FieldArrayReturn<TValues, TName> {
  fields: Array<{ id: string } & FieldArrayItem>
  append: (value: FieldArrayItem) => void
  prepend: (value: FieldArrayItem) => void
  insert: (index: number, value: FieldArrayItem) => void
  remove: (index: number) => void
  move: (from: number, to: number) => void
  swap: (indexA: number, indexB: number) => void
  update: (index: number, value: FieldArrayItem) => void
  replace: (values: FieldArrayItem[]) => void
}`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Plugin Types</h2>

        <h3 className="text-xl font-semibold mb-3">Plugin</h3>
        <p className="text-muted-foreground mb-4">
          Interface for creating custom plugins:
        </p>
        <CodeBlock
          code={`interface Plugin<TValues extends FieldValues = FieldValues> {
  name: string
  version?: string
  dependencies?: string[]
  install: (kernel: Kernel<TValues>) => PluginAPI | void
  uninstall?: (kernel: Kernel<TValues>) => void
}

interface PluginAPI {
  [key: string]: any
}`}
          language="typescript"
        />

        <h3 className="text-xl font-semibold mb-3 mt-8">PluginInfo</h3>
        <p className="text-muted-foreground mb-4">
          Information about installed plugins:
        </p>
        <CodeBlock
          code={`interface PluginInfo {
  name: string
  version?: string
  dependencies?: string[]
}`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Event Types</h2>

        <h3 className="text-xl font-semibold mb-3">EventType</h3>
        <p className="text-muted-foreground mb-4">
          Available event types for the event bus:
        </p>
        <CodeBlock
          code={`type EventType =
  | 'change'
  | 'blur'
  | 'focus'
  | 'submit'
  | 'reset'
  | 'validate'
  | 'error'
  | 'register'
  | 'unregister'`}
          language="typescript"
        />

        <h3 className="text-xl font-semibold mb-3 mt-8">FormEvent</h3>
        <p className="text-muted-foreground mb-4">
          Event object structure:
        </p>
        <CodeBlock
          code={`interface FormEvent<TValues> {
  type: EventType
  name?: string
  value?: any
  prevValue?: any
  errors?: FormErrors<TValues>
  timestamp: number
}`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Utility Types</h2>

        <h3 className="text-xl font-semibold mb-3">DeepPartial</h3>
        <p className="text-muted-foreground mb-4">
          Make all properties optional recursively:
        </p>
        <CodeBlock
          code={`type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P]
}`}
          language="typescript"
        />

        <h3 className="text-xl font-semibold mb-3 mt-8">Unsubscribe</h3>
        <p className="text-muted-foreground mb-4">
          Cleanup function returned by subscriptions:
        </p>
        <CodeBlock
          code={`type Unsubscribe = () => void

// Usage
const unsubscribe = form.watch('email', (value) => {
  console.log('Email changed:', value)
})

// Later, cleanup
unsubscribe()`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Importing Types</h2>
        <p className="text-muted-foreground mb-4">
          All types are exported from the main package:
        </p>
        <CodeBlock
          code={`import type {
  FormOptions,
  FieldValues,
  FieldPath,
  ValidationRules,
  FormErrors,
  FieldRegistration,
  TouchedFields,
  DirtyFields,
  FieldArrayReturn,
  Plugin,
  EventType,
  FormEvent,
  DeepPartial,
  Unsubscribe,
} from '@oxog/formkeeper'`}
          language="typescript"
        />
      </section>
    </div>
  )
}
