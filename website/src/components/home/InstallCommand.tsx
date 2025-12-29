import { motion } from 'framer-motion'
import { PackageManagerTabs } from '@/components/code/PackageManagerTabs'

export function InstallCommand() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Quick Installation
            </h2>
            <p className="text-muted-foreground">
              Install FormKeeper with your favorite package manager
            </p>
          </div>
          <PackageManagerTabs />
        </motion.div>
      </div>
    </section>
  )
}
