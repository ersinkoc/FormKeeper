/**
 * React Multi-Step Form Example
 *
 * This example demonstrates a wizard-style multi-step form using the Wizard plugin.
 *
 * Features:
 * - Step navigation (next, previous, go to step)
 * - Step validation before proceeding
 * - Progress indicator
 * - Step completion tracking
 */

import React from 'react'
import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'
import { createWizardPlugin } from '@oxog/formkeeper/plugins'

interface CheckoutValues {
  // Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string
  // Shipping Address
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  // Payment
  cardNumber: string
  cardName: string
  expiry: string
  cvv: string
}

export function MultiStepForm() {
  const wizardPlugin = createWizardPlugin({
    steps: [
      { id: 'personal', fields: ['firstName', 'lastName', 'email', 'phone'] },
      { id: 'shipping', fields: ['street', 'city', 'state', 'zipCode', 'country'] },
      { id: 'payment', fields: ['cardNumber', 'cardName', 'expiry', 'cvv'] },
    ],
    validateOnStepChange: true,
  })

  const form = useForm<CheckoutValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: '',
    },
    plugins: [wizardPlugin],
    onSubmit: async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Order submitted:', values)
      alert('Order placed successfully!')
    },
  })

  const wizard = form.getPlugin('wizard') as any

  const steps = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
  ]

  return (
    <FormProvider form={form}>
      <div className="multi-step-form">
        <h1>Checkout</h1>

        {/* Progress Steps */}
        <div className="steps-progress">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`step ${
                wizard?.currentIndex === index
                  ? 'active'
                  : wizard?.currentIndex > index
                  ? 'completed'
                  : ''
              }`}
              onClick={() => wizard?.goTo(step.id)}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-label">{step.label}</div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${wizard?.getProgress() || 0}%` }}
          />
        </div>

        <form onSubmit={form.handleSubmit}>
          {/* Step Content */}
          {wizard?.currentStep?.id === 'personal' && <PersonalInfoStep />}
          {wizard?.currentStep?.id === 'shipping' && <ShippingStep />}
          {wizard?.currentStep?.id === 'payment' && <PaymentStep />}

          {/* Navigation */}
          <div className="step-navigation">
            <button
              type="button"
              onClick={() => wizard?.prev()}
              disabled={wizard?.isFirstStep}
              className="btn-secondary"
            >
              Previous
            </button>

            {wizard?.isLastStep ? (
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="btn-primary"
              >
                {form.formState.isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => wizard?.next()}
                className="btn-primary"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

function PersonalInfoStep() {
  return (
    <div className="step-content">
      <h2>Personal Information</h2>

      <div className="form-row">
        <TextField name="firstName" label="First Name" required />
        <TextField name="lastName" label="Last Name" required />
      </div>

      <TextField
        name="email"
        label="Email"
        type="email"
        required
        pattern={{
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Invalid email address',
        }}
      />

      <TextField
        name="phone"
        label="Phone"
        type="tel"
        pattern={{
          value: /^\+?[\d\s-]{10,}$/,
          message: 'Invalid phone number',
        }}
      />
    </div>
  )
}

function ShippingStep() {
  return (
    <div className="step-content">
      <h2>Shipping Address</h2>

      <TextField name="street" label="Street Address" required />

      <div className="form-row">
        <TextField name="city" label="City" required />
        <TextField name="state" label="State" required />
      </div>

      <div className="form-row">
        <TextField name="zipCode" label="ZIP Code" required />
        <SelectField
          name="country"
          label="Country"
          required
          options={[
            { value: '', label: 'Select country...' },
            { value: 'US', label: 'United States' },
            { value: 'CA', label: 'Canada' },
            { value: 'UK', label: 'United Kingdom' },
            { value: 'DE', label: 'Germany' },
            { value: 'FR', label: 'France' },
          ]}
        />
      </div>
    </div>
  )
}

function PaymentStep() {
  return (
    <div className="step-content">
      <h2>Payment Details</h2>

      <TextField
        name="cardNumber"
        label="Card Number"
        required
        placeholder="1234 5678 9012 3456"
        maxLength={19}
      />

      <TextField name="cardName" label="Name on Card" required />

      <div className="form-row">
        <TextField
          name="expiry"
          label="Expiry Date"
          required
          placeholder="MM/YY"
          maxLength={5}
        />
        <TextField
          name="cvv"
          label="CVV"
          required
          type="password"
          maxLength={4}
        />
      </div>

      <div className="secure-notice">
        <span className="lock-icon">🔒</span>
        Your payment information is secure and encrypted
      </div>
    </div>
  )
}

// Reusable TextField component
interface TextFieldProps {
  name: string
  label: string
  type?: string
  required?: boolean
  placeholder?: string
  maxLength?: number
  pattern?: { value: RegExp; message: string }
}

function TextField({
  name,
  label,
  type = 'text',
  required,
  placeholder,
  maxLength,
  pattern,
}: TextFieldProps) {
  const { register, error, touched } = useField(name, {
    required: required ? `${label} is required` : undefined,
    pattern,
  })

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        {...register()}
        type={type}
        id={name}
        placeholder={placeholder}
        maxLength={maxLength}
        className={touched && error ? 'error' : ''}
      />
      {touched && error && <span className="error-message">{error}</span>}
    </div>
  )
}

// Reusable SelectField component
interface SelectFieldProps {
  name: string
  label: string
  required?: boolean
  options: { value: string; label: string }[]
}

function SelectField({ name, label, required, options }: SelectFieldProps) {
  const { register, error, touched } = useField(name, {
    required: required ? `${label} is required` : undefined,
  })

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select
        {...register()}
        id={name}
        className={touched && error ? 'error' : ''}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {touched && error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default MultiStepForm
