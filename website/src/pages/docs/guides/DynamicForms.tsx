import { CodeBlock } from '@/components/code/CodeBlock'

export default function DynamicForms() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Dynamic Forms</h1>
      <p className="lead">
        Build forms with dynamic fields, conditional rendering, and runtime configuration.
      </p>

      <h2>Conditional Fields</h2>
      <p>
        Show or hide fields based on other field values:
      </p>

      <CodeBlock language="tsx">{`import { useForm, useField, useWatch, FormProvider } from '@oxog/formkeeper/react'

function ConditionalForm() {
  const form = useForm({
    initialValues: {
      hasShipping: false,
      shippingAddress: '',
      sameAsBilling: true,
      billingAddress: ''
    },
    onSubmit: async (values) => console.log(values)
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <ShippingSection />
        <BillingSection />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  )
}

function ShippingSection() {
  const hasShipping = useWatch('hasShipping')
  const shippingField = useField('hasShipping')
  const addressField = useField('shippingAddress', {
    validate: (value, formValues) => {
      if (formValues.hasShipping && !value) {
        return 'Shipping address is required'
      }
      return true
    },
    deps: ['hasShipping']
  })

  return (
    <section>
      <label>
        <input {...shippingField.register()} type="checkbox" />
        Ship to different address
      </label>

      {hasShipping && (
        <div className="form-group">
          <label>Shipping Address</label>
          <input {...addressField.register()} />
          {addressField.error && <span className="error">{addressField.error}</span>}
        </div>
      )}
    </section>
  )
}

function BillingSection() {
  const hasShipping = useWatch('hasShipping')
  const sameAsBilling = useWatch('sameAsBilling')
  const sameField = useField('sameAsBilling')
  const billingField = useField('billingAddress', {
    validate: (value, formValues) => {
      if (!formValues.sameAsBilling && !value) {
        return 'Billing address is required'
      }
      return true
    },
    deps: ['sameAsBilling']
  })

  return (
    <section>
      {hasShipping && (
        <label>
          <input {...sameField.register()} type="checkbox" />
          Same as shipping address
        </label>
      )}

      {(!hasShipping || !sameAsBilling) && (
        <div className="form-group">
          <label>Billing Address</label>
          <input {...billingField.register()} />
        </div>
      )}
    </section>
  )
}`}</CodeBlock>

      <h2>Dynamic Field Arrays</h2>
      <CodeBlock language="tsx">{`import { useFieldArray, useField } from '@oxog/formkeeper/react'

function DynamicItemsList() {
  const { fields, append, remove, move } = useFieldArray('items')

  return (
    <div className="items-list">
      <h2>Order Items</h2>

      {fields.length === 0 && (
        <p className="empty-state">No items added yet</p>
      )}

      {fields.map((field, index) => (
        <ItemRow
          key={field.id}
          index={index}
          onRemove={() => remove(index)}
          onMoveUp={() => move(index, index - 1)}
          onMoveDown={() => move(index, index + 1)}
          isFirst={index === 0}
          isLast={index === fields.length - 1}
        />
      ))}

      <button
        type="button"
        onClick={() => append({ name: '', quantity: 1, price: 0 })}
        className="btn-add"
      >
        + Add Item
      </button>
    </div>
  )
}

function ItemRow({ index, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  const name = useField(\`items.\${index}.name\`, { required: 'Required' })
  const quantity = useField(\`items.\${index}.quantity\`, { min: 1 })
  const price = useField(\`items.\${index}.price\`, { min: 0 })

  return (
    <div className="item-row">
      <input {...name.register()} placeholder="Item name" />
      <input {...quantity.register()} type="number" min="1" />
      <input {...price.register()} type="number" min="0" step="0.01" />

      <div className="actions">
        <button type="button" onClick={onMoveUp} disabled={isFirst}>↑</button>
        <button type="button" onClick={onMoveDown} disabled={isLast}>↓</button>
        <button type="button" onClick={onRemove}>×</button>
      </div>
    </div>
  )
}`}</CodeBlock>

      <h2>Field Type Selection</h2>
      <CodeBlock language="tsx">{`function DynamicFieldType() {
  const fieldType = useWatch('fieldType')
  const typeField = useField('fieldType')

  return (
    <div>
      <select {...typeField.register()}>
        <option value="text">Text Input</option>
        <option value="textarea">Text Area</option>
        <option value="select">Dropdown</option>
        <option value="checkbox">Checkbox</option>
      </select>

      {fieldType === 'text' && <TextFieldInput />}
      {fieldType === 'textarea' && <TextAreaInput />}
      {fieldType === 'select' && <SelectInput />}
      {fieldType === 'checkbox' && <CheckboxInput />}
    </div>
  )
}`}</CodeBlock>

      <h2>Schema-Driven Forms</h2>
      <CodeBlock language="tsx">{`interface FieldSchema {
  name: string
  type: 'text' | 'number' | 'email' | 'select' | 'checkbox'
  label: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: object
}

function SchemaForm({ schema }: { schema: FieldSchema[] }) {
  const initialValues = schema.reduce((acc, field) => ({
    ...acc,
    [field.name]: field.type === 'checkbox' ? false : ''
  }), {})

  const form = useForm({
    initialValues,
    onSubmit: async (values) => console.log(values)
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        {schema.map(fieldSchema => (
          <DynamicField key={fieldSchema.name} schema={fieldSchema} />
        ))}
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  )
}

function DynamicField({ schema }: { schema: FieldSchema }) {
  const field = useField(schema.name, {
    required: schema.required ? \`\${schema.label} is required\` : undefined,
    ...schema.validation
  })

  switch (schema.type) {
    case 'text':
    case 'email':
    case 'number':
      return (
        <div className="form-group">
          <label>{schema.label}</label>
          <input {...field.register()} type={schema.type} />
          {field.touched && field.error && <span className="error">{field.error}</span>}
        </div>
      )

    case 'select':
      return (
        <div className="form-group">
          <label>{schema.label}</label>
          <select {...field.register()}>
            <option value="">Select...</option>
            {schema.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )

    case 'checkbox':
      return (
        <label className="checkbox">
          <input {...field.register()} type="checkbox" />
          {schema.label}
        </label>
      )

    default:
      return null
  }
}

// Usage
const formSchema: FieldSchema[] = [
  { name: 'name', type: 'text', label: 'Full Name', required: true },
  { name: 'email', type: 'email', label: 'Email', required: true },
  { name: 'country', type: 'select', label: 'Country', options: [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' }
  ]},
  { name: 'newsletter', type: 'checkbox', label: 'Subscribe to newsletter' }
]

<SchemaForm schema={formSchema} />`}</CodeBlock>

      <h2>Computed Fields</h2>
      <CodeBlock language="tsx">{`function OrderForm() {
  const items = useWatch('items')
  const discount = useWatch('discount')

  const subtotal = useMemo(() => {
    return (items || []).reduce((sum, item) =>
      sum + (item.quantity || 0) * (item.price || 0), 0
    )
  }, [items])

  const discountAmount = subtotal * ((discount || 0) / 100)
  const total = subtotal - discountAmount

  return (
    <div className="order-summary">
      <ItemsList />

      <div className="totals">
        <div className="row">
          <span>Subtotal</span>
          <span>\${subtotal.toFixed(2)}</span>
        </div>

        <div className="row discount">
          <span>Discount</span>
          <input
            {...discountField.register()}
            type="number"
            min="0"
            max="100"
          />%
          <span>-\${discountAmount.toFixed(2)}</span>
        </div>

        <div className="row total">
          <span>Total</span>
          <span>\${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}`}</CodeBlock>

      <h2>Field Cloning</h2>
      <CodeBlock language="tsx">{`function ClonableFields() {
  const { fields, append } = useFieldArray('contacts')

  const cloneField = (index: number) => {
    const fieldToClone = fields[index]
    append({ ...fieldToClone, id: undefined }) // Clone without ID
  }

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="contact-row">
          <ContactFields index={index} />
          <button type="button" onClick={() => cloneField(index)}>
            Clone
          </button>
        </div>
      ))}
    </div>
  )
}`}</CodeBlock>
    </div>
  )
}
