import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'

export function AutosavePlugin() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Autosave Plugin</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Automatically save form changes to your backend with configurable
        debouncing and error handling.
      </p>

      {/* Setup */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Setup</h2>
        <CodeBlock
          code={`import { useForm } from '@oxog/formkeeper/react'
import { AutosavePlugin } from '@oxog/formkeeper/plugins'

const form = useForm({
  initialValues: {
    title: '',
    content: '',
  },
  plugins: [
    AutosavePlugin({
      onSave: async (values) => {
        await api.saveDraft(values)
      },
      debounceMs: 2000,  // Wait 2s after last change
    }),
  ],
  onSubmit: (values) => api.publish(values),
})`}
          language="typescript"
          filename="autosave-setup.ts"
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
                <td className="py-3 px-4 font-mono text-primary">onSave</td>
                <td className="py-3 px-4 font-mono">function</td>
                <td className="py-3 px-4">Required</td>
                <td className="py-3 px-4 text-muted-foreground">Save callback</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">debounceMs</td>
                <td className="py-3 px-4 font-mono">number</td>
                <td className="py-3 px-4">1000</td>
                <td className="py-3 px-4 text-muted-foreground">Debounce time</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">enabled</td>
                <td className="py-3 px-4 font-mono">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4 text-muted-foreground">Enable autosave</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">onSuccess</td>
                <td className="py-3 px-4 font-mono">function</td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4 text-muted-foreground">Success callback</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">onError</td>
                <td className="py-3 px-4 font-mono">function</td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4 text-muted-foreground">Error callback</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">saveOnBlur</td>
                <td className="py-3 px-4 font-mono">boolean</td>
                <td className="py-3 px-4">false</td>
                <td className="py-3 px-4 text-muted-foreground">Save on field blur</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* API */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Autosave API</h2>
        <CodeBlock
          code={`const autosave = form.getPlugin('autosave')

// Manual trigger
await autosave.save()

// Pause/resume
autosave.pause()
autosave.resume()

// Check state
autosave.isSaving()       // Currently saving?
autosave.isPaused()       // Is paused?
autosave.getLastSaved()   // Last save timestamp`}
          language="typescript"
        />
      </section>

      {/* Complete Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Complete Example</h2>
        <CodeBlock
          code={`import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'
import { AutosavePlugin } from '@oxog/formkeeper/plugins'
import { useState } from 'react'

export function DocumentEditor() {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const form = useForm({
    initialValues: {
      title: '',
      content: '',
    },
    plugins: [
      AutosavePlugin({
        debounceMs: 2000,
        onSave: async (values) => {
          setSaveStatus('saving')
          await api.saveDraft(values)
        },
        onSuccess: () => {
          setSaveStatus('saved')
          setTimeout(() => setSaveStatus('idle'), 2000)
        },
        onError: (error) => {
          setSaveStatus('error')
          console.error('Autosave failed:', error)
        },
      }),
    ],
    onSubmit: async (values) => {
      await api.publish(values)
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <div className="flex items-center justify-between mb-4">
          <h1>Edit Document</h1>
          <SaveIndicator status={saveStatus} />
        </div>

        <TitleField />
        <ContentField />

        <button type="submit">
          Publish
        </button>
      </form>
    </FormProvider>
  )
}

function SaveIndicator({ status }) {
  return (
    <span className="text-sm text-muted">
      {status === 'saving' && 'Saving...'}
      {status === 'saved' && 'All changes saved'}
      {status === 'error' && 'Save failed'}
    </span>
  )
}

function TitleField() {
  const { register } = useField('title')
  return <input {...register()} placeholder="Document title" />
}

function ContentField() {
  const { register } = useField('content')
  return <textarea {...register()} rows={20} placeholder="Start writing..." />
}`}
          language="tsx"
          filename="DocumentEditor.tsx"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/docs/plugins/persist">
              Persist Plugin
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
