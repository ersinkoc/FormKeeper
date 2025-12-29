import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'
import { useState } from 'react'

interface UserProfileValues {
  personal: {
    firstName: string
    lastName: string
    age: string
  }
  address: {
    street: string
    city: string
    country: string
  }
  preferences: {
    newsletter: boolean
    theme: string
  }
}

export function LiveNestedObjects() {
  const [result, setResult] = useState<string | null>(null)

  const form = useForm<UserProfileValues>({
    initialValues: {
      personal: {
        firstName: '',
        lastName: '',
        age: '',
      },
      address: {
        street: '',
        city: '',
        country: '',
      },
      preferences: {
        newsletter: false,
        theme: 'dark',
      },
    },
    onSubmit: async (values) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      setResult(JSON.stringify(values, null, 2))
    },
  })

  return (
    <FormProvider form={form}>
      <form
        onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}
        className="max-w-md mx-auto p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center mb-6">User Profile</h2>

        {/* Personal Info Section */}
        <fieldset className="border border-zinc-700 rounded-lg p-4">
          <legend className="text-sm font-medium text-zinc-400 px-2">Personal Info</legend>
          <PersonalFields />
        </fieldset>

        {/* Address Section */}
        <fieldset className="border border-zinc-700 rounded-lg p-4">
          <legend className="text-sm font-medium text-zinc-400 px-2">Address</legend>
          <AddressFields />
        </fieldset>

        {/* Preferences Section */}
        <fieldset className="border border-zinc-700 rounded-lg p-4">
          <legend className="text-sm font-medium text-zinc-400 px-2">Preferences</legend>
          <PreferencesFields />
        </fieldset>

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
            <p className="text-sm text-green-400 font-medium mb-1">Saved!</p>
            <pre className="text-xs text-green-300 overflow-auto">{result}</pre>
          </div>
        )}
      </form>
    </FormProvider>
  )
}

function PersonalFields() {
  const firstName = useField('personal.firstName', { required: 'Required' })
  const lastName = useField('personal.lastName', { required: 'Required' })
  const age = useField('personal.age', {
    validate: (value: string) => {
      if (value && (isNaN(Number(value)) || Number(value) < 0)) {
        return 'Must be a valid number'
      }
      return true
    },
  })

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-400">First Name</label>
          <input
            {...firstName.register()}
            placeholder="John"
            className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                       focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {firstName.touched && firstName.error && (
            <p className="text-xs text-red-400">{firstName.error}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-400">Last Name</label>
          <input
            {...lastName.register()}
            placeholder="Doe"
            className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                       focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {lastName.touched && lastName.error && (
            <p className="text-xs text-red-400">{lastName.error}</p>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-400">Age (optional)</label>
        <input
          {...age.register()}
          type="number"
          placeholder="25"
          className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                     focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        {age.touched && age.error && (
          <p className="text-xs text-red-400">{age.error}</p>
        )}
      </div>
    </div>
  )
}

function AddressFields() {
  const street = useField('address.street', { required: 'Required' })
  const city = useField('address.city', { required: 'Required' })
  const country = useField('address.country', { required: 'Required' })

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-400">Street</label>
        <input
          {...street.register()}
          placeholder="123 Main St"
          className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                     focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        {street.touched && street.error && (
          <p className="text-xs text-red-400">{street.error}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-400">City</label>
          <input
            {...city.register()}
            placeholder="New York"
            className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                       focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {city.touched && city.error && (
            <p className="text-xs text-red-400">{city.error}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-400">Country</label>
          <input
            {...country.register()}
            placeholder="USA"
            className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                       focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {country.touched && country.error && (
            <p className="text-xs text-red-400">{country.error}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function PreferencesFields() {
  const newsletter = useField('preferences.newsletter')
  const theme = useField('preferences.theme')

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          {...newsletter.register()}
          type="checkbox"
          className="w-4 h-4 rounded border-zinc-700 bg-zinc-800/50"
        />
        <span className="text-sm">Subscribe to newsletter</span>
      </label>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-400">Theme</label>
        <select
          {...theme.register()}
          className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                     focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
    </div>
  )
}
