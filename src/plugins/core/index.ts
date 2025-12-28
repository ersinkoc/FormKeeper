/**
 * Core Plugins
 * Always loaded, bundled with kernel
 * @packageDocumentation
 */

export {
  createFieldRegistryPlugin,
  type FieldRegistryAPI,
} from './field-registry'

export {
  createStateManagerPlugin,
  type StateManagerAPI,
} from './state-manager'

export {
  createValidationEnginePlugin,
  type ValidationEngineAPI,
} from './validation-engine'

export {
  createArrayFieldsPlugin,
  type ArrayFieldsAPI,
} from './array-fields'

export {
  createSubmitHandlerPlugin,
  type SubmitHandlerAPI,
} from './submit-handler'
