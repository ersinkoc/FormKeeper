import { CodeBlock } from '@/components/code/CodeBlock'

export default function ErrorHandling() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Error Handling</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Learn how to handle, display, and manage form validation errors effectively.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-muted-foreground mb-4">
          FormKeeper provides a comprehensive error handling system that supports:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
          <li>Built-in validation rules with customizable messages</li>
          <li>Custom validation functions (sync and async)</li>
          <li>Form-level validation</li>
          <li>Manual error setting</li>
          <li>Error display timing control</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Validation Modes</h2>
        <p className="text-muted-foreground mb-4">
          Control when validation runs with the <code className="text-primary">mode</code> option:
        </p>

        <CodeBlock
          code={`const form = createForm({
  initialValues: { email: '' },
  mode: 'onBlur',        // Validate on blur (default)
  reValidateMode: 'onChange', // Re-validate on change after first error
  onSubmit: async (values) => console.log(values)
})

// Available modes:
// - 'onSubmit': Only validate on form submission
// - 'onBlur': Validate when field loses focus
// - 'onChange': Validate on every change
// - 'onTouched': Validate on blur, then on every change
// - 'all': Validate on all events`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Built-in Validation Rules</h2>

        <CodeBlock
          code={`form.register('email', {
  required: 'Email is required',

  minLength: { value: 5, message: 'Minimum 5 characters' },
  maxLength: { value: 100, message: 'Maximum 100 characters' },

  min: { value: 0, message: 'Must be positive' },
  max: { value: 100, message: 'Maximum 100' },

  pattern: {
    value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
    message: 'Invalid email format'
  }
})`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Custom Validation Functions</h2>

        <CodeBlock
          code={`// Single validation function
form.register('password', {
  validate: (value) => {
    if (value.length < 8) return 'Minimum 8 characters'
    if (!/[A-Z]/.test(value)) return 'Needs uppercase letter'
    if (!/[0-9]/.test(value)) return 'Needs a number'
    return true // Valid
  }
})

// Multiple named validators
form.register('username', {
  validate: {
    required: (value) => value ? true : 'Username required',
    noSpaces: (value) => !value.includes(' ') || 'No spaces allowed',
    minLength: (value) => value.length >= 3 || 'Minimum 3 characters'
  }
})`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Async Validation</h2>
        <p className="text-muted-foreground mb-4">
          Validate against APIs or perform expensive checks:
        </p>

        <CodeBlock
          code={`form.register('username', {
  validate: async (value) => {
    // Check if username is available
    const response = await fetch(\`/api/check-username?q=\${value}\`)
    const { available } = await response.json()
    return available || 'Username already taken'
  }
})

// Check if field is currently validating
if (form.isFieldValidating('username')) {
  showLoadingSpinner()
}`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Dependent Field Validation</h2>

        <CodeBlock
          code={`form.register('confirmPassword', {
  validate: (value, formValues) => {
    return value === formValues.password || 'Passwords must match'
  },
  deps: ['password'] // Re-validate when password changes
})`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Form-Level Validation</h2>

        <CodeBlock
          code={`const form = createForm({
  initialValues: { start: '', end: '' },
  validate: (values) => {
    const errors = {}

    if (new Date(values.start) > new Date(values.end)) {
      errors.end = 'End date must be after start date'
    }

    return errors
  },
  onSubmit: async (values) => console.log(values)
})`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Manual Error Management</h2>

        <CodeBlock
          code={`// Set error manually (e.g., from server response)
form.setError('email', 'This email is already registered')

// Clear specific error
form.clearError('email')

// Clear all errors
form.clearErrors()`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Displaying Errors in React</h2>

        <CodeBlock
          code={`function EmailField() {
  const { register, error, touched } = useField('email', {
    required: 'Email is required'
  })

  return (
    <div className="form-group">
      <label>Email</label>
      <input
        {...register()}
        className={touched && error ? 'input-error' : ''}
      />
      {touched && error && (
        <span className="error-message">{error}</span>
      )}
    </div>
  )
}

// Error summary component
function ErrorSummary() {
  const { errors, submitCount } = useFormState({
    select: ['errors', 'submitCount']
  })

  if (submitCount === 0) return null

  const errorList = Object.entries(errors).filter(([_, error]) => error)

  if (errorList.length === 0) return null

  return (
    <div className="error-summary" role="alert">
      <h4>Please fix the following errors:</h4>
      <ul>
        {errorList.map(([field, message]) => (
          <li key={field}>{message}</li>
        ))}
      </ul>
    </div>
  )
}`}
          language="tsx"
          filename="ErrorHandling.tsx"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Error Focus Management</h2>

        <CodeBlock
          code={`const form = createForm({
  initialValues: { email: '', password: '' },
  shouldFocusError: true, // Focus first error on submit
  onSubmit: async (values) => console.log(values)
})

// Or use the focus manager plugin for more control
import { createFocusManagerPlugin } from '@oxog/formkeeper/plugins'

const form = createForm({
  plugins: [
    createFocusManagerPlugin({
      focusFirstError: true,
      scrollToError: true,
      scrollOffset: 100
    })
  ],
  // ...
})`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Delayed Error Display</h2>
        <p className="text-muted-foreground mb-4">
          Prevent errors from flashing during typing:
        </p>

        <CodeBlock
          code={`const form = createForm({
  initialValues: { email: '' },
  delayError: 500, // Wait 500ms before showing errors
  onSubmit: async (values) => console.log(values)
})`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Server-Side Errors</h2>

        <CodeBlock
          code={`const form = createForm({
  initialValues: { email: '', password: '' },
  onSubmit: async (values) => {
    try {
      await api.login(values)
    } catch (error) {
      if (error.field) {
        // Set field-specific error
        form.setError(error.field, error.message)
      } else {
        // Set form-level error
        form.setError('root', error.message)
      }
    }
  }
})`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Show errors only after user interaction (touched state)</li>
          <li>Provide clear, actionable error messages</li>
          <li>Use <code className="text-primary">delayError</code> to prevent errors during typing</li>
          <li>Focus the first error field on submit for accessibility</li>
          <li>Consider showing an error summary for long forms</li>
          <li>Handle both client-side and server-side validation errors</li>
        </ul>
      </section>
    </div>
  )
}
