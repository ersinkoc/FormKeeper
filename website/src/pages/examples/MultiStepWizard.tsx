import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'
import { BrowserWindow } from '@/components/code/BrowserWindow'
import { LiveMultiStepWizard } from '@/components/examples'

const wizardCode = `import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'
import { createWizardPlugin } from '@oxog/formkeeper/plugins/wizard'

interface WizardValues {
  // Step 1: Personal
  firstName: string
  lastName: string
  // Step 2: Contact
  email: string
  phone: string
  // Step 3: Account
  username: string
  password: string
}

export function MultiStepWizard() {
  const form = useForm<WizardValues>({
    initialValues: {
      firstName: '', lastName: '',
      email: '', phone: '',
      username: '', password: '',
    },
    plugins: [
      createWizardPlugin({
        steps: ['personal', 'contact', 'account'],
      }),
    ],
    onSubmit: async (values) => {
      console.log('Wizard completed:', values)
      alert('Account created!')
    },
  })

  const wizard = form.getPlugin('wizard')
  const { currentStep, totalSteps, isFirstStep, isLastStep } = wizard

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit} className="max-w-md mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-600 rounded transition-all"
              style={{ width: \`\${((currentStep + 1) / totalSteps) * 100}%\` }}
            />
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 0 && <PersonalStep />}
        {currentStep === 1 && <ContactStep />}
        {currentStep === 2 && <AccountStep />}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => wizard.goToPrev()}
            disabled={isFirstStep}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          {isLastStep ? (
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Submit
            </button>
          ) : (
            <button
              type="button"
              onClick={async () => {
                const isValid = await wizard.validateCurrentStep()
                if (isValid) wizard.goToNext()
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}

function PersonalStep() {
  const firstName = useField('firstName', { required: 'First name required' })
  const lastName = useField('lastName', { required: 'Last name required' })

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Personal Information</h3>
      <div>
        <label className="block text-sm mb-1">First Name</label>
        <input {...firstName.register()} className="w-full px-3 py-2 border rounded" />
        {firstName.error && <p className="text-sm text-red-500">{firstName.error}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1">Last Name</label>
        <input {...lastName.register()} className="w-full px-3 py-2 border rounded" />
        {lastName.error && <p className="text-sm text-red-500">{lastName.error}</p>}
      </div>
    </div>
  )
}

// Similar components for ContactStep and AccountStep...`

export function MultiStepWizardExample() {
  return (
    <div className="container py-12 max-w-5xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/examples">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Examples
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-4">Multi-Step Wizard</h1>
        <p className="text-lg text-muted-foreground">
          A step-by-step form wizard with progress indicator using the Wizard plugin.
        </p>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Live Preview</h2>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Interactive</span>
        </div>
        <BrowserWindow url="localhost:3000/wizard">
          <div className="bg-zinc-900">
            <LiveMultiStepWizard />
          </div>
        </BrowserWindow>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Source Code</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/playground"><ExternalLink className="w-4 h-4 mr-2" />Open in Playground</Link>
          </Button>
        </div>
        <CodeBlock code={wizardCode} language="tsx" filename="MultiStepWizard.tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>Wizard Plugin</strong> - Manages step state, navigation, and per-step validation</div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>validateCurrentStep()</strong> - Validates only fields for current step</div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>Progress tracking</strong> - currentStep, totalSteps, isFirstStep, isLastStep</div>
          </li>
        </ul>
      </section>
    </div>
  )
}
