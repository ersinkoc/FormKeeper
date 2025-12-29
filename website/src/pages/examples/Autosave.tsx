import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'
import { BrowserWindow } from '@/components/code/BrowserWindow'

const autosaveCode = `import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'
import { createAutosavePlugin } from '@oxog/formkeeper/plugins/autosave'
import { useState } from 'react'

interface DraftValues {
  title: string
  content: string
  tags: string
}

export function AutosaveForm() {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const form = useForm<DraftValues>({
    initialValues: {
      title: '',
      content: '',
      tags: '',
    },
    plugins: [
      createAutosavePlugin({
        // Save after 1 second of inactivity
        debounce: 1000,
        // Save to localStorage
        storage: 'localStorage',
        key: 'draft-post',
        // Callback when saved
        onSave: (values) => {
          setLastSaved(new Date())
          console.log('Draft saved:', values)
        },
        // Restore on mount
        restoreOnMount: true,
      }),
    ],
    onSubmit: async (values) => {
      // Clear draft after successful submit
      const autosave = form.getPlugin('autosave')
      autosave.clear()
      console.log('Published:', values)
      alert('Post published!')
    },
  })

  const autosave = form.getPlugin('autosave')

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit} className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Write Post</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {autosave.isSaving && (
              <>
                <Save className="w-4 h-4 animate-pulse" />
                Saving...
              </>
            )}
            {!autosave.isSaving && lastSaved && (
              <>
                <Clock className="w-4 h-4" />
                Saved {lastSaved.toLocaleTimeString()}
              </>
            )}
          </div>
        </div>

        <TitleField />
        <ContentField />
        <TagsField />

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => autosave.clear()}
            className="px-4 py-2 border rounded-md"
          >
            Discard Draft
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Publish
          </button>
        </div>
      </form>
    </FormProvider>
  )
}

function TitleField() {
  const { register, error } = useField('title', { required: 'Title required' })
  return (
    <div className="mb-4">
      <input
        {...register()}
        placeholder="Post title..."
        className="w-full px-4 py-3 text-2xl border-b focus:outline-none"
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function ContentField() {
  const { register, error } = useField('content', { required: 'Content required' })
  return (
    <div className="mb-4">
      <textarea
        {...register()}
        placeholder="Write your post..."
        rows={10}
        className="w-full px-4 py-3 border rounded-md resize-none"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

function TagsField() {
  const { register } = useField('tags')
  return (
    <div>
      <input
        {...register()}
        placeholder="Tags (comma separated)"
        className="w-full px-4 py-2 border rounded-md"
      />
    </div>
  )
}`

export function AutosaveExample() {
  return (
    <div className="container py-12 max-w-5xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/examples">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Examples
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-4">Auto-save Draft</h1>
        <p className="text-lg text-muted-foreground">
          Automatically save form progress with the Autosave plugin and restore on page reload.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Preview</h2>
        <BrowserWindow url="localhost:3000/write">
          <div className="p-8 bg-white dark:bg-zinc-900">
            <div className="max-w-2xl mx-auto p-6 border rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Write Post</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Saved 2:34 PM
                </div>
              </div>
              <div className="space-y-4">
                <input placeholder="Post title..." className="w-full px-4 py-3 text-2xl border-b bg-transparent focus:outline-none" />
                <textarea placeholder="Write your post..." rows={6} className="w-full px-4 py-3 border rounded-md bg-background resize-none" />
                <input placeholder="Tags (comma separated)" className="w-full px-4 py-2 border rounded-md bg-background" />
              </div>
              <div className="flex gap-4 mt-6">
                <button className="px-4 py-2 border rounded-md">Discard Draft</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Publish</button>
              </div>
            </div>
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
        <CodeBlock code={autosaveCode} language="tsx" filename="AutosaveForm.tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>Autosave Plugin</strong> - Debounced auto-save to localStorage/sessionStorage</div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>restoreOnMount</strong> - Automatically restore saved draft on page load</div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div><strong>clear()</strong> - Remove saved draft after successful submission</div>
          </li>
        </ul>
      </section>
    </div>
  )
}
