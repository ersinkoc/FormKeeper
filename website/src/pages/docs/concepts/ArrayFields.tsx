import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'

export function ArrayFields() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Array Fields</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Handle dynamic form fields with FormKeeper's useFieldArray hook.
        Add, remove, and reorder items with ease.
      </p>

      {/* Basic Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock
          code={`import { useForm, useFieldArray, FormProvider } from '@oxog/formkeeper/react'

interface FormValues {
  items: { name: string; quantity: number }[]
}

function ShoppingList() {
  const form = useForm<FormValues>({
    initialValues: {
      items: [{ name: '', quantity: 1 }]
    },
    onSubmit: (values) => console.log(values),
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <ItemsList />
        <button type="submit">Save</button>
      </form>
    </FormProvider>
  )
}

function ItemsList() {
  const { fields, append, remove } = useFieldArray('items')

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <ItemFields index={index} />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ name: '', quantity: 1 })}
      >
        Add Item
      </button>
    </div>
  )
}`}
          language="tsx"
          filename="ShoppingList.tsx"
        />
      </section>

      {/* Field Array API */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Field Array API</h2>
        <p className="text-muted-foreground mb-4">
          The <code className="text-primary">useFieldArray</code> hook returns:
        </p>

        <CodeBlock
          code={`const {
  // Array of items with unique IDs for React keys
  fields,      // { id: string, ...itemData }[]

  // Add items
  append,      // (value, options?) => void - Add to end
  prepend,     // (value, options?) => void - Add to start
  insert,      // (index, value, options?) => void - Insert at position

  // Remove items
  remove,      // (index | index[]) => void - Remove by index

  // Reorder items
  swap,        // (indexA, indexB) => void - Swap two items
  move,        // (from, to) => void - Move item to new position

  // Update items
  update,      // (index, value) => void - Update single item
  replace,     // (values) => void - Replace entire array
} = useFieldArray('items')`}
          language="typescript"
        />
      </section>

      {/* Nested Fields */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Nested Array Fields</h2>
        <p className="text-muted-foreground mb-4">
          Register fields within array items using dot notation:
        </p>

        <CodeBlock
          code={`function ItemFields({ index }: { index: number }) {
  const nameField = useField(\`items.\${index}.name\`, {
    required: 'Name is required',
  })

  const quantityField = useField(\`items.\${index}.quantity\`, {
    required: 'Quantity is required',
    min: { value: 1, message: 'Min 1' },
  })

  return (
    <div className="flex gap-4">
      <div>
        <input {...nameField.register()} placeholder="Item name" />
        {nameField.error && <span>{nameField.error}</span>}
      </div>

      <div>
        <input
          {...quantityField.register()}
          type="number"
          placeholder="Qty"
        />
        {quantityField.error && <span>{quantityField.error}</span>}
      </div>
    </div>
  )
}`}
          language="tsx"
          filename="ItemFields.tsx"
        />
      </section>

      {/* Options */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Options</h2>
        <p className="text-muted-foreground mb-4">
          Array operations accept optional configuration:
        </p>

        <CodeBlock
          code={`// Focus the first field of the new item
append({ name: '', quantity: 1 }, { shouldFocus: true })

// Insert at specific position
insert(2, { name: 'New Item', quantity: 1 })

// Remove multiple items
remove([0, 2, 4])

// Swap items
swap(0, 1)

// Move item from index 3 to index 0
move(3, 0)

// Replace entire array
replace([
  { name: 'Item 1', quantity: 1 },
  { name: 'Item 2', quantity: 2 },
])`}
          language="typescript"
        />
      </section>

      {/* Complete Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Complete Example</h2>
        <CodeBlock
          code={`import { useForm, useField, useFieldArray, FormProvider } from '@oxog/formkeeper/react'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface Todo {
  text: string
  completed: boolean
}

interface FormValues {
  title: string
  todos: Todo[]
}

export function TodoList() {
  const form = useForm<FormValues>({
    initialValues: {
      title: '',
      todos: [{ text: '', completed: false }],
    },
    onSubmit: async (values) => {
      await saveTodoList(values)
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit} className="space-y-4">
        <TitleField />
        <TodoItems />

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="btn-primary"
        >
          {form.formState.isSubmitting ? 'Saving...' : 'Save List'}
        </button>
      </form>
    </FormProvider>
  )
}

function TitleField() {
  const { register, error } = useField('title', {
    required: 'Title is required',
  })

  return (
    <div>
      <input {...register()} placeholder="List title" className="input" />
      {error && <span className="error">{error}</span>}
    </div>
  )
}

function TodoItems() {
  const { fields, append, remove, swap } = useFieldArray('todos')

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <button type="button" className="cursor-grab">
            <GripVertical className="w-4 h-4" />
          </button>

          <TodoItem index={index} />

          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ text: '', completed: false })}
        className="flex items-center gap-2 text-blue-500"
      >
        <Plus className="w-4 h-4" />
        Add Todo
      </button>
    </div>
  )
}

function TodoItem({ index }: { index: number }) {
  const textField = useField(\`todos.\${index}.text\`, {
    required: 'Todo text required',
  })
  const completedField = useField(\`todos.\${index}.completed\`)

  return (
    <>
      <input
        type="checkbox"
        checked={completedField.value}
        onChange={(e) => completedField.setValue(e.target.checked)}
      />
      <input
        {...textField.register()}
        placeholder="What needs to be done?"
        className={\`input flex-1 \${completedField.value ? 'line-through' : ''}\`}
      />
    </>
  )
}`}
          language="tsx"
          filename="TodoList.tsx"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/docs/concepts/validation">
              Validation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/examples/dynamic-fields">See Example</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
