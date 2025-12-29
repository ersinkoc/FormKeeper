import { motion } from 'framer-motion'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function CTA() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-950/20 to-background" />

      <div className="container relative">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Build Better Forms?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start building type-safe, performant forms with FormKeeper today.
            Explore our documentation or try it out in the playground.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="gap-2">
              <Link to="/docs">
                <BookOpen className="w-4 h-4" />
                Read the Docs
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2">
              <Link to="/playground">
                Try Playground
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
