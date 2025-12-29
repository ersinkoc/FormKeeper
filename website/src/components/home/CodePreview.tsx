import { motion } from 'framer-motion'
import { IDEWindow } from '@/components/code/IDEWindow'

const sampleCode = `import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

function LoginForm() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      await api.login(values)
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <EmailField />
        <PasswordField />
        <button type="submit" disabled={form.formState.isSubmitting}>
          Login
        </button>
      </form>
    </FormProvider>
  )
}

function EmailField() {
  const { register, error, touched } = useField('email', {
    required: 'Email is required',
    pattern: { value: /^\\S+@\\S+$/, message: 'Invalid email' },
  })

  return (
    <div>
      <input {...register()} type="email" placeholder="Email" />
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}`

export function CodePreview() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Intuitive API Design
            </h2>
            <p className="text-muted-foreground mb-6">
              FormKeeper provides a clean, declarative API that feels natural.
              Register fields, add validation, and handle submissions with
              minimal boilerplate.
            </p>
            <ul className="space-y-3">
              {[
                'Type-safe with full TypeScript support',
                'Sync and async validation',
                'Field-level and form-level validation',
                'Built-in error handling',
                'Optimized re-renders',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <IDEWindow
              filename="LoginForm.tsx"
              code={sampleCode}
              language="tsx"
              showSidebar={false}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
