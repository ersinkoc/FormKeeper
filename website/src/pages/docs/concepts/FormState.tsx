import { CodeBlock } from '@/components/code/CodeBlock'

export default function FormState() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Form State</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Understanding how FormKeeper manages and exposes form state for building reactive UIs.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-muted-foreground mb-4">
          FormKeeper maintains comprehensive state about your form including values, errors,
          touched fields, dirty fields, and submission status. This state is available both
          at the form level and individual field level.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Form State Interface</h2>
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
                <td className="px-4 py-2"><code>values</code></td>
                <td className="px-4 py-2 text-muted-foreground">TValues</td>
                <td className="px-4 py-2 text-muted-foreground">Current form values object</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>errors</code></td>
                <td className="px-4 py-2 text-muted-foreground">FormErrors</td>
                <td className="px-4 py-2 text-muted-foreground">Validation errors for all fields</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>touched</code></td>
                <td className="px-4 py-2 text-muted-foreground">TouchedFields</td>
                <td className="px-4 py-2 text-muted-foreground">Fields that have been focused/blurred</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>dirty</code></td>
                <td className="px-4 py-2 text-muted-foreground">DirtyFields</td>
                <td className="px-4 py-2 text-muted-foreground">Fields with values different from initial</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>isValid</code></td>
                <td className="px-4 py-2 text-muted-foreground">boolean</td>
                <td className="px-4 py-2 text-muted-foreground">True when no validation errors exist</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>isSubmitting</code></td>
                <td className="px-4 py-2 text-muted-foreground">boolean</td>
                <td className="px-4 py-2 text-muted-foreground">True during form submission</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>submitCount</code></td>
                <td className="px-4 py-2 text-muted-foreground">number</td>
                <td className="px-4 py-2 text-muted-foreground">Number of form submission attempts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Accessing State</h2>
        <p className="text-muted-foreground mb-4">
          FormKeeper provides multiple ways to access form state:
        </p>

        <CodeBlock
          code={`import { createForm } from '@oxog/formkeeper'

const form = createForm({
  initialValues: { email: '', password: '' },
  onSubmit: async (values) => console.log(values)
})

// Get all values
const values = form.getValues()

// Get specific value
const email = form.getValues('email')

// Get all errors
const errors = form.getErrors()

// Get specific error
const emailError = form.getError('email')

// Check touched/dirty state
const isEmailTouched = form.isTouched('email')
const isEmailDirty = form.isDirty('email')
const isFormDirty = form.isDirty() // Any field dirty

// Check validation/submission state
const isValid = form.isValid()
const isSubmitting = form.isSubmitting()
const submitCount = form.getSubmitCount()`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">React Hook: useFormState</h2>
        <p className="text-muted-foreground mb-4">
          In React, use <code className="text-primary">useFormState</code> to subscribe to specific state changes:
        </p>

        <CodeBlock
          code={`import { useFormState } from '@oxog/formkeeper/react'

function FormStatus() {
  const { isValid, isSubmitting, submitCount, errors } = useFormState({
    select: ['isValid', 'isSubmitting', 'submitCount', 'errors']
  })

  return (
    <div className="form-status">
      <span>Valid: {isValid ? '✓' : '✗'}</span>
      <span>Submitting: {isSubmitting ? 'Yes' : 'No'}</span>
      <span>Submit attempts: {submitCount}</span>
    </div>
  )
}`}
          language="tsx"
          filename="FormStatus.tsx"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Watching Value Changes</h2>
        <p className="text-muted-foreground mb-4">
          Use the <code className="text-primary">watch</code> API to react to value changes:
        </p>

        <CodeBlock
          code={`// Watch specific field
const unwatch = form.watch('email', (value, prevValue) => {
  console.log('Email changed:', prevValue, '->', value)
})

// Watch all values
const unwatchAll = form.watch((values) => {
  console.log('Form values:', values)
})

// Clean up watchers
unwatch()
unwatchAll()`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h3 className="text-xl font-semibold mb-4">React Hook: useWatch</h3>

        <CodeBlock
          code={`import { useWatch } from '@oxog/formkeeper/react'

function PriceCalculator() {
  const quantity = useWatch('quantity')
  const price = useWatch('unitPrice')
  const total = (quantity || 0) * (price || 0)

  return <div>Total: \${total.toFixed(2)}</div>
}

// Watch with callback
function PriceLogger() {
  useWatch('price', (value, prevValue) => {
    console.log(\`Price changed: \${prevValue} → \${value}\`)
  })
  return null
}`}
          language="tsx"
          filename="WatchExamples.tsx"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Event System</h2>
        <p className="text-muted-foreground mb-4">
          Subscribe to state changes through the event system:
        </p>

        <CodeBlock
          code={`// Subscribe to changes
form.on('change', (event) => {
  console.log(\`Field \${event.name} changed to \${event.value}\`)
})

form.on('validate', (event) => {
  console.log('Validation result:', event.isValid)
})

form.on('submit', (event) => {
  console.log('Form submitted with:', event.values)
})

form.on('state-change', (event) => {
  console.log('Full state update:', event.state)
})`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">State Persistence</h2>
        <p className="text-muted-foreground mb-4">
          Use the Persist plugin to automatically save and restore form state:
        </p>

        <CodeBlock
          code={`import { createForm } from '@oxog/formkeeper'
import { createPersistPlugin } from '@oxog/formkeeper/plugins'

const form = createForm({
  initialValues: { email: '' },
  plugins: [
    createPersistPlugin({
      key: 'my-form',
      storage: localStorage,
      include: ['values', 'touched']
    })
  ],
  onSubmit: async (values) => console.log(values)
})`}
          language="typescript"
        />
      </section>
    </div>
  )
}
