import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'
import { BrowserWindow } from '@/components/code/BrowserWindow'

const dynamicFieldsCode = `import { useForm, useField, useFieldArray, FormProvider } from '@oxog/formkeeper/react'

interface FormValues {
  teamName: string
  members: { name: string; email: string }[]
}

export function DynamicFieldsForm() {
  const form = useForm<FormValues>({
    initialValues: {
      teamName: '',
      members: [{ name: '', email: '' }],
    },
    onSubmit: async (values) => {
      console.log('Team submitted:', values)
      alert(JSON.stringify(values, null, 2))
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit} className="max-w-lg mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold">Create Team</h2>

        <TeamNameField />
        <MembersList />

        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md">
          Create Team
        </button>
      </form>
    </FormProvider>
  )
}

function TeamNameField() {
  const { register, error } = useField('teamName', {
    required: 'Team name is required',
  })

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Team Name</label>
      <input {...register()} className="w-full px-3 py-2 border rounded-md" />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

function MembersList() {
  const { fields, append, remove } = useFieldArray('members')

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Team Members</h3>
        <button
          type="button"
          onClick={() => append({ name: '', email: '' })}
          className="flex items-center gap-1 text-blue-600 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 items-start">
          <MemberField index={index} />
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

function MemberField({ index }: { index: number }) {
  const name = useField(\`members.\${index}.name\`, { required: 'Name required' })
  const email = useField(\`members.\${index}.email\`, {
    required: 'Email required',
    pattern: { value: /^[^\\s@]+@[^\\s@]+$/, message: 'Invalid email' },
  })

  return (
    <div className="flex-1 grid grid-cols-2 gap-2">
      <div>
        <input {...name.register()} placeholder="Name" className="w-full px-3 py-2 border rounded-md" />
        {name.error && <p className="text-xs text-red-500">{name.error}</p>}
      </div>
      <div>
        <input {...email.register()} placeholder="Email" className="w-full px-3 py-2 border rounded-md" />
        {email.error && <p className="text-xs text-red-500">{email.error}</p>}
      </div>
    </div>
  )
}`

export function DynamicFieldsExample() {
  return (
    <div className="container py-12 max-w-5xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/examples">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Examples
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-4">Dynamic Fields</h1>
        <p className="text-lg text-muted-foreground">
          Add and remove form fields dynamically using the useFieldArray hook.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Preview</h2>
        <BrowserWindow url="localhost:3000/team">
          <div className="p-8 bg-white dark:bg-zinc-900">
            <div className="max-w-lg mx-auto p-6 border rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Create Team</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Team Name</label>
                  <input className="w-full px-3 py-2 border rounded-md bg-background" />
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Team Members</h3>
                  <button className="flex items-center gap-1 text-blue-600 text-sm">
                    <Plus className="w-4 h-4" /> Add Member
                  </button>
                </div>
                <div className="flex gap-2">
                  <input placeholder="Name" className="flex-1 px-3 py-2 border rounded-md bg-background" />
                  <input placeholder="Email" className="flex-1 px-3 py-2 border rounded-md bg-background" />
                  <button className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
                <button className="w-full py-2 bg-blue-600 text-white rounded-md">Create Team</button>
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
        <CodeBlock code={dynamicFieldsCode} language="tsx" filename="DynamicFieldsForm.tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>useFieldArray</strong> - Manage arrays of fields with append, remove, move, swap</div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>field.id</strong> - Unique key for React rendering, auto-generated</div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>Dynamic paths</strong> - Use template literals for indexed field names</div>
          </li>
        </ul>
      </section>
    </div>
  )
}
