import { CodeBlock } from '@/components/code/CodeBlock'

export default function UseForm() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">useForm</h1>
      <p className="text-lg text-muted-foreground mb-8">
        The primary React hook for creating and managing form state.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Import</h2>
        <CodeBlock code={`import { useForm } from '@oxog/formkeeper/react'`} language="typescript" />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock
          code={`function LoginForm() {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      await api.login(values)
    },
  })

  return (
    <form onSubmit={form.handleSubmit}>
      {/* form fields */}
    </form>
  )
}`}
          language="tsx"
          filename="LoginForm.tsx"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Options</h2>
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
                <td className="px-4 py-2 text-muted-foreground">TValues</td>
                <td className="px-4 py-2 text-muted-foreground">Initial form values (required)</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>onSubmit</code></td>
                <td className="px-4 py-2 text-muted-foreground">(values) =&gt; void</td>
                <td className="px-4 py-2 text-muted-foreground">Submit handler (required)</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>validate</code></td>
                <td className="px-4 py-2 text-muted-foreground">(values) =&gt; errors</td>
                <td className="px-4 py-2 text-muted-foreground">Form-level validation</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>mode</code></td>
                <td className="px-4 py-2 text-muted-foreground">ValidationMode</td>
                <td className="px-4 py-2 text-muted-foreground">When to validate (default: onBlur)</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>plugins</code></td>
                <td className="px-4 py-2 text-muted-foreground">Plugin[]</td>
                <td className="px-4 py-2 text-muted-foreground">Array of plugins to install</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Return Value</h2>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-border rounded-lg">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left">Property</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>register</code></td>
                <td className="px-4 py-2 text-muted-foreground">(name, rules?) =&gt; FieldReg</td>
                <td className="px-4 py-2 text-muted-foreground">Register a field with optional rules</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>setValue</code></td>
                <td className="px-4 py-2 text-muted-foreground">(name, value) =&gt; void</td>
                <td className="px-4 py-2 text-muted-foreground">Set a field value</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>getValues</code></td>
                <td className="px-4 py-2 text-muted-foreground">(name?) =&gt; any</td>
                <td className="px-4 py-2 text-muted-foreground">Get all or specific value</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>setError</code></td>
                <td className="px-4 py-2 text-muted-foreground">(name, error) =&gt; void</td>
                <td className="px-4 py-2 text-muted-foreground">Set a field error</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>handleSubmit</code></td>
                <td className="px-4 py-2 text-muted-foreground">(e?) =&gt; Promise</td>
                <td className="px-4 py-2 text-muted-foreground">Form submit handler</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>formState</code></td>
                <td className="px-4 py-2 text-muted-foreground">FormState</td>
                <td className="px-4 py-2 text-muted-foreground">Current form state</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">With Validation</h2>
        <CodeBlock
          code={`const form = useForm({
  initialValues: { email: '', password: '' },
  mode: 'onBlur',
  validate: (values) => {
    const errors: FormErrors = {}
    if (!values.email) errors.email = 'Required'
    if (values.password.length < 8) {
      errors.password = 'Minimum 8 characters'
    }
    return errors
  },
  onSubmit: async (values) => {
    await api.register(values)
  },
  onError: (errors) => {
    console.log('Validation failed:', errors)
  }
})`}
          language="tsx"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">With Plugins</h2>
        <CodeBlock
          code={`import { createWizardPlugin, createAutosavePlugin } from '@oxog/formkeeper/plugins'

const form = useForm({
  initialValues: { step1: {}, step2: {} },
  plugins: [
    createWizardPlugin({
      steps: [
        { id: 'step1', fields: ['name', 'email'] },
        { id: 'step2', fields: ['address', 'phone'] }
      ]
    }),
    createAutosavePlugin({
      key: 'my-form-draft',
      debounce: 1000
    })
  ],
  onSubmit: async (values) => { /* ... */ }
})

// Access plugin APIs
const wizard = form.getPlugin('wizard')
wizard.next()

const autosave = form.getPlugin('autosave')
autosave.restore()`}
          language="tsx"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">TypeScript</h2>
        <CodeBlock
          code={`interface FormValues {
  email: string
  password: string
  remember: boolean
}

const form = useForm<FormValues>({
  initialValues: {
    email: '',
    password: '',
    remember: false
  },
  onSubmit: async (values) => {
    // values is typed as FormValues
    console.log(values.email) // string
  }
})`}
          language="tsx"
        />
      </section>
    </div>
  )
}
