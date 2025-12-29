import { CodeBlock } from '@/components/code/CodeBlock'

export default function FormCreation() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Form Creation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Learn how to create and configure forms with FormKeeper's createForm factory function.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-muted-foreground mb-4">
          FormKeeper uses a factory function pattern to create form instances. The <code className="text-primary">createForm</code> function
          returns a fully-featured form object with methods for registration, validation, submission, and state management.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Basic Form Creation</h2>
        <p className="text-muted-foreground mb-4">
          Create a form by providing initial values and a submit handler:
        </p>

        <CodeBlock
          code={`import { createForm } from '@oxog/formkeeper'

const form = createForm({
  initialValues: {
    email: '',
    password: '',
    rememberMe: false
  },
  onSubmit: async (values) => {
    console.log('Form submitted:', values)
    await api.login(values)
  }
})`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Configuration Options</h2>
        <p className="text-muted-foreground mb-4">
          The <code className="text-primary">createForm</code> function accepts the following options:
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-border rounded-lg">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left">Option</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>initialValues</code></td>
                <td className="px-4 py-2 text-muted-foreground">object</td>
                <td className="px-4 py-2 text-muted-foreground">Initial form values (required)</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>onSubmit</code></td>
                <td className="px-4 py-2 text-muted-foreground">(values) =&gt; Promise</td>
                <td className="px-4 py-2 text-muted-foreground">Submit handler function (required)</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>onError</code></td>
                <td className="px-4 py-2 text-muted-foreground">(errors) =&gt; void</td>
                <td className="px-4 py-2 text-muted-foreground">Called when validation fails</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>mode</code></td>
                <td className="px-4 py-2 text-muted-foreground">'onSubmit' | 'onChange' | 'onBlur'</td>
                <td className="px-4 py-2 text-muted-foreground">Validation trigger mode</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>shouldFocusError</code></td>
                <td className="px-4 py-2 text-muted-foreground">boolean</td>
                <td className="px-4 py-2 text-muted-foreground">Auto-focus first error field</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>shouldUnregister</code></td>
                <td className="px-4 py-2 text-muted-foreground">boolean</td>
                <td className="px-4 py-2 text-muted-foreground">Remove unmounted field values</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Validation Modes</h2>
        <p className="text-muted-foreground mb-4">
          Control when validation runs using the <code className="text-primary">mode</code> option:
        </p>

        <CodeBlock
          code={`// Validate only on submit (default)
const form = createForm({
  initialValues: { email: '' },
  mode: 'onSubmit',
  onSubmit: async (values) => {}
})

// Validate on every change
const form = createForm({
  initialValues: { email: '' },
  mode: 'onChange',
  onSubmit: async (values) => {}
})

// Validate on blur
const form = createForm({
  initialValues: { email: '' },
  mode: 'onBlur',
  onSubmit: async (values) => {}
})`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Error Handling</h2>
        <p className="text-muted-foreground mb-4">
          Handle validation errors and submission failures:
        </p>

        <CodeBlock
          code={`const form = createForm({
  initialValues: { email: '', password: '' },
  onSubmit: async (values) => {
    const result = await api.login(values)
    if (!result.success) {
      // Set server-side errors
      form.setError('email', 'Email not found')
    }
  },
  onError: (errors) => {
    console.log('Validation failed:', errors)
    // { email: 'Email is required', password: 'Password is required' }
  },
  shouldFocusError: true // Auto-focus first error field
})`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">React Integration</h2>
        <p className="text-muted-foreground mb-4">
          In React, use the <code className="text-primary">useForm</code> hook for automatic re-renders:
        </p>

        <CodeBlock
          code={`import { useForm, FormProvider } from '@oxog/formkeeper/react'

function LoginForm() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      await api.login(values)
    }
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <EmailField />
        <PasswordField />
        <button type="submit" disabled={form.isSubmitting}>
          {form.isSubmitting ? 'Submitting...' : 'Login'}
        </button>
      </form>
    </FormProvider>
  )
}`}
          language="tsx"
          filename="LoginForm.tsx"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Form Instance Methods</h2>
        <p className="text-muted-foreground mb-4">
          The form instance provides these methods:
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-border rounded-lg">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left">Method</th>
                <th className="px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>register(name, rules)</code></td>
                <td className="px-4 py-2 text-muted-foreground">Register a field with validation</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>handleSubmit(e?)</code></td>
                <td className="px-4 py-2 text-muted-foreground">Handle form submission</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>getValues()</code></td>
                <td className="px-4 py-2 text-muted-foreground">Get all form values</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>setValue(name, value)</code></td>
                <td className="px-4 py-2 text-muted-foreground">Set a field value</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>reset(values?)</code></td>
                <td className="px-4 py-2 text-muted-foreground">Reset form to initial or new values</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>validate()</code></td>
                <td className="px-4 py-2 text-muted-foreground">Validate all fields</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>setError(name, error)</code></td>
                <td className="px-4 py-2 text-muted-foreground">Set a field error manually</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>clearErrors()</code></td>
                <td className="px-4 py-2 text-muted-foreground">Clear all errors</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
