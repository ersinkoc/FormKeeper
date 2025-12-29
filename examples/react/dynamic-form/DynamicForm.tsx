/**
 * React Dynamic Form Example
 *
 * This example demonstrates dynamic form building with array fields.
 *
 * Features:
 * - Add/remove form fields dynamically
 * - Reorder fields with drag handles
 * - Nested array fields
 * - Computed values (totals)
 */

import React from 'react'
import {
  useForm,
  useField,
  useFieldArray,
  FormProvider,
  useWatch,
} from '@oxog/formkeeper/react'

interface InvoiceValues {
  invoiceNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
  }>
  notes: string
  discount: number
}

export function DynamicForm() {
  const form = useForm<InvoiceValues>({
    initialValues: {
      invoiceNumber: `INV-${Date.now().toString(36).toUpperCase()}`,
      customerName: '',
      customerEmail: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      notes: '',
      discount: 0,
    },
    onSubmit: async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Invoice submitted:', values)
      alert('Invoice created successfully!')
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit} className="invoice-form">
        <header className="invoice-header">
          <h1>Create Invoice</h1>
          <InvoiceNumberField />
        </header>

        <section className="customer-section">
          <h2>Customer Details</h2>
          <div className="form-row">
            <CustomerNameField />
            <CustomerEmailField />
          </div>
        </section>

        <section className="items-section">
          <h2>Invoice Items</h2>
          <ItemsList />
        </section>

        <section className="totals-section">
          <TotalsDisplay />
        </section>

        <section className="notes-section">
          <NotesField />
        </section>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => form.reset()}>
            Clear Form
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </FormProvider>
  )
}

function InvoiceNumberField() {
  const { register } = useField('invoiceNumber')
  return (
    <div className="invoice-number">
      <label>Invoice #</label>
      <input {...register()} type="text" readOnly className="readonly" />
    </div>
  )
}

function CustomerNameField() {
  const { register, error, touched } = useField('customerName', {
    required: 'Customer name is required',
  })
  return (
    <div className="form-group">
      <label htmlFor="customerName">Customer Name</label>
      <input
        {...register()}
        type="text"
        id="customerName"
        placeholder="Enter customer name"
        className={touched && error ? 'error' : ''}
      />
      {touched && error && <span className="error-message">{error}</span>}
    </div>
  )
}

function CustomerEmailField() {
  const { register, error, touched } = useField('customerEmail', {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email address',
    },
  })
  return (
    <div className="form-group">
      <label htmlFor="customerEmail">Customer Email</label>
      <input
        {...register()}
        type="email"
        id="customerEmail"
        placeholder="Enter customer email"
        className={touched && error ? 'error' : ''}
      />
      {touched && error && <span className="error-message">{error}</span>}
    </div>
  )
}

function ItemsList() {
  const { fields, append, remove, move } = useFieldArray('items')

  return (
    <div className="items-list">
      <div className="items-header">
        <span className="col-description">Description</span>
        <span className="col-quantity">Qty</span>
        <span className="col-price">Unit Price</span>
        <span className="col-total">Total</span>
        <span className="col-actions"></span>
      </div>

      {fields.map((field, index) => (
        <ItemRow
          key={field.id}
          index={index}
          canMoveUp={index > 0}
          canMoveDown={index < fields.length - 1}
          canRemove={fields.length > 1}
          onMoveUp={() => move(index, index - 1)}
          onMoveDown={() => move(index, index + 1)}
          onRemove={() => remove(index)}
        />
      ))}

      <button
        type="button"
        className="btn-add-item"
        onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
      >
        + Add Item
      </button>
    </div>
  )
}

interface ItemRowProps {
  index: number
  canMoveUp: boolean
  canMoveDown: boolean
  canRemove: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
}

function ItemRow({
  index,
  canMoveUp,
  canMoveDown,
  canRemove,
  onMoveUp,
  onMoveDown,
  onRemove,
}: ItemRowProps) {
  const descField = useField(`items.${index}.description`, {
    required: 'Required',
  })
  const qtyField = useField(`items.${index}.quantity`, {
    required: 'Required',
    min: { value: 1, message: 'Min 1' },
  })
  const priceField = useField(`items.${index}.unitPrice`, {
    required: 'Required',
    min: { value: 0, message: 'Min 0' },
  })

  const quantity = qtyField.value || 0
  const unitPrice = priceField.value || 0
  const lineTotal = quantity * unitPrice

  return (
    <div className="item-row">
      <div className="col-description">
        <input
          {...descField.register()}
          type="text"
          placeholder="Item description"
          className={descField.touched && descField.error ? 'error' : ''}
        />
      </div>

      <div className="col-quantity">
        <input
          {...qtyField.register()}
          type="number"
          min="1"
          className={qtyField.touched && qtyField.error ? 'error' : ''}
        />
      </div>

      <div className="col-price">
        <input
          {...priceField.register()}
          type="number"
          min="0"
          step="0.01"
          className={priceField.touched && priceField.error ? 'error' : ''}
        />
      </div>

      <div className="col-total">${lineTotal.toFixed(2)}</div>

      <div className="col-actions">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="btn-icon"
          title="Move up"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="btn-icon"
          title="Move down"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className="btn-icon btn-remove"
          title="Remove"
        >
          ×
        </button>
      </div>
    </div>
  )
}

function TotalsDisplay() {
  const items = useWatch('items') as InvoiceValues['items']
  const discount = useWatch('discount') as number

  const subtotal = (items || []).reduce((sum, item) => {
    return sum + (item.quantity || 0) * (item.unitPrice || 0)
  }, 0)

  const discountAmount = subtotal * ((discount || 0) / 100)
  const total = subtotal - discountAmount

  const { register } = useField('discount')

  return (
    <div className="totals">
      <div className="total-row">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="total-row discount-row">
        <span>
          Discount (
          <input
            {...register()}
            type="number"
            min="0"
            max="100"
            step="1"
            className="discount-input"
          />
          %)
        </span>
        <span className="discount-amount">-${discountAmount.toFixed(2)}</span>
      </div>

      <div className="total-row total-final">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  )
}

function NotesField() {
  const { register } = useField('notes')
  return (
    <div className="form-group">
      <label htmlFor="notes">Notes (optional)</label>
      <textarea
        {...register()}
        id="notes"
        placeholder="Add any notes or payment terms..."
        rows={3}
      />
    </div>
  )
}

export default DynamicForm
