import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export function DevToolsPlugin() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">DevTools Plugin</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Debug forms with logging, state snapshots, and timeline inspection.
        Perfect for development and troubleshooting.
      </p>

      {/* Setup */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Setup</h2>
        <CodeBlock
          code={`import { useForm } from '@oxog/formkeeper/react'
import { DevToolsPlugin } from '@oxog/formkeeper/plugins'

const form = useForm({
  initialValues: {
    name: '',
    email: '',
  },
  plugins: [
    DevToolsPlugin({
      name: 'ContactForm',   // Label in console
      enabled: process.env.NODE_ENV === 'development',
    }),
  ],
  onSubmit: (values) => console.log(values),
})`}
          language="typescript"
          filename="devtools-setup.ts"
        />

        <Card className="mt-4 border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="flex gap-4 pt-6">
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Production Warning</h4>
              <p className="text-sm text-muted-foreground">
                Always disable DevToolsPlugin in production. It adds overhead
                and exposes form internals.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Configuration */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Option</th>
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Default</th>
                <th className="text-left py-3 px-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">name</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4">'Form'</td>
                <td className="py-3 px-4 text-muted-foreground">Form label</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">enabled</td>
                <td className="py-3 px-4 font-mono">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4 text-muted-foreground">Enable plugin</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">logEvents</td>
                <td className="py-3 px-4 font-mono">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4 text-muted-foreground">Log form events</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">snapshots</td>
                <td className="py-3 px-4 font-mono">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4 text-muted-foreground">Save state snapshots</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">maxSnapshots</td>
                <td className="py-3 px-4 font-mono">number</td>
                <td className="py-3 px-4">50</td>
                <td className="py-3 px-4 text-muted-foreground">Max snapshots to keep</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* API */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">DevTools API</h2>
        <CodeBlock
          code={`const devtools = form.getPlugin('devtools')

// Get all snapshots
const snapshots = devtools.getSnapshots()
console.log(snapshots)
// [
//   { timestamp: 1704067200000, event: 'change', field: 'name', state: {...} },
//   { timestamp: 1704067201000, event: 'blur', field: 'name', state: {...} },
//   ...
// ]

// Get current state
devtools.logState()

// Time travel (restore previous state)
devtools.restoreSnapshot(0)

// Clear snapshots
devtools.clearSnapshots()

// Get events log
const events = devtools.getEvents()`}
          language="typescript"
        />
      </section>

      {/* Console Output */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Console Output</h2>
        <p className="text-muted-foreground mb-4">
          DevTools logs form events with helpful formatting:
        </p>

        <CodeBlock
          code={`// Example console output:

[FormKeeper:ContactForm] Field registered: name
[FormKeeper:ContactForm] Field registered: email
[FormKeeper:ContactForm] Change: name = "John"
[FormKeeper:ContactForm] Blur: name
[FormKeeper:ContactForm] Change: email = "john@example.com"
[FormKeeper:ContactForm] Validation: { valid: true }
[FormKeeper:ContactForm] Submit started
[FormKeeper:ContactForm] Submit success`}
          language="text"
        />
      </section>

      {/* Time Travel Debugging */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Time Travel Debugging</h2>
        <p className="text-muted-foreground mb-4">
          Restore previous form states to debug issues:
        </p>

        <CodeBlock
          code={`// In browser console:

// Get the form's devtools instance
const devtools = window.__FORMKEEPER_DEVTOOLS__['ContactForm']

// View all snapshots
devtools.getSnapshots().forEach((snap, i) => {
  console.log(i, snap.event, snap.field, snap.timestamp)
})

// Restore to snapshot #5
devtools.restoreSnapshot(5)

// Or restore to a specific timestamp
const snapshot = devtools.getSnapshots().find(s =>
  s.timestamp === 1704067200000
)
if (snapshot) {
  devtools.restoreSnapshot(
    devtools.getSnapshots().indexOf(snapshot)
  )
}`}
          language="typescript"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/docs/plugins">
              All Plugins
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/examples">View Examples</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
