import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'

export function SvelteFramework() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Svelte</h1>
      <p className="text-lg text-muted-foreground mb-8">
        FormKeeper provides Svelte stores and actions that integrate naturally
        with Svelte's reactivity model.
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

      {/* Stores */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Available APIs</h2>

        <h3 className="text-xl font-semibold mb-3 mt-6">createForm</h3>
        <p className="text-muted-foreground mb-4">
          Create a form store:
        </p>
        <CodeBlock
          code={`<script lang="ts">
  import { createForm } from '@oxog/formkeeper/svelte'

  interface LoginForm {
    email: string
    password: string
  }

  const form = createForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      await login(values)
    },
  })

  // Destructure stores
  const { values, errors, isSubmitting, isValid } = form.formState
</script>

<form on:submit|preventDefault={form.handleSubmit}>
  <!-- fields -->
</form>`}
          language="svelte"
        />

        <h3 className="text-xl font-semibold mb-3 mt-8">createField</h3>
        <p className="text-muted-foreground mb-4">
          Register and manage a single field:
        </p>
        <CodeBlock
          code={`<script lang="ts">
  import { getFormContext } from '@oxog/formkeeper/svelte'

  const form = getFormContext()

  const field = form.createField('email', {
    required: 'Email is required',
    pattern: {
      value: /^\\S+@\\S+$/,
      message: 'Invalid email',
    },
  })

  // Reactive stores
  $: value = $field.value
  $: error = $field.error
  $: touched = $field.touched
</script>

<div>
  <input use:field.register type="email" />
  {#if $field.touched && $field.error}
    <span class="error">{$field.error}</span>
  {/if}
</div>`}
          language="svelte"
        />

        <h3 className="text-xl font-semibold mb-3 mt-8">createFieldArray</h3>
        <p className="text-muted-foreground mb-4">
          Manage dynamic array fields:
        </p>
        <CodeBlock
          code={`<script lang="ts">
  import { getFormContext } from '@oxog/formkeeper/svelte'

  const form = getFormContext()

  const { fields, append, remove, swap, move } = form.createFieldArray('items')
</script>

<div>
  {#each $fields as field, index (field.id)}
    <div>
      <ItemField {index} />
      <button on:click={() => remove(index)}>Remove</button>
    </div>
  {/each}
  <button on:click={() => append({ name: '' })}>Add Item</button>
</div>`}
          language="svelte"
        />
      </section>

      {/* Complete Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Complete Example</h2>
        <CodeBlock
          code={`<!-- ContactForm.svelte -->
<script lang="ts">
  import { createForm, setFormContext } from '@oxog/formkeeper/svelte'
  import NameField from './NameField.svelte'
  import EmailField from './EmailField.svelte'
  import MessageField from './MessageField.svelte'
  import SubmitButton from './SubmitButton.svelte'

  interface ContactForm {
    name: string
    email: string
    message: string
  }

  const form = createForm<ContactForm>({
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

  setFormContext(form)
</script>

<form on:submit|preventDefault={form.handleSubmit} class="space-y-4">
  <NameField />
  <EmailField />
  <MessageField />
  <SubmitButton />
</form>

<!-- NameField.svelte -->
<script lang="ts">
  import { getFormContext } from '@oxog/formkeeper/svelte'

  const form = getFormContext()
  const field = form.createField('name', {
    required: 'Name is required',
    minLength: { value: 2, message: 'Min 2 characters' },
  })
</script>

<div>
  <label>Name</label>
  <input use:field.register />
  {#if $field.touched && $field.error}
    <span class="error">{$field.error}</span>
  {/if}
</div>

<!-- SubmitButton.svelte -->
<script lang="ts">
  import { getFormContext } from '@oxog/formkeeper/svelte'

  const { formState } = getFormContext()
</script>

<button type="submit" disabled={$formState.isSubmitting}>
  {$formState.isSubmitting ? 'Sending...' : 'Send Message'}
</button>`}
          language="svelte"
          filename="ContactForm.svelte"
        />
      </section>

      {/* Svelte Actions */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Svelte Actions</h2>
        <p className="text-muted-foreground mb-4">
          FormKeeper uses Svelte actions for clean input binding:
        </p>

        <CodeBlock
          code={`<!-- The use:field.register action handles all input bindings -->
<input use:field.register />

<!-- Equivalent to manually binding: -->
<input
  value={$field.value}
  on:input={field.handleChange}
  on:blur={field.handleBlur}
  on:focus={field.handleFocus}
/>`}
          language="svelte"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/docs/frameworks/vue">
              Vue Guide
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
