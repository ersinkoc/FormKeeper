import { CodeBlock } from '@/components/code/CodeBlock'
import { PropsTable } from '@/components/code/PropsTable'

export default function ValidationRules() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Validation Rules</h1>
      <p className="lead">
        Complete reference for FormKeeper's built-in validation rules and custom validators.
      </p>

      <h2>Built-in Rules</h2>

      <h3>required</h3>
      <p>Validates that the field has a value.</p>
      <CodeBlock language="typescript">{`// Boolean form
{ required: true }

// With custom message
{ required: 'This field is required' }`}</CodeBlock>

      <h3>min / max</h3>
      <p>Validates numeric minimum and maximum values.</p>
      <CodeBlock language="typescript">{`// Simple form
{ min: 0, max: 100 }

// With custom messages
{
  min: { value: 0, message: 'Must be positive' },
  max: { value: 100, message: 'Cannot exceed 100' }
}`}</CodeBlock>

      <h3>minLength / maxLength</h3>
      <p>Validates string length.</p>
      <CodeBlock language="typescript">{`// Simple form
{ minLength: 3, maxLength: 50 }

// With custom messages
{
  minLength: { value: 3, message: 'At least 3 characters' },
  maxLength: { value: 50, message: 'Maximum 50 characters' }
}`}</CodeBlock>

      <h3>pattern</h3>
      <p>Validates against a regular expression.</p>
      <CodeBlock language="typescript">{`// Simple form (uses default message)
{ pattern: /^[a-zA-Z]+$/ }

// With custom message
{
  pattern: {
    value: /^[a-zA-Z]+$/,
    message: 'Only letters allowed'
  }
}`}</CodeBlock>

      <h2>Common Patterns</h2>

      <PropsTable
        props={[
          { name: 'Email', type: '/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/', description: 'Basic email format' },
          { name: 'Phone', type: '/^\\+?[\\d\\s-]{10,}$/', description: 'Phone with optional + and spaces' },
          { name: 'URL', type: '/^https?:\\/\\/[\\w.-]+\\.[a-z]{2,}/', description: 'HTTP/HTTPS URLs' },
          { name: 'Alphanumeric', type: '/^[a-zA-Z0-9]+$/', description: 'Letters and numbers only' },
          { name: 'ZIP Code (US)', type: '/^\\d{5}(-\\d{4})?$/', description: '5 or 9 digit ZIP' },
          { name: 'Credit Card', type: '/^\\d{16}$/', description: '16 digit card number' },
          { name: 'Strong Password', type: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$/', description: 'Upper, lower, number, 8+ chars' },
        ]}
      />

      <h2>Custom Validation</h2>

      <h3>Single Validator</h3>
      <CodeBlock language="typescript">{`form.register('password', {
  validate: (value) => {
    if (!value) return 'Password is required'
    if (value.length < 8) return 'Minimum 8 characters'
    if (!/[A-Z]/.test(value)) return 'Need uppercase letter'
    if (!/[0-9]/.test(value)) return 'Need a number'
    return true // Valid
  }
})`}</CodeBlock>

      <h3>Multiple Named Validators</h3>
      <CodeBlock language="typescript">{`form.register('username', {
  validate: {
    required: (value) => !!value || 'Username is required',
    noSpaces: (value) => !value.includes(' ') || 'No spaces allowed',
    minLength: (value) => value.length >= 3 || 'At least 3 characters',
    maxLength: (value) => value.length <= 20 || 'Maximum 20 characters',
    alphanumeric: (value) => /^[a-zA-Z0-9_]+$/.test(value) || 'Letters, numbers, underscore only'
  }
})`}</CodeBlock>

      <h3>Access Other Form Values</h3>
      <CodeBlock language="typescript">{`form.register('confirmPassword', {
  validate: (value, formValues) => {
    return value === formValues.password || 'Passwords must match'
  }
})`}</CodeBlock>

      <h2>Async Validation</h2>
      <CodeBlock language="typescript">{`form.register('email', {
  validate: async (value) => {
    // Skip if empty (let required handle it)
    if (!value) return true

    // Call API to check availability
    const response = await fetch(\`/api/check-email?email=\${value}\`)
    const { available } = await response.json()

    return available || 'This email is already registered'
  }
})

// Combine with other rules
form.register('username', {
  required: 'Username is required',
  minLength: { value: 3, message: 'Min 3 characters' },
  validate: async (value) => {
    const available = await checkUsername(value)
    return available || 'Username taken'
  }
})`}</CodeBlock>

      <h2>Dependent Field Validation</h2>
      <CodeBlock language="typescript">{`// Re-validate when dependent fields change
form.register('endDate', {
  validate: (value, formValues) => {
    if (!value || !formValues.startDate) return true
    const start = new Date(formValues.startDate)
    const end = new Date(value)
    return end > start || 'End date must be after start date'
  },
  deps: ['startDate'] // Re-validate when startDate changes
})

// Conditional required
form.register('billingAddress', {
  validate: (value, formValues) => {
    if (formValues.sameAsShipping) return true
    return !!value || 'Billing address is required'
  },
  deps: ['sameAsShipping']
})`}</CodeBlock>

      <h2>Form-Level Validation</h2>
      <CodeBlock language="typescript">{`const form = createForm({
  initialValues: {
    startDate: '',
    endDate: '',
    items: []
  },
  validate: (values) => {
    const errors = {}

    // Cross-field validation
    if (values.startDate && values.endDate) {
      if (new Date(values.endDate) <= new Date(values.startDate)) {
        errors.endDate = 'End date must be after start date'
      }
    }

    // Array validation
    if (values.items.length === 0) {
      errors.items = 'At least one item is required'
    }

    // Complex business rules
    const total = values.items.reduce((sum, item) => sum + item.price, 0)
    if (total > 10000) {
      errors.items = 'Order total cannot exceed $10,000'
    }

    return errors
  },
  onSubmit: async (values) => { /* ... */ }
})`}</CodeBlock>

      <h2>Validation Modes</h2>
      <CodeBlock language="typescript">{`const form = createForm({
  initialValues: { email: '' },

  // When to first validate
  mode: 'onBlur', // 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all'

  // When to re-validate after first error
  reValidateMode: 'onChange',

  // Delay before showing errors (debounce)
  delayError: 500,

  onSubmit: async (values) => { /* ... */ }
})`}</CodeBlock>

      <h2>Validation Utility Functions</h2>
      <CodeBlock language="typescript">{`// Create reusable validators
const validators = {
  email: (value: string) => {
    if (!value) return 'Email is required'
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
      return 'Invalid email format'
    }
    return true
  },

  password: (value: string) => {
    if (!value) return 'Password is required'
    if (value.length < 8) return 'Minimum 8 characters'
    if (!/[A-Z]/.test(value)) return 'Need uppercase letter'
    if (!/[a-z]/.test(value)) return 'Need lowercase letter'
    if (!/[0-9]/.test(value)) return 'Need a number'
    return true
  },

  phone: (value: string) => {
    if (!value) return true // Optional
    if (!/^\\+?[\\d\\s-]{10,}$/.test(value)) {
      return 'Invalid phone number'
    }
    return true
  }
}

// Use in forms
form.register('email', { validate: validators.email })
form.register('password', { validate: validators.password })`}</CodeBlock>
    </div>
  )
}
