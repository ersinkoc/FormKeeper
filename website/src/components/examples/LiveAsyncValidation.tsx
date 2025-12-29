import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'
import { useState, FormEvent } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

interface ProfileValues {
  username: string
  displayName: string
}

// Simulated taken usernames
const takenUsernames = ['admin', 'user', 'test', 'demo', 'john', 'jane']

export function LiveAsyncValidation() {
  const [result, setResult] = useState<string | null>(null)

  const form = useForm<ProfileValues>({
    initialValues: {
      username: '',
      displayName: '',
    },
    onSubmit: async (values) => {
      await new Promise(resolve => setTimeout(resolve, 500))
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
        <h2 className="text-2xl font-bold text-center mb-6">Profile Setup</h2>
        <p className="text-sm text-zinc-400 text-center mb-4">
          Try usernames: admin, user, test (taken)
        </p>

        <UsernameField />
        <DisplayNameField />

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md
                     hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {form.formState.isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>

        {result && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
            <p className="text-sm text-green-400 font-medium mb-1">Profile Saved!</p>
            <pre className="text-xs text-green-300 overflow-auto">{result}</pre>
          </div>
        )}
      </form>
    </FormProvider>
  )
}

function UsernameField() {
  const { register, error, touched, validating } = useField('username', {
    required: 'Username is required',
    minLength: { value: 3, message: 'Min 3 characters' },
    validate: async (value: string) => {
      // Simulate API call to check username availability
      await new Promise(resolve => setTimeout(resolve, 800))
      if (takenUsernames.includes(value.toLowerCase())) {
        return 'Username is already taken'
      }
      return true
    },
  })

  const showSuccess = touched && !error && !validating && register().value

  return (
    <div className="space-y-1">
      <label htmlFor="username" className="block text-sm font-medium">Username</label>
      <div className="relative">
        <input
          {...register()}
          id="username"
          placeholder="Choose a username"
          className="w-full px-3 py-2 pr-10 border border-zinc-700 rounded-md bg-zinc-800/50
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {validating && <span className="text-zinc-400 text-xs">...</span>}
          {showSuccess && <CheckCircle className="w-4 h-4 text-green-400" />}
          {touched && error && !validating && <XCircle className="w-4 h-4 text-red-400" />}
        </div>
      </div>
      {touched && error && <p className="text-sm text-red-400">{error}</p>}
      {showSuccess && <p className="text-sm text-green-400">Username is available!</p>}
    </div>
  )
}

function DisplayNameField() {
  const { register, error, touched } = useField('displayName', {
    required: 'Display name is required',
  })

  return (
    <div className="space-y-1">
      <label htmlFor="displayName" className="block text-sm font-medium">Display Name</label>
      <input
        {...register()}
        id="displayName"
        placeholder="John Doe"
        className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {touched && error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
