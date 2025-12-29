/**
 * Optional Plugins
 * Import separately to reduce bundle size
 * @packageDocumentation
 */

// Autosave Plugin
export {
  createAutosavePlugin,
  createAutosavePlugin as AutosavePlugin,
  type AutosaveOptions,
  type AutosaveAPI,
} from './optional/autosave'

// Persist Plugin
export {
  createPersistPlugin,
  createPersistPlugin as PersistPlugin,
  type PersistOptions,
  type PersistAPI,
  type StorageType,
} from './optional/persist'

// Wizard Plugin
export {
  createWizardPlugin,
  createWizardPlugin as WizardPlugin,
  type WizardOptions,
  type WizardAPI,
  type WizardStep,
} from './optional/wizard'

// Focus Manager Plugin
export {
  createFocusManagerPlugin,
  createFocusManagerPlugin as FocusManagerPlugin,
  type FocusManagerOptions,
  type FocusManagerAPI,
} from './optional/focus-manager'

// Schema Plugin (Zod, Yup, Joi adapters)
export {
  createSchemaPlugin,
  createSchemaPlugin as SchemaPlugin,
  type SchemaOptions,
  type SchemaAPI,
  type SchemaValidator,
  type SchemaValidationResult,
  zodAdapter,
  yupAdapter,
  joiAdapter,
} from './optional/schema'

// DevTools Plugin
export {
  createDevToolsPlugin,
  createDevToolsPlugin as DevToolsPlugin,
  type DevToolsOptions,
  type DevToolsAPI,
  type DevToolsLogEntry,
  type FormSnapshot,
} from './optional/devtools'
