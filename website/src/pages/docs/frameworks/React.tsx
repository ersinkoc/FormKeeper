import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'

export function ReactFramework() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">React</h1>
      <p className="text-lg text-muted-foreground mb-8">
        FormKeeper provides first-class React support with hooks that integrate
        seamlessly with React's rendering model.
      </p>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <CodeBlock
          code="npm install @oxog/formkeeper"
          language="bash"
          showLineNumbers={false}
        />
      </section>

      {/* Hooks */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Available Hooks</h2>

        <h3 className="text-xl font-semibold mb-3 mt-6">useForm</h3>
        <p className="text-muted-foreground mb-4">
          Create and manage a form instance:
        </p>
        <CodeBlock
          code={`import { useForm, FormProvider } from '@oxog/formkeeper/react'

interface LoginForm {
  email: string
  password: string
}

function App() {
  const form = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
    onSubmit: async (values) => {
      await login(values)
    },
  })

  // Access form state
  const { values, errors, isSubmitting, isValid } = form.formState

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        {/* fields */}
      </form>
    </FormProvider>
  )
}`}
          language="tsx"
        />

        <h3 className="text-xl font-semibold mb-3 mt-8">useField</h3>
        <p className="text-muted-foreground mb-4">
          Register and manage a single field:
        </p>
        <CodeBlock
          code={`import { useField } from '@oxog/formkeeper/react'

function EmailField() {
  const {
    register,     // () => input props
    value,        // current value
    error,        // validation error
    touched,      // has been blurred
    dirty,        // value changed from initial
    validating,   // async validation in progress
    setValue,     // (value) => void
    setError,     // (error) => void
    clearError,   // () => void
    setTouched,   // (touched?) => void
  } = useField('email', {
    required: 'Email is required',
    pattern: {
      value: /^\\S+@\\S+$/,
      message: 'Invalid email',
    },
  })

  return (
    <div>
      <input {...register()} type="email" />
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}`}
          language="tsx"
        />

        <h3 className="text-xl font-semibold mb-3 mt-8">useFieldArray</h3>
        <p className="text-muted-foreground mb-4">
          Manage dynamic array fields:
        </p>
        <CodeBlock
          code={`import { useFieldArray } from '@oxog/formkeeper/react'

function ItemsList() {
  const {
    fields,   // Array with unique IDs
    append,   // Add to end
    prepend,  // Add to start
    insert,   // Insert at index
    remove,   // Remove by index
    swap,     // Swap two items
    move,     // Move item
    update,   // Update item
    replace,  // Replace all
  } = useFieldArray('items')

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <ItemField index={index} />
          <button onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button onClick={() => append({ name: '' })}>Add</button>
    </div>
  )
}`}
          language="tsx"
        />

        <h3 className="text-xl font-semibold mb-3 mt-8">useWatch</h3>
        <p className="text-muted-foreground mb-4">
          Watch for value changes:
        </p>
        <CodeBlock
          code={`import { useWatch } from '@oxog/formkeeper/react'

function PriceDisplay() {
  // Watch single field
  const price = useWatch<number>('price')

  // Watch with callback
  useWatch('quantity', (value, prevValue) => {
    console.log('Quantity changed:', prevValue, '->', value)
  })

  // Watch all values
  const allValues = useWatch()

  return <div>Price: \${price}</div>
}`}
          language="tsx"
        />

        <h3 className="text-xl font-semibold mb-3 mt-8">useFormContext</h3>
        <p className="text-muted-foreground mb-4">
          Access form from nested components:
        </p>
        <CodeBlock
          code={`import { useFormContext } from '@oxog/formkeeper/react'

function SubmitButton() {
  const form = useFormContext()

  return (
    <button
      type="submit"
      disabled={form.formState.isSubmitting}
    >
      {form.formState.isSubmitting ? 'Saving...' : 'Submit'}
    </button>
  )
}`}
          language="tsx"
        />
      </section>

      {/* Controller */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Controller Component</h2>
        <p className="text-muted-foreground mb-4">
          For controlled components that don't work with register():
        </p>
        <CodeBlock
          code={`import { Controller } from '@oxog/formkeeper/react'
import DatePicker from 'react-datepicker'

function DateField() {
  return (
    <Controller
      name="birthDate"
      rules={{ required: 'Date is required' }}
      render={({ field, fieldState }) => (
        <div>
          <DatePicker
            selected={field.value}
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
}`}
          language="tsx"
        />
      </section>

      {/* Complete Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Complete Example</h2>
        <CodeBlock
          code={`import {
  useForm,
  useField,
  FormProvider,
  useFormContext
} from '@oxog/formkeeper/react'

interface ContactForm {
  name: string
  email: string
  message: string
}

export function ContactPage() {
  const form = useForm<ContactForm>({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    onSubmit: async (values) => {
      await sendContactForm(values)
      form.reset()
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit} className="space-y-4">
        <NameField />
        <EmailField />
        <MessageField />
        <SubmitButton />
      </form>
    </FormProvider>
  )
}

function NameField() {
  const { register, error, touched } = useField('name', {
    required: 'Name is required',
    minLength: { value: 2, message: 'Min 2 characters' },
  })

  return (
    <div>
      <label>Name</label>
      <input {...register()} />
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}

function EmailField() {
  const { register, error, touched } = useField('email', {
    required: 'Email is required',
    pattern: { value: /^\\S+@\\S+$/, message: 'Invalid email' },
  })

  return (
    <div>
      <label>Email</label>
      <input {...register()} type="email" />
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}

function MessageField() {
  const { register, error, touched } = useField('message', {
    required: 'Message is required',
    minLength: { value: 10, message: 'Min 10 characters' },
  })

  return (
    <div>
      <label>Message</label>
      <textarea {...register()} rows={4} />
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}

function SubmitButton() {
  const { formState } = useFormContext()

  return (
    <button type="submit" disabled={formState.isSubmitting}>
      {formState.isSubmitting ? 'Sending...' : 'Send Message'}
    </button>
  )
}`}
          language="tsx"
          filename="ContactPage.tsx"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/docs/api/use-form">
              useForm API
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/examples">View Examples</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
