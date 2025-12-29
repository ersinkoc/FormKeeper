import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'

export function PersistPlugin() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Persist Plugin</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Save form data to localStorage or sessionStorage. Automatically restore
        on page reload.
      </p>

      {/* Setup */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Setup</h2>
        <CodeBlock
          code={`import { useForm } from '@oxog/formkeeper/react'
import { PersistPlugin } from '@oxog/formkeeper/plugins'

const form = useForm({
  initialValues: {
    name: '',
    email: '',
    message: '',
  },
  plugins: [
    PersistPlugin({
      key: 'contact-form',  // Storage key
    }),
  ],
  onSubmit: (values) => console.log(values),
})`}
          language="typescript"
          filename="persist-setup.ts"
        />
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
                <td className="py-3 px-4 font-mono text-primary">key</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4">Required</td>
                <td className="py-3 px-4 text-muted-foreground">Storage key</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">storage</td>
                <td className="py-3 px-4 font-mono">Storage</td>
                <td className="py-3 px-4">localStorage</td>
                <td className="py-3 px-4 text-muted-foreground">Storage backend</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">debounceMs</td>
                <td className="py-3 px-4 font-mono">number</td>
                <td className="py-3 px-4">300</td>
                <td className="py-3 px-4 text-muted-foreground">Debounce time</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">include</td>
                <td className="py-3 px-4 font-mono">string[]</td>
                <td className="py-3 px-4">All fields</td>
                <td className="py-3 px-4 text-muted-foreground">Fields to persist</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">exclude</td>
                <td className="py-3 px-4 font-mono">string[]</td>
                <td className="py-3 px-4">[]</td>
                <td className="py-3 px-4 text-muted-foreground">Fields to skip</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono text-primary">clearOnSubmit</td>
                <td className="py-3 px-4 font-mono">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4 text-muted-foreground">Clear after submit</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* API */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Persist API</h2>
        <CodeBlock
          code={`const persist = form.getPlugin('persist')

// Manual save
persist.save()

// Clear stored data
persist.clear()

// Check if data exists
const hasData = persist.hasStoredData()

// Get raw stored data
const data = persist.getStoredData()`}
          language="typescript"
        />
      </section>

      {/* Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mb-3">Session Storage</h3>
        <CodeBlock
          code={`PersistPlugin({
  key: 'my-form',
  storage: sessionStorage,  // Clear when browser closes
})`}
          language="typescript"
        />

        <h3 className="text-xl font-semibold mb-3 mt-6">Selective Persistence</h3>
        <CodeBlock
          code={`// Only persist specific fields
PersistPlugin({
  key: 'checkout',
  include: ['name', 'address', 'city'],
})

// Or exclude sensitive fields
PersistPlugin({
  key: 'checkout',
  exclude: ['cardNumber', 'cvv'],
})`}
          language="typescript"
        />

        <h3 className="text-xl font-semibold mb-3 mt-6">Custom Storage</h3>
        <CodeBlock
          code={`// Use any Storage-compatible API
const encryptedStorage = {
  getItem(key) {
    const data = localStorage.getItem(key)
    return data ? decrypt(data) : null
  },
  setItem(key, value) {
    localStorage.setItem(key, encrypt(value))
  },
  removeItem(key) {
    localStorage.removeItem(key)
  },
}

PersistPlugin({
  key: 'sensitive-form',
  storage: encryptedStorage,
})`}
          language="typescript"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/docs/plugins/autosave">
              Autosave Plugin
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/docs/plugins">All Plugins</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
