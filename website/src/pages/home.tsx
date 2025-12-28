import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Zap, Package, Shield, Boxes, Rocket, CheckCircle2, XCircle, Sparkles, Terminal, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IDEWindow } from '@/components/code/IDEWindow'
import { useState } from 'react'

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

function InstallCommand() {
  const [copied, setCopied] = useState(false)
  const command = 'npm install @oxog/formkeeper'

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="inline-flex items-center gap-2 bg-black dark:bg-zinc-900 text-green-400 px-6 py-3 rounded-lg font-mono text-sm border border-zinc-700">
      <Terminal className="h-4 w-4" />
      <span className="text-zinc-400">$</span>
      <span>{command}</span>
      <button
        onClick={handleCopy}
        className="ml-2 p-1 hover:bg-zinc-800 rounded transition-colors"
        aria-label="Copy command"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-zinc-400" />
        )}
      </button>
    </div>
  )
}

export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/50 text-sm mb-8 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Welcome to the new era of form libraries</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Forms shouldn't be{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                this easy
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Stop wrestling with heavy libraries, complex APIs, and endless boilerplate.
              With FormKeeper, forms take <span className="text-foreground font-semibold">less than 5KB</span>.
            </p>

            <div className="flex flex-col items-center gap-6 mb-12">
              <InstallCommand />

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="text-lg px-8">
                  <Link to="/playground">
                    <Zap className="mr-2 h-5 w-5" />
                    Try Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8">
                  <Link to="/docs">
                    Documentation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto text-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-green-500">&lt;5KB</div>
                <div className="text-muted-foreground">Minified + Gzip</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-blue-500">0</div>
                <div className="text-muted-foreground">Dependencies</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-purple-500">100%</div>
                <div className="text-muted-foreground">TypeScript</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-orange-500">∞</div>
                <div className="text-muted-foreground">Frameworks</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 border-t bg-muted/20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Stop{' '}
                <span className="text-destructive">fighting</span>{' '}
                with other libraries
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Other libraries force you into their rules. FormKeeper gives you complete control.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Other Libraries */}
              <Card className="relative border-destructive/50">
                <div className="absolute -top-3 left-4">
                  <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    Other Libraries
                  </span>
                </div>
                <CardHeader className="pt-8">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <span>50KB+ bundle size</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <span>Complex APIs and concepts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <span>React-only support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <span>Tons of boilerplate code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <span>Locked into UI framework</span>
                    </li>
                  </ul>
                </CardHeader>
              </Card>

              {/* FormKeeper */}
              <Card className="relative border-primary/50 bg-primary/5">
                <div className="absolute -top-3 left-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    FormKeeper
                  </span>
                </div>
                <CardHeader className="pt-8">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="font-medium">&lt;5KB minified + gzipped</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Simple and intuitive API</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Framework agnostic</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Minimal and clean code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Headless - use your own UI</span>
                    </li>
                  </ul>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-20 border-t">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Just a few lines of code</h2>
              <p className="text-xl text-muted-foreground">
                Everything included: validation, state management, and submit handling
              </p>
            </div>
            <IDEWindow code={exampleCode} language="typescript" filename="LoginForm.tsx" />
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">That's it. Really that simple.</p>
              <Button asChild variant="outline" size="lg">
                <Link to="/playground">
                  <Zap className="mr-2 h-4 w-4" />
                  Try in Playground
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t bg-muted/20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why FormKeeper?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with modern development standards, everything you need without the bloat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-lg">
              <Rocket className="h-5 w-5 text-primary" />
              <span className="font-semibold">
                Extend features however you want with the plugin system
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 border-t">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">How does it compare?</h2>
              <p className="text-xl text-muted-foreground">
                Much lighter and more flexible than the competition
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-4 px-6 font-semibold text-lg">Feature</th>
                      <th className="text-center py-4 px-6">
                        <div className="font-bold text-lg text-primary">FormKeeper</div>
                      </th>
                      <th className="text-center py-4 px-6 text-muted-foreground">
                        <div className="font-mono text-sm">react-hook-form</div>
                      </th>
                      <th className="text-center py-4 px-6 text-muted-foreground">
                        <div className="font-mono text-sm">Formik</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 font-medium">Bundle Size</td>
                      <td className="text-center py-4 px-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                          <span className="font-bold text-green-600 dark:text-green-400">&lt; 5KB</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-6 text-muted-foreground">~40KB</td>
                      <td className="text-center py-4 px-6 text-muted-foreground">~50KB</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 font-medium">Dependencies</td>
                      <td className="text-center py-4 px-6">
                        <div className="inline-flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <span className="font-bold text-green-600 dark:text-green-400">0</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-6 text-muted-foreground">0</td>
                      <td className="text-center py-4 px-6 text-muted-foreground">5+</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 font-medium">Framework Support</td>
                      <td className="text-center py-4 px-6">
                        <div className="inline-flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <span className="font-bold text-green-600 dark:text-green-400">All</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-6 text-muted-foreground">React Only</td>
                      <td className="text-center py-4 px-6 text-muted-foreground">React Only</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 font-medium">Plugin System</td>
                      <td className="text-center py-4 px-6">
                        <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-6">
                        <XCircle className="h-6 w-6 text-muted-foreground/50 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-6">
                        <XCircle className="h-6 w-6 text-muted-foreground/50 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 font-medium">TypeScript</td>
                      <td className="text-center py-4 px-6">
                        <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-6">
                        <CheckCircle2 className="h-6 w-6 text-muted-foreground/50 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-6">
                        <CheckCircle2 className="h-6 w-6 text-muted-foreground/50 mx-auto" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 border-t overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-background" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Install FormKeeper and start building better forms today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" asChild className="text-lg px-8 h-14">
                <Link to="/docs">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Get Started
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 h-14">
                <Link to="/playground">
                  <Zap className="mr-2 h-5 w-5" />
                  Try Playground
                </Link>
              </Button>
            </div>
            <div className="inline-flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">or install right now:</p>
              <InstallCommand />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
