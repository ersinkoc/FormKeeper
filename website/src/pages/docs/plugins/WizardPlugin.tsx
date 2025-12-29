import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'

export function WizardPlugin() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Wizard Plugin</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Create multi-step forms with validation, navigation, and progress tracking.
      </p>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Setup</h2>
        <CodeBlock
          code={`import { useForm } from '@oxog/formkeeper/react'
import { WizardPlugin } from '@oxog/formkeeper/plugins'

const form = useForm({
  initialValues: {
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    // Step 2: Address
    street: '',
    city: '',
    zipCode: '',
    // Step 3: Payment
    cardNumber: '',
    expiry: '',
    cvv: '',
  },
  plugins: [
    WizardPlugin({
      steps: [
        {
          id: 'personal',
          title: 'Personal Information',
          fields: ['firstName', 'lastName', 'email'],
        },
        {
          id: 'address',
          title: 'Address',
          fields: ['street', 'city', 'zipCode'],
        },
        {
          id: 'payment',
          title: 'Payment',
          fields: ['cardNumber', 'expiry', 'cvv'],
        },
      ],
      validateOnNext: true,
    }),
  ],
  onSubmit: (values) => console.log(values),
})`}
          language="typescript"
          filename="wizard-setup.ts"
        />
      </section>

      {/* Configuration */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Option</th>
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Default</th>
                <th className="text-left py-3 px-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">steps</td>
                <td className="py-3 px-4 font-mono">WizardStep[]</td>
                <td className="py-3 px-4">Required</td>
                <td className="py-3 px-4 text-muted-foreground">Step definitions</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">initialStep</td>
                <td className="py-3 px-4 font-mono">number</td>
                <td className="py-3 px-4">0</td>
                <td className="py-3 px-4 text-muted-foreground">Starting step index</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">validateOnNext</td>
                <td className="py-3 px-4 font-mono">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4 text-muted-foreground">Validate before advancing</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">allowBack</td>
                <td className="py-3 px-4 font-mono">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4 text-muted-foreground">Allow going back</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* API */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Wizard API</h2>
        <CodeBlock
          code={`const wizard = form.getPlugin('wizard')

// Navigation
await wizard.next()        // Go to next step (validates first)
wizard.back()              // Go to previous step
await wizard.goToStep(2)   // Jump to specific step

// State
wizard.getCurrentStep()           // Current step index (0-based)
wizard.getCurrentStepConfig()     // Current step configuration
wizard.getSteps()                 // All step configurations
wizard.isFirstStep()              // true if on first step
wizard.isLastStep()               // true if on last step
wizard.canGoNext()                // true if can advance
wizard.canGoBack()                // true if can go back
wizard.getProgress()              // Progress 0-100
wizard.isStepCompleted(index)     // Check if step was completed

// Reset
wizard.reset()                    // Go back to first step`}
          language="typescript"
        />
      </section>

      {/* Complete Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Complete Example</h2>
        <CodeBlock
          code={`import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'
import { WizardPlugin } from '@oxog/formkeeper/plugins'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CheckoutForm {
  firstName: string
  lastName: string
  email: string
  street: string
  city: string
  zipCode: string
  cardNumber: string
  expiry: string
  cvv: string
}

export function CheckoutWizard() {
  const form = useForm<CheckoutForm>({
    initialValues: {
      firstName: '', lastName: '', email: '',
      street: '', city: '', zipCode: '',
      cardNumber: '', expiry: '', cvv: '',
    },
    plugins: [
      WizardPlugin({
        steps: [
          { id: 'personal', title: 'Personal Info', fields: ['firstName', 'lastName', 'email'] },
          { id: 'address', title: 'Shipping', fields: ['street', 'city', 'zipCode'] },
          { id: 'payment', title: 'Payment', fields: ['cardNumber', 'expiry', 'cvv'] },
        ],
      }),
    ],
    onSubmit: async (values) => {
      await processOrder(values)
    },
  })

  const wizard = form.getPlugin('wizard')
  const currentStep = wizard.getCurrentStep()
  const steps = wizard.getSteps()

  return (
    <FormProvider form={form}>
      <div className="max-w-xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={\`flex-1 text-center \${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }\`}
              >
                <div className={\`w-8 h-8 mx-auto rounded-full flex items-center justify-center \${
                  index < currentStep ? 'bg-blue-600 text-white' :
                  index === currentStep ? 'border-2 border-blue-600' :
                  'border-2 border-gray-300'
                }\`}>
                  {index + 1}
                </div>
                <span className="text-sm mt-1">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: \`\${wizard.getProgress()}%\` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <form onSubmit={form.handleSubmit}>
          {currentStep === 0 && <PersonalInfoStep />}
          {currentStep === 1 && <AddressStep />}
          {currentStep === 2 && <PaymentStep />}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => wizard.back()}
              disabled={!wizard.canGoBack()}
              className="flex items-center gap-2 px-4 py-2 border rounded disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {wizard.isLastStep() ? (
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded"
              >
                {form.formState.isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => wizard.next()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Next
                <ChevronRight className="w-4 h-4" />
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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Personal Information</h2>
      <TextField name="firstName" label="First Name" required />
      <TextField name="lastName" label="Last Name" required />
      <TextField name="email" label="Email" type="email" required />
    </div>
  )
}

function AddressStep() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Shipping Address</h2>
      <TextField name="street" label="Street Address" required />
      <TextField name="city" label="City" required />
      <TextField name="zipCode" label="ZIP Code" required />
    </div>
  )
}

function PaymentStep() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment Details</h2>
      <TextField name="cardNumber" label="Card Number" required />
      <div className="grid grid-cols-2 gap-4">
        <TextField name="expiry" label="Expiry" placeholder="MM/YY" required />
        <TextField name="cvv" label="CVV" required />
      </div>
    </div>
  )
}

function TextField({ name, label, ...props }) {
  const { register, error, touched } = useField(name, {
    required: props.required ? \`\${label} is required\` : undefined,
  })

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input {...register()} {...props} className="w-full px-3 py-2 border rounded" />
      {touched && error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
}`}
          language="tsx"
          filename="CheckoutWizard.tsx"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/examples/multi-step-wizard">
              See Full Example
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/docs/plugins/persist">Persist Plugin</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
