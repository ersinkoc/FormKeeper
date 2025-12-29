import { useMemo } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import { cn } from '@/lib/utils'

interface SyntaxHighlighterProps {
  code: string
  language: string
  highlightLines?: number[]
}

export function SyntaxHighlighter({
  code,
  language,
  highlightLines = [],
}: SyntaxHighlighterProps) {
  // Use Prism.highlight() to get pre-highlighted HTML, then split by lines
  // This is safe as Prism output is trusted syntax highlighting markup
  const highlightedLines = useMemo(() => {
    const trimmedCode = code.trim()
    const grammar = Prism.languages[language] || Prism.languages.javascript
    const highlighted = Prism.highlight(trimmedCode, grammar, language)
    return highlighted.split('\n')
  }, [code, language])

  return (
    <pre className="!bg-transparent !p-0 !m-0">
      <code className={`language-${language}`}>
        {highlightedLines.map((line, index) => {
          // Create element with Prism's highlighted HTML
          const lineHtml = line || '&nbsp;'
          return (
            <div
              key={index}
              className={cn(
                'leading-6 whitespace-pre',
                highlightLines.includes(index + 1) && 'line-highlight'
              )}
              // Safe: Prism.highlight() output is trusted syntax highlighting
              dangerouslySetInnerHTML={{ __html: lineHtml }}
            />
          )
        })}
      </code>
    </pre>
  )
}
