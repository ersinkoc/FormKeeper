import { useForm } from '@oxog/formkeeper/react'

interface LivePreviewProps {
  template: 'basic' | 'login' | 'array'
}

function BasicFormPreview() {
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      age: 0,
    },
    onSubmit: async (values) => {
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
          className="w-full px-3 py-2 border rounded bg-background"
          placeholder="Enter your name"
        />
        {form.getError('name') && (
          <p className="text-red-500 text-sm mt-1">{form.getError('name')}</p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          {...form.register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/,
              message: 'Invalid email address',
            },
          })}
          className="w-full px-3 py-2 border rounded bg-background"
          placeholder="your@email.com"
        />
        {form.getError('email') && (
          <p className="text-red-500 text-sm mt-1">{form.getError('email')}</p>
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
          className="w-full px-3 py-2 border rounded bg-background"
          placeholder="18"
        />
        {form.getError('age') && (
          <p className="text-red-500 text-sm mt-1">{form.getError('age')}</p>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        disabled={form.isSubmitting()}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
      >
        {form.isSubmitting() ? 'Submitting...' : 'Submit'}
      </button>

      {/* Form State Debug */}
      <div className="mt-6 p-4 bg-muted rounded">
        <h3 className="font-semibold mb-2">Form State:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(
            {
              values: form.getValues(),
              errors: form.getErrors(),
              touched: form.getTouched(),
              isValid: form.isValid(),
              isDirty: form.isDirty(),
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  )
}

function LoginFormPreview() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      console.log('Login:', values)
      alert('Login successful!\n' + JSON.stringify(values, null, 2))
    },
  })

  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <div>
          <label className="block mb-2 font-medium">Email</label>
          <input
            {...form.register('email', { required: 'Email required' })}
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border rounded bg-background"
          />
          {form.getError('email') && (
            <p className="text-red-500 text-sm">{form.getError('email')}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 font-medium">Password</label>
          <input
            {...form.register('password', { required: 'Password required' })}
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border rounded bg-background"
          />
          {form.getError('password') && (
            <p className="text-red-500 text-sm">{form.getError('password')}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  )
}

function TodoListPreview() {
  const form = useForm({
    initialValues: {
      todos: [{ text: 'Try FormKeeper', done: false }],
    },
    onSubmit: async (values) => {
      console.log('Todos:', values)
    },
  })

  const fieldArray = form.useFieldArray('todos')

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-6">Todo List</h2>
      <div className="space-y-3">
        {fieldArray.fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              type="checkbox"
              {...form.register(`todos.${index}.done`)}
              className="mt-2"
            />
            <input
              {...form.register(`todos.${index}.text`)}
              className="flex-1 px-3 py-2 border rounded bg-background"
            />
            <button
              onClick={() => fieldArray.remove(index)}
              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => fieldArray.append({ text: '', done: false })}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
        >
          Add Todo
        </button>
      </div>

      {/* Form State Debug */}
      <div className="mt-6 p-4 bg-muted rounded">
        <h3 className="font-semibold mb-2">Form Values:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(form.getValues(), null, 2)}
        </pre>
      </div>
    </div>
  )
}

export function LivePreview({ template }: LivePreviewProps) {
  try {
    return (
      <div className="bg-background">
        {template === 'basic' && <BasicFormPreview />}
        {template === 'login' && <LoginFormPreview />}
        {template === 'array' && <TodoListPreview />}
      </div>
    )
  } catch (err) {
    return (
      <div className="p-6 text-red-500">
        <p className="font-semibold">Error rendering preview:</p>
        <p className="text-sm mt-2">{err instanceof Error ? err.message : 'Unknown error'}</p>
      </div>
    )
  }
}
