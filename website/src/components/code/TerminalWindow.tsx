import { cn } from '@/lib/utils'
import { CopyButton } from './CopyButton'

interface TerminalWindowProps {
  title?: string
  children?: React.ReactNode
  command?: string
  output?: string
  showCopy?: boolean
  className?: string
}

export function TerminalWindow({
  title = 'Terminal',
  children,
  command,
  output,
  showCopy = true,
  className,
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-zinc-700 overflow-hidden shadow-2xl',
        className
      )}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 bg-zinc-800 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          {/* Traffic Lights */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-3 text-sm text-zinc-400">{title}</span>
        </div>
        {showCopy && command && <CopyButton text={command} />}
      </div>

      {/* Terminal Content */}
      <div className="p-4 bg-zinc-950 font-mono text-sm leading-relaxed">
        {command && (
          <div className="flex items-center gap-2 text-green-400">
            <span className="text-zinc-500">$</span>
            <span>{command}</span>
          </div>
        )}
        {output && <div className="mt-2 text-zinc-400">{output}</div>}
        {children}
      </div>
    </div>
  )
}
