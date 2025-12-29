import { CodeBlock } from '@/components/code/CodeBlock'
import { PropsTable } from '@/components/code/PropsTable'

export default function CorePlugins() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Core Plugins</h1>
      <p className="lead">
        The 5 core plugins that power FormKeeper's fundamental functionality.
        These are automatically loaded and don't need manual installation.
      </p>

      <h2>Overview</h2>
      <p>
        FormKeeper's micro-kernel architecture delegates specific responsibilities to plugins.
        The core plugins provide essential form functionality:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
        {[
          { name: 'field-registry', desc: 'Field registration and ref management' },
          { name: 'state-manager', desc: 'Values, touched, dirty state' },
          { name: 'validation-engine', desc: 'Sync and async validation' },
          { name: 'array-fields', desc: 'Dynamic field arrays' },
          { name: 'submit-handler', desc: 'Form submission' },
        ].map((plugin) => (
          <div key={plugin.name} className="bg-zinc-900 p-4 rounded-lg">
            <h3 className="text-blue-400 font-mono text-sm">{plugin.name}</h3>
            <p className="text-sm text-zinc-400 mt-1">{plugin.desc}</p>
          </div>
        ))}
      </div>

      <h2>1. Field Registry Plugin</h2>
      <p>
        Manages field registration, unregistration, and DOM element references.
      </p>

      <h3>API</h3>
      <PropsTable
        props={[
          { name: 'register(name, rules?)', type: 'FieldRegistration', description: 'Register a field with optional validation rules' },
          { name: 'unregister(name)', type: 'void', description: 'Unregister a field' },
          { name: 'getField(name)', type: 'FieldState | undefined', description: 'Get field state by name' },
          { name: 'getFields()', type: 'Map<string, FieldState>', description: 'Get all registered fields' },
          { name: 'getRegisteredNames()', type: 'string[]', description: 'List all registered field names' },
          { name: 'isRegistered(name)', type: 'boolean', description: 'Check if field is registered' },
          { name: 'setRef(name, element)', type: 'void', description: 'Store element reference' },
          { name: 'getRef(name)', type: 'HTMLElement | null', description: 'Get element reference' },
        ]}
      />

      <CodeBlock language="typescript">{`// Access via form instance
const form = createForm({ /* ... */ })

// Register returns props for input binding
const emailProps = form.register('email', {
  required: 'Email is required'
})

// Check registration
form.getPlugin('field-registry')?.isRegistered('email') // true`}</CodeBlock>

      <h2>2. State Manager Plugin</h2>
      <p>
        Manages form values, touched state, dirty state, and reset functionality.
      </p>

      <h3>API</h3>
      <PropsTable
        props={[
          { name: 'getValues(name?)', type: 'TValues | any', description: 'Get all or specific value' },
          { name: 'setValue(name, value, options?)', type: 'void', description: 'Set a field value' },
          { name: 'setValues(values, options?)', type: 'void', description: 'Set multiple values' },
          { name: 'getTouched()', type: 'TouchedFields', description: 'Get touched state' },
          { name: 'isTouched(name)', type: 'boolean', description: 'Check if field is touched' },
          { name: 'setTouched(name, touched?)', type: 'void', description: 'Set touched state' },
          { name: 'getDirty()', type: 'DirtyFields', description: 'Get dirty state' },
          { name: 'isDirty(name?)', type: 'boolean', description: 'Check if field/form is dirty' },
          { name: 'getDefaultValues()', type: 'TValues', description: 'Get initial values' },
          { name: 'reset(values?, options?)', type: 'void', description: 'Reset form' },
          { name: 'resetField(name, options?)', type: 'void', description: 'Reset specific field' },
        ]}
      />

      <CodeBlock language="typescript">{`// Get values
const allValues = form.getValues()
const email = form.getValues('email')

// Set values
form.setValue('email', 'test@example.com')
form.setValues({ email: 'test@example.com', name: 'John' })

// Check state
form.isDirty()        // Any field dirty?
form.isDirty('email') // Specific field dirty?
form.isTouched('email')

// Reset
form.reset()                          // Reset to initial
form.reset({ email: 'new@email.com' }) // Reset with new values`}</CodeBlock>

      <h2>3. Validation Engine Plugin</h2>
      <p>
        Handles all validation logic including built-in rules, custom validators, and async validation.
      </p>

      <h3>API</h3>
      <PropsTable
        props={[
          { name: 'validate()', type: 'Promise<boolean>', description: 'Validate entire form' },
          { name: 'validateField(name)', type: 'Promise<boolean>', description: 'Validate specific field' },
          { name: 'getErrors()', type: 'FormErrors', description: 'Get all errors' },
          { name: 'getError(name)', type: 'string | undefined', description: 'Get field error' },
          { name: 'setError(name, error)', type: 'void', description: 'Set field error' },
          { name: 'clearError(name)', type: 'void', description: 'Clear field error' },
          { name: 'clearErrors()', type: 'void', description: 'Clear all errors' },
          { name: 'isValid()', type: 'boolean', description: 'Check if form is valid' },
          { name: 'isValidating()', type: 'boolean', description: 'Check if validating' },
          { name: 'isFieldValidating(name)', type: 'boolean', description: 'Check if field is validating' },
        ]}
      />

      <CodeBlock language="typescript">{`// Validate
const isValid = await form.validate()

// Get/set errors
const errors = form.getErrors()
const emailError = form.getError('email')

form.setError('email', 'Email already exists')
form.clearError('email')

// Check validation state
form.isValid()
form.isValidating()
form.isFieldValidating('email')`}</CodeBlock>

      <h2>4. Array Fields Plugin</h2>
      <p>
        Provides array manipulation methods for dynamic field lists.
      </p>

      <h3>API</h3>
      <PropsTable
        props={[
          { name: 'useFieldArray(name)', type: 'FieldArrayReturn', description: 'Get array field helpers' },
          { name: 'append(name, value)', type: 'void', description: 'Add to end' },
          { name: 'prepend(name, value)', type: 'void', description: 'Add to beginning' },
          { name: 'insert(name, index, value)', type: 'void', description: 'Insert at index' },
          { name: 'remove(name, index)', type: 'void', description: 'Remove at index' },
          { name: 'swap(name, indexA, indexB)', type: 'void', description: 'Swap two items' },
          { name: 'move(name, from, to)', type: 'void', description: 'Move item' },
          { name: 'update(name, index, value)', type: 'void', description: 'Update at index' },
          { name: 'replace(name, values)', type: 'void', description: 'Replace entire array' },
        ]}
      />

      <CodeBlock language="typescript">{`// Use field array
const { fields, append, remove, move } = form.useFieldArray('items')

// Add items
append({ name: '', price: 0 })

// Remove item
remove(0)

// Reorder
move(0, 2) // Move first item to third position
swap(0, 1) // Swap first two items`}</CodeBlock>

      <h2>5. Submit Handler Plugin</h2>
      <p>
        Manages form submission including validation, error focusing, and submit state.
      </p>

      <h3>API</h3>
      <PropsTable
        props={[
          { name: 'submit()', type: 'Promise<void>', description: 'Submit the form' },
          { name: 'handleSubmit(e?)', type: 'Promise<void>', description: 'Submit handler for form element' },
          { name: 'isSubmitting()', type: 'boolean', description: 'Check if submitting' },
          { name: 'isSubmitSuccessful()', type: 'boolean', description: 'Check if last submit succeeded' },
          { name: 'getSubmitCount()', type: 'number', description: 'Get number of submit attempts' },
        ]}
      />

      <CodeBlock language="typescript">{`// Use with form element
<form onSubmit={form.handleSubmit}>

// Or programmatically
await form.submit()

// Check state
form.isSubmitting()
form.isSubmitSuccessful()
form.getSubmitCount()`}</CodeBlock>

      <h2>Plugin Lifecycle</h2>
      <p>
        Core plugins are installed automatically in this order:
      </p>
      <ol>
        <li><code>field-registry</code> - Foundation for field management</li>
        <li><code>state-manager</code> - Depends on field-registry</li>
        <li><code>validation-engine</code> - Depends on state-manager</li>
        <li><code>array-fields</code> - Depends on state-manager</li>
        <li><code>submit-handler</code> - Depends on all above</li>
      </ol>

      <h2>Accessing Plugin APIs</h2>
      <CodeBlock language="typescript">{`const form = createForm({ /* ... */ })

// Get specific plugin
const stateManager = form.getPlugin('state-manager')
const validationEngine = form.getPlugin('validation-engine')

// List all plugins
const plugins = form.listPlugins()
// [
//   { name: 'field-registry', version: '1.0.0', type: 'core', enabled: true },
//   { name: 'state-manager', version: '1.0.0', type: 'core', enabled: true },
//   ...
// ]`}</CodeBlock>
    </div>
  )
}
