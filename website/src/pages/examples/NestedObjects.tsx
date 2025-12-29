import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'
import { BrowserWindow } from '@/components/code/BrowserWindow'

const nestedObjectsCode = `import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

interface ProfileValues {
  personal: {
    firstName: string
    lastName: string
  }
  address: {
    street: string
    city: string
    country: string
    zip: string
  }
  preferences: {
    newsletter: boolean
    notifications: {
      email: boolean
      sms: boolean
    }
  }
}

export function NestedObjectsForm() {
  const form = useForm<ProfileValues>({
    initialValues: {
      personal: { firstName: '', lastName: '' },
      address: { street: '', city: '', country: '', zip: '' },
      preferences: {
        newsletter: false,
        notifications: { email: true, sms: false },
      },
    },
    onSubmit: async (values) => {
      console.log('Profile saved:', values)
      alert(JSON.stringify(values, null, 2))
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit} className="max-w-lg mx-auto p-6 space-y-8">
        <h2 className="text-2xl font-bold">Edit Profile</h2>

        <PersonalSection />
        <AddressSection />
        <PreferencesSection />

        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md">
          Save Profile
        </button>
      </form>
    </FormProvider>
  )
}

function PersonalSection() {
  const firstName = useField('personal.firstName', { required: 'Required' })
  const lastName = useField('personal.lastName', { required: 'Required' })

  return (
    <section>
      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">First Name</label>
          <input {...firstName.register()} className="w-full px-3 py-2 border rounded-md" />
          {firstName.error && <p className="text-sm text-red-500">{firstName.error}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Last Name</label>
          <input {...lastName.register()} className="w-full px-3 py-2 border rounded-md" />
          {lastName.error && <p className="text-sm text-red-500">{lastName.error}</p>}
        </div>
      </div>
    </section>
  )
}

function AddressSection() {
  const street = useField('address.street', { required: 'Required' })
  const city = useField('address.city', { required: 'Required' })
  const country = useField('address.country', { required: 'Required' })
  const zip = useField('address.zip')

  return (
    <section>
      <h3 className="text-lg font-semibold mb-4">Address</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Street</label>
          <input {...street.register()} className="w-full px-3 py-2 border rounded-md" />
          {street.error && <p className="text-sm text-red-500">{street.error}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">City</label>
            <input {...city.register()} className="w-full px-3 py-2 border rounded-md" />
            {city.error && <p className="text-sm text-red-500">{city.error}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">ZIP</label>
            <input {...zip.register()} className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Country</label>
          <input {...country.register()} className="w-full px-3 py-2 border rounded-md" />
          {country.error && <p className="text-sm text-red-500">{country.error}</p>}
        </div>
      </div>
    </section>
  )
}

function PreferencesSection() {
  const newsletter = useField('preferences.newsletter')
  const emailNotif = useField('preferences.notifications.email')
  const smsNotif = useField('preferences.notifications.sms')

  return (
    <section>
      <h3 className="text-lg font-semibold mb-4">Preferences</h3>
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input {...newsletter.register()} type="checkbox" />
          <span>Subscribe to newsletter</span>
        </label>
        <div className="ml-6 space-y-2">
          <p className="text-sm font-medium">Notifications</p>
          <label className="flex items-center gap-2">
            <input {...emailNotif.register()} type="checkbox" />
            <span className="text-sm">Email notifications</span>
          </label>
          <label className="flex items-center gap-2">
            <input {...smsNotif.register()} type="checkbox" />
            <span className="text-sm">SMS notifications</span>
          </label>
        </div>
      </div>
    </section>
  )
}`

export function NestedObjectsExample() {
  return (
    <div className="container py-12 max-w-5xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/examples">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Examples
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-4">Nested Objects</h1>
        <p className="text-lg text-muted-foreground">
          Handle complex nested form data with dot notation paths for deeply nested values.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Preview</h2>
        <BrowserWindow url="localhost:3000/profile">
          <div className="p-8 bg-white dark:bg-zinc-900">
            <div className="max-w-lg mx-auto p-6 border rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">First Name</label>
                      <input className="w-full px-3 py-2 border rounded-md bg-background" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Last Name</label>
                      <input className="w-full px-3 py-2 border rounded-md bg-background" />
                    </div>
                  </div>
                </section>
                <section>
                  <h3 className="text-lg font-semibold mb-4">Address</h3>
                  <div className="space-y-3">
                    <input placeholder="Street" className="w-full px-3 py-2 border rounded-md bg-background" />
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="City" className="px-3 py-2 border rounded-md bg-background" />
                      <input placeholder="ZIP" className="px-3 py-2 border rounded-md bg-background" />
                    </div>
                  </div>
                </section>
                <button className="w-full py-2 bg-blue-600 text-white rounded-md">Save Profile</button>
              </div>
            </div>
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
        <CodeBlock code={nestedObjectsCode} language="tsx" filename="NestedObjectsForm.tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>Dot notation</strong> - Access nested values with paths like "address.city"</div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>Deep nesting</strong> - Support for any depth: "preferences.notifications.email"</div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>Type safety</strong> - Full TypeScript inference for nested paths</div>
          </li>
        </ul>
      </section>
    </div>
  )
}
