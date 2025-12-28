/**
 * Optional Plugins
 * Tree-shakeable plugins for additional functionality
 */

export { createAutosavePlugin, type AutosaveOptions, type AutosaveAPI } from './autosave'
export { createPersistPlugin, type PersistOptions, type PersistAPI, type StorageType } from './persist'
export { createWizardPlugin, type WizardOptions, type WizardAPI, type WizardStep } from './wizard'
export { createFocusManagerPlugin, type FocusManagerOptions, type FocusManagerAPI } from './focus-manager'
export {
  createSchemaPlugin,
  type SchemaOptions,
  type SchemaAPI,
  type SchemaValidator,
  type SchemaValidationResult,
  zodAdapter,
  yupAdapter,
  joiAdapter,
} from './schema'
export {
  createDevToolsPlugin,
  type DevToolsOptions,
  type DevToolsAPI,
  type DevToolsLogEntry,
  type FormSnapshot,
} from './devtools'
