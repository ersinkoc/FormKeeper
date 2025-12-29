import { CodeBlock } from '@/components/code/CodeBlock'
import { PropsTable } from '@/components/code/PropsTable'

export default function UseWatch() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>useWatch</h1>
      <p className="lead">
        Hook for subscribing to form value changes with optimized re-renders.
      </p>

      <h2>Import</h2>
      <CodeBlock language="typescript">{`import { useWatch } from '@oxog/formkeeper/react'`}</CodeBlock>

      <h2>Basic Usage</h2>
      <CodeBlock language="tsx">{`function PriceDisplay() {
  // Watch a specific field
  const price = useWatch('price')

  return <div>Price: \${price || 0}</div>
}

function FormSummary() {
  // Watch all form values
  const values = useWatch()

  return <pre>{JSON.stringify(values, null, 2)}</pre>
}`}</CodeBlock>

      <h2>Overloads</h2>
      <PropsTable
        props={[
          { name: 'useWatch()', type: '() => TValues', description: 'Watch all form values' },
          { name: 'useWatch(name)', type: '(name: string) => any', description: 'Watch a specific field' },
          { name: 'useWatch(name, callback)', type: '(name: string, cb: Function) => void', description: 'Watch with callback (no re-render)' },
        ]}
      />

      <h2>Watch Specific Field</h2>
      <CodeBlock language="tsx">{`function TaxCalculator() {
  const subtotal = useWatch('subtotal')
  const taxRate = useWatch('taxRate')

  const tax = (subtotal || 0) * ((taxRate || 0) / 100)

  return (
    <div className="tax-line">
      Tax ({taxRate}%): \${tax.toFixed(2)}
    </div>
  )
}`}</CodeBlock>

      <h2>Watch Multiple Fields</h2>
      <CodeBlock language="tsx">{`function OrderSummary() {
  const quantity = useWatch('quantity')
  const unitPrice = useWatch('unitPrice')
  const discount = useWatch('discount')

  const subtotal = (quantity || 0) * (unitPrice || 0)
  const discountAmount = subtotal * ((discount || 0) / 100)
  const total = subtotal - discountAmount

  return (
    <div className="order-summary">
      <div>Subtotal: \${subtotal.toFixed(2)}</div>
      <div>Discount: -\${discountAmount.toFixed(2)}</div>
      <div className="total">Total: \${total.toFixed(2)}</div>
    </div>
  )
}`}</CodeBlock>

      <h2>Watch Nested Fields</h2>
      <CodeBlock language="tsx">{`function ShippingPreview() {
  const street = useWatch('shipping.address.street')
  const city = useWatch('shipping.address.city')
  const zip = useWatch('shipping.address.zip')

  if (!street && !city && !zip) {
    return <p>No shipping address entered</p>
  }

  return (
    <address>
      {street}<br />
      {city}, {zip}
    </address>
  )
}`}</CodeBlock>

      <h2>Watch with Callback</h2>
      <p>
        For side effects without re-rendering the component:
      </p>
      <CodeBlock language="tsx">{`function PriceLogger() {
  // This won't cause re-renders
  useWatch('price', (value, prevValue) => {
    console.log(\`Price changed: \${prevValue} → \${value}\`)

    // Track analytics
    analytics.track('price_changed', { from: prevValue, to: value })
  })

  return null // No UI needed
}

function AutoSaveIndicator() {
  const [saved, setSaved] = useState(true)

  useWatch('content', (value, prevValue) => {
    if (value !== prevValue) {
      setSaved(false)
      // Debounced save
      saveContent(value).then(() => setSaved(true))
    }
  })

  return <span>{saved ? 'Saved' : 'Saving...'}</span>
}`}</CodeBlock>

      <h2>Conditional Rendering</h2>
      <CodeBlock language="tsx">{`function ConditionalFields() {
  const hasShipping = useWatch('hasShipping')
  const paymentMethod = useWatch('paymentMethod')

  return (
    <div>
      <Checkbox name="hasShipping" label="Ship to address" />

      {hasShipping && <ShippingAddressFields />}

      <Select name="paymentMethod" options={paymentOptions} />

      {paymentMethod === 'card' && <CreditCardFields />}
      {paymentMethod === 'bank' && <BankTransferFields />}
      {paymentMethod === 'paypal' && <PayPalButton />}
    </div>
  )
}`}</CodeBlock>

      <h2>Watch Array Fields</h2>
      <CodeBlock language="tsx">{`function ItemsCount() {
  const items = useWatch('items')

  return (
    <span className="badge">
      {items?.length || 0} items
    </span>
  )
}

function CartTotal() {
  const items = useWatch('items')

  const total = useMemo(() => {
    return (items || []).reduce((sum, item) => {
      return sum + item.quantity * item.price
    }, 0)
  }, [items])

  return <div className="cart-total">Total: \${total.toFixed(2)}</div>
}`}</CodeBlock>

      <h2>Performance Optimization</h2>
      <p>
        <code>useWatch</code> only triggers re-renders when the watched value changes:
      </p>
      <CodeBlock language="tsx">{`// ✅ Optimized - only re-renders when 'email' changes
function EmailPreview() {
  const email = useWatch('email')
  return <span>{email}</span>
}

// ❌ Less optimal - re-renders on any form change
function EmailPreview() {
  const { formState } = useFormContext()
  return <span>{formState.values.email}</span>
}`}</CodeBlock>

      <h2>With useFormContext</h2>
      <CodeBlock language="tsx">{`import { useWatch, useFormContext } from '@oxog/formkeeper/react'

function SmartSubmitButton() {
  const { formState } = useFormContext()
  const email = useWatch('email')
  const password = useWatch('password')

  const canSubmit = email && password && !formState.isSubmitting

  return (
    <button type="submit" disabled={!canSubmit}>
      {formState.isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  )
}`}</CodeBlock>
    </div>
  )
}
