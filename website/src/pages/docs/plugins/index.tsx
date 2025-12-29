import { Link } from 'react-router-dom'
import { ArrowRight, HardDrive, Save, Wand2, FileCode, Bug } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CodeBlock } from '@/components/code/CodeBlock'

const plugins = [
  {
    name: 'PersistPlugin',
    description: 'Save form data to localStorage or sessionStorage. Restore on page reload.',
    icon: HardDrive,
    href: '/docs/plugins/persist',
  },
  {
    name: 'AutosavePlugin',
    description: 'Automatically save form changes with configurable debounce.',
    icon: Save,
    href: '/docs/plugins/autosave',
  },
  {
    name: 'WizardPlugin',
    description: 'Multi-step forms with validation, navigation, and progress tracking.',
    icon: Wand2,
    href: '/docs/plugins/wizard',
  },
  {
    name: 'SchemaPlugin',
    description: 'Integrate Zod, Yup, or Joi for schema-based validation.',
    icon: FileCode,
    href: '/docs/plugins/schema',
  },
  {
    name: 'DevToolsPlugin',
    description: 'Debug forms with logging, snapshots, and state inspection.',
    icon: Bug,
    href: '/docs/plugins/devtools',
  },
]

export function PluginsIndex() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Plugins</h1>
      <p className="text-lg text-muted-foreground mb-8">
        FormKeeper uses a micro-kernel architecture. Core functionality is
        minimal, and features are added through plugins. This keeps your
        bundle size small - only include what you need.
      </p>

      {/* How Plugins Work */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Using Plugins</h2>
        <p className="text-muted-foreground mb-4">
          Add plugins via the <code className="text-primary">plugins</code> option:
        </p>

        <CodeBlock
          code={`import { useForm } from '@oxog/formkeeper/react'
import {
  PersistPlugin,
  AutosavePlugin,
  WizardPlugin
} from '@oxog/formkeeper/plugins'

const form = useForm({
  initialValues: { name: '', email: '' },
  plugins: [
    // Persist to localStorage
    PersistPlugin({ key: 'my-form' }),

    // Auto-save every 2 seconds
    AutosavePlugin({
      onSave: (values) => api.saveDraft(values),
      debounceMs: 2000,
    }),
  ],
  onSubmit: (values) => console.log(values),
})`}
          language="typescript"
          filename="plugins-example.ts"
        />
      </section>

      {/* Available Plugins */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Available Plugins</h2>
        <div className="grid gap-4">
          {plugins.map((plugin) => (
            <Link key={plugin.name} to={plugin.href}>
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <plugin.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {plugin.name}
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </CardTitle>
                      <CardDescription>{plugin.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Plugin API */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Accessing Plugin APIs</h2>
        <p className="text-muted-foreground mb-4">
          Some plugins expose APIs you can access at runtime:
        </p>

        <CodeBlock
          code={`// Get plugin API
const wizard = form.getPlugin('wizard')

// Use wizard navigation
wizard.next()
wizard.back()
wizard.goToStep(2)

// Check wizard state
console.log(wizard.getCurrentStep())
console.log(wizard.getProgress()) // 0-100

// Persist plugin
const persist = form.getPlugin('persist')
persist.save()
persist.clear()

// DevTools plugin
const devtools = form.getPlugin('devtools')
console.log(devtools.getSnapshots())`}
          language="typescript"
        />
      </section>

      {/* Creating Custom Plugins */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Creating Custom Plugins</h2>
        <p className="text-muted-foreground mb-4">
          Plugins are simple objects with lifecycle hooks:
        </p>

        <CodeBlock
          code={`import type { Plugin } from '@oxog/formkeeper'

interface MyPluginOptions {
  logChanges?: boolean
}

function MyPlugin(options: MyPluginOptions = {}): Plugin {
  return {
    name: 'my-plugin',

    install(form, hooks) {
      // Called when plugin is registered
      console.log('Plugin installed!')

      // Subscribe to form events
      hooks.on('change', (event) => {
        if (options.logChanges) {
          console.log('Field changed:', event.name, event.value)
        }
      })

      hooks.on('submit', () => {
        console.log('Form submitted!')
      })

      // Return public API (optional)
      return {
        sayHello: () => console.log('Hello from plugin!'),
      }
    },

    uninstall(form) {
      // Cleanup when plugin is removed
      console.log('Plugin uninstalled!')
    },
  }
}

// Usage
const form = useForm({
  plugins: [MyPlugin({ logChanges: true })],
  // ...
})

// Access plugin API
const myPlugin = form.getPlugin('my-plugin')
myPlugin.sayHello()`}
          language="typescript"
          filename="custom-plugin.ts"
        />
      </section>

      {/* Plugin Hooks */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Available Hooks</h2>
        <p className="text-muted-foreground mb-4">
          Plugins can listen to these form events:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Event</th>
                <th className="text-left py-3 px-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">register</td>
                <td className="py-3 px-4 text-muted-foreground">Field registered</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">unregister</td>
                <td className="py-3 px-4 text-muted-foreground">Field unregistered</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">change</td>
                <td className="py-3 px-4 text-muted-foreground">Field value changed</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">blur</td>
                <td className="py-3 px-4 text-muted-foreground">Field lost focus</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">focus</td>
                <td className="py-3 px-4 text-muted-foreground">Field gained focus</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">validate</td>
                <td className="py-3 px-4 text-muted-foreground">Validation completed</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">submit</td>
                <td className="py-3 px-4 text-muted-foreground">Form submitted</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">submit-success</td>
                <td className="py-3 px-4 text-muted-foreground">Submit succeeded</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">submit-error</td>
                <td className="py-3 px-4 text-muted-foreground">Submit failed</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">reset</td>
                <td className="py-3 px-4 text-muted-foreground">Form reset</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">state-change</td>
                <td className="py-3 px-4 text-muted-foreground">Any state changed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
