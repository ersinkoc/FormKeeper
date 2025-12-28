# FormKeeper

<div align="center">
  <h3>Zero-dependency headless form state manager</h3>
  <p>
    <a href="https://formkeeper.oxog.dev">Documentation</a> •
    <a href="https://formkeeper.oxog.dev/docs/getting-started">Getting Started</a> •
    <a href="https://formkeeper.oxog.dev/examples">Examples</a> •
    <a href="https://formkeeper.oxog.dev/playground">Playground</a>
  </p>
</div>

<div align="center">

[![npm version](https://img.shields.io/npm/v/@oxog/formkeeper.svg)](https://www.npmjs.com/package/@oxog/formkeeper)
[![npm downloads](https://img.shields.io/npm/dm/@oxog/formkeeper.svg)](https://www.npmjs.com/package/@oxog/formkeeper)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@oxog/formkeeper)](https://bundlephobia.com/package/@oxog/formkeeper)
[![license](https://img.shields.io/npm/l/@oxog/formkeeper.svg)](LICENSE)

</div>

---

## 🚀 Features

- 📝 **Headless** - Bring your own UI
- ⚡ **Tiny** - Under 5KB minified + gzipped
- 🔌 **Zero Dependencies** - No runtime dependencies
- 🎯 **Type-Safe** - Full TypeScript support with generics
- ✅ **Validation** - Sync and async validation
- 🌳 **Nested Fields** - Deep object support
- 📋 **Array Fields** - Dynamic field lists
- 🧙 **Wizard** - Multi-step forms (plugin)
- 💾 **Auto-save** - Draft persistence (plugin)
- ⚛️ **React/Vue/Svelte** - First-class adapters

## 📦 Installation

```bash
npm install @oxog/formkeeper
```

## 🎯 Quick Start

### React

```tsx
import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

function LoginForm() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      await api.login(values)
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <EmailField />
        <PasswordField />
        <button type="submit" disabled={form.formState.isSubmitting}>
          Login
        </button>
      </form>
    </FormProvider>
  )
}

function EmailField() {
  const { register, error, touched } = useField('email', {
    required: 'Email is required',
    pattern: { value: /^\S+@\S+$/, message: 'Invalid email' },
  })

  return (
    <div>
      <input {...register()} type="email" />
      {touched && error && <span>{error}</span>}
    </div>
  )
}
```

### Vanilla JS

```typescript
import { createForm } from '@oxog/formkeeper'

const form = createForm({
  initialValues: { email: '', password: '' },
  onSubmit: async (values) => {
    await api.login(values)
  },
})

const emailInput = document.querySelector('#email')
const { onChange, onBlur } = form.register('email', { required: true })

emailInput.addEventListener('change', onChange)
emailInput.addEventListener('blur', onBlur)

document.querySelector('form').addEventListener('submit', form.handleSubmit)
```

## 📊 Comparison

| Feature | FormKeeper | react-hook-form | Formik |
|---------|-----------|-----------------|--------|
| Bundle Size | **< 5KB** | ~40KB | ~50KB |
| Dependencies | **0** | 0 | 5+ |
| TypeScript | ✅ | ✅ | Partial |
| Vue/Svelte | ✅ | ❌ | ❌ |
| Wizard Plugin | ✅ | ❌ | ❌ |
| Auto-save | ✅ | ❌ | ❌ |

## 📚 Documentation

Visit [formkeeper.oxog.dev](https://formkeeper.oxog.dev) for full documentation including:

- 📖 **[Complete Guides](https://formkeeper.oxog.dev/docs)** - Getting started, core concepts, and tutorials
- 🔍 **[API Reference](https://formkeeper.oxog.dev/api)** - Detailed API documentation
- 💡 **[Examples](https://formkeeper.oxog.dev/examples)** - Real-world usage examples
- 🎮 **[Playground](https://formkeeper.oxog.dev/playground)** - Try FormKeeper live in your browser

### Local Documentation

- [docs/DOCS.md](./docs/DOCS.md) - Complete documentation
- [docs/EXAMPLES.md](./docs/EXAMPLES.md) - Code examples
- [docs/WEBSITE_SETUP.md](./docs/WEBSITE_SETUP.md) - Website development guide

## 📄 License

MIT © [Ersin KOÇ](https://github.com/ersinkoc)
