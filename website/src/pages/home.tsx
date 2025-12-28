import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Zap, Package, Shield, Boxes, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/code-block'

const features = [
  {
    icon: Code2,
    title: 'Headless',
    description: 'Bring your own UI components. No styling opinions, just pure logic.',
  },
  {
    icon: Zap,
    title: 'Tiny Bundle',
    description: 'Under 5KB minified + gzipped. Every byte counts.',
  },
  {
    icon: Package,
    title: 'Zero Dependencies',
    description: 'No runtime dependencies. Keep your bundle lean.',
  },
  {
    icon: Shield,
    title: 'Type-Safe',
    description: 'Full TypeScript support with intelligent type inference.',
  },
  {
    icon: Boxes,
    title: 'Plugin System',
    description: 'Extend functionality with micro-kernel plugin architecture.',
  },
  {
    icon: Rocket,
    title: 'Framework Agnostic',
    description: 'Works with React, Vue, Svelte, or vanilla JavaScript.',
  },
]

const exampleCode = `import { useForm } from '@oxog/formkeeper/react'

function LoginForm() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      await api.login(values)
    },
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.register('email', {
        required: 'Email is required',
        pattern: {
          value: /^\\S+@\\S+$/,
          message: 'Invalid email'
        }
      })} />
      <button type="submit">Login</button>
    </form>
  )
}`

export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-muted/50 text-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              v1.0.0 Released
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Headless Form State Manager
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Zero-dependency, type-safe form management with plugin architecture.
              Built for developers who value simplicity and control.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/docs">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/playground">Try Playground</Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>&lt; 5KB</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span>0 Dependencies</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span>100% TypeScript</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-20 border-t">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Simple, yet powerful</h2>
              <p className="text-muted-foreground">
                Get started with just a few lines of code
              </p>
            </div>
            <CodeBlock code={exampleCode} language="typescript" filename="LoginForm.tsx" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why FormKeeper?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with modern development practices in mind, FormKeeper provides everything
              you need without the bloat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="relative overflow-hidden">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 border-t">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How does it compare?</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-mono font-semibold">Feature</th>
                    <th className="text-center py-4 px-4 font-mono font-semibold">FormKeeper</th>
                    <th className="text-center py-4 px-4 font-mono font-semibold">react-hook-form</th>
                    <th className="text-center py-4 px-4 font-mono font-semibold">Formik</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-mono text-sm">Bundle Size</td>
                    <td className="text-center py-4 px-4 font-bold text-green-600 dark:text-green-400">&lt; 5KB</td>
                    <td className="text-center py-4 px-4">~40KB</td>
                    <td className="text-center py-4 px-4">~50KB</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-mono text-sm">Dependencies</td>
                    <td className="text-center py-4 px-4 font-bold text-green-600 dark:text-green-400">0</td>
                    <td className="text-center py-4 px-4">0</td>
                    <td className="text-center py-4 px-4">5+</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-mono text-sm">Framework Support</td>
                    <td className="text-center py-4 px-4">✅</td>
                    <td className="text-center py-4 px-4">React Only</td>
                    <td className="text-center py-4 px-4">React Only</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-mono text-sm">Plugin System</td>
                    <td className="text-center py-4 px-4">✅</td>
                    <td className="text-center py-4 px-4">❌</td>
                    <td className="text-center py-4 px-4">❌</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8">
              Install FormKeeper and start building better forms today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/docs">Read Documentation</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/examples">View Examples</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
