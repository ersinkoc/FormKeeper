/**
 * Wizard Plugin
 * Multi-step form navigation with validation
 */

import type {
  Plugin,
  FieldValues,
} from '../../types'
import type { Kernel } from '../../kernel/kernel'
import type { ValidationEngineAPI } from '../core/validation-engine'

/**
 * Wizard step configuration
 */
export interface WizardStep {
  /** Step identifier */
  id: string
  /** Step title/label */
  title: string
  /** Fields in this step */
  fields: string[]
  /** Custom validation function for the step */
  validate?: () => Promise<boolean> | boolean
  /** Step is optional (can be skipped) */
  optional?: boolean
}

/**
 * Wizard options
 */
export interface WizardOptions {
  /** Wizard steps */
  steps: WizardStep[]
  /** Initial step index (default: 0) */
  initialStep?: number
  /** Validate step before moving to next (default: true) */
  validateOnNext?: boolean
  /** Allow going back to previous steps (default: true) */
  allowBack?: boolean
}

/**
 * Wizard plugin API
 */
export interface WizardAPI {
  /** Go to next step */
  next(): Promise<boolean>
  /** Go to previous step */
  back(): void
  /** Go to specific step by index */
  goToStep(index: number): Promise<boolean>
  /** Get current step index */
  getCurrentStep(): number
  /** Get current step configuration */
  getCurrentStepConfig(): WizardStep
  /** Get all steps */
  getSteps(): WizardStep[]
  /** Check if current step is first */
  isFirstStep(): boolean
  /** Check if current step is last */
  isLastStep(): boolean
  /** Check if can go to next step */
  canGoNext(): boolean
  /** Check if can go back */
  canGoBack(): boolean
  /** Get step progress (0-100) */
  getProgress(): number
  /** Check if step is completed */
  isStepCompleted(stepIndex: number): boolean
  /** Reset wizard to first step */
  reset(): void
}

/**
 * Create wizard plugin
 * @param options - Wizard options
 * @returns Wizard plugin
 */
export function createWizardPlugin<TValues extends FieldValues>(
  options: WizardOptions
): Plugin<TValues> {
  let kernel: Kernel<TValues> | null = null
  let validationEngine: ValidationEngineAPI<TValues> | null = null
  let currentStep = options.initialStep ?? 0
  const completedSteps = new Set<number>()

  async function validateCurrentStep(): Promise<boolean> {
    if (!validationEngine) return true

    const step = options.steps[currentStep]
    if (!step) return false

    // Run custom step validation if provided
    if (step.validate) {
      const customValid = await step.validate()
      if (!customValid) return false
    }

    // Validate all fields in the current step
    const validationResults = await Promise.all(
      step.fields.map((field) => validationEngine!.validateField(field))
    )

    return validationResults.every((result) => result === true)
  }

  function emitStepChange(from: number, to: number): void {
    if (!kernel) return

    kernel.emit({
      type: 'error', // Using error as base event type
      error: new Error(JSON.stringify({ from, to, type: 'step-change' })),
      context: 'wizard',
      timestamp: Date.now(),
    })
  }

  const api: WizardAPI = {
    async next(): Promise<boolean> {
      if (!api.canGoNext()) return false

      // Validate current step if required
      if (options.validateOnNext !== false) {
        const isValid = await validateCurrentStep()
        if (!isValid) return false
      }

      // Mark current step as completed
      completedSteps.add(currentStep)

      const previousStep = currentStep
      currentStep++

      emitStepChange(previousStep, currentStep)
      return true
    },

    back(): void {
      if (!api.canGoBack()) return

      const previousStep = currentStep
      currentStep--

      emitStepChange(previousStep, currentStep)
    },

    async goToStep(index: number): Promise<boolean> {
      if (index < 0 || index >= options.steps.length) {
        return false
      }

      if (index === currentStep) {
        return true
      }

      // If going forward, validate current step
      if (index > currentStep && options.validateOnNext !== false) {
        const isValid = await validateCurrentStep()
        if (!isValid) return false
        completedSteps.add(currentStep)
      }

      const previousStep = currentStep
      currentStep = index

      emitStepChange(previousStep, currentStep)
      return true
    },

    getCurrentStep(): number {
      return currentStep
    },

    getCurrentStepConfig(): WizardStep {
      return options.steps[currentStep]!
    },

    getSteps(): WizardStep[] {
      return options.steps
    },

    isFirstStep(): boolean {
      return currentStep === 0
    },

    isLastStep(): boolean {
      return currentStep === options.steps.length - 1
    },

    canGoNext(): boolean {
      return currentStep < options.steps.length - 1
    },

    canGoBack(): boolean {
      if (options.allowBack === false) return false
      return currentStep > 0
    },

    getProgress(): number {
      if (options.steps.length === 0) return 100
      return Math.round(((currentStep + 1) / options.steps.length) * 100)
    },

    isStepCompleted(stepIndex: number): boolean {
      return completedSteps.has(stepIndex)
    },

    reset(): void {
      const previousStep = currentStep
      currentStep = options.initialStep ?? 0
      completedSteps.clear()

      emitStepChange(previousStep, currentStep)
    },
  }

  return {
    name: 'wizard',
    version: '1.0.0',
    type: 'optional',

    install(k: Kernel<TValues>) {
      kernel = k
      validationEngine = kernel.getPlugin<ValidationEngineAPI<TValues>>('validation-engine') ?? null
    },

    uninstall() {
      kernel = null
      validationEngine = null
      currentStep = options.initialStep ?? 0
      completedSteps.clear()
    },

    api: api as any,
  }
}
