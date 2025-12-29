import { Link } from 'react-router-dom'
import { ArrowRight, Code, Braces, List, Eye, Settings, CheckSquare } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const apiItems = [
  {
    icon: Braces,
    title: 'createForm',
    description: 'Core factory function to create form instances with full API access.',
    href: '/docs/api/create-form',
  },
  {
    icon: Code,
    title: 'useForm',
    description: 'React hook for creating and managing forms with reactive state.',
    href: '/docs/api/use-form',
  },
  {
    icon: Settings,
    title: 'useField',
    description: 'Hook for registering individual fields with validation rules.',
    href: '/docs/api/use-field',
  },
  {
    icon: List,
    title: 'useFieldArray',
    description: 'Hook for managing dynamic arrays of fields.',
    href: '/docs/api/use-field-array',
  },
  {
    icon: Eye,
    title: 'useWatch',
    description: 'Hook for watching field values with subscription-based updates.',
    href: '/docs/api/use-watch',
  },
  {
    icon: Settings,
    title: 'Controller',
    description: 'Wrapper component for controlled inputs and third-party UI libraries.',
    href: '/docs/api/controller',
  },
  {
    icon: CheckSquare,
    title: 'Validation Rules',
    description: 'Built-in validation rules and custom validator patterns.',
    href: '/docs/api/validation-rules',
  },
]

export function ApiIndex() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">API Reference</h1>
        <p className="text-lg text-muted-foreground">
          Complete API documentation for FormKeeper. Learn about all available
          functions, hooks, and configuration options.
        </p>
      </div>

      {/* API Items Grid */}
      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-4">
          {apiItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Card className="h-full hover:border-primary/50 transition-colors group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg font-mono">{item.title}</CardTitle>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Related Topics</h2>
        <ul className="space-y-2">
          <li>
            <Link
              to="/docs/concepts/validation"
              className="text-primary hover:underline"
            >
              Validation Concepts
            </Link>
            <span className="text-muted-foreground"> - Understanding the validation system</span>
          </li>
          <li>
            <Link
              to="/docs/plugins"
              className="text-primary hover:underline"
            >
              Plugins
            </Link>
            <span className="text-muted-foreground"> - Extend functionality with plugins</span>
          </li>
          <li>
            <Link
              to="/docs/frameworks/react"
              className="text-primary hover:underline"
            >
              React Guide
            </Link>
            <span className="text-muted-foreground"> - React-specific usage patterns</span>
          </li>
        </ul>
      </section>
    </div>
  )
}
