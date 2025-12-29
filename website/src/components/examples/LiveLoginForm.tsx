import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'
import { useState, FormEvent } from 'react'

interface LoginValues {
  email: string
  password: string
}

export function LiveLoginForm() {
  const [result, setResult] = useState<string | null>(null)

  const form = useForm<LoginValues>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setResult(JSON.stringify(values, null, 2))
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.handleSubmit()
  }

  return (
    <FormProvider form={form}>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <EmailField />
        <PasswordField />

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md
                     hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        {result && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
            <p className="text-sm text-green-400 font-medium mb-1">Success!</p>
            <pre className="text-xs text-green-300 overflow-auto">{result}</pre>
          </div>
        )}
      </form>
    </FormProvider>
  )
}

function EmailField() {
  const { register, error, touched } = useField('email', {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
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
        className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {touched && error && (
        <p className="text-sm text-red-400">{error}</p>
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
        className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {touched && error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
