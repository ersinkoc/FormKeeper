import { Link } from 'react-router-dom'
import { ArrowRight, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'
import { Card, CardContent } from '@/components/ui/card'

export function Validation() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Validation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        FormKeeper provides a powerful validation system with built-in rules,
        custom validators, and async validation support.
      </p>

      {/* Built-in Rules */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Built-in Validation Rules</h2>
        <p className="text-muted-foreground mb-4">
          FormKeeper includes common validation rules out of the box:
        </p>

        <CodeBlock
          code={`const { register } = useField('email', {
  // Required field
  required: 'Email is required',

  // Minimum value (for numbers)
  min: { value: 0, message: 'Must be positive' },

  // Maximum value (for numbers)
  max: { value: 100, message: 'Max 100' },

  // Minimum length (for strings/arrays)
  minLength: { value: 3, message: 'Min 3 characters' },

  // Maximum length (for strings/arrays)
  maxLength: { value: 50, message: 'Max 50 characters' },

  // Regex pattern
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
    message: 'Invalid email format',
  },
})`}
          language="typescript"
          filename="validation-rules.ts"
        />
      </section>

      {/* Custom Validation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Custom Validation</h2>
        <p className="text-muted-foreground mb-4">
          Use the <code className="text-primary">validate</code> property for custom logic:
        </p>

        <CodeBlock
          code={`// Single custom validator
const { register } = useField('password', {
  validate: (value) => {
    if (value.length < 8) return 'Min 8 characters'
    if (!/[A-Z]/.test(value)) return 'Need uppercase letter'
    if (!/[0-9]/.test(value)) return 'Need a number'
    return true // Valid
  },
})

// Multiple named validators
const { register } = useField('username', {
  validate: {
    notEmpty: (value) => value.length > 0 || 'Required',
    noSpaces: (value) => !/\\s/.test(value) || 'No spaces allowed',
    minLength: (value) => value.length >= 3 || 'Min 3 characters',
  },
})`}
          language="typescript"
          filename="custom-validation.ts"
        />
      </section>

      {/* Async Validation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Async Validation</h2>
        <p className="text-muted-foreground mb-4">
          Validators can be async - perfect for server-side checks:
        </p>

        <CodeBlock
          code={`const { register, validating } = useField('username', {
  validate: async (value) => {
    // Check if username is available
    const response = await fetch(\`/api/check-username?u=\${value}\`)
    const { available } = await response.json()

    if (!available) {
      return 'Username is already taken'
    }
    return true
  },
})

// Show loading state
{validating && <span>Checking availability...</span>}`}
          language="typescript"
          filename="async-validation.ts"
        />

        <Card className="mt-4 border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="flex gap-4 pt-6">
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Debouncing Async Validation</h4>
              <p className="text-sm text-muted-foreground">
                FormKeeper automatically debounces async validators to prevent
                excessive API calls. Previous pending validations are cancelled.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cross-field Validation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Cross-field Validation</h2>
        <p className="text-muted-foreground mb-4">
          Access other form values for dependent validation:
        </p>

        <CodeBlock
          code={`// Password confirmation
const { register } = useField('confirmPassword', {
  validate: (value, formValues) => {
    if (value !== formValues.password) {
      return 'Passwords do not match'
    }
    return true
  },
  // Re-validate when password changes
  deps: ['password'],
})

// End date must be after start date
const { register } = useField('endDate', {
  validate: (value, formValues) => {
    if (new Date(value) <= new Date(formValues.startDate)) {
      return 'End date must be after start date'
    }
    return true
  },
  deps: ['startDate'],
})`}
          language="typescript"
          filename="cross-field.ts"
        />
      </section>

      {/* Validation Modes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Validation Modes</h2>
        <p className="text-muted-foreground mb-4">
          Control when validation runs with the <code className="text-primary">mode</code> option:
        </p>

        <CodeBlock
          code={`const form = useForm({
  initialValues: { email: '' },
  // When to validate
  mode: 'onBlur', // 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all'

  // When to re-validate after an error
  reValidateMode: 'onChange',

  onSubmit: (values) => console.log(values),
})`}
          language="typescript"
        />

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Mode</th>
                <th className="text-left py-3 px-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">onSubmit</td>
                <td className="py-3 px-4 text-muted-foreground">Only validate on form submit (default)</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">onBlur</td>
                <td className="py-3 px-4 text-muted-foreground">Validate when field loses focus</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">onChange</td>
                <td className="py-3 px-4 text-muted-foreground">Validate on every change</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">onTouched</td>
                <td className="py-3 px-4 text-muted-foreground">Validate on blur, then on change</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">all</td>
                <td className="py-3 px-4 text-muted-foreground">Validate on all events</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Schema Validation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Schema Validation</h2>
        <p className="text-muted-foreground mb-4">
          Use Zod, Yup, or Joi for schema-based validation:
        </p>

        <CodeBlock
          code={`import { z } from 'zod'
import { useForm } from '@oxog/formkeeper/react'
import { SchemaPlugin, zodAdapter } from '@oxog/formkeeper/plugins'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  age: z.number().min(18, 'Must be 18+'),
})

type FormData = z.infer<typeof schema>

function MyForm() {
  const form = useForm<FormData>({
    initialValues: { email: '', password: '', age: 0 },
    plugins: [
      SchemaPlugin({ validator: zodAdapter(schema) })
    ],
    onSubmit: (values) => console.log(values),
  })
  // ...
}`}
          language="typescript"
          filename="schema-validation.ts"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/docs/plugins/schema">
              Schema Plugin
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/docs/concepts/form-state">Form State</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
