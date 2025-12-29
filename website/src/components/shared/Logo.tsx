import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
  animated?: boolean
}

export function Logo({ className, showText = true, animated = false }: LogoProps) {
  const Wrapper = animated ? motion.div : 'div'
  const wrapperProps = animated
    ? {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 },
      }
    : {}

  return (
    <Wrapper
      className={cn('flex items-center gap-2', className)}
      {...wrapperProps}
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5 text-white"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 11V6a3 3 0 0 1 6 0v5" />
            <path d="M12 12v5" />
            <rect x="4" y="11" width="16" height="10" rx="2" />
          </svg>
        </div>
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 blur-lg opacity-50"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      {showText && (
        <span className="font-semibold text-lg">FormKeeper</span>
      )}
    </Wrapper>
  )
}
