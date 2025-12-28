import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeBlock } from '@/components/code-block'
import {
  User,
  Lock,
  Mail,
  List,
  Layers,
  Workflow,
} from 'lucide-react'

const examples = [
  {
    id: 'login',
    icon: Lock,
    title: 'Login Form',
    description: 'Simple login form with email and password validation',
    category: 'basic',
  },
  {
    id: 'registration',
    icon: User,
    title: 'Registration Form',
    description: 'User registration with complex validation rules',
    category: 'basic',
  },
  {
    id: 'nested',
    icon: Layers,
    title: 'Nested Fields',
    description: 'Working with deeply nested object structures',
    category: 'intermediate',
  },
  {
    id: 'array',
    icon: List,
    title: 'Dynamic Lists',
    description: 'Managing dynamic field arrays',
    category: 'intermediate',
  },
  {
    id: 'wizard',
    icon: Workflow,
    title: 'Multi-Step Wizard',
    description: 'Multi-step form with navigation',
    category: 'advanced',
  },
  {
    id: 'async',
    icon: Mail,
    title: 'Async Validation',
    description: 'Server-side validation with async rules',
    category: 'advanced',
  },
]

const loginExample = `import { useForm } from '@oxog/formkeeper/react'

function LoginForm() {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(values),
      })
      if (response.ok) {
        console.log('Login successful!')
      }
    },
  })

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...form.register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\\S+@\\S+$/,
              message: 'Invalid email address',
            },
          })}
          className="w-full px-3 py-2 border rounded"
        />
        {form.errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {form.errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...form.register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
          className="w-full px-3 py-2 border rounded"
        />
        {form.errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {form.errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}`

const arrayExample = `import { useForm, useFieldArray } from '@oxog/formkeeper/react'

function TodoList() {
  const form = useForm({
    initialValues: {
      todos: [
        { text: 'Learn FormKeeper', done: false },
      ],
    },
  })

  const { fields, append, remove, move } = useFieldArray({
    form,
    name: 'todos',
  })

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <input
            type="checkbox"
            {...form.register(\`todos.\${index}.done\`)}
          />
          <input
            type="text"
            {...form.register(\`todos.\${index}.text\`, {
              required: 'Todo text is required',
            })}
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="px-3 py-2 bg-red-500 text-white rounded"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ text: '', done: false })}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Todo
      </button>
    </div>
  )
}`

const wizardExample = `import { useForm } from '@oxog/formkeeper/react'
import { wizardPlugin } from '@oxog/formkeeper/plugins'

function WizardForm() {
  const form = useForm({
    initialValues: {
      personal: { name: '', email: '' },
      address: { street: '', city: '' },
      preferences: { newsletter: false },
    },
    plugins: [
      wizardPlugin({
        steps: ['personal', 'address', 'preferences'],
      }),
    ],
    onSubmit: async (values) => {
      console.log('Form submitted:', values)
    },
  })

  const { currentStep, isFirstStep, isLastStep, next, previous } = form.wizard

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex justify-between mb-8">
        {['Personal', 'Address', 'Preferences'].map((label, index) => (
          <div
            key={label}
            className={\`flex-1 text-center \${
              currentStep === index
                ? 'text-blue-500 font-bold'
                : 'text-gray-400'
            }\`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Info */}
      {currentStep === 0 && (
        <div className="space-y-4">
          <input
            {...form.register('personal.name', {
              required: 'Name is required',
            })}
            placeholder="Full Name"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            {...form.register('personal.email', {
              required: 'Email is required',
            })}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      )}

      {/* Step 2: Address */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <input
            {...form.register('address.street')}
            placeholder="Street"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            {...form.register('address.city')}
            placeholder="City"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      )}

      {/* Step 3: Preferences */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...form.register('preferences.newsletter')}
            />
            Subscribe to newsletter
          </label>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={previous}
          disabled={isFirstStep}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        {isLastStep ? (
          <button
            type="submit"
            onClick={form.handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}`

const asyncExample = `import { useForm } from '@oxog/formkeeper/react'

function AsyncValidationForm() {
  const form = useForm({
    initialValues: {
      username: '',
      email: '',
    },
    validationMode: 'onBlur',
  })

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          {...form.register('username', {
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'At least 3 characters',
            },
            validate: async (value) => {
              // Simulate API call to check username
              const response = await fetch(
                \`/api/check-username?username=\${value}\`
              )
              const { available } = await response.json()

              if (!available) {
                return 'Username is already taken'
              }
            },
          })}
          className="w-full px-3 py-2 border rounded"
        />
        {form.errors.username && (
          <p className="text-red-500 text-sm mt-1">
            {form.errors.username}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...form.register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\\S+@\\S+$/,
              message: 'Invalid email',
            },
            validate: async (value) => {
              // Simulate API call to check email
              const response = await fetch(
                \`/api/check-email?email=\${value}\`
              )
              const { available } = await response.json()

              if (!available) {
                return 'Email is already registered'
              }
            },
          })}
          className="w-full px-3 py-2 border rounded"
        />
        {form.errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {form.errors.email}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        Register
      </button>
    </form>
  )
}`

export function ExamplesPage() {
  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Examples</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Real-world examples to help you get started quickly.
        </p>

        {/* Example Categories */}
        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Examples</TabsTrigger>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {['all', 'basic', 'intermediate', 'advanced'].map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {examples
                  .filter((ex) => category === 'all' || ex.category === category)
                  .map((example) => (
                    <Card key={example.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <example.icon className="h-8 w-8 text-primary mb-2" />
                        <CardTitle>{example.title}</CardTitle>
                        <CardDescription>{example.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <a
                          href={`#${example.id}`}
                          className="text-sm text-primary hover:underline"
                        >
                          View example →
                        </a>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Detailed Examples */}
        <div className="space-y-16">
          {/* Login Form */}
          <section id="login" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Login Form</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              A simple login form with email and password validation. This example demonstrates
              basic field registration and validation rules.
            </p>
            <CodeBlock code={loginExample} language="typescript" />
          </section>

          {/* Dynamic Lists */}
          <section id="array" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <List className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Dynamic Lists</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Manage dynamic lists of items with the useFieldArray hook. Add, remove, and reorder
              items easily.
            </p>
            <CodeBlock code={arrayExample} language="typescript" />
          </section>

          {/* Multi-Step Wizard */}
          <section id="wizard" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <Workflow className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Multi-Step Wizard</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Create multi-step forms with the wizard plugin. Navigate between steps while
              maintaining form state.
            </p>
            <CodeBlock code={wizardExample} language="typescript" />
          </section>

          {/* Async Validation */}
          <section id="async" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Async Validation</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Perform server-side validation with async validation functions. Check username
              availability in real-time.
            </p>
            <CodeBlock code={asyncExample} language="typescript" />
          </section>
        </div>
      </div>
    </div>
  )
}
