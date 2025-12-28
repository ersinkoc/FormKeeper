import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, RotateCcw, Download } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

const defaultCode = `import { useForm } from '@oxog/formkeeper/react'

function PlaygroundForm() {
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      age: 0,
    },
    onSubmit: async (values) => {
      console.log('Form submitted:', values)
      alert(JSON.stringify(values, null, 2))
    },
  })

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold mb-4">Example Form</h2>

      <div>
        <label className="block mb-2 font-medium">Name</label>
        <input
          {...form.register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'At least 2 characters',
            },
          })}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter your name"
        />
        {form.errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {form.errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          {...form.register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\\S+@\\S+$/,
              message: 'Invalid email address',
            },
          })}
          className="w-full px-3 py-2 border rounded"
          placeholder="your@email.com"
        />
        {form.errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {form.errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-medium">Age</label>
        <input
          type="number"
          {...form.register('age', {
            required: 'Age is required',
            min: {
              value: 18,
              message: 'Must be at least 18',
            },
          })}
          className="w-full px-3 py-2 border rounded"
          placeholder="18"
        />
        {form.errors.age && (
          <p className="text-red-500 text-sm mt-1">
            {form.errors.age}
          </p>
        )}
      </div>

      <button
        type="submit"
        onClick={form.handleSubmit}
        disabled={form.formState.isSubmitting}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
      >
        {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>

      {/* Form State Debug */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <h3 className="font-semibold mb-2">Form State:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify({
            values: form.values,
            errors: form.errors,
            touched: form.touched,
            isValid: form.formState.isValid,
            isDirty: form.formState.isDirty,
          }, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default PlaygroundForm`

const templates = {
  basic: defaultCode,
  login: `import { useForm } from '@oxog/formkeeper/react'

function LoginForm() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      console.log('Login:', values)
    },
  })

  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={form.handleSubmit} className="space-y-4">
        <div>
          <input
            {...form.register('email', { required: 'Email required' })}
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border rounded"
          />
          {form.errors.email && <p className="text-red-500 text-sm">{form.errors.email}</p>}
        </div>
        <div>
          <input
            {...form.register('password', { required: 'Password required' })}
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border rounded"
          />
          {form.errors.password && <p className="text-red-500 text-sm">{form.errors.password}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginForm`,
  array: `import { useForm, useFieldArray } from '@oxog/formkeeper/react'

function TodoList() {
  const form = useForm({
    initialValues: {
      todos: [{ text: 'Try FormKeeper', done: false }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    form,
    name: 'todos',
  })

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-6">Todo List</h2>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              type="checkbox"
              {...form.register(\`todos.\${index}.done\`)}
            />
            <input
              {...form.register(\`todos.\${index}.text\`)}
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={() => remove(index)}
              className="px-3 py-2 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => append({ text: '', done: false })}
          className="w-full py-2 bg-blue-500 text-white rounded"
        >
          Add Todo
        </button>
      </div>
    </div>
  )
}

export default TodoList`,
}

export function PlaygroundPage() {
  const { theme } = useTheme()
  const [code, setCode] = useState(defaultCode)
  const [output, setOutput] = useState('')

  const handleReset = () => {
    setCode(defaultCode)
    setOutput('')
  }

  const handleRun = () => {
    setOutput('Code execution in browser is simulated. In a real implementation, this would render your form component.')
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'playground.tsx'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Playground</h1>
          <p className="text-xl text-muted-foreground">
            Experiment with FormKeeper in a live coding environment
          </p>
        </div>

        {/* Templates */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">Quick Start Templates:</p>
          <div className="flex gap-2">
            {Object.entries(templates).map(([name, templateCode]) => (
              <Button
                key={name}
                variant="outline"
                size="sm"
                onClick={() => setCode(templateCode)}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Editor Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm font-mono ml-3">playground.tsx</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={handleRun}>
                  <Play className="h-4 w-4 mr-2" />
                  Run
                </Button>
              </div>
            </div>
            <div className="h-[600px]">
              <Editor
                height="100%"
                defaultLanguage="typescript"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
                }}
              />
            </div>
          </Card>

          {/* Preview */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                </div>
                <span className="text-sm font-mono ml-3">Preview</span>
              </div>
            </div>
            <div className="h-[600px] overflow-auto">
              <Tabs defaultValue="preview" className="h-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="console">Console</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="p-6 mt-0">
                  <div className="bg-muted/20 rounded-lg p-6 min-h-[500px] flex items-center justify-center">
                    <p className="text-muted-foreground text-center">
                      {output || 'Click "Run" to see your form in action'}
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="console" className="p-6 mt-0">
                  <div className="bg-black text-green-400 rounded-lg p-4 font-mono text-sm min-h-[500px]">
                    <div>$ FormKeeper Playground Console</div>
                    <div className="mt-2 text-gray-500">
                      Console output will appear here when you run your code
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-6 bg-muted/30">
          <div className="p-6">
            <h3 className="font-semibold mb-2">💡 Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use the templates above to quickly get started with common patterns</li>
              <li>• Press Ctrl+Space for autocomplete suggestions</li>
              <li>• Click "Run" to execute your code (simulation mode in this demo)</li>
              <li>• Download your code to use it in your project</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}
