# FormKeeper Documentation

Complete documentation for FormKeeper - the zero-dependency headless form state manager.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Core Concepts](#core-concepts)
3. [API Reference](#api-reference)
4. [Examples](#examples)
5. [Testing](#testing)
6. [Website Development](#website-development)

## Getting Started

### Installation

```bash
npm install @oxog/formkeeper
# or
yarn add @oxog/formkeeper
# or
pnpm add @oxog/formkeeper
```

### Quick Start

#### Vanilla JavaScript

```typescript
import { createForm } from '@oxog/formkeeper'

const form = createForm({
  initialValues: { email: '', password: '' },
  onSubmit: async (values) => {
    console.log(values)
  }
})

const emailField = form.register('email', {
  required: 'Email is required',
  pattern: {
    value: /^\S+@\S+$/,
    message: 'Invalid email address'
  }
})
```

#### React

```tsx
import { useForm } from '@oxog/formkeeper/react'

function MyForm() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      await api.submit(values)
    }
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.register('email', { required: true })} />
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Core Concepts

### Form Instance

The form instance is the core of FormKeeper. It manages:
- Form state (values, errors, touched fields)
- Field registration and validation
- Submit handling
- Event emission and subscription
- Plugin management

### Field Registration

Fields are registered using the `register` method:

```typescript
form.register('fieldName', {
  required: 'This field is required',
  minLength: { value: 3, message: 'At least 3 characters' },
  validate: (value) => value !== 'admin' || 'Reserved username'
})
```

### Validation

FormKeeper supports multiple validation modes:
- `onChange` - Validate on every change
- `onBlur` - Validate when field loses focus
- `onSubmit` - Validate only on form submission

Validation can be synchronous or asynchronous:

```typescript
// Sync validation
form.register('username', {
  validate: (value) => value.length >= 3 || 'Too short'
})

// Async validation
form.register('email', {
  validate: async (value) => {
    const exists = await api.checkEmail(value)
    return !exists || 'Email already taken'
  }
})
```

### Nested Fields

Work with nested objects using dot notation:

```typescript
const form = useForm({
  initialValues: {
    user: {
      profile: {
        name: '',
        email: ''
      }
    }
  }
})

form.register('user.profile.name', { required: true })
form.register('user.profile.email', { required: true })
```

### Dynamic Arrays

Manage dynamic field arrays:

```typescript
import { useFieldArray } from '@oxog/formkeeper/react'

const { fields, append, remove } = useFieldArray({
  form,
  name: 'todos'
})

fields.map((field, index) => (
  <input {...form.register(`todos.${index}.text`)} />
))
```

### Plugins

Extend FormKeeper with plugins:

```typescript
import { createForm } from '@oxog/formkeeper'
import { wizardPlugin, autoSavePlugin } from '@oxog/formkeeper/plugins'

const form = createForm({
  initialValues: {},
  plugins: [
    wizardPlugin({ steps: ['step1', 'step2'] }),
    autoSavePlugin({ key: 'my-form', debounce: 1000 })
  ]
})
```

## API Reference

### createForm(options)

Creates a new form instance.

**Parameters:**
- `options.initialValues` - Initial form values
- `options.onSubmit` - Submit handler function
- `options.onError` - Error handler function (optional)
- `options.validationMode` - Validation mode (default: 'onSubmit')
- `options.plugins` - Array of plugins (optional)

**Returns:** Form instance

### Form Instance Methods

#### register(name, rules?)

Register a field with optional validation rules.

**Parameters:**
- `name` - Field name (supports dot notation)
- `rules` - Validation rules (optional)

**Returns:** Field props object

#### setValue(name, value, options?)

Set a field value programmatically.

**Parameters:**
- `name` - Field name
- `value` - New value
- `options.shouldValidate` - Trigger validation (default: false)
- `options.shouldTouch` - Mark as touched (default: false)

#### handleSubmit()

Returns a submit handler function for forms.

**Returns:** Submit handler function

#### reset(values?)

Reset form to initial or provided values.

**Parameters:**
- `values` - New values (optional)

#### watch(name?)

Watch field value changes.

**Parameters:**
- `name` - Field name to watch (optional, watches all if omitted)

**Returns:** Current value(s)

### React Hooks

#### useForm(options)

React hook for creating forms.

#### useField(name, rules?)

React hook for individual field management.

#### useFieldArray({ form, name })

React hook for managing dynamic field arrays.

#### useWatch({ form, name? })

React hook for watching field values.

#### useFormState(form)

React hook for subscribing to form state.

## Examples

See the [website examples section](https://formkeeper.oxog.dev/examples) for comprehensive examples including:

- Login forms
- Registration forms with complex validation
- Multi-step wizards
- Dynamic field arrays
- Async validation
- File uploads
- Nested forms
- Custom plugins

## Testing

FormKeeper includes comprehensive test coverage (100%).

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

### Test Structure

```
tests/
├── unit/
│   ├── utils/           # Utility function tests
│   ├── kernel/          # Core kernel tests
│   ├── plugins/         # Plugin tests
│   └── adapters/        # Framework adapter tests
└── integration/         # Integration tests
```

### Writing Tests

FormKeeper uses Vitest for testing:

```typescript
import { describe, it, expect } from 'vitest'
import { createForm } from '@oxog/formkeeper'

describe('Form', () => {
  it('should create form with initial values', () => {
    const form = createForm({
      initialValues: { email: '' }
    })

    expect(form.values).toEqual({ email: '' })
  })
})
```

## Website Development

The FormKeeper documentation website is built with React + Vite + shadcn/ui.

### Development

```bash
# Install website dependencies
npm run website:install

# Start development server
npm run website:dev

# Build for production
npm run website:build

# Preview production build
npm run website:preview
```

### Website Features

- 📖 **Comprehensive Documentation** - Complete guides and API reference
- 💡 **Interactive Examples** - Real-world usage examples
- 🎮 **Live Playground** - Try FormKeeper with Monaco Editor
- 🌓 **Dark/Light Themes** - Beautiful themes with JetBrains Mono
- 📱 **Responsive Design** - Works on all devices

### Website Structure

```
website/
├── src/
│   ├── components/      # UI components
│   ├── pages/          # Route pages
│   │   ├── home.tsx
│   │   ├── docs/
│   │   ├── api/
│   │   ├── examples/
│   │   └── playground/
│   └── styles/         # Global styles
└── public/             # Static assets
```

### Deployment

The website is automatically deployed to GitHub Pages via GitHub Actions:

1. Push to `main` branch
2. GitHub Actions builds the website
3. Deploys to https://formkeeper.oxog.dev

### Custom Domain Setup

The custom domain is configured via:
1. `website/public/CNAME` file
2. DNS CNAME record pointing to GitHub Pages
3. GitHub Pages custom domain settings

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT © [Ersin KOÇ](https://github.com/ersinkoc)

## Support

- 📖 [Documentation](https://formkeeper.oxog.dev)
- 💬 [GitHub Discussions](https://github.com/ersinkoc/formkeeper/discussions)
- 🐛 [Issue Tracker](https://github.com/ersinkoc/formkeeper/issues)
- 📧 [Email Support](mailto:ersin@oxog.dev)
