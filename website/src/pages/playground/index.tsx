import { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, ChevronDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeBlock } from '@/components/code/CodeBlock'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LiveLoginForm,
  LiveRegistrationForm,
  LiveDynamicFields,
  LiveAsyncValidation,
  LiveMultiStepWizard,
} from '@/components/examples'

const presets = {
  login: {
    name: 'Login Form',
    description: 'Basic authentication with email/password validation',
    component: LiveLoginForm,
    code: `import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

interface LoginValues {
  email: string
  password: string
}

export function LoginForm() {
  const form = useForm<LoginValues>({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Login successful:', values)
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <EmailField />
        <PasswordField />
        <button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </FormProvider>
  )
}

function EmailField() {
  const { register, error, touched } = useField('email', {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  })

  return (
    <div>
      <input {...register()} type="email" placeholder="Email" />
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}

function PasswordField() {
  const { register, error, touched } = useField('password', {
    required: 'Password is required',
    minLength: { value: 8, message: 'Min 8 characters' },
  })

  return (
    <div>
      <input {...register()} type="password" placeholder="Password" />
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}`,
  },
  registration: {
    name: 'Registration Form',
    description: 'Multi-field form with password confirmation',
    component: LiveRegistrationForm,
    code: `import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

interface RegistrationValues {
  username: string
  email: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

export function RegistrationForm() {
  const form = useForm<RegistrationValues>({
    initialValues: {
      username: '', email: '', password: '',
      confirmPassword: '', agreeTerms: false,
    },
    onSubmit: async (values) => {
      console.log('Registration:', values)
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <UsernameField />
        <PasswordField />
        <ConfirmPasswordField />
        <AgreeTermsField />
        <button type="submit">Create Account</button>
      </form>
    </FormProvider>
  )
}

function ConfirmPasswordField() {
  const { register, error, touched } = useField('confirmPassword', {
    required: 'Please confirm password',
    validate: (value, formValues) =>
      value === formValues.password || 'Passwords do not match',
    deps: ['password'], // Re-validate when password changes
  })

  return (
    <div>
      <input {...register()} type="password" placeholder="Confirm" />
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}`,
  },
  dynamicFields: {
    name: 'Dynamic Fields',
    description: 'Add/remove fields with useFieldArray',
    component: LiveDynamicFields,
    code: `import { useForm, useField, useFieldArray, FormProvider } from '@oxog/formkeeper/react'

interface TodoItem { text: string; completed: boolean }
interface TodoListValues {
  title: string
  items: TodoItem[]
}

export function TodoForm() {
  const form = useForm<TodoListValues>({
    initialValues: {
      title: '',
      items: [{ text: '', completed: false }]
    },
    onSubmit: (values) => console.log('Todo List:', values),
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <TitleField />
        <ItemsList />
        <button type="submit">Save List</button>
      </form>
    </FormProvider>
  )
}

function ItemsList() {
  const { fields, append, remove } = useFieldArray<TodoItem>('items')

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <ItemField index={index} />
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ text: '', completed: false })}>
        Add Item
      </button>
    </div>
  )
}`,
  },
  asyncValidation: {
    name: 'Async Validation',
    description: 'Username availability check with debounce',
    component: LiveAsyncValidation,
    code: `import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

const takenUsernames = ['admin', 'user', 'test', 'demo']

function UsernameField() {
  const { register, error, touched, isValidating } = useField('username', {
    required: 'Username is required',
    minLength: { value: 3, message: 'Min 3 characters' },
    validate: async (value) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      if (takenUsernames.includes(value.toLowerCase())) {
        return 'Username is already taken'
      }
      return true
    },
    debounce: 500, // Wait 500ms before validating
  })

  return (
    <div>
      <input {...register()} placeholder="Username" />
      {isValidating && <span>Checking...</span>}
      {!isValidating && touched && !error && <span>Available!</span>}
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}`,
  },
  wizard: {
    name: 'Multi-Step Wizard',
    description: 'Step-by-step form with navigation',
    component: LiveMultiStepWizard,
    code: `import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'
import { useState } from 'react'

interface WizardValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
}

export function WizardForm() {
  const [step, setStep] = useState(1)

  const form = useForm<WizardValues>({
    initialValues: {
      firstName: '', lastName: '',
      email: '', phone: '',
      street: '', city: '',
    },
    onSubmit: (values) => console.log('Completed:', values),
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        {/* Progress indicator */}
        <div className="progress">Step {step} of 3</div>

        {step === 1 && <PersonalInfoStep />}
        {step === 2 && <ContactStep />}
        {step === 3 && <AddressStep />}

        {/* Navigation */}
        <div>
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)}>Back</button>
          )}
          {step < 3 ? (
            <button type="button" onClick={() => setStep(step + 1)}>Next</button>
          ) : (
            <button type="submit">Complete</button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}`,
  },
}

type PresetKey = keyof typeof presets

export function Playground() {
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>('login')
  const [key, setKey] = useState(0) // For resetting components

  const handlePresetChange = (preset: PresetKey) => {
    setSelectedPreset(preset)
    setKey(k => k + 1) // Reset component state
  }

  const handleReset = () => {
    setKey(k => k + 1) // Reset component state
  }

  const CurrentComponent = presets[selectedPreset].component

  return (
    <div className="container py-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl font-bold">Playground</h1>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Live
          </span>
        </div>
        <p className="text-muted-foreground">
          Experiment with FormKeeper in real-time. Select a preset and interact with the live demo.
        </p>
      </motion.div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {presets[selectedPreset].name}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.entries(presets).map(([key, preset]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => handlePresetChange(key as PresetKey)}
              >
                <div>
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs text-muted-foreground">{preset.description}</div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="icon" onClick={handleReset} title="Reset form">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor & Preview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Code Panel */}
        <div className="space-y-4">
          <Tabs defaultValue="code">
            <TabsList>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <TabsContent value="code">
              <CodeBlock
                code={presets[selectedPreset].code}
                language="tsx"
                filename="App.tsx"
                maxHeight="600px"
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Live Preview</h3>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 h-[600px] overflow-auto">
            <CurrentComponent key={key} />
          </div>
        </div>
      </div>
    </div>
  )
}
