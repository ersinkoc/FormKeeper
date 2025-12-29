import { CodeBlock } from '@/components/code/CodeBlock'

export default function MultiStepForms() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Multi-Step Forms</h1>
      <p className="lead">
        Build wizard-style forms with step navigation, validation, and progress tracking.
      </p>

      <h2>Overview</h2>
      <p>
        Multi-step forms (wizards) break complex forms into manageable steps.
        FormKeeper's Wizard plugin provides navigation, per-step validation,
        and progress tracking out of the box.
      </p>

      <h2>Basic Setup</h2>
      <CodeBlock language="tsx">{`import { useForm, FormProvider } from '@oxog/formkeeper/react'
import { createWizardPlugin } from '@oxog/formkeeper/plugins'

function CheckoutWizard() {
  const form = useForm({
    initialValues: {
      // Step 1: Personal
      name: '',
      email: '',
      // Step 2: Shipping
      address: '',
      city: '',
      // Step 3: Payment
      cardNumber: '',
      expiry: ''
    },
    plugins: [
      createWizardPlugin({
        steps: [
          { id: 'personal', fields: ['name', 'email'] },
          { id: 'shipping', fields: ['address', 'city'] },
          { id: 'payment', fields: ['cardNumber', 'expiry'] }
        ],
        validateOnStepChange: true
      })
    ],
    onSubmit: async (values) => {
      await submitOrder(values)
    }
  })

  const wizard = form.getPlugin('wizard')

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <WizardSteps wizard={wizard} />
        <WizardContent wizard={wizard} />
        <WizardNavigation wizard={wizard} form={form} />
      </form>
    </FormProvider>
  )
}`}</CodeBlock>

      <h2>Step Progress Indicator</h2>
      <CodeBlock language="tsx">{`function WizardSteps({ wizard }) {
  const steps = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' }
  ]

  return (
    <div className="wizard-steps">
      {steps.map((step, index) => (
        <button
          key={step.id}
          type="button"
          className={\`step \${
            wizard.currentIndex === index ? 'active' :
            wizard.currentIndex > index ? 'completed' : ''
          }\`}
          onClick={() => wizard.goTo(step.id)}
          disabled={!wizard.canGoTo(step.id)}
        >
          <span className="step-number">{index + 1}</span>
          <span className="step-label">{step.label}</span>
        </button>
      ))}

      {/* Progress bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: \`\${wizard.getProgress()}%\` }}
        />
      </div>
    </div>
  )
}`}</CodeBlock>

      <h2>Step Content</h2>
      <CodeBlock language="tsx">{`function WizardContent({ wizard }) {
  return (
    <div className="wizard-content">
      {wizard.currentStep.id === 'personal' && <PersonalStep />}
      {wizard.currentStep.id === 'shipping' && <ShippingStep />}
      {wizard.currentStep.id === 'payment' && <PaymentStep />}
    </div>
  )
}

function PersonalStep() {
  const name = useField('name', { required: 'Name is required' })
  const email = useField('email', {
    required: 'Email is required',
    pattern: { value: /^[^\\s@]+@[^\\s@]+$/, message: 'Invalid email' }
  })

  return (
    <div className="step-content">
      <h2>Personal Information</h2>
      <div className="form-group">
        <label>Full Name</label>
        <input {...name.register()} />
        {name.touched && name.error && <span className="error">{name.error}</span>}
      </div>
      <div className="form-group">
        <label>Email</label>
        <input {...email.register()} type="email" />
        {email.touched && email.error && <span className="error">{email.error}</span>}
      </div>
    </div>
  )
}`}</CodeBlock>

      <h2>Navigation Controls</h2>
      <CodeBlock language="tsx">{`function WizardNavigation({ wizard, form }) {
  const handleNext = async () => {
    const canProceed = await wizard.next()
    if (!canProceed) {
      // Validation failed, errors are displayed
      console.log('Please fix errors before proceeding')
    }
  }

  return (
    <div className="wizard-navigation">
      <button
        type="button"
        onClick={() => wizard.prev()}
        disabled={wizard.isFirstStep}
        className="btn-secondary"
      >
        Previous
      </button>

      {wizard.isLastStep ? (
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="btn-primary"
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Complete Order'}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="btn-primary"
        >
          Next
        </button>
      )}
    </div>
  )
}`}</CodeBlock>

      <h2>Custom Step Validation</h2>
      <CodeBlock language="typescript">{`createWizardPlugin({
  steps: [
    {
      id: 'personal',
      fields: ['name', 'email'],
      // Custom validation for this step
      validate: async () => {
        // Additional async checks
        const emailAvailable = await checkEmailAvailability()
        return emailAvailable
      }
    },
    {
      id: 'shipping',
      fields: ['address', 'city'],
      // Control when user can enter/leave step
      canEnter: () => {
        // Only allow if personal info is complete
        return true
      },
      canLeave: () => {
        // Confirm before leaving
        return confirm('Are you sure you want to leave shipping?')
      }
    }
  ]
})`}</CodeBlock>

      <h2>Linear vs Non-Linear Navigation</h2>
      <CodeBlock language="typescript">{`// Linear: Must complete steps in order
createWizardPlugin({
  steps: [...],
  linear: true, // Cannot skip ahead
  validateOnStepChange: true
})

// Non-linear: Can jump to any completed step
createWizardPlugin({
  steps: [...],
  linear: false,
  allowSkip: true // Can skip validation and jump
})`}</CodeBlock>

      <h2>Persisting Wizard State</h2>
      <CodeBlock language="tsx">{`import { createWizardPlugin, createPersistPlugin } from '@oxog/formkeeper/plugins'

const form = useForm({
  initialValues: { /* ... */ },
  plugins: [
    createWizardPlugin({ steps: [...] }),
    createPersistPlugin({
      key: 'checkout-wizard',
      storage: sessionStorage,
      include: ['values'] // Persist values across page refreshes
    })
  ],
  onSubmit: async (values) => { /* ... */ }
})

// On mount, check for saved progress
useEffect(() => {
  const persist = form.getPlugin('persist')
  if (persist?.restore()) {
    console.log('Restored saved progress')
  }
}, [])`}</CodeBlock>

      <h2>Step Completion Status</h2>
      <CodeBlock language="tsx">{`function StepStatus({ wizard }) {
  return (
    <div className="step-status">
      {wizard.steps.map(step => (
        <div key={step.id} className="step-item">
          <span className={wizard.isStepComplete(step.id) ? 'complete' : ''}>
            {step.id}
          </span>
          {wizard.isStepComplete(step.id) && <span>✓</span>}
        </div>
      ))}

      <div className="completed-count">
        Completed: {wizard.getCompletedSteps().length} / {wizard.steps.length}
      </div>
    </div>
  )
}`}</CodeBlock>

      <h2>Complete Example</h2>
      <p>
        See the full multi-step checkout example in the{' '}
        <a href="/examples">Examples</a> section.
      </p>
    </div>
  )
}
