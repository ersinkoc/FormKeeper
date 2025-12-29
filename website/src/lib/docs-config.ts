export interface DocSection {
  title: string
  items: DocItem[]
}

export interface DocItem {
  title: string
  href: string
  description?: string
}

export const docsConfig: DocSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs', description: 'What is FormKeeper?' },
      { title: 'Installation', href: '/docs/installation', description: 'Install and setup' },
      { title: 'Quick Start', href: '/docs/quick-start', description: 'Get started in 5 minutes' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { title: 'Form Creation', href: '/docs/concepts/form-creation', description: 'Creating forms' },
      { title: 'Field Registration', href: '/docs/concepts/field-registration', description: 'Registering fields' },
      { title: 'Validation', href: '/docs/concepts/validation', description: 'Validation system' },
      { title: 'Form State', href: '/docs/concepts/form-state', description: 'Managing state' },
      { title: 'Array Fields', href: '/docs/concepts/array-fields', description: 'Dynamic arrays' },
    ],
  },
  {
    title: 'Plugins',
    items: [
      { title: 'Plugin Overview', href: '/docs/plugins', description: 'Plugin architecture' },
      { title: 'Persist Plugin', href: '/docs/plugins/persist', description: 'Save to storage' },
      { title: 'Autosave Plugin', href: '/docs/plugins/autosave', description: 'Auto-save drafts' },
      { title: 'Wizard Plugin', href: '/docs/plugins/wizard', description: 'Multi-step forms' },
      { title: 'Schema Plugin', href: '/docs/plugins/schema', description: 'Zod/Yup/Joi' },
      { title: 'DevTools Plugin', href: '/docs/plugins/devtools', description: 'Debugging' },
    ],
  },
  {
    title: 'Framework Guides',
    items: [
      { title: 'React', href: '/docs/frameworks/react', description: 'React adapter' },
      { title: 'Vue', href: '/docs/frameworks/vue', description: 'Vue adapter' },
      { title: 'Svelte', href: '/docs/frameworks/svelte', description: 'Svelte adapter' },
      { title: 'Vanilla JS', href: '/docs/frameworks/vanilla', description: 'Without framework' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { title: 'createForm', href: '/docs/api/create-form', description: 'Form factory' },
      { title: 'useForm', href: '/docs/api/use-form', description: 'React hook' },
      { title: 'useField', href: '/docs/api/use-field', description: 'Field hook' },
      { title: 'useFieldArray', href: '/docs/api/use-field-array', description: 'Array hook' },
      { title: 'Types', href: '/docs/api/types', description: 'TypeScript types' },
    ],
  },
]
