import { CodeBlock } from '@/components/code/CodeBlock'
import { PropsTable } from '@/components/code/PropsTable'

export default function CustomPlugins() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Custom Plugins</h1>
      <p className="lead">
        Extend FormKeeper's functionality by creating your own plugins.
      </p>

      <h2>Plugin Interface</h2>
      <CodeBlock language="typescript">{`interface Plugin<TValues extends FieldValues = FieldValues> {
  // Identity
  name: string
  version: string
  type: 'core' | 'optional'

  // Lifecycle
  install(kernel: Kernel<TValues>): void | Promise<void>
  uninstall(): void | Promise<void>

  // Hooks (all optional)
  hooks?: PluginHooks<TValues>

  // Public API exposed to form users
  api?: Record<string, unknown>
}`}</CodeBlock>

      <h2>Available Hooks</h2>
      <PropsTable
        props={[
          { name: 'beforeRegister', type: '(name, rules?) => rules', description: 'Modify rules before registration' },
          { name: 'afterRegister', type: '(name, field) => void', description: 'Called after field registered' },
          { name: 'beforeValidate', type: '(values) => values', description: 'Transform values before validation' },
          { name: 'afterValidate', type: '(errors) => errors', description: 'Transform/filter errors' },
          { name: 'beforeSubmit', type: '(values) => values | false', description: 'Transform or cancel submit' },
          { name: 'afterSubmit', type: '(values, success) => void', description: 'Called after submit completes' },
          { name: 'beforeReset', type: '(values) => values', description: 'Transform reset values' },
          { name: 'afterReset', type: '() => void', description: 'Called after reset' },
          { name: 'onValueChange', type: '(name, value, prevValue) => void', description: 'Called when any value changes' },
          { name: 'onErrorChange', type: '(name, error) => void', description: 'Called when error changes' },
          { name: 'onStateChange', type: '(state) => void', description: 'Called on any state change' },
        ]}
      />

      <h2>Basic Plugin Example</h2>
      <CodeBlock language="typescript">{`import type { Plugin, FieldValues, Kernel } from '@oxog/formkeeper'

interface LoggerOptions {
  prefix?: string
  logChanges?: boolean
  logSubmit?: boolean
}

interface LoggerAPI {
  getLogs(): string[]
  clearLogs(): void
}

function createLoggerPlugin<TValues extends FieldValues>(
  options: LoggerOptions = {}
): Plugin<TValues> {
  const { prefix = '[Form]', logChanges = true, logSubmit = true } = options

  let logs: string[] = []
  let kernel: Kernel<TValues>

  return {
    name: 'logger',
    version: '1.0.0',
    type: 'optional',

    install(k) {
      kernel = k
      logs.push(\`\${prefix} Plugin installed\`)
    },

    uninstall() {
      logs.push(\`\${prefix} Plugin uninstalled\`)
    },

    hooks: {
      onValueChange(name, value, prevValue) {
        if (logChanges) {
          logs.push(\`\${prefix} \${name}: \${prevValue} → \${value}\`)
          console.log(\`\${prefix} \${name} changed:\`, prevValue, '→', value)
        }
      },

      beforeSubmit(values) {
        if (logSubmit) {
          logs.push(\`\${prefix} Submitting form\`)
          console.log(\`\${prefix} Submitting:\`, values)
        }
        return values
      },

      afterSubmit(values, success) {
        if (logSubmit) {
          const status = success ? 'succeeded' : 'failed'
          logs.push(\`\${prefix} Submit \${status}\`)
          console.log(\`\${prefix} Submit \${status}\`)
        }
      }
    },

    api: {
      getLogs: () => [...logs],
      clearLogs: () => { logs = [] }
    } as LoggerAPI
  }
}

// Usage
const form = createForm({
  initialValues: { email: '' },
  plugins: [createLoggerPlugin({ prefix: '[MyForm]' })],
  onSubmit: async (values) => console.log(values)
})

// Access plugin API
const logger = form.getPlugin<LoggerAPI>('logger')
console.log(logger?.getLogs())`}</CodeBlock>

      <h2>Analytics Plugin Example</h2>
      <CodeBlock language="typescript">{`interface AnalyticsOptions {
  trackingId: string
  trackFields?: boolean
  trackSubmit?: boolean
}

function createAnalyticsPlugin<TValues extends FieldValues>(
  options: AnalyticsOptions
): Plugin<TValues> {
  const { trackingId, trackFields = true, trackSubmit = true } = options

  return {
    name: 'analytics',
    version: '1.0.0',
    type: 'optional',

    install(kernel) {
      // Initialize analytics
      console.log('Analytics initialized with ID:', trackingId)
    },

    uninstall() {},

    hooks: {
      afterRegister(name) {
        if (trackFields) {
          // Track field impression
          sendEvent('field_registered', { field: name })
        }
      },

      onValueChange(name, value) {
        if (trackFields) {
          // Track field interaction (debounced in production)
          sendEvent('field_changed', { field: name })
        }
      },

      beforeSubmit(values) {
        if (trackSubmit) {
          sendEvent('form_submit_started', {
            fieldCount: Object.keys(values).length
          })
        }
        return values
      },

      afterSubmit(values, success) {
        if (trackSubmit) {
          sendEvent('form_submit_completed', { success })
        }
      }
    }
  }
}

function sendEvent(name: string, data: Record<string, any>) {
  // Send to analytics service
  console.log('Analytics:', name, data)
}`}</CodeBlock>

      <h2>Conditional Fields Plugin</h2>
      <CodeBlock language="typescript">{`interface ConditionalRule {
  field: string
  condition: (values: any) => boolean
}

interface ConditionalFieldsAPI {
  addRule(rule: ConditionalRule): void
  removeRule(field: string): void
  isVisible(field: string): boolean
}

function createConditionalFieldsPlugin<TValues extends FieldValues>(): Plugin<TValues> {
  const rules: Map<string, (values: any) => boolean> = new Map()
  let currentValues: TValues

  return {
    name: 'conditional-fields',
    version: '1.0.0',
    type: 'optional',

    install(kernel) {
      currentValues = kernel.getOptions().initialValues
    },

    uninstall() {
      rules.clear()
    },

    hooks: {
      onValueChange(name, value, prevValue) {
        // Update current values
        currentValues = { ...currentValues, [name]: value }
      },

      beforeValidate(values) {
        currentValues = values
        return values
      }
    },

    api: {
      addRule(rule: ConditionalRule) {
        rules.set(rule.field, rule.condition)
      },

      removeRule(field: string) {
        rules.delete(field)
      },

      isVisible(field: string): boolean {
        const condition = rules.get(field)
        if (!condition) return true
        return condition(currentValues)
      }
    } as ConditionalFieldsAPI
  }
}

// Usage
const form = createForm({
  initialValues: { hasAddress: false, street: '' },
  plugins: [createConditionalFieldsPlugin()],
  onSubmit: async (values) => console.log(values)
})

const conditional = form.getPlugin<ConditionalFieldsAPI>('conditional-fields')
conditional?.addRule({
  field: 'street',
  condition: (values) => values.hasAddress === true
})

// In component
if (conditional?.isVisible('street')) {
  // Render street field
}`}</CodeBlock>

      <h2>Async Plugin Installation</h2>
      <CodeBlock language="typescript">{`function createAsyncPlugin<TValues extends FieldValues>(): Plugin<TValues> {
  return {
    name: 'async-plugin',
    version: '1.0.0',
    type: 'optional',

    async install(kernel) {
      // Load external configuration
      const config = await fetch('/api/form-config').then(r => r.json())

      // Apply configuration
      console.log('Loaded config:', config)
    },

    async uninstall() {
      // Cleanup async resources
      await saveState()
    }
  }
}`}</CodeBlock>

      <h2>Testing Plugins</h2>
      <CodeBlock language="typescript">{`import { describe, it, expect, vi } from 'vitest'
import { createForm } from '@oxog/formkeeper'

describe('Logger Plugin', () => {
  it('should log value changes', () => {
    const consoleSpy = vi.spyOn(console, 'log')

    const form = createForm({
      initialValues: { email: '' },
      plugins: [createLoggerPlugin()],
      onSubmit: async () => {}
    })

    form.setValue('email', 'test@example.com')

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('email changed'),
      '',
      '→',
      'test@example.com'
    )
  })

  it('should expose logs via API', () => {
    const form = createForm({
      initialValues: { email: '' },
      plugins: [createLoggerPlugin()],
      onSubmit: async () => {}
    })

    form.setValue('email', 'test@example.com')

    const logger = form.getPlugin<LoggerAPI>('logger')
    const logs = logger?.getLogs()

    expect(logs).toContain(expect.stringContaining('email'))
  })
})`}</CodeBlock>

      <h2>Best Practices</h2>
      <ul>
        <li>Keep plugins focused on a single responsibility</li>
        <li>Use TypeScript for type-safe plugin APIs</li>
        <li>Provide sensible defaults for all options</li>
        <li>Clean up resources in the <code>uninstall</code> method</li>
        <li>Document your plugin's hooks and API</li>
        <li>Handle errors gracefully in hooks</li>
        <li>Consider performance - avoid expensive operations in <code>onValueChange</code></li>
      </ul>
    </div>
  )
}
