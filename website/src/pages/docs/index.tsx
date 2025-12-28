import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/code-block'
import { Book, Rocket, Code2, Puzzle } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

const sections = [
  {
    icon: Rocket,
    title: 'Getting Started',
    description: 'Learn the basics and install FormKeeper',
    href: '#getting-started',
  },
  {
    icon: Code2,
    title: 'Core Concepts',
    description: 'Understand forms, fields, and validation',
    href: '#core-concepts',
  },
  {
    icon: Puzzle,
    title: 'Plugins',
    description: 'Extend functionality with plugins',
    href: '#plugins',
  },
  {
    icon: Book,
    title: 'Advanced Usage',
    description: 'Master advanced patterns and techniques',
    href: '#advanced',
  },
]

const installCode = `npm install @oxog/formkeeper
# or
yarn add @oxog/formkeeper
# or
pnpm add @oxog/formkeeper`

const basicUsageCode = `import { createForm } from '@oxog/formkeeper'

const form = createForm({
  initialValues: {
    email: '',
    password: ''
  },
  onSubmit: async (values) => {
    console.log(values)
  }
})

// Register a field
const emailField = form.register('email', {
  required: 'Email is required',
  pattern: {
    value: /^\\S+@\\S+$/,
    message: 'Invalid email address'
  }
})

// Use in your form
emailInput.addEventListener('change', emailField.onChange)
emailInput.addEventListener('blur', emailField.onBlur)`

const reactUsageCode = `import { useForm } from '@oxog/formkeeper/react'

function MyForm() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      await api.submit(values)
    }
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        {...form.register('email', {
          required: 'Email is required'
        })}
        type="email"
      />
      {form.errors.email && (
        <span>{form.errors.email}</span>
      )}
      <button type="submit" disabled={form.formState.isSubmitting}>
        Submit
      </button>
    </form>
  )
}`

const validationCode = `const form = useForm({
  initialValues: { username: '' },
  validationMode: 'onChange', // or 'onBlur', 'onSubmit'
})

// Sync validation
form.register('username', {
  required: 'Username is required',
  minLength: {
    value: 3,
    message: 'At least 3 characters'
  },
  validate: (value) => {
    if (value.includes(' ')) {
      return 'No spaces allowed'
    }
  }
})

// Async validation
form.register('email', {
  validate: async (value) => {
    const exists = await api.checkEmail(value)
    if (exists) {
      return 'Email already taken'
    }
  }
})`

const nestedFieldsCode = `const form = useForm({
  initialValues: {
    user: {
      profile: {
        name: '',
        email: ''
      },
      settings: {
        notifications: true
      }
    }
  }
})

// Access nested fields with dot notation
form.register('user.profile.name', { required: true })
form.register('user.profile.email', { required: true })
form.register('user.settings.notifications')`

const arrayFieldsCode = `import { useFieldArray } from '@oxog/formkeeper/react'

function TodoList() {
  const form = useForm({
    initialValues: {
      todos: [{ text: '', done: false }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    form,
    name: 'todos'
  })

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...form.register(\`todos.\${index}.text\`)} />
          <button onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button onClick={() => append({ text: '', done: false })}>
        Add Todo
      </button>
    </div>
  )
}`

const pluginCode = `import { createForm } from '@oxog/formkeeper'
import { wizardPlugin } from '@oxog/formkeeper/plugins'

const form = createForm({
  initialValues: { step1: {}, step2: {} },
  plugins: [
    wizardPlugin({
      steps: ['step1', 'step2', 'step3']
    })
  ]
})

// Navigate between steps
form.wizard.next()
form.wizard.previous()
form.wizard.goTo(2)

// Get current step
console.log(form.wizard.currentStep) // 0
console.log(form.wizard.isFirstStep) // true
console.log(form.wizard.isLastStep) // false`

export function DocsPage() {
  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <nav className="space-y-1 pr-4">
                <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider">
                  Documentation
                </h3>
                {sections.map((section) => (
                  <a
                    key={section.href}
                    href={section.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                  >
                    <section.icon className="h-4 w-4" />
                    {section.title}
                  </a>
                ))}
              </nav>
            </ScrollArea>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-6">Documentation</h1>
            <p className="text-xl text-muted-foreground mb-12">
              Everything you need to know to build amazing forms with FormKeeper.
            </p>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-16">
              {sections.map((section) => (
                <Card key={section.href}>
                  <CardHeader>
                    <section.icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Getting Started */}
            <section id="getting-started" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6">Getting Started</h2>

              <h3 className="text-2xl font-semibold mb-4">Installation</h3>
              <p>Install FormKeeper using your favorite package manager:</p>
              <CodeBlock code={installCode} language="bash" showLineNumbers={false} />

              <h3 className="text-2xl font-semibold mb-4 mt-8">Basic Usage (Vanilla JS)</h3>
              <p>
                Create a form instance and register fields with validation rules:
              </p>
              <CodeBlock code={basicUsageCode} language="typescript" />

              <h3 className="text-2xl font-semibold mb-4 mt-8">React Integration</h3>
              <p>
                FormKeeper provides first-class React hooks for seamless integration:
              </p>
              <CodeBlock code={reactUsageCode} language="typescript" />
            </section>

            {/* Core Concepts */}
            <section id="core-concepts" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6">Core Concepts</h2>

              <h3 className="text-2xl font-semibold mb-4">Validation</h3>
              <p>
                FormKeeper supports both synchronous and asynchronous validation with flexible
                validation modes:
              </p>
              <CodeBlock code={validationCode} language="typescript" />

              <h3 className="text-2xl font-semibold mb-4 mt-8">Nested Fields</h3>
              <p>
                Work with deeply nested object structures using dot notation:
              </p>
              <CodeBlock code={nestedFieldsCode} language="typescript" />

              <h3 className="text-2xl font-semibold mb-4 mt-8">Array Fields</h3>
              <p>
                Manage dynamic lists of fields with the useFieldArray hook:
              </p>
              <CodeBlock code={arrayFieldsCode} language="typescript" />
            </section>

            {/* Plugins */}
            <section id="plugins" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6">Plugins</h2>
              <p>
                Extend FormKeeper's functionality with plugins. The plugin system is built on a
                micro-kernel architecture that allows you to add features without bloating the core.
              </p>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Wizard Plugin</h3>
              <p>
                Create multi-step forms with the built-in wizard plugin:
              </p>
              <CodeBlock code={pluginCode} language="typescript" />

              <div className="bg-muted/50 border rounded-lg p-6 mt-8">
                <h4 className="font-semibold mb-2">Available Plugins</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>wizardPlugin</strong> - Multi-step form navigation
                  </li>
                  <li>
                    <strong>autoSavePlugin</strong> - Automatic draft persistence
                  </li>
                  <li>
                    <strong>historyPlugin</strong> - Undo/redo functionality
                  </li>
                  <li>
                    <strong>analyticsPlugin</strong> - Track form interactions
                  </li>
                </ul>
              </div>
            </section>

            {/* Advanced */}
            <section id="advanced" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6">Advanced Usage</h2>
              <p>
                Learn advanced patterns and techniques for complex form scenarios.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Custom Plugins</CardTitle>
                    <CardDescription>
                      Create your own plugins to extend FormKeeper's functionality
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/api#plugins" className="text-sm text-primary hover:underline">
                      Learn more →
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Optimization</CardTitle>
                    <CardDescription>
                      Tips and tricks for optimizing large forms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/api#performance" className="text-sm text-primary hover:underline">
                      Learn more →
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
