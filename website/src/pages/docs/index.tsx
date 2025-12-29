import { Link } from 'react-router-dom'
import { ArrowRight, Package, Zap, Code, Puzzle, Shield, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CodeBlock } from '@/components/code/CodeBlock'

const quickStartCode = `import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

function MyForm() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      console.log(values)
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <EmailField />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  )
}`

const features = [
  {
    icon: Package,
    title: 'Zero Dependencies',
    description: 'No runtime dependencies. Pure TypeScript under 5KB.',
    href: '/docs/installation',
  },
  {
    icon: Zap,
    title: 'Headless',
    description: 'Bring your own UI. Complete rendering control.',
    href: '/docs/concepts/form-creation',
  },
  {
    icon: Shield,
    title: 'Type-Safe',
    description: 'Full TypeScript with inference support.',
    href: '/docs/api/types',
  },
  {
    icon: Puzzle,
    title: 'Plugin System',
    description: 'Extensible micro-kernel architecture.',
    href: '/docs/plugins',
  },
  {
    icon: Layers,
    title: 'Multi-Framework',
    description: 'React, Vue, Svelte adapters included.',
    href: '/docs/frameworks/react',
  },
  {
    icon: Code,
    title: 'Validation',
    description: 'Sync, async, and schema validation.',
    href: '/docs/concepts/validation',
  },
]

export function DocsIndex() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to use FormKeeper to build type-safe, performant forms with
          minimal boilerplate.
        </p>
      </div>

      {/* Quick Start */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
        <p className="text-muted-foreground mb-4">
          Install FormKeeper and create your first form in minutes:
        </p>

        <CodeBlock
          code="npm install @oxog/formkeeper"
          language="bash"
          filename="Terminal"
          showLineNumbers={false}
          className="mb-4"
        />

        <CodeBlock
          code={quickStartCode}
          language="tsx"
          filename="MyForm.tsx"
          className="mb-6"
        />

        <Button asChild>
          <Link to="/docs/quick-start">
            Full Quick Start Guide
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </section>

      {/* Features Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Core Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Link key={feature.href} to={feature.href}>
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <feature.icon className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <ul className="space-y-2">
          <li>
            <Link
              to="/docs/installation"
              className="text-primary hover:underline"
            >
              Installation Guide
            </Link>
            <span className="text-muted-foreground"> - Get started with your framework</span>
          </li>
          <li>
            <Link
              to="/docs/concepts/form-creation"
              className="text-primary hover:underline"
            >
              Core Concepts
            </Link>
            <span className="text-muted-foreground"> - Understand the fundamentals</span>
          </li>
          <li>
            <Link to="/examples" className="text-primary hover:underline">
              Examples
            </Link>
            <span className="text-muted-foreground"> - See real-world implementations</span>
          </li>
          <li>
            <Link to="/playground" className="text-primary hover:underline">
              Playground
            </Link>
            <span className="text-muted-foreground"> - Try FormKeeper live in your browser</span>
          </li>
        </ul>
      </section>
    </div>
  )
}
