import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'
import { useState, FormEvent } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

interface WizardValues {
  // Step 1: Personal Info
  firstName: string
  lastName: string
  // Step 2: Contact
  email: string
  phone: string
  // Step 3: Address
  street: string
  city: string
  zipCode: string
}

const steps = [
  { id: 1, title: 'Personal Info' },
  { id: 2, title: 'Contact' },
  { id: 3, title: 'Address' },
]

export function LiveMultiStepWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [result, setResult] = useState<string | null>(null)

  const form = useForm<WizardValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      zipCode: '',
    },
    onSubmit: async (values) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      setResult(JSON.stringify(values, null, 2))
    },
  })

  const goNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const goPrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <FormProvider form={form}>
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Registration Wizard</h2>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-700 text-zinc-400'
                  }`}
              >
                {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-zinc-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-zinc-400 text-sm mb-6">
          Step {currentStep}: {steps[currentStep - 1].title}
        </p>

        <form onSubmit={(e: FormEvent<HTMLFormElement>) => { e.preventDefault(); form.handleSubmit() }}>
          {/* Step 1: Personal Info */}
          {currentStep === 1 && <PersonalInfoStep />}

          {/* Step 2: Contact */}
          {currentStep === 2 && <ContactStep />}

          {/* Step 3: Address */}
          {currentStep === 3 && <AddressStep />}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentStep === 1}
              className="flex items-center gap-1 px-4 py-2 text-zinc-400 hover:text-white
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md
                           hover:bg-blue-700 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md
                           hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {form.formState.isSubmitting ? 'Submitting...' : 'Complete'}
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {result && (
          <div className="mt-6 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
            <p className="text-sm text-green-400 font-medium mb-1">Registration Complete!</p>
            <pre className="text-xs text-green-300 overflow-auto">{result}</pre>
          </div>
        )}
      </div>
    </FormProvider>
  )
}

function PersonalInfoStep() {
  const firstName = useField('firstName', { required: 'First name is required' })
  const lastName = useField('lastName', { required: 'Last name is required' })

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium">First Name</label>
        <input
          {...firstName.register()}
          placeholder="John"
          className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {firstName.touched && firstName.error && (
          <p className="text-sm text-red-400">{firstName.error}</p>
        )}
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium">Last Name</label>
        <input
          {...lastName.register()}
          placeholder="Doe"
          className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {lastName.touched && lastName.error && (
          <p className="text-sm text-red-400">{lastName.error}</p>
        )}
      </div>
    </div>
  )
}

function ContactStep() {
  const email = useField('email', {
    required: 'Email is required',
    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' },
  })
  const phone = useField('phone', { required: 'Phone is required' })

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium">Email</label>
        <input
          {...email.register()}
          type="email"
          placeholder="john@example.com"
          className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {email.touched && email.error && (
          <p className="text-sm text-red-400">{email.error}</p>
        )}
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium">Phone</label>
        <input
          {...phone.register()}
          type="tel"
          placeholder="+1 (555) 000-0000"
          className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {phone.touched && phone.error && (
          <p className="text-sm text-red-400">{phone.error}</p>
        )}
      </div>
    </div>
  )
}

function AddressStep() {
  const street = useField('street', { required: 'Street is required' })
  const city = useField('city', { required: 'City is required' })
  const zipCode = useField('zipCode', { required: 'ZIP code is required' })

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium">Street</label>
        <input
          {...street.register()}
          placeholder="123 Main St"
          className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {street.touched && street.error && (
          <p className="text-sm text-red-400">{street.error}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium">City</label>
          <input
            {...city.register()}
            placeholder="New York"
            className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {city.touched && city.error && (
            <p className="text-sm text-red-400">{city.error}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">ZIP Code</label>
          <input
            {...zipCode.register()}
            placeholder="10001"
            className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {zipCode.touched && zipCode.error && (
            <p className="text-sm text-red-400">{zipCode.error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
