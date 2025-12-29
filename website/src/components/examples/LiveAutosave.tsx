import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'
import { useState, useEffect, useRef, FormEvent } from 'react'
import { Save, Clock } from 'lucide-react'

interface ArticleValues {
  title: string
  content: string
  tags: string
}

export function LiveAutosave() {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const form = useForm<ArticleValues>({
    initialValues: {
      title: '',
      content: '',
      tags: '',
    },
    onSubmit: async (values) => {
      setIsSaving(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setLastSaved(new Date())
      setIsSaving(false)
      console.log('Manual save:', values)
    },
  })

  // Auto-save on value changes (debounced)
  useEffect(() => {
    const unsubscribe = form.on('change', () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // Only auto-save if there are values
      const values = form.getValues()
      const hasContent = values.title || values.content || values.tags
      if (!hasContent) return

      saveTimeoutRef.current = setTimeout(async () => {
        setIsSaving(true)
        await new Promise(resolve => setTimeout(resolve, 300))
        setLastSaved(new Date())
        setIsSaving(false)
        console.log('Auto-saved:', form.getValues())
      }, 2000) // 2 second debounce
    })

    return () => {
      unsubscribe()
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [form])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.handleSubmit()
  }

  return (
    <FormProvider form={form}>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 space-y-4"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Write Article</h2>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            {isSaving ? (
              <>
                <Save className="w-4 h-4 animate-pulse" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <Clock className="w-4 h-4" />
                <span>Saved {formatTime(lastSaved)}</span>
              </>
            ) : (
              <span>Not saved yet</span>
            )}
          </div>
        </div>

        <p className="text-sm text-zinc-400 mb-4">
          Start typing - your work auto-saves after 2 seconds of inactivity
        </p>

        <TitleField />
        <ContentField />
        <TagsField />

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md
                     hover:bg-blue-700 disabled:opacity-50 transition-colors
                     flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {form.formState.isSubmitting ? 'Saving...' : 'Save Now'}
        </button>
      </form>
    </FormProvider>
  )
}

function TitleField() {
  const { register, error, touched } = useField('title', {
    required: 'Title is required',
  })

  return (
    <div className="space-y-1">
      <label htmlFor="article-title" className="block text-sm font-medium">Title</label>
      <input
        {...register()}
        id="article-title"
        placeholder="Enter article title..."
        className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {touched && error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}

function ContentField() {
  const { register, error, touched } = useField('content', {
    required: 'Content is required',
    minLength: { value: 10, message: 'Min 10 characters' },
  })

  return (
    <div className="space-y-1">
      <label htmlFor="article-content" className="block text-sm font-medium">Content</label>
      <textarea
        {...register()}
        id="article-content"
        rows={6}
        placeholder="Write your article content..."
        className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                   focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      {touched && error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}

function TagsField() {
  const { register } = useField('tags')

  return (
    <div className="space-y-1">
      <label htmlFor="article-tags" className="block text-sm font-medium">Tags (optional)</label>
      <input
        {...register()}
        id="article-tags"
        placeholder="react, typescript, formkeeper"
        className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-xs text-zinc-500">Separate tags with commas</p>
    </div>
  )
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 5) return 'just now'
  if (diff < 60) return diff + 's ago'
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
  return date.toLocaleTimeString()
}
