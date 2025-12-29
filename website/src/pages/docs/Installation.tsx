import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'
import { PackageManagerTabs } from '@/components/code/PackageManagerTabs'

export function Installation() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Installation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Get started with FormKeeper in your project.
      </p>

      {/* Package Installation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Install the Package</h2>
        <p className="text-muted-foreground mb-4">
          Install FormKeeper using your preferred package manager:
        </p>
        <PackageManagerTabs />
      </section>

      {/* Framework Setup */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Framework Setup</h2>
        <p className="text-muted-foreground mb-6">
          FormKeeper provides first-class adapters for React, Vue, and Svelte.
          Choose your framework:
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">React</h3>
            <CodeBlock
              code={`import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

function App() {
  const form = useForm({
    initialValues: { name: '' },
    onSubmit: (values) => console.log(values),
  })

  return (
    <FormProvider form={form}>
      <YourForm />
    </FormProvider>
  )
}`}
              language="tsx"
              filename="App.tsx"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Vue</h3>
            <CodeBlock
              code={`<script setup lang="ts">
import { useForm, useField, provideForm } from '@oxog/formkeeper/vue'

const form = useForm({
  initialValues: { name: '' },
  onSubmit: (values) => console.log(values),
})

provideForm(form)
</script>

<template>
  <form @submit="form.handleSubmit">
    <YourFields />
  </form>
</template>`}
              language="html"
              filename="App.vue"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Svelte</h3>
            <CodeBlock
              code={`<script lang="ts">
  import { createFormStore, setFormContext } from '@oxog/formkeeper/svelte'

  const form = createFormStore({
    initialValues: { name: '' },
    onSubmit: (values) => console.log(values),
  })

  setFormContext(form)
</script>

<form on:submit|preventDefault={form.handleSubmit}>
  <YourFields />
</form>`}
              language="html"
              filename="App.svelte"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Vanilla JavaScript</h3>
            <CodeBlock
              code={`import { createForm } from '@oxog/formkeeper'

const form = createForm({
  initialValues: { name: '' },
  onSubmit: (values) => console.log(values),
})

// Register fields
const nameReg = form.register('name', { required: true })

// Bind to DOM
document.querySelector('#name').addEventListener('input', nameReg.onChange)
document.querySelector('#name').addEventListener('blur', nameReg.onBlur)

// Handle submit
document.querySelector('form').addEventListener('submit', form.handleSubmit)`}
              language="typescript"
              filename="main.ts"
            />
          </div>
        </div>
      </section>

      {/* TypeScript */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">TypeScript Support</h2>
        <p className="text-muted-foreground mb-4">
          FormKeeper is written in TypeScript and provides full type inference:
        </p>
        <CodeBlock
          code={`interface FormValues {
  email: string
  password: string
  rememberMe: boolean
}

const form = useForm<FormValues>({
  initialValues: {
    email: '',
    password: '',
    rememberMe: false,
  },
  onSubmit: (values) => {
    // values is typed as FormValues
    console.log(values.email) // string
  },
})`}
          language="typescript"
          filename="types-example.ts"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <p className="text-muted-foreground mb-4">
          Now that you have FormKeeper installed, learn more about:
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/docs/quick-start">
              Quick Start
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/docs/concepts/form-creation">Core Concepts</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/examples">View Examples</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
