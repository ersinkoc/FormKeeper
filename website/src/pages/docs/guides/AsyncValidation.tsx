import { CodeBlock } from '@/components/code/CodeBlock'

export default function AsyncValidation() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Async Validation</h1>
      <p className="lead">
        Implement server-side validation, availability checks, and complex async validators.
      </p>

      <h2>Basic Async Validation</h2>
      <CodeBlock language="tsx">{`import { useField } from '@oxog/formkeeper/react'

function EmailField() {
  const { register, error, touched, validating } = useField('email', {
    required: 'Email is required',
    pattern: {
      value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
      message: 'Invalid email format'
    },
    // Async validation
    validate: async (value) => {
      if (!value) return true

      // Check email availability
      const response = await fetch(\`/api/check-email?email=\${value}\`)
      const { available } = await response.json()

      return available || 'This email is already registered'
    }
  })

  return (
    <div className="form-group">
      <label>Email</label>
      <div className="input-wrapper">
        <input {...register()} type="email" />
        {validating && <span className="loading-spinner" />}
      </div>
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}`}</CodeBlock>

      <h2>Debounced Validation</h2>
      <p>
        Prevent excessive API calls during typing:
      </p>

      <CodeBlock language="typescript">{`import { createForm } from '@oxog/formkeeper'

// Method 1: Use delayError option
const form = createForm({
  initialValues: { username: '' },
  delayError: 500, // Wait 500ms before validating
  onSubmit: async (values) => console.log(values)
})

// Method 2: Debounce in validation function
function debounce<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout

  return ((...args: Parameters<T>) => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(async () => {
        resolve(await fn(...args))
      }, delay)
    })
  }) as T
}

const checkUsername = debounce(async (username: string) => {
  const response = await fetch(\`/api/check-username?q=\${username}\`)
  return response.json()
}, 300)

form.register('username', {
  validate: async (value) => {
    if (!value || value.length < 3) return true

    const { available } = await checkUsername(value)
    return available || 'Username taken'
  }
})`}</CodeBlock>

      <h2>Abort Previous Validation</h2>
      <CodeBlock language="typescript">{`function createAbortableValidator(
  validateFn: (value: string, signal: AbortSignal) => Promise<string | true>
) {
  let abortController: AbortController | null = null

  return async (value: string) => {
    // Abort previous validation
    if (abortController) {
      abortController.abort()
    }

    // Create new abort controller
    abortController = new AbortController()

    try {
      return await validateFn(value, abortController.signal)
    } catch (error) {
      if (error.name === 'AbortError') {
        return true // Ignore aborted validations
      }
      throw error
    }
  }
}

// Usage
const validateEmail = createAbortableValidator(async (email, signal) => {
  const response = await fetch(\`/api/check-email?email=\${email}\`, { signal })
  const { available } = await response.json()
  return available || 'Email already registered'
})

form.register('email', { validate: validateEmail })`}</CodeBlock>

      <h2>Multiple Async Validators</h2>
      <CodeBlock language="tsx">{`function UsernameField() {
  const { register, error, touched, validating } = useField('username', {
    validate: {
      // Sync validators run first
      minLength: (value) => value.length >= 3 || 'Min 3 characters',
      pattern: (value) => /^[a-z0-9_]+$/i.test(value) || 'Letters, numbers, underscore only',

      // Async validators
      available: async (value) => {
        if (value.length < 3) return true // Skip if too short

        const response = await fetch(\`/api/username/\${value}\`)
        const { available } = await response.json()
        return available || 'Username taken'
      },

      notBanned: async (value) => {
        const response = await fetch('/api/banned-usernames')
        const { banned } = await response.json()
        return !banned.includes(value.toLowerCase()) || 'This username is not allowed'
      }
    }
  })

  return (
    <div className="form-group">
      <label>Username</label>
      <input {...register()} />
      {validating && <span>Checking availability...</span>}
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}`}</CodeBlock>

      <h2>Validation Status Indicator</h2>
      <CodeBlock language="tsx">{`function FieldWithStatus({ name, label, rules }) {
  const field = useField(name, rules)

  const getStatusIcon = () => {
    if (field.validating) return '⏳'
    if (field.touched && field.error) return '❌'
    if (field.touched && !field.error && field.value) return '✅'
    return null
  }

  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="input-with-status">
        <input {...field.register()} />
        <span className="status-icon">{getStatusIcon()}</span>
      </div>
      {field.touched && field.error && (
        <span className="error">{field.error}</span>
      )}
    </div>
  )
}`}</CodeBlock>

      <h2>Validation with Loading State</h2>
      <CodeBlock language="tsx">{`function AsyncFormField({ name, validateAsync }) {
  const [isValidating, setIsValidating] = useState(false)

  const field = useField(name, {
    validate: async (value) => {
      setIsValidating(true)
      try {
        return await validateAsync(value)
      } finally {
        setIsValidating(false)
      }
    }
  })

  return (
    <div className="form-group">
      <input
        {...field.register()}
        disabled={isValidating}
      />
      {isValidating && <LoadingSpinner />}
      {field.error && <ErrorMessage>{field.error}</ErrorMessage>}
    </div>
  )
}`}</CodeBlock>

      <h2>Server-Side Validation on Submit</h2>
      <CodeBlock language="tsx">{`function RegistrationForm() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      try {
        await api.register(values)
      } catch (error) {
        // Handle server validation errors
        if (error.response?.status === 400) {
          const { errors } = error.response.data

          // Set errors from server
          Object.entries(errors).forEach(([field, message]) => {
            form.setError(field, message as string)
          })
        } else {
          // Generic error
          form.setError('root', 'Registration failed. Please try again.')
        }
      }
    }
  })

  const rootError = form.getError('root')

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        {rootError && (
          <div className="error-banner">{rootError}</div>
        )}

        <EmailField />
        <PasswordField />

        <button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </FormProvider>
  )
}`}</CodeBlock>

      <h2>Cross-Field Async Validation</h2>
      <CodeBlock language="tsx">{`function PasswordFields() {
  const password = useField('password', {
    required: 'Password is required',
    minLength: { value: 8, message: 'Min 8 characters' }
  })

  const confirmPassword = useField('confirmPassword', {
    validate: async (value, formValues) => {
      // Sync check first
      if (value !== formValues.password) {
        return 'Passwords must match'
      }

      // Async password strength check
      const response = await fetch('/api/check-password-strength', {
        method: 'POST',
        body: JSON.stringify({ password: value })
      })
      const { score, feedback } = await response.json()

      if (score < 3) {
        return \`Weak password: \${feedback}\`
      }

      return true
    },
    deps: ['password'] // Re-validate when password changes
  })

  return (
    <>
      <div className="form-group">
        <label>Password</label>
        <input {...password.register()} type="password" />
      </div>
      <div className="form-group">
        <label>Confirm Password</label>
        <input {...confirmPassword.register()} type="password" />
        {confirmPassword.validating && <span>Checking...</span>}
      </div>
    </>
  )
}`}</CodeBlock>

      <h2>Caching Validation Results</h2>
      <CodeBlock language="typescript">{`const validationCache = new Map<string, { result: boolean; timestamp: number }>()
const CACHE_TTL = 30000 // 30 seconds

async function cachedValidation(
  key: string,
  validateFn: () => Promise<string | true>
): Promise<string | true> {
  const cached = validationCache.get(key)

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result ? true : 'Already checked and taken'
  }

  const result = await validateFn()
  validationCache.set(key, {
    result: result === true,
    timestamp: Date.now()
  })

  return result
}

// Usage
form.register('email', {
  validate: (value) => cachedValidation(
    \`email:\${value}\`,
    () => checkEmailAvailability(value)
  )
})`}</CodeBlock>
    </div>
  )
}
