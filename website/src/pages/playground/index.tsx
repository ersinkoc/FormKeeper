import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Share2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeBlock } from '@/components/code/CodeBlock'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const presets = {
  basic: {
    name: 'Basic Form',
    code: `import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

function BasicForm() {
  const form = useForm({
    initialValues: { name: '', email: '' },
    onSubmit: (values) => {
      console.log('Submitted:', values)
      alert(JSON.stringify(values, null, 2))
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <NameField />
        <EmailField />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  )
}

function NameField() {
  const { register, error } = useField('name', {
    required: 'Name is required',
  })
  return (
    <div>
      <input {...register()} placeholder="Name" />
      {error && <span className="error">{error}</span>}
    </div>
  )
}

function EmailField() {
  const { register, error } = useField('email', {
    required: 'Email is required',
    pattern: { value: /^\\S+@\\S+$/, message: 'Invalid email' },
  })
  return (
    <div>
      <input {...register()} type="email" placeholder="Email" />
      {error && <span className="error">{error}</span>}
    </div>
  )
}`,
  },
  validation: {
    name: 'Validation Example',
    code: `import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

function ValidationForm() {
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: ''
    },
    onSubmit: (values) => {
      console.log('Submitted:', values)
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <UsernameField />
        <PasswordField />
        <ConfirmPasswordField />
        <button type="submit" disabled={form.formState.isSubmitting}>
          Register
        </button>
      </form>
    </FormProvider>
  )
}

function UsernameField() {
  const { register, error, touched } = useField('username', {
    required: 'Username is required',
    minLength: { value: 3, message: 'Min 3 characters' },
    maxLength: { value: 20, message: 'Max 20 characters' },
  })
  return (
    <div>
      <input {...register()} placeholder="Username" />
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}

function PasswordField() {
  const { register, error, touched } = useField('password', {
    required: 'Password is required',
    minLength: { value: 8, message: 'Min 8 characters' },
    validate: (value) => {
      if (!/[A-Z]/.test(value)) return 'Need uppercase letter'
      if (!/[0-9]/.test(value)) return 'Need number'
      return true
    },
  })
  return (
    <div>
      <input {...register()} type="password" placeholder="Password" />
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}

function ConfirmPasswordField() {
  const { register, error, touched } = useField('confirmPassword', {
    required: 'Please confirm password',
    validate: (value, formValues) =>
      value === formValues.password || 'Passwords do not match',
    deps: ['password'],
  })
  return (
    <div>
      <input {...register()} type="password" placeholder="Confirm Password" />
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}`,
  },
  arrayFields: {
    name: 'Array Fields',
    code: `import { useForm, useField, useFieldArray, FormProvider } from '@oxog/formkeeper/react'

function TodoForm() {
  const form = useForm({
    initialValues: {
      title: '',
      items: [{ text: '' }]
    },
    onSubmit: (values) => {
      console.log('Todo List:', values)
    },
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

function TitleField() {
  const { register } = useField('title', { required: 'Title required' })
  return <input {...register()} placeholder="List Title" />
}

function ItemsList() {
  const { fields, append, remove } = useFieldArray('items')

  return (
    <div>
      <h3>Items</h3>
      {fields.map((field, index) => (
        <div key={field.id}>
          <ItemField index={index} />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append({ text: '' })}>
        Add Item
      </button>
    </div>
  )
}

function ItemField({ index }) {
  const { register, error } = useField(\`items.\${index}.text\`, {
    required: 'Item text required',
  })
  return (
    <div>
      <input {...register()} placeholder={\`Item \${index + 1}\`} />
      {error && <span className="error">{error}</span>}
    </div>
  )
}`,
  },
}

export function Playground() {
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof presets>('basic')
  const [code, setCode] = useState(presets.basic.code)

  const handlePresetChange = (preset: keyof typeof presets) => {
    setSelectedPreset(preset)
    setCode(presets[preset].code)
  }

  const handleReset = () => {
    setCode(presets[selectedPreset].code)
  }

  return (
    <div className="container py-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-4">Playground</h1>
        <p className="text-muted-foreground">
          Experiment with FormKeeper in real-time. Edit the code and see the
          results instantly.
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
                onClick={() => handlePresetChange(key as keyof typeof presets)}
              >
                {preset.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button className="gap-2">
            <Play className="w-4 h-4" />
            Run
          </Button>
        </div>
      </div>

      {/* Editor & Preview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-4">
          <Tabs defaultValue="code">
            <TabsList>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="console">Console</TabsTrigger>
            </TabsList>
            <TabsContent value="code">
              <CodeBlock
                code={code}
                language="tsx"
                filename="App.tsx"
                maxHeight="600px"
              />
            </TabsContent>
            <TabsContent value="console">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm h-[600px] overflow-auto">
                <div className="text-muted-foreground">
                  Console output will appear here...
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Preview</h3>
            <Button variant="ghost" size="sm">
              Open in New Tab
            </Button>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-white dark:bg-zinc-900 h-[600px] overflow-auto">
            <div className="p-6">
              {/* Static preview for demonstration */}
              <div className="max-w-md mx-auto space-y-4">
                <h2 className="text-xl font-bold mb-4">
                  {presets[selectedPreset].name}
                </h2>
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </div>
                <button className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md">
                  Submit
                </button>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-8">
                Live preview coming soon. For now, copy the code and try it in your project!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
