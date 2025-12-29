import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'

export function SchemaPlugin() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Schema Plugin</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Integrate schema validation libraries like Zod, Yup, or Joi for
        type-safe, declarative validation.
      </p>

      {/* Zod */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Zod Integration</h2>
        <CodeBlock
          code={`import { z } from 'zod'
import { useForm } from '@oxog/formkeeper/react'
import { SchemaPlugin, zodAdapter } from '@oxog/formkeeper/plugins'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Min 8 characters')
    .regex(/[A-Z]/, 'Need uppercase')
    .regex(/[0-9]/, 'Need number'),
  age: z.number().min(18, 'Must be 18+'),
})

type FormData = z.infer<typeof schema>

function MyForm() {
  const form = useForm<FormData>({
    initialValues: {
      email: '',
      password: '',
      age: 0,
    },
    plugins: [
      SchemaPlugin({
        validator: zodAdapter(schema),
      }),
    ],
    onSubmit: (values) => {
      // values is typed as FormData
      console.log(values)
    },
  })

  // ...
}`}
          language="typescript"
          filename="zod-validation.ts"
        />
      </section>

      {/* Yup */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Yup Integration</h2>
        <CodeBlock
          code={`import * as yup from 'yup'
import { useForm } from '@oxog/formkeeper/react'
import { SchemaPlugin, yupAdapter } from '@oxog/formkeeper/plugins'

const schema = yup.object({
  name: yup.string()
    .required('Name is required')
    .min(2, 'Min 2 characters'),
  email: yup.string()
    .required('Email is required')
    .email('Invalid email'),
  website: yup.string()
    .url('Invalid URL'),
})

const form = useForm({
  initialValues: {
    name: '',
    email: '',
    website: '',
  },
  plugins: [
    SchemaPlugin({
      validator: yupAdapter(schema),
    }),
  ],
  onSubmit: (values) => console.log(values),
})`}
          language="typescript"
          filename="yup-validation.ts"
        />
      </section>

      {/* Joi */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Joi Integration</h2>
        <CodeBlock
          code={`import Joi from 'joi'
import { useForm } from '@oxog/formkeeper/react'
import { SchemaPlugin, joiAdapter } from '@oxog/formkeeper/plugins'

const schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Letters and numbers only',
      'string.min': 'Min 3 characters',
    }),
  birth_year: Joi.number()
    .integer()
    .min(1900)
    .max(2013),
})

const form = useForm({
  initialValues: {
    username: '',
    birth_year: 2000,
  },
  plugins: [
    SchemaPlugin({
      validator: joiAdapter(schema),
    }),
  ],
  onSubmit: (values) => console.log(values),
})`}
          language="typescript"
          filename="joi-validation.ts"
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
                <td className="py-3 px-4 font-mono text-primary">validator</td>
                <td className="py-3 px-4 font-mono">SchemaAdapter</td>
                <td className="py-3 px-4">Required</td>
                <td className="py-3 px-4 text-muted-foreground">Schema adapter</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">mode</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4">'onSubmit'</td>
                <td className="py-3 px-4 text-muted-foreground">When to validate</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">abortEarly</td>
                <td className="py-3 px-4 font-mono">boolean</td>
                <td className="py-3 px-4">false</td>
                <td className="py-3 px-4 text-muted-foreground">Stop on first error</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Custom Adapter */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Custom Adapter</h2>
        <p className="text-muted-foreground mb-4">
          Create adapters for any validation library:
        </p>

        <CodeBlock
          code={`import type { SchemaAdapter } from '@oxog/formkeeper/plugins'

function myLibraryAdapter(schema: MySchema): SchemaAdapter {
  return {
    validate(values) {
      const result = schema.validate(values)

      if (result.valid) {
        return { valid: true, errors: {} }
      }

      // Convert errors to { fieldName: errorMessage }
      const errors: Record<string, string> = {}
      for (const error of result.errors) {
        errors[error.path] = error.message
      }

      return { valid: false, errors }
    },

    validateField(name, value, allValues) {
      const result = schema.validateField(name, value)
      return result.error || null
    },
  }
}`}
          language="typescript"
          filename="custom-adapter.ts"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/docs/concepts/validation">
              Validation Guide
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/docs/plugins">All Plugins</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
