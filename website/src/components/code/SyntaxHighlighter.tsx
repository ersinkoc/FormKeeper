import { useEffect } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import '@/styles/prism.css'
import { cn } from '@/lib/utils'

interface SyntaxHighlighterProps {
  code: string
  language: string
  highlightLines?: number[]
}

export function SyntaxHighlighter({
  code,
  language,
  highlightLines = []
}: SyntaxHighlighterProps) {
  useEffect(() => {
    Prism.highlightAll()
  }, [code])

  const lines = code.trim().split('\n')

  return (
    <pre className="!m-0 !p-0 !bg-transparent">
      <code className={`language-${language}`}>
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "leading-6",
              highlightLines.includes(i + 1) && "line-highlight"
            )}
          >
            {line || '\n'}
          </div>
        ))}
      </code>
    </pre>
  )
}
