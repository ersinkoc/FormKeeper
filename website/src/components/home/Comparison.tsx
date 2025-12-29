import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { COMPARISON_DATA } from '@/lib/constants'

export function Comparison() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Does It Compare?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            FormKeeper offers the smallest bundle size with the most features.
            See how it stacks up against other popular form libraries.
          </p>
        </motion.div>

        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="py-4 px-4 text-left font-semibold">Feature</th>
                <th className="py-4 px-4 text-center font-semibold">
                  <span className="gradient-text">FormKeeper</span>
                </th>
                <th className="py-4 px-4 text-center font-semibold text-muted-foreground">
                  react-hook-form
                </th>
                <th className="py-4 px-4 text-center font-semibold text-muted-foreground">
                  Formik
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.map((row, index) => (
                <tr
                  key={row.feature}
                  className={index % 2 === 0 ? 'bg-zinc-900/30' : ''}
                >
                  <td className="py-3 px-4 text-sm">{row.feature}</td>
                  <td className="py-3 px-4 text-center">
                    {typeof row.formkeeper === 'boolean' ? (
                      row.formkeeper ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm font-medium text-cyan-400">
                        {row.formkeeper}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {typeof row.rhf === 'boolean' ? (
                      row.rhf ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-zinc-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {row.rhf}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {typeof row.formik === 'boolean' ? (
                      row.formik ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-zinc-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {row.formik}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}
