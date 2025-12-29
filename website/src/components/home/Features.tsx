import { motion } from 'framer-motion'
import {
  Package,
  Puzzle,
  Shield,
  Blocks,
  Layers,
  CheckCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FEATURES } from '@/lib/constants'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Package,
  Puzzle,
  Shield,
  Blocks,
  Layers,
  CheckCircle,
}

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-zinc-950/50">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why FormKeeper?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built from the ground up for modern form management with a focus on
            developer experience and performance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon]
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-zinc-900/50 border-zinc-800 h-full hover:border-zinc-700 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
