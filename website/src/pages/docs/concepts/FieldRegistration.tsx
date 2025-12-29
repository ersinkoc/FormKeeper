import { CodeBlock } from '@/components/code/CodeBlock'

export default function FieldRegistration() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Field Registration</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Learn how FormKeeper tracks and manages form fields through its registration system.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-muted-foreground mb-4">
          Field registration is the process of telling FormKeeper about your form fields.
          When you register a field, FormKeeper starts tracking its value, validation state,
          touched/dirty status, and provides event handlers for user interactions.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Basic Registration</h2>
        <p className="text-muted-foreground mb-4">
          Use the <code className="text-primary">register</code> function to register a field with optional validation rules:
        </p>

        <CodeBlock
          code={`import { createForm } from '@oxog/formkeeper'

const form = createForm({
  initialValues: { email: '', password: '' },
  onSubmit: async (values) => console.log(values)
})

// Register with validation rules
const emailField = form.register('email', {
  required: 'Email is required',
  pattern: {
    value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
    message: 'Invalid email format'
  }
})

// Apply to DOM element
const input = document.querySelector('#email')
input.addEventListener('change', emailField.onChange)
input.addEventListener('blur', emailField.onBlur)
emailField.ref(input)`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Registration Return Value</h2>
        <p className="text-muted-foreground mb-4">
          The <code className="text-primary">register</code> function returns a <code className="text-primary">FieldRegistration</code> object
          containing everything needed to connect a field to FormKeeper:
        </p>

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
                <td className="px-4 py-2"><code>name</code></td>
                <td className="px-4 py-2 text-muted-foreground">string</td>
                <td className="px-4 py-2 text-muted-foreground">The field name/path</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>ref</code></td>
                <td className="px-4 py-2 text-muted-foreground">(element) =&gt; void</td>
                <td className="px-4 py-2 text-muted-foreground">Function to store element reference for focus management</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>onChange</code></td>
                <td className="px-4 py-2 text-muted-foreground">(event) =&gt; void</td>
                <td className="px-4 py-2 text-muted-foreground">Handler for value changes</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>onBlur</code></td>
                <td className="px-4 py-2 text-muted-foreground">(event) =&gt; void</td>
                <td className="px-4 py-2 text-muted-foreground">Handler for blur events (marks field as touched)</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>value</code></td>
                <td className="px-4 py-2 text-muted-foreground">any</td>
                <td className="px-4 py-2 text-muted-foreground">Current field value</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">React Integration</h2>
        <p className="text-muted-foreground mb-4">
          In React, use the <code className="text-primary">useField</code> hook for a more ergonomic API:
        </p>

        <CodeBlock
          code={`import { useField } from '@oxog/formkeeper/react'

function EmailField() {
  const { register, error, touched, dirty } = useField('email', {
    required: 'Email is required',
  })

  return (
    <div>
      <input {...register()} type="email" />
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}`}
          language="tsx"
          filename="EmailField.tsx"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Nested Fields</h2>
        <p className="text-muted-foreground mb-4">
          FormKeeper supports dot notation for nested field paths:
        </p>

        <CodeBlock
          code={`const form = createForm({
  initialValues: {
    user: {
      profile: {
        firstName: '',
        lastName: ''
      }
    }
  },
  onSubmit: async (values) => console.log(values)
})

// Register nested fields
form.register('user.profile.firstName', { required: 'First name is required' })
form.register('user.profile.lastName', { required: 'Last name is required' })`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Unregistering Fields</h2>
        <p className="text-muted-foreground mb-4">
          When a field is removed from the form (e.g., conditional rendering), you can unregister it:
        </p>

        <CodeBlock
          code={`// Unregister a field
form.unregister('email')

// With shouldUnregister option, fields auto-unregister on unmount
const form = createForm({
  initialValues: { email: '' },
  shouldUnregister: true, // Fields removed from DOM are unregistered
  onSubmit: async (values) => console.log(values)
})`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Register fields as early as possible in your component lifecycle</li>
          <li>Always provide the <code className="text-primary">ref</code> callback for focus management to work</li>
          <li>Use consistent naming conventions for nested paths</li>
          <li>Unregister fields when they're removed from conditional sections</li>
        </ul>
      </section>
    </div>
  )
}
