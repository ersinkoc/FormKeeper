import { CodeBlock } from '@/components/code/CodeBlock'

export default function NestedFields() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Nested Fields</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Handle complex form structures with deeply nested objects using dot notation paths.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-muted-foreground mb-4">
          Real-world forms often need to represent structured data with nested objects.
          FormKeeper fully supports nested field paths using dot notation, making it easy
          to work with complex data structures.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Defining Nested Initial Values</h2>

        <CodeBlock
          code={`import { createForm } from '@oxog/formkeeper'

interface UserProfile {
  personal: {
    firstName: string
    lastName: string
    dateOfBirth: string
  }
  contact: {
    email: string
    phone: string
    address: {
      street: string
      city: string
      country: string
      zip: string
    }
  }
  preferences: {
    newsletter: boolean
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
  }
}

const form = createForm<UserProfile>({
  initialValues: {
    personal: {
      firstName: '',
      lastName: '',
      dateOfBirth: ''
    },
    contact: {
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        country: '',
        zip: ''
      }
    },
    preferences: {
      newsletter: false,
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  },
  onSubmit: async (values) => {
    console.log(values.contact.address.city) // Type-safe access
  }
})`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Registering Nested Fields</h2>
        <p className="text-muted-foreground mb-4">
          Use dot notation to register nested fields:
        </p>

        <CodeBlock
          code={`// Register with dot notation
form.register('personal.firstName', { required: 'First name is required' })
form.register('contact.address.city', { required: 'City is required' })
form.register('preferences.notifications.email')`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">React Example</h2>

        <CodeBlock
          code={`import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

function ProfileForm() {
  const form = useForm<UserProfile>({
    initialValues: { /* ... */ },
    onSubmit: async (values) => saveProfile(values)
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <PersonalSection />
        <AddressSection />
        <NotificationSettings />
        <button type="submit">Save Profile</button>
      </form>
    </FormProvider>
  )
}

function PersonalSection() {
  const firstName = useField('personal.firstName', { required: 'Required' })
  const lastName = useField('personal.lastName', { required: 'Required' })

  return (
    <section>
      <h2>Personal Information</h2>
      <input {...firstName.register()} placeholder="First Name" />
      <input {...lastName.register()} placeholder="Last Name" />
    </section>
  )
}

function AddressSection() {
  const street = useField('contact.address.street')
  const city = useField('contact.address.city', { required: 'Required' })
  const country = useField('contact.address.country')
  const zip = useField('contact.address.zip')

  return (
    <section>
      <h2>Address</h2>
      <input {...street.register()} placeholder="Street" />
      <input {...city.register()} placeholder="City" />
      <input {...country.register()} placeholder="Country" />
      <input {...zip.register()} placeholder="ZIP Code" />
    </section>
  )
}

function NotificationSettings() {
  const emailNotif = useField('preferences.notifications.email')
  const smsNotif = useField('preferences.notifications.sms')
  const pushNotif = useField('preferences.notifications.push')

  return (
    <section>
      <h2>Notifications</h2>
      <label>
        <input {...emailNotif.register()} type="checkbox" />
        Email notifications
      </label>
      <label>
        <input {...smsNotif.register()} type="checkbox" />
        SMS notifications
      </label>
      <label>
        <input {...pushNotif.register()} type="checkbox" />
        Push notifications
      </label>
    </section>
  )
}`}
          language="tsx"
          filename="ProfileForm.tsx"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Getting and Setting Nested Values</h2>

        <CodeBlock
          code={`// Get nested values
const city = form.getValues('contact.address.city')
const allContact = form.getValues('contact')
const allValues = form.getValues()

// Set nested values
form.setValue('contact.address.city', 'New York')

// Set multiple nested values at once
form.setValues({
  contact: {
    address: {
      city: 'New York',
      country: 'USA'
    }
  }
})`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Nested Field Errors</h2>
        <p className="text-muted-foreground mb-4">
          Errors maintain the same nested structure:
        </p>

        <CodeBlock
          code={`// Get specific nested error
const cityError = form.getError('contact.address.city')

// Set nested error
form.setError('contact.address.city', 'Invalid city name')

// Clear specific nested error
form.clearError('contact.address.city')

// All errors as nested object
const errors = form.getErrors()
// {
//   contact: {
//     address: {
//       city: 'Invalid city name'
//     }
//   }
// }`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Touched and Dirty State</h2>

        <CodeBlock
          code={`// Check if nested field is touched/dirty
const isCityTouched = form.isTouched('contact.address.city')
const isCityDirty = form.isDirty('contact.address.city')

// Get all touched/dirty as nested objects
const touched = form.getTouched()
const dirty = form.getDirty()`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Resetting Nested Fields</h2>

        <CodeBlock
          code={`// Reset entire form
form.reset()

// Reset with partial nested values
form.reset({
  contact: {
    address: {
      city: 'Default City'
    }
  }
})

// Reset specific nested field
form.resetField('contact.address.city')`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Keep nesting to a reasonable depth (3-4 levels max) for maintainability</li>
          <li>Use TypeScript interfaces to define your form structure</li>
          <li>Group related fields in logical sections matching your data model</li>
          <li>Consider using array fields for repeating nested structures</li>
        </ul>
      </section>
    </div>
  )
}
