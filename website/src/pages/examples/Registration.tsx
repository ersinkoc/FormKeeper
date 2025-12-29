import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'
import { BrowserWindow } from '@/components/code/BrowserWindow'
import { LiveRegistrationForm } from '@/components/examples'

const registrationCode = `import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

interface RegistrationValues {
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export function RegistrationForm() {
  const form = useForm<RegistrationValues>({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    onSubmit: async (values) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Registration successful:', values)
      alert('Account created!')
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <EmailField />
        <PasswordField />
        <ConfirmPasswordField />
        <TermsField />

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
        >
          {form.formState.isSubmitting ? 'Creating...' : 'Create Account'}
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
      <label className="block text-sm font-medium">Email</label>
      <input {...register()} type="email" className="w-full px-3 py-2 border rounded-md" />
      {touched && error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

function PasswordField() {
  const { register, error, touched } = useField('password', {
    required: 'Password is required',
    minLength: { value: 8, message: 'Password must be at least 8 characters' },
  })

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">Password</label>
      <input {...register()} type="password" className="w-full px-3 py-2 border rounded-md" />
      {touched && error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

function ConfirmPasswordField() {
  const { register, error, touched } = useField('confirmPassword', {
    required: 'Please confirm your password',
    validate: (value, values) =>
      value === values.password || 'Passwords do not match',
  })

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">Confirm Password</label>
      <input {...register()} type="password" className="w-full px-3 py-2 border rounded-md" />
      {touched && error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

function TermsField() {
  const { register, error, touched } = useField('acceptTerms', {
    validate: (value) => value === true || 'You must accept the terms',
  })

  return (
    <div className="space-y-1">
      <label className="flex items-center gap-2">
        <input {...register()} type="checkbox" className="rounded" />
        <span className="text-sm">I accept the terms and conditions</span>
      </label>
      {touched && error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}`

export function RegistrationExample() {
  return (
    <div className="container py-12 max-w-5xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/examples">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Examples
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-4">Registration Form</h1>
        <p className="text-lg text-muted-foreground">
          A multi-field registration form with password confirmation and terms checkbox validation.
        </p>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Live Preview</h2>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Interactive</span>
        </div>
        <BrowserWindow url="localhost:3000/register">
          <div className="bg-zinc-900">
            <LiveRegistrationForm />
          </div>
        </BrowserWindow>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Source Code</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/playground"><ExternalLink className="w-4 h-4 mr-2" />Open in Playground</Link>
          </Button>
        </div>
        <CodeBlock code={registrationCode} language="tsx" filename="RegistrationForm.tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>Cross-field validation</strong> - Validate confirm password against password field</div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>Checkbox validation</strong> - Ensure required checkbox is checked</div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>Custom validate function</strong> - Access all form values in validator</div>
          </li>
        </ul>
      </section>
    </div>
  )
}
