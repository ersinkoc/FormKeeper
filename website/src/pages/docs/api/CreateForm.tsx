import { CodeBlock } from '@/components/code/CodeBlock'

export function CreateFormApi() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">createForm</h1>
      <p className="text-lg text-muted-foreground mb-8">
        The core factory function for creating form instances.
      </p>

      {/* Signature */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Signature</h2>
        <CodeBlock
          code={`function createForm<T extends FieldValues>(
  options: FormOptions<T>
): FormInstance<T>`}
          language="typescript"
        />
      </section>

      {/* Options */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Options</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Property</th>
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Default</th>
                <th className="text-left py-3 px-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">initialValues</td>
                <td className="py-3 px-4 font-mono">T</td>
                <td className="py-3 px-4">Required</td>
                <td className="py-3 px-4 text-muted-foreground">Initial form values</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">onSubmit</td>
                <td className="py-3 px-4 font-mono">(values: T) =&gt; void | Promise</td>
                <td className="py-3 px-4">Required</td>
                <td className="py-3 px-4 text-muted-foreground">Submit handler</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">mode</td>
                <td className="py-3 px-4 font-mono">ValidationMode</td>
                <td className="py-3 px-4">'onSubmit'</td>
                <td className="py-3 px-4 text-muted-foreground">When to validate</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">reValidateMode</td>
                <td className="py-3 px-4 font-mono">ValidationMode</td>
                <td className="py-3 px-4">'onChange'</td>
                <td className="py-3 px-4 text-muted-foreground">When to revalidate after error</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">shouldFocusError</td>
                <td className="py-3 px-4 font-mono">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4 text-muted-foreground">Focus first error on submit</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">plugins</td>
                <td className="py-3 px-4 font-mono">Plugin[]</td>
                <td className="py-3 px-4">[]</td>
                <td className="py-3 px-4 text-muted-foreground">Plugins to install</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">onError</td>
                <td className="py-3 px-4 font-mono">(errors) =&gt; void</td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4 text-muted-foreground">Error handler</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Return Value */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Return Value</h2>
        <p className="text-muted-foreground mb-4">
          Returns a <code className="text-primary">FormInstance</code> with the following methods:
        </p>

        <h3 className="text-xl font-semibold mb-3">Field Management</h3>
        <CodeBlock
          code={`// Register a field with validation rules
form.register(name: string, rules?: ValidationRules)

// Unregister a field
form.unregister(name: string)

// Get/set values
form.getValues() // Get all values
form.getValues(name: string) // Get specific field value
form.setValue(name: string, value: any, options?: SetValueOptions)
form.setValues(values: Partial<T>, options?: SetValueOptions)`}
          language="typescript"
          className="mb-6"
        />

        <h3 className="text-xl font-semibold mb-3">Validation</h3>
        <CodeBlock
          code={`// Validate form/field
form.validate(): Promise<boolean>
form.validateField(name: string): Promise<boolean>

// Error management
form.getErrors(): FormErrors<T>
form.getError(name: string): string | undefined
form.setError(name: string, error: string)
form.clearError(name: string)
form.clearErrors()

// State checks
form.isValid(): boolean
form.isValidating(): boolean`}
          language="typescript"
          className="mb-6"
        />

        <h3 className="text-xl font-semibold mb-3">Submission</h3>
        <CodeBlock
          code={`// Submit form
form.submit(): Promise<void>
form.handleSubmit(e?: Event): Promise<void>

// Submission state
form.isSubmitting(): boolean
form.isSubmitSuccessful(): boolean
form.getSubmitCount(): number`}
          language="typescript"
          className="mb-6"
        />

        <h3 className="text-xl font-semibold mb-3">Reset & Watch</h3>
        <CodeBlock
          code={`// Reset form
form.reset(values?: Partial<T>, options?: ResetOptions)
form.resetField(name: string, options?: ResetOptions)

// Watch for changes
form.watch(callback: (values) => void): () => void
form.watch(name: string, callback: (value) => void): () => void`}
          language="typescript"
        />
      </section>

      {/* Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Example</h2>
        <CodeBlock
          code={`import { createForm } from '@oxog/formkeeper'

const form = createForm({
  initialValues: {
    email: '',
    password: '',
    rememberMe: false,
  },
  mode: 'onBlur',
  onSubmit: async (values) => {
    const response = await api.login(values)
    if (response.ok) {
      window.location.href = '/dashboard'
    }
  },
  onError: (errors) => {
    console.error('Validation failed:', errors)
  },
})

// Register fields
const emailReg = form.register('email', {
  required: 'Email is required',
  pattern: {
    value: /^\\S+@\\S+$/,
    message: 'Invalid email format',
  },
})

const passwordReg = form.register('password', {
  required: 'Password is required',
  minLength: {
    value: 8,
    message: 'Password must be at least 8 characters',
  },
})

// Bind to DOM (vanilla JS)
document.querySelector('#email').addEventListener('change', emailReg.onChange)
document.querySelector('#email').addEventListener('blur', emailReg.onBlur)

document.querySelector('#password').addEventListener('change', passwordReg.onChange)
document.querySelector('#password').addEventListener('blur', passwordReg.onBlur)

document.querySelector('form').addEventListener('submit', form.handleSubmit)`}
          language="typescript"
          filename="example.ts"
        />
      </section>
    </div>
  )
}
