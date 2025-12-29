import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'
import { BrowserWindow } from '@/components/code/BrowserWindow'

const schemaValidationCode = `import { z } from 'zod'
import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'
import { createSchemaPlugin } from '@oxog/formkeeper/plugins/schema'

// Define schema with Zod
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be 18 or older').max(120, 'Invalid age'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
})

type UserValues = z.infer<typeof userSchema>

export function SchemaValidationForm() {
  const form = useForm<UserValues>({
    initialValues: {
      name: '',
      email: '',
      age: 0,
      website: '',
    },
    plugins: [
      createSchemaPlugin({
        schema: userSchema,
        // Options: 'zod' | 'yup' | 'joi'
        adapter: 'zod',
      }),
    ],
    onSubmit: async (values) => {
      console.log('Valid data:', values)
      alert(JSON.stringify(values, null, 2))
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
        <h2 className="text-2xl font-bold">User Profile</h2>

        <NameField />
        <EmailField />
        <AgeField />
        <WebsiteField />

        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md">
          Save Profile
        </button>
      </form>
    </FormProvider>
  )
}

function NameField() {
  const { register, error, touched } = useField('name')
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Name</label>
      <input {...register()} className="w-full px-3 py-2 border rounded-md" />
      {touched && error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

function EmailField() {
  const { register, error, touched } = useField('email')
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Email</label>
      <input {...register()} type="email" className="w-full px-3 py-2 border rounded-md" />
      {touched && error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

function AgeField() {
  const { register, error, touched } = useField('age')
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Age</label>
      <input {...register()} type="number" className="w-full px-3 py-2 border rounded-md" />
      {touched && error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

function WebsiteField() {
  const { register, error, touched } = useField('website')
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Website (optional)</label>
      <input {...register()} placeholder="https://" className="w-full px-3 py-2 border rounded-md" />
      {touched && error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}`

export function SchemaValidationExample() {
  return (
    <div className="container py-12 max-w-5xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/examples">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Examples
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-4">Zod Schema Validation</h1>
        <p className="text-lg text-muted-foreground">
          Form validation using Zod schemas with the SchemaPlugin for type-safe validation.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Preview</h2>
        <BrowserWindow url="localhost:3000/profile">
          <div className="p-8 bg-white dark:bg-zinc-900">
            <div className="max-w-md mx-auto p-6 border rounded-lg">
              <h2 className="text-2xl font-bold mb-6">User Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input className="w-full px-3 py-2 border rounded-md bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full px-3 py-2 border rounded-md bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <input type="number" className="w-full px-3 py-2 border rounded-md bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website (optional)</label>
                  <input placeholder="https://" className="w-full px-3 py-2 border rounded-md bg-background" />
                </div>
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
        <CodeBlock code={schemaValidationCode} language="tsx" filename="SchemaValidationForm.tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>Schema Plugin</strong> - Integrates Zod, Yup, or Joi schemas</div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>Type inference</strong> - Form values are typed from schema</div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>No manual rules</strong> - Validation derived from schema definition</div>
          </li>
        </ul>
      </section>
    </div>
  )
}
