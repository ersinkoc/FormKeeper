import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'
import { BrowserWindow } from '@/components/code/BrowserWindow'

const loginFormCode = `import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

interface LoginValues {
  email: string
  password: string
}

export function LoginForm() {
  const form = useForm<LoginValues>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Login successful:', values)
      alert('Login successful!')
    },
  })

  return (
    <FormProvider form={form}>
      <form
        onSubmit={form.handleSubmit}
        className="max-w-md mx-auto p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <EmailField />
        <PasswordField />

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md
                     hover:bg-blue-700 disabled:opacity-50"
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
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  })

  return (
    <div className="space-y-1">
      <label htmlFor="email" className="block text-sm font-medium">
        Email
      </label>
      <input
        {...register()}
        type="email"
        id="email"
        placeholder="you@example.com"
        className="w-full px-3 py-2 border rounded-md focus:outline-none
                   focus:ring-2 focus:ring-blue-500"
      />
      {touched && error && (
        <p className="text-sm text-red-500">{error}</p>
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
    <div className="space-y-1">
      <label htmlFor="password" className="block text-sm font-medium">
        Password
      </label>
      <input
        {...register()}
        type="password"
        id="password"
        placeholder="********"
        className="w-full px-3 py-2 border rounded-md focus:outline-none
                   focus:ring-2 focus:ring-blue-500"
      />
      {touched && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}`

export function LoginFormExample() {
  return (
    <div className="container py-12 max-w-5xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/examples">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Examples
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-4">Login Form</h1>
        <p className="text-lg text-muted-foreground">
          A basic login form with email and password validation. This example
          demonstrates the core FormKeeper API for handling simple forms.
        </p>
      </div>

      {/* Preview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Preview</h2>
        <BrowserWindow url="localhost:3000/login">
          <div className="p-8 bg-white dark:bg-zinc-900">
            <div className="max-w-md mx-auto p-6 border rounded-lg">
              <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="********"
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </div>
                <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Login
                </button>
              </div>
            </div>
          </div>
        </BrowserWindow>
      </section>

      {/* Source Code */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Source Code</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/playground">
              Open in Playground
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        <CodeBlock
          code={loginFormCode}
          language="tsx"
          filename="LoginForm.tsx"
        />
      </section>

      {/* Key Concepts */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div>
              <strong>useForm</strong> - Creates a form instance with initial
              values and submit handler
            </div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div>
              <strong>useField</strong> - Registers a field with validation rules
              and returns field state
            </div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div>
              <strong>FormProvider</strong> - Provides form context to child
              components
            </div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div>
              <strong>register()</strong> - Returns props to spread on input
              elements
            </div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div>
              <strong>touched & error</strong> - Shows errors only after user
              interacts with field
            </div>
          </li>
        </ul>
      </section>
    </div>
  )
}
