import { motion } from 'framer-motion'
import { ArrowRight, Github, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/shared/Logo'
import { SITE_CONFIG } from '@/lib/constants'

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 grid-background" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="container relative">
        <motion.div
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              v1.0 Released - Zero Dependencies
            </Badge>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Logo showText={false} animated className="w-20 h-20" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="gradient-text">Headless</span> Form{' '}
            <br className="hidden sm:block" />
            State Manager
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Zero-dependency form management with micro-kernel plugin architecture.
            Type-safe, under 5KB, works with React, Vue, and Svelte.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button size="lg" asChild className="gap-2">
              <Link to="/docs">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2">
              <a
                href={SITE_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
