import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeBlock } from '@/components/code/CodeBlock'

const frameworkExamples = {
  react: {
    label: 'React',
    code: `import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

function ContactForm() {
  const form = useForm({
    initialValues: { name: '', email: '', message: '' },
    onSubmit: async (values) => {
      await sendMessage(values)
    },
  })

  const nameField = useField('name', { required: 'Name is required' })
  const emailField = useField('email', {
    required: 'Email is required',
    pattern: { value: /^\\S+@\\S+$/, message: 'Invalid email' }
  })
  const messageField = useField('message', {
    minLength: { value: 10, message: 'Min 10 characters' }
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <input {...nameField.register()} placeholder="Name" />
        <input {...emailField.register()} placeholder="Email" />
        <textarea {...messageField.register()} placeholder="Message" />
        <button type="submit">Send</button>
      </form>
    </FormProvider>
  )
}`,
  },
  vue: {
    label: 'Vue',
    code: `<script setup lang="ts">
import { useForm, useField } from '@oxog/formkeeper/vue'

const { handleSubmit, isSubmitting } = useForm({
  initialValues: { name: '', email: '', message: '' },
  onSubmit: async (values) => {
    await sendMessage(values)
  },
})

const nameField = useField('name', { required: 'Name is required' })
const emailField = useField('email', {
  required: 'Email is required',
  pattern: { value: /^\\S+@\\S+$/, message: 'Invalid email' }
})
const messageField = useField('message', {
  minLength: { value: 10, message: 'Min 10 characters' }
})
</script>

<template>
  <form @submit="handleSubmit">
    <input v-model="nameField.value" placeholder="Name" />
    <input v-model="emailField.value" placeholder="Email" />
    <textarea v-model="messageField.value" placeholder="Message" />
    <button type="submit" :disabled="isSubmitting">Send</button>
  </form>
</template>`,
  },
  svelte: {
    label: 'Svelte',
    code: `<script lang="ts">
  import { createFormStore, fieldStore } from '@oxog/formkeeper/svelte'

  const form = createFormStore({
    initialValues: { name: '', email: '', message: '' },
    onSubmit: async (values) => {
      await sendMessage(values)
    },
  })

  const nameField = fieldStore(form, 'name', { required: 'Required' })
  const emailField = fieldStore(form, 'email', {
    required: 'Required',
    pattern: { value: /^\\S+@\\S+$/, message: 'Invalid' }
  })
  const messageField = fieldStore(form, 'message', {
    minLength: { value: 10, message: 'Min 10 chars' }
  })
</script>

<form on:submit|preventDefault={form.handleSubmit}>
  <input bind:value={$nameField.value} placeholder="Name" />
  <input bind:value={$emailField.value} placeholder="Email" />
  <textarea bind:value={$messageField.value} placeholder="Message" />
  <button type="submit" disabled={$form.isSubmitting}>Send</button>
</form>`,
  },
  vanilla: {
    label: 'Vanilla JS',
    code: `import { createForm } from '@oxog/formkeeper'

const form = createForm({
  initialValues: { name: '', email: '', message: '' },
  onSubmit: async (values) => {
    await sendMessage(values)
  },
})

// Register fields
const nameReg = form.register('name', { required: 'Name is required' })
const emailReg = form.register('email', {
  required: 'Email is required',
  pattern: { value: /^\\S+@\\S+$/, message: 'Invalid email' }
})
const messageReg = form.register('message', {
  minLength: { value: 10, message: 'Min 10 characters' }
})

// Bind to DOM elements
document.querySelector('#name').addEventListener('change', nameReg.onChange)
document.querySelector('#email').addEventListener('change', emailReg.onChange)
document.querySelector('#message').addEventListener('change', messageReg.onChange)

// Handle form submission
document.querySelector('form').addEventListener('submit', form.handleSubmit)`,
  },
}

export function FrameworkShowcase() {
  return (
    <section className="py-16 md:py-24 bg-zinc-950/50">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Works with Your Stack
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            First-class support for React, Vue, Svelte, and vanilla JavaScript.
            Use the same core API across all frameworks.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Tabs defaultValue="react" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
              {Object.entries(frameworkExamples).map(([key, value]) => (
                <TabsTrigger key={key} value={key}>
                  {value.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(frameworkExamples).map(([key, value]) => (
              <TabsContent key={key} value={key}>
                <div className="max-w-4xl mx-auto">
                  <CodeBlock
                    code={value.code}
                    language={key === 'vue' ? 'html' : key === 'svelte' ? 'html' : 'tsx'}
                    filename={`ContactForm.${key === 'vue' ? 'vue' : key === 'svelte' ? 'svelte' : 'tsx'}`}
                    maxHeight="500px"
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}
