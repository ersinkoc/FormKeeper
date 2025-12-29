import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'
import { BrowserWindow } from '@/components/code/BrowserWindow'
import { LiveAsyncValidation } from '@/components/examples'

const asyncValidationCode = `import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

// Simulated API call to check username availability
async function checkUsername(username: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 500))
  const taken = ['admin', 'user', 'test', 'root']
  return !taken.includes(username.toLowerCase())
}

interface SignupValues {
  username: string
  email: string
  password: string
}

export function AsyncValidationForm() {
  const form = useForm<SignupValues>({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      console.log('Signup:', values)
      alert('Account created!')
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        <UsernameField />
        <EmailField />
        <PasswordField />

        <button
          type="submit"
          disabled={form.formState.isSubmitting || form.formState.isValidating}
          className="w-full py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          Create Account
        </button>
      </form>
    </FormProvider>
  )
}

function UsernameField() {
  const { register, error, touched, isValidating } = useField('username', {
    required: 'Username is required',
    minLength: { value: 3, message: 'At least 3 characters' },
    validate: {
      // Debounced async validation
      available: async (value) => {
        if (value.length < 3) return true // Skip if too short
        const available = await checkUsername(value)
        return available || 'Username is already taken'
      },
    },
  })

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">Username</label>
      <div className="relative">
        <input
          {...register()}
          className="w-full px-3 py-2 pr-10 border rounded-md"
          placeholder="Choose a username"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isValidating && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
          {!isValidating && touched && !error && (
            <Check className="w-4 h-4 text-green-500" />
          )}
          {!isValidating && error && (
            <X className="w-4 h-4 text-red-500" />
          )}
        </div>
      </div>
      {touched && error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

// EmailField and PasswordField similar to previous examples...`

export function AsyncValidationExample() {
  return (
    <div className="container py-12 max-w-5xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/examples">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Examples
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-4">Async Validation</h1>
        <p className="text-lg text-muted-foreground">
          Username availability check with debounced async validation and loading states.
        </p>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Live Preview</h2>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Interactive</span>
        </div>
        <BrowserWindow url="localhost:3000/signup">
          <div className="bg-zinc-900">
            <LiveAsyncValidation />
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
        <CodeBlock code={asyncValidationCode} language="tsx" filename="AsyncValidationForm.tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>Async validators</strong> - Return Promises for server-side validation</div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>isValidating</strong> - Track async validation state per field</div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>Debouncing</strong> - Built-in debounce for async validators</div>
          </li>
        </ul>
      </section>
    </div>
  )
}
