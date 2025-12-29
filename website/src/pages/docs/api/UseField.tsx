import { CodeBlock } from '@/components/code/CodeBlock'

export default function UseField() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">useField</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Hook for registering and managing individual form fields with validation.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Import</h2>
        <CodeBlock code={`import { useField } from '@oxog/formkeeper/react'`} language="typescript" />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock
          code={`function EmailField() {
  const field = useField('email', {
    required: 'Email is required',
    pattern: {
      value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
      message: 'Invalid email format'
    }
  })

  return (
    <div>
      <input {...field.register()} type="email" />
      {field.touched && field.error && (
        <span className="error">{field.error}</span>
      )}
    </div>
  )
}`}
          language="tsx"
          filename="EmailField.tsx"
        />
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
                <td className="px-4 py-2 text-muted-foreground">() =&gt; FieldProps</td>
                <td className="px-4 py-2 text-muted-foreground">Returns props to spread on input</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>value</code></td>
                <td className="px-4 py-2 text-muted-foreground">any</td>
                <td className="px-4 py-2 text-muted-foreground">Current field value</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>error</code></td>
                <td className="px-4 py-2 text-muted-foreground">string | undefined</td>
                <td className="px-4 py-2 text-muted-foreground">Current error message</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>touched</code></td>
                <td className="px-4 py-2 text-muted-foreground">boolean</td>
                <td className="px-4 py-2 text-muted-foreground">True after field has been blurred</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>dirty</code></td>
                <td className="px-4 py-2 text-muted-foreground">boolean</td>
                <td className="px-4 py-2 text-muted-foreground">True if value differs from initial</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>validating</code></td>
                <td className="px-4 py-2 text-muted-foreground">boolean</td>
                <td className="px-4 py-2 text-muted-foreground">True during async validation</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code>setValue</code></td>
                <td className="px-4 py-2 text-muted-foreground">(value) =&gt; void</td>
                <td className="px-4 py-2 text-muted-foreground">Update field value</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Custom Validation</h2>
        <CodeBlock
          code={`// Single validation function
const password = useField('password', {
  validate: (value) => {
    if (value.length < 8) return 'Minimum 8 characters'
    if (!/[A-Z]/.test(value)) return 'Needs uppercase'
    return true
  }
})

// Multiple named validators
const username = useField('username', {
  validate: {
    required: (v) => v ? true : 'Required',
    noSpaces: (v) => !v.includes(' ') || 'No spaces',
    minLength: (v) => v.length >= 3 || 'Min 3 chars'
  }
})`}
          language="tsx"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Async Validation</h2>
        <CodeBlock
          code={`const email = useField('email', {
  validate: async (value) => {
    const available = await checkEmailAvailability(value)
    return available || 'Email already taken'
  }
})

// Show loading state
return (
  <div>
    <input {...email.register()} />
    {email.validating && <span>Checking...</span>}
    {email.error && <span className="error">{email.error}</span>}
  </div>
)`}
          language="tsx"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Dependent Validation</h2>
        <CodeBlock
          code={`import { useWatch } from '@oxog/formkeeper/react'

function ConfirmPasswordField() {
  const password = useWatch('password')

  const confirmPassword = useField('confirmPassword', {
    validate: (value) => {
      return value === password || 'Passwords must match'
    },
    deps: ['password'] // Re-validate when password changes
  })

  return <input {...confirmPassword.register()} type="password" />
}`}
          language="tsx"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">With FormProvider</h2>
        <p className="text-muted-foreground mb-4">
          <code className="text-primary">useField</code> requires a <code className="text-primary">FormProvider</code> parent:
        </p>
        <CodeBlock
          code={`import { useForm, FormProvider, useField } from '@oxog/formkeeper/react'

function Form() {
  const form = useForm({
    initialValues: { email: '' },
    onSubmit: async (values) => console.log(values)
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <EmailField />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  )
}

function EmailField() {
  const { register, error, touched } = useField('email', {
    required: 'Email is required'
  })

  return (
    <div>
      <input {...register()} type="email" />
      {touched && error && <span>{error}</span>}
    </div>
  )
}`}
          language="tsx"
          filename="FormExample.tsx"
        />
      </section>
    </div>
  )
}
