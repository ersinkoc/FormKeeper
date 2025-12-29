export const SITE_CONFIG = {
  name: 'FormKeeper',
  description: 'Zero-dependency headless form state manager with micro-kernel plugin architecture',
  url: 'https://formkeeper.oxog.dev',
  github: 'https://github.com/ersinkoc/formkeeper',
  npm: 'https://www.npmjs.com/package/@oxog/formkeeper',
  author: 'Ersin KOC',
  package: '@oxog/formkeeper',
}

export const NAV_ITEMS = [
  { label: 'Docs', href: '/docs' },
  { label: 'API', href: '/docs/api' },
  { label: 'Examples', href: '/examples' },
  { label: 'Playground', href: '/playground' },
]

export const FEATURES = [
  {
    title: 'Zero Dependencies',
    description: 'No runtime dependencies. Pure TypeScript implementation under 5KB gzipped.',
    icon: 'Package',
  },
  {
    title: 'Headless',
    description: 'Bring your own UI. Complete control over rendering and styling.',
    icon: 'Puzzle',
  },
  {
    title: 'Type-Safe',
    description: 'Full TypeScript support with generics for complete type inference.',
    icon: 'Shield',
  },
  {
    title: 'Plugin Architecture',
    description: 'Extensible micro-kernel design. Add only what you need.',
    icon: 'Blocks',
  },
  {
    title: 'Multi-Framework',
    description: 'First-class React, Vue, and Svelte adapters with framework-specific hooks.',
    icon: 'Layers',
  },
  {
    title: 'Validation',
    description: 'Sync and async validation. Zod, Yup, and Joi schema integration.',
    icon: 'CheckCircle',
  },
]

export const STATS = [
  { label: 'Bundle Size', value: '<5KB', description: 'gzipped' },
  { label: 'Dependencies', value: '0', description: 'zero runtime deps' },
  { label: 'TypeScript', value: '100%', description: 'type coverage' },
  { label: 'License', value: 'MIT', description: 'open source' },
]

export const COMPARISON_DATA = [
  { feature: 'Bundle Size', formkeeper: '< 5KB', rhf: '~40KB', formik: '~50KB' },
  { feature: 'Dependencies', formkeeper: '0', rhf: '0', formik: '5+' },
  { feature: 'TypeScript', formkeeper: 'Full', rhf: 'Full', formik: 'Partial' },
  { feature: 'React', formkeeper: true, rhf: true, formik: true },
  { feature: 'Vue', formkeeper: true, rhf: false, formik: false },
  { feature: 'Svelte', formkeeper: true, rhf: false, formik: false },
  { feature: 'Wizard Plugin', formkeeper: true, rhf: false, formik: false },
  { feature: 'Auto-save', formkeeper: true, rhf: false, formik: false },
  { feature: 'DevTools', formkeeper: true, rhf: true, formik: false },
]
