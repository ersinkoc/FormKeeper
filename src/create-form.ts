/**
 * Main Factory Function
 * Creates a form instance with all core plugins
 */

import { Kernel } from './kernel/kernel'
import {
  createFieldRegistryPlugin,
  createStateManagerPlugin,
  createValidationEnginePlugin,
  createArrayFieldsPlugin,
  createSubmitHandlerPlugin,
  type FieldRegistryAPI,
  type StateManagerAPI,
  type ValidationEngineAPI,
  type ArrayFieldsAPI,
  type SubmitHandlerAPI,
} from './plugins/core'
import type {
  FormOptions,
  FieldValues,
  FieldPath,
  FieldRegistration,
  ValidationRules,
  SetValueOptions,
  ResetOptions,
  DeepPartial,
  FormErrors,
  TouchedFields,
  DirtyFields,
  FieldArrayReturn,
  WatchCallback,
  Unsubscribe,
  EventType,
  FormEvent,
  EventHandler,
  Plugin,
  PluginInfo,
} from './types'

/**
 * Form instance interface
 */
export interface Form<TValues extends FieldValues = FieldValues> {
  // Field registration
  register<TName extends FieldPath<TValues>>(
    name: TName,
    rules?: ValidationRules
  ): FieldRegistration
  unregister(name: string): void

  // Values
  getValues(): TValues
  getValues<TName extends FieldPath<TValues>>(name: TName): any
  setValue<TName extends FieldPath<TValues>>(
    name: TName,
    value: any,
    options?: SetValueOptions
  ): void
  setValues(values: DeepPartial<TValues>, options?: SetValueOptions): void

  // Errors
  getErrors(): FormErrors<TValues>
  getError<TName extends FieldPath<TValues>>(name: TName): string | undefined
  setError<TName extends FieldPath<TValues>>(name: TName, error: string): void
  clearError<TName extends FieldPath<TValues>>(name: TName): void
  clearErrors(): void

  // Touched & Dirty
  getTouched(): TouchedFields<TValues>
  isTouched<TName extends FieldPath<TValues>>(name: TName): boolean
  setTouched<TName extends FieldPath<TValues>>(name: TName, touched?: boolean): void
  getDirty(): DirtyFields<TValues>
  isDirty<TName extends FieldPath<TValues>>(name?: TName): boolean

  // Validation
  validate(): Promise<boolean>
  validateField<TName extends FieldPath<TValues>>(name: TName): Promise<boolean>
  isValid(): boolean
  isValidating(): boolean
  isFieldValidating(name: string): boolean

  // Submit
  submit(): Promise<void>
  handleSubmit(e?: Event): Promise<void>
  isSubmitting(): boolean
  isSubmitSuccessful(): boolean
  getSubmitCount(): number

  // Reset
  reset(values?: DeepPartial<TValues>, options?: ResetOptions): void
  resetField<TName extends FieldPath<TValues>>(name: TName, options?: ResetOptions): void

  // Watch
  watch<TName extends FieldPath<TValues>>(
    name: TName,
    callback: WatchCallback
  ): Unsubscribe
  watch(callback: WatchCallback<TValues>): Unsubscribe

  // Focus
  setFocus<TName extends FieldPath<TValues>>(name: TName): void

  // Array fields
  useFieldArray<TName extends FieldPath<TValues>>(
    name: TName
  ): FieldArrayReturn<TValues, TName>

  // Plugin management
  registerPlugin(plugin: Plugin<TValues>): void
  unregisterPlugin(pluginName: string): void
  getPlugin<P = any>(name: string): P | undefined
  listPlugins(): PluginInfo[]

  // Event system
  emit(event: FormEvent<TValues>): void
  on<E extends EventType>(eventType: E, handler: EventHandler<E, TValues>): Unsubscribe
  off<E extends EventType>(eventType: E, handler: EventHandler<E, TValues>): void

  // Lifecycle
  destroy(): void

  // Configuration
  getOptions(): FormOptions<TValues>
}

/**
 * Create a form instance
 * @param options - Form options
 * @returns Form instance
 */
