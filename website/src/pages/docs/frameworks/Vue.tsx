import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'

export function VueFramework() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Vue</h1>
      <p className="text-lg text-muted-foreground mb-8">
        FormKeeper provides Vue 3 composables that integrate seamlessly with
        Vue's reactivity system and Composition API.
      </p>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <CodeBlock
          code="npm install @oxog/formkeeper"
          language="bash"
          showLineNumbers={false}
        />
      </section>

      {/* Composables */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Available Composables</h2>

        <h3 className="text-xl font-semibold mb-3 mt-6">useForm</h3>
        <p className="text-muted-foreground mb-4">
          Create and manage a form instance:
        </p>
        <CodeBlock
          code={`<script setup lang="ts">
import { useForm, FormProvider } from '@oxog/formkeeper/vue'

interface LoginForm {
  email: string
  password: string
}

const form = useForm<LoginForm>({
  initialValues: {
    email: '',
    password: '',
  },
  onSubmit: async (values) => {
    await login(values)
  },
})

// Access reactive form state
const { values, errors, isSubmitting, isValid } = form.formState
</script>

<template>
  <FormProvider :form="form">
    <form @submit="form.handleSubmit">
      <!-- fields -->
    </form>
  </FormProvider>
</template>`}
          language="vue"
        />

        <h3 className="text-xl font-semibold mb-3 mt-8">useField</h3>
        <p className="text-muted-foreground mb-4">
          Register and manage a single field:
        </p>
        <CodeBlock
          code={`<script setup lang="ts">
import { useField } from '@oxog/formkeeper/vue'

const {
  register,     // () => input bindings
  value,        // reactive current value
  error,        // validation error
  touched,      // has been blurred
  dirty,        // value changed from initial
  validating,   // async validation in progress
} = useField('email', {
  required: 'Email is required',
  pattern: {
    value: /^\\S+@\\S+$/,
    message: 'Invalid email',
  },
})
</script>

<template>
  <div>
    <input v-bind="register()" type="email" />
    <span v-if="touched && error" class="error">{{ error }}</span>
  </div>
</template>`}
          language="vue"
        />

        <h3 className="text-xl font-semibold mb-3 mt-8">useFieldArray</h3>
        <p className="text-muted-foreground mb-4">
          Manage dynamic array fields:
        </p>
        <CodeBlock
          code={`<script setup lang="ts">
import { useFieldArray } from '@oxog/formkeeper/vue'

const {
  fields,   // Reactive array with unique IDs
  append,   // Add to end
  prepend,  // Add to start
  insert,   // Insert at index
  remove,   // Remove by index
  swap,     // Swap two items
  move,     // Move item
} = useFieldArray('items')
</script>

<template>
  <div>
    <div v-for="(field, index) in fields" :key="field.id">
      <ItemField :index="index" />
      <button @click="remove(index)">Remove</button>
    </div>
    <button @click="append({ name: '' })">Add Item</button>
  </div>
</template>`}
          language="vue"
        />

        <h3 className="text-xl font-semibold mb-3 mt-8">useWatch</h3>
        <p className="text-muted-foreground mb-4">
          Watch for value changes:
        </p>
        <CodeBlock
          code={`<script setup lang="ts">
import { useWatch } from '@oxog/formkeeper/vue'

// Watch single field (returns reactive ref)
const price = useWatch<number>('price')

// Watch with callback
useWatch('quantity', (value, prevValue) => {
  console.log('Quantity changed:', prevValue, '->', value)
})

// Watch all values
const allValues = useWatch()
</script>

<template>
  <div>Price: $ {{ price }}</div>
</template>`}
          language="vue"
        />
      </section>

      {/* Complete Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Complete Example</h2>
        <CodeBlock
          code={`<script setup lang="ts">
import {
  useForm,
  useField,
  FormProvider,
  useFormContext
} from '@oxog/formkeeper/vue'

interface ContactForm {
  name: string
  email: string
  message: string
}

const form = useForm<ContactForm>({
  initialValues: {
    name: '',
    email: '',
    message: '',
  },
  onSubmit: async (values) => {
    await sendContactForm(values)
    form.reset()
  },
})
</script>

<template>
  <FormProvider :form="form">
    <form @submit="form.handleSubmit" class="space-y-4">
      <NameField />
      <EmailField />
      <MessageField />
      <SubmitButton />
    </form>
  </FormProvider>
</template>

<!-- NameField.vue -->
<script setup lang="ts">
import { useField } from '@oxog/formkeeper/vue'

const { register, error, touched } = useField('name', {
  required: 'Name is required',
  minLength: { value: 2, message: 'Min 2 characters' },
})
</script>

<template>
  <div>
    <label>Name</label>
    <input v-bind="register()" />
    <span v-if="touched && error" class="error">{{ error }}</span>
  </div>
</template>

<!-- SubmitButton.vue -->
<script setup lang="ts">
import { useFormContext } from '@oxog/formkeeper/vue'

const { formState } = useFormContext()
</script>

<template>
  <button type="submit" :disabled="formState.isSubmitting">
    {{ formState.isSubmitting ? 'Sending...' : 'Send Message' }}
  </button>
</template>`}
          language="vue"
          filename="ContactForm.vue"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/docs/frameworks/react">
              React Guide
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/examples">View Examples</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
