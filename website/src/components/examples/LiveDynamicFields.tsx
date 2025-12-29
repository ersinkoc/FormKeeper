import { useForm, useField, useFieldArray, FormProvider } from '@oxog/formkeeper/react'
import { useState, FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'

interface TodoItem {
  text: string
  completed: boolean
}

interface TodoListValues {
  title: string
  items: TodoItem[]
}

export function LiveDynamicFields() {
  const [result, setResult] = useState<string | null>(null)

  const form = useForm<TodoListValues>({
    initialValues: {
      title: '',
      items: [{ text: '', completed: false }],
    },
    onSubmit: async (values) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      setResult(JSON.stringify(values, null, 2))
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.handleSubmit()
  }

  return (
    <FormProvider form={form}>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Todo List</h2>

        <TitleField />
        <ItemsList />

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md
                     hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {form.formState.isSubmitting ? 'Saving...' : 'Save List'}
        </button>

        {result && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
            <p className="text-sm text-green-400 font-medium mb-1">Saved!</p>
            <pre className="text-xs text-green-300 overflow-auto">{result}</pre>
          </div>
        )}
      </form>
    </FormProvider>
  )
}

function TitleField() {
  const { register, error, touched } = useField('title', {
    required: 'Title is required',
  })

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">List Title</label>
      <input
        {...register()}
        placeholder="My Todo List"
        className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {touched && error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}

function ItemsList() {
  const { fields, append, remove } = useFieldArray('items')

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Items</label>
        <button
          type="button"
          onClick={() => append({ text: '', completed: false })}
          className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <ItemField key={field.id} index={index} onRemove={() => remove(index)} canRemove={fields.length > 1} />
        ))}
      </div>
    </div>
  )
}

function ItemField({ index, onRemove, canRemove }: { index: number; onRemove: () => void; canRemove: boolean }) {
  const fieldName = 'items.' + index + '.text'
  const { register, error } = useField(fieldName, {
    required: 'Item text is required',
  })

  const completedName = 'items.' + index + '.completed'
  const completedField = useField(completedName)

  return (
    <div className="flex items-start gap-2">
      <input
        {...completedField.register()}
        type="checkbox"
        className="mt-2.5 w-4 h-4 rounded border-zinc-700 bg-zinc-800/50"
      />
      <div className="flex-1">
        <input
          {...register()}
          placeholder={'Item ' + (index + 1)}
          className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