export function createForm<TValues extends FieldValues = FieldValues>(
  options: FormOptions<TValues>
): Form<TValues> {
  // Create kernel
  const kernel = new Kernel<TValues>(options)

  // Install core plugins in order
  const fieldRegistryPlugin = createFieldRegistryPlugin<TValues>()
  const stateManagerPlugin = createStateManagerPlugin<TValues>(options.initialValues)
  const validationEnginePlugin = createValidationEnginePlugin<TValues>()
  const arrayFieldsPlugin = createArrayFieldsPlugin<TValues>()
  const submitHandlerPlugin = createSubmitHandlerPlugin<TValues>()

  kernel.registerPlugin(fieldRegistryPlugin)
  kernel.registerPlugin(stateManagerPlugin)
  kernel.registerPlugin(validationEnginePlugin)
  kernel.registerPlugin(arrayFieldsPlugin)
  kernel.registerPlugin(submitHandlerPlugin)

  // Get plugin APIs
  const fieldRegistry = kernel.getPlugin<FieldRegistryAPI>('field-registry')!
  const stateManager = kernel.getPlugin<StateManagerAPI<TValues>>('state-manager')!
  const validationEngine = kernel.getPlugin<ValidationEngineAPI<TValues>>('validation-engine')!
  const arrayFields = kernel.getPlugin<ArrayFieldsAPI>('array-fields')!
  const submitHandler = kernel.getPlugin<SubmitHandlerAPI<TValues>>('submit-handler')!

  // Create unified form API
  const form: Form<TValues> = {
    // Field registration
    register: fieldRegistry.register.bind(fieldRegistry),
    unregister: fieldRegistry.unregister.bind(fieldRegistry),

    // Values
    getValues: stateManager.getValues.bind(stateManager) as any,
    setValue: stateManager.setValue.bind(stateManager) as any,
    setValues: stateManager.setValues.bind(stateManager),

    // Errors
    getErrors: validationEngine.getErrors.bind(validationEngine),
    getError: validationEngine.getError.bind(validationEngine) as any,
    setError: validationEngine.setError.bind(validationEngine) as any,
    clearError: validationEngine.clearError.bind(validationEngine) as any,
    clearErrors: validationEngine.clearErrors.bind(validationEngine),

    // Touched & Dirty
    getTouched: stateManager.getTouched.bind(stateManager),
    isTouched: stateManager.isTouched.bind(stateManager) as any,
    setTouched: stateManager.setTouched.bind(stateManager) as any,
    getDirty: stateManager.getDirty.bind(stateManager),
    isDirty: stateManager.isDirty.bind(stateManager) as any,

    // Validation
    validate: validationEngine.validate.bind(validationEngine),
    validateField: validationEngine.validateField.bind(validationEngine) as any,
    isValid: validationEngine.isValid.bind(validationEngine),
    isValidating: validationEngine.isValidating.bind(validationEngine),
    isFieldValidating: validationEngine.isFieldValidating.bind(validationEngine),

    // Submit
    submit: submitHandler.submit.bind(submitHandler),
    handleSubmit: submitHandler.handleSubmit.bind(submitHandler),
    isSubmitting: submitHandler.isSubmitting.bind(submitHandler),
    isSubmitSuccessful: submitHandler.isSubmitSuccessful.bind(submitHandler),
    getSubmitCount: submitHandler.getSubmitCount.bind(submitHandler),

    // Reset
    reset: stateManager.reset.bind(stateManager),
    resetField: stateManager.resetField.bind(stateManager) as any,

    // Watch
    watch: ((nameOrCallback: any, callback?: any) => {
      if (typeof nameOrCallback === 'function') {
        // Watch all values
        return kernel.on('change', () => {
          const values = stateManager.getValues()
          nameOrCallback(values, values)
        })
      } else {
        // Watch specific field
        return kernel.on('change', (event) => {
          if (event.name === nameOrCallback) {
            callback(event.value, event.prevValue)
          }
        })
      }
    }) as any,

    // Focus
    setFocus: ((name: string) => {
      const element = fieldRegistry.getRef(name)
      if (element && typeof element.focus === 'function') {
        element.focus()
      }
    }) as any,

    // Array fields
    useFieldArray: arrayFields.useFieldArray.bind(arrayFields) as any,

    // Plugin management
    registerPlugin: kernel.registerPlugin.bind(kernel),
    unregisterPlugin: kernel.unregisterPlugin.bind(kernel),
    getPlugin: kernel.getPlugin.bind(kernel),
    listPlugins: kernel.listPlugins.bind(kernel),

    // Event system
    emit: kernel.emit.bind(kernel),
    on: kernel.on.bind(kernel),
    off: kernel.off.bind(kernel),

    // Lifecycle
    destroy: kernel.destroy.bind(kernel),

    // Configuration
    getOptions: kernel.getOptions.bind(kernel),
  }

  return form
}
