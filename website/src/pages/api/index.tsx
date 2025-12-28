import { useState } from 'react'
import { Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/code-block'
import { ScrollArea } from '@/components/ui/scroll-area'

const apiSections = [
  { id: 'createForm', title: 'createForm', category: 'Core' },
  { id: 'Form', title: 'Form Instance', category: 'Core' },
  { id: 'useForm', title: 'useForm', category: 'React' },
  { id: 'useField', title: 'useField', category: 'React' },
  { id: 'useFieldArray', title: 'useFieldArray', category: 'React' },
  { id: 'useWatch', title: 'useWatch', category: 'React' },
  { id: 'ValidationRules', title: 'ValidationRules', category: 'Types' },
  { id: 'FormState', title: 'FormState', category: 'Types' },
]

export function ApiPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSections = apiSections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search API..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-12rem)]">
              <nav className="space-y-4 pr-4">
                {['Core', 'React', 'Types'].map((category) => (
                  <div key={category}>
                    <h3 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wider">
                      {category}
                    </h3>
                    <div className="space-y-1">
                      {filteredSections
                        .filter((section) => section.category === category)
                        .map((section) => (
                          <a
                            key={section.id}
                            href={`#${section.id}`}
                            className="block px-3 py-1.5 rounded-lg hover:bg-accent transition-colors text-sm font-mono"
                          >
                            {section.title}
                          </a>
                        ))}
                    </div>
                  </div>
                ))}
              </nav>
            </ScrollArea>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9">
          <h1 className="text-4xl font-bold mb-6">API Reference</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Complete API documentation for FormKeeper.
          </p>

          {/* createForm */}
          <section id="createForm" className="mb-16 scroll-mt-24">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-mono">createForm</CardTitle>
                    <CardDescription className="mt-2">
                      Factory function to create a new form instance
                    </CardDescription>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary font-mono">
                    Core
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Signature</h4>
                  <CodeBlock
                    code={`function createForm<TValues extends FieldValues>(
  options: FormOptions<TValues>
): Form<TValues>`}
                    language="typescript"
                    showLineNumbers={false}
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Parameters</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 font-mono">Name</th>
                          <th className="text-left p-3 font-mono">Type</th>
                          <th className="text-left p-3">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3 font-mono text-xs">options</td>
                          <td className="p-3 font-mono text-xs">FormOptions&lt;TValues&gt;</td>
                          <td className="p-3">Configuration options for the form</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Example</h4>
                  <CodeBlock
                    code={`import { createForm } from '@oxog/formkeeper'

const form = createForm({
  initialValues: {
    email: '',
    password: '',
  },
  validationMode: 'onChange',
  onSubmit: async (values) => {
    await api.login(values)
  },
  onError: (errors) => {
    console.error('Validation errors:', errors)
  },
})`}
                    language="typescript"
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Form Instance */}
          <section id="Form" className="mb-16 scroll-mt-24">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-mono">Form</CardTitle>
                    <CardDescription className="mt-2">
                      The form instance returned by createForm
                    </CardDescription>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary font-mono">
                    Core
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Properties</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 font-mono">Property</th>
                          <th className="text-left p-3 font-mono">Type</th>
                          <th className="text-left p-3">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3 font-mono text-xs">values</td>
                          <td className="p-3 font-mono text-xs">TValues</td>
                          <td className="p-3">Current form values</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3 font-mono text-xs">errors</td>
                          <td className="p-3 font-mono text-xs">FormErrors&lt;TValues&gt;</td>
                          <td className="p-3">Current validation errors</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3 font-mono text-xs">touched</td>
                          <td className="p-3 font-mono text-xs">TouchedFields&lt;TValues&gt;</td>
                          <td className="p-3">Fields that have been touched</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3 font-mono text-xs">formState</td>
                          <td className="p-3 font-mono text-xs">FormState</td>
                          <td className="p-3">Form state (isSubmitting, isValid, etc.)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Methods</h4>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4">
                      <code className="text-sm font-mono">register(name, rules?)</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Register a field with optional validation rules
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <code className="text-sm font-mono">setValue(name, value, options?)</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Set a field's value programmatically
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <code className="text-sm font-mono">handleSubmit()</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Submit handler function for forms
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <code className="text-sm font-mono">reset(values?)</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Reset form to initial or provided values
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <code className="text-sm font-mono">watch(name?)</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Watch field value changes
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* useForm */}
          <section id="useForm" className="mb-16 scroll-mt-24">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-mono">useForm</CardTitle>
                    <CardDescription className="mt-2">
                      React hook for creating and managing forms
                    </CardDescription>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-md bg-blue-500/10 text-blue-500 font-mono">
                    React
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Signature</h4>
                  <CodeBlock
                    code={`function useForm<TValues extends FieldValues>(
  options: FormOptions<TValues>
): Form<TValues>`}
                    language="typescript"
                    showLineNumbers={false}
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Example</h4>
                  <CodeBlock
                    code={`import { useForm } from '@oxog/formkeeper/react'

function MyForm() {
  const form = useForm({
    initialValues: { email: '' },
    onSubmit: async (values) => {
      await api.submit(values)
    },
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.register('email')} />
      <button type="submit">Submit</button>
    </form>
  )
}`}
                    language="typescript"
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ValidationRules */}
          <section id="ValidationRules" className="mb-16 scroll-mt-24">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-mono">ValidationRules</CardTitle>
                    <CardDescription className="mt-2">
                      Type definition for field validation rules
                    </CardDescription>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-md bg-purple-500/10 text-purple-500 font-mono">
                    Type
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CodeBlock
                  code={`interface ValidationRules<T = any> {
  required?: string | boolean
  min?: { value: number; message: string }
  max?: { value: number; message: string }
  minLength?: { value: number; message: string }
  maxLength?: { value: number; message: string }
  pattern?: { value: RegExp; message: string }
  validate?: ValidateFn<T> | Record<string, ValidateFn<T>>
}`}
                  language="typescript"
                />

                <div>
                  <h4 className="font-semibold mb-2">Example</h4>
                  <CodeBlock
                    code={`const rules: ValidationRules = {
  required: 'This field is required',
  minLength: {
    value: 8,
    message: 'Password must be at least 8 characters',
  },
  validate: {
    hasNumber: (value) =>
      /\\d/.test(value) || 'Must contain a number',
    hasUpperCase: (value) =>
      /[A-Z]/.test(value) || 'Must contain uppercase',
  },
}`}
                    language="typescript"
                  />
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
