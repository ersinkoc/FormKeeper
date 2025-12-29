import { Link } from 'react-router-dom'
import { ArrowRight, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'
import { Card, CardContent } from '@/components/ui/card'

export function QuickStart() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Quick Start</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Build your first form with FormKeeper in 5 minutes.
      </p>

      {/* Step 1 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. Create a Form</h2>
        <p className="text-muted-foreground mb-4">
          Use the <code className="text-primary">useForm</code> hook to create a form instance:
        </p>
        <CodeBlock
          code={`import { useForm, FormProvider } from '@oxog/formkeeper/react'

function LoginForm() {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      // Handle form submission
      console.log('Form submitted:', values)
      await api.login(values)
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        {/* Fields go here */}
      </form>
    </FormProvider>
  )
}`}
          language="tsx"
          filename="LoginForm.tsx"
        />
      </section>

      {/* Step 2 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">2. Register Fields</h2>
        <p className="text-muted-foreground mb-4">
          Use the <code className="text-primary">useField</code> hook to register and validate fields:
        </p>
        <CodeBlock
          code={`import { useField } from '@oxog/formkeeper/react'

function EmailField() {
  const { register, error, touched, value } = useField('email', {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  })

  return (
    <div className="field">
      <label htmlFor="email">Email</label>
      <input
        {...register()}
        type="email"
        id="email"
        placeholder="you@example.com"
      />
      {touched && error && (
        <span className="error">{error}</span>
      )}
    </div>
  )
}

function PasswordField() {
  const { register, error, touched } = useField('password', {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
  })

  return (
    <div className="field">
      <label htmlFor="password">Password</label>
      <input
        {...register()}
        type="password"
        id="password"
        placeholder="********"
      />
      {touched && error && (
        <span className="error">{error}</span>
      )}
    </div>
  )
}`}
          language="tsx"
          filename="Fields.tsx"
        />
      </section>

      {/* Step 3 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">3. Complete Example</h2>
        <p className="text-muted-foreground mb-4">
          Here's the complete login form with all components:
        </p>
        <CodeBlock
          code={`import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

function LoginForm() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      try {
        await api.login(values)
        // Redirect on success
      } catch (err) {
        form.setError('email', 'Invalid credentials')
      }
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit} className="login-form">
        <EmailField />
        <PasswordField />

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </FormProvider>
  )
}

function EmailField() {
  const { register, error, touched } = useField('email', {
    required: 'Email is required',
    pattern: { value: /^\\S+@\\S+$/i, message: 'Invalid email' },
  })

  return (
    <div>
      <input {...register()} type="email" placeholder="Email" />
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}

function PasswordField() {
  const { register, error, touched } = useField('password', {
    required: 'Password is required',
    minLength: { value: 8, message: 'Min 8 characters' },
  })

  return (
    <div>
      <input {...register()} type="password" placeholder="Password" />
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}`}
          language="tsx"
          filename="LoginForm.tsx"
        />
      </section>

      {/* Info Box */}
      <Card className="mb-12 border-blue-500/20 bg-blue-500/5">
        <CardContent className="flex gap-4 pt-6">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Available Validation Rules</h4>
            <p className="text-sm text-muted-foreground">
              FormKeeper supports <code>required</code>, <code>min</code>,{' '}
              <code>max</code>, <code>minLength</code>, <code>maxLength</code>,{' '}
              <code>pattern</code>, and custom <code>validate</code> functions.
              You can also use schema validation with Zod, Yup, or Joi.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">What's Next?</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/docs/concepts/validation">
              Learn Validation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/docs/concepts/array-fields">Array Fields</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/docs/plugins">Explore Plugins</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
