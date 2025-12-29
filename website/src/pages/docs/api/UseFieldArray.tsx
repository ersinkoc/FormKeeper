import { CodeBlock } from '@/components/code/CodeBlock'
import { PropsTable } from '@/components/code/PropsTable'

export default function UseFieldArray() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>useFieldArray</h1>
      <p className="lead">
        Hook for managing dynamic lists of fields with add, remove, and reorder capabilities.
      </p>

      <h2>Import</h2>
      <CodeBlock language="typescript">{`import { useFieldArray } from '@oxog/formkeeper/react'`}</CodeBlock>

      <h2>Basic Usage</h2>
      <CodeBlock language="tsx">{`function ItemsList() {
  const { fields, append, remove } = useFieldArray('items')

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <ItemField index={index} />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={() => append({ name: '', price: 0 })}>
        Add Item
      </button>
    </div>
  )
}`}</CodeBlock>

      <h2>Parameters</h2>
      <PropsTable
        props={[
          { name: 'name', type: 'string', required: true, description: 'Field array name (path to array in form values)' },
        ]}
      />

      <h2>Return Value</h2>
      <PropsTable
        props={[
          { name: 'fields', type: 'FieldArrayItem[]', description: 'Array of field items with unique id' },
          { name: 'append', type: '(value, options?) => void', description: 'Add item to end of array' },
          { name: 'prepend', type: '(value, options?) => void', description: 'Add item to beginning of array' },
          { name: 'insert', type: '(index, value, options?) => void', description: 'Insert item at specific index' },
          { name: 'remove', type: '(index | number[]) => void', description: 'Remove item(s) by index' },
          { name: 'swap', type: '(indexA, indexB) => void', description: 'Swap two items' },
          { name: 'move', type: '(from, to) => void', description: 'Move item to new position' },
          { name: 'update', type: '(index, value) => void', description: 'Update item at index' },
          { name: 'replace', type: '(values[]) => void', description: 'Replace entire array' },
        ]}
      />

      <h2>Complete Example</h2>
      <CodeBlock language="tsx">{`interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface OrderForm {
  customerName: string
  items: OrderItem[]
}

function OrderForm() {
  const form = useForm<OrderForm>({
    initialValues: {
      customerName: '',
      items: []
    },
    onSubmit: async (values) => {
      console.log('Order:', values)
    }
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <CustomerField />
        <ItemsList />
        <OrderTotal />
        <button type="submit">Place Order</button>
      </form>
    </FormProvider>
  )
}

function ItemsList() {
  const { fields, append, remove, move, swap } = useFieldArray('items')

  return (
    <div className="items">
      <h2>Order Items</h2>

      {fields.length === 0 && (
        <p className="empty">No items yet. Add some items!</p>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="item-row">
          <span className="item-number">{index + 1}</span>

          <ItemFields index={index} />

          <div className="item-actions">
            <button
              type="button"
              onClick={() => move(index, index - 1)}
              disabled={index === 0}
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(index, index + 1)}
              disabled={index === fields.length - 1}
            >
              ↓
            </button>
            <button type="button" onClick={() => remove(index)}>
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ name: '', quantity: 1, price: 0 })}
      >
        + Add Item
      </button>
    </div>
  )
}

function ItemFields({ index }: { index: number }) {
  const name = useField(\`items.\${index}.name\`, { required: 'Name required' })
  const quantity = useField(\`items.\${index}.quantity\`, { min: 1 })
  const price = useField(\`items.\${index}.price\`, { min: 0 })

  return (
    <>
      <input {...name.register()} placeholder="Item name" />
      <input {...quantity.register()} type="number" min="1" />
      <input {...price.register()} type="number" min="0" step="0.01" />
    </>
  )
}`}</CodeBlock>

      <h2>Options for append/prepend/insert</h2>
      <CodeBlock language="tsx">{`const { append } = useFieldArray('items')

// Basic append
append({ name: '', price: 0 })

// With focus options
append(
  { name: '', price: 0 },
  {
    shouldFocus: true,    // Focus the new item
    focusIndex: 0,        // Which field in the item to focus
    focusName: 'name'     // Alternative: focus by field name
  }
)`}</CodeBlock>

      <h2>Removing Multiple Items</h2>
      <CodeBlock language="tsx">{`const { remove } = useFieldArray('items')

// Remove single item
remove(2)

// Remove multiple items by indices
remove([0, 2, 4])

// Remove all items
const { replace } = useFieldArray('items')
replace([])`}</CodeBlock>

      <h2>Nested Arrays</h2>
      <CodeBlock language="tsx">{`// For nested structures like:
// { groups: [{ items: [{ name: '' }] }] }

function GroupItems({ groupIndex }: { groupIndex: number }) {
  const { fields, append, remove } = useFieldArray(
    \`groups.\${groupIndex}.items\`
  )

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <ItemField
            name={\`groups.\${groupIndex}.items.\${index}.name\`}
          />
          <button onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button onClick={() => append({ name: '' })}>Add Item</button>
    </div>
  )
}`}</CodeBlock>

      <h2>Important: Use field.id as key</h2>
      <p>
        Always use <code>field.id</code> as the React key, not the array index:
      </p>
      <CodeBlock language="tsx">{`// ✅ Correct - use field.id
{fields.map((field, index) => (
  <div key={field.id}>
    <ItemField index={index} />
  </div>
))}

// ❌ Wrong - don't use index as key
{fields.map((field, index) => (
  <div key={index}>
    <ItemField index={index} />
  </div>
))}`}</CodeBlock>

      <h2>Computed Values</h2>
      <CodeBlock language="tsx">{`function OrderTotal() {
  const items = useWatch('items')

  const total = useMemo(() => {
    return items?.reduce((sum, item) => {
      return sum + (item.quantity || 0) * (item.price || 0)
    }, 0) || 0
  }, [items])

  return <div className="total">Total: \${total.toFixed(2)}</div>
}`}</CodeBlock>
    </div>
  )
}
