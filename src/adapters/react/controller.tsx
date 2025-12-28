/**
 * React Controller Component
 * For controlled custom components
 */

import { type ReactElement } from 'react'
import { useField } from './use-field'
import { useFormContext } from './context'
import type { ValidationRules, FormState } from '../../types'

/**
 * Controller props
 */
export interface ControllerProps {
  /** Field name */
  name: string
  /** Validation rules */
  rules?: ValidationRules
  /** Default value */
  defaultValue?: any
  /** Render function */
  render: (props: ControllerRenderProps) => ReactElement
}

/**
 * Controller render props
 */
export interface ControllerRenderProps {
  field: {
    name: string
    value: any
    onChange: (value: any) => void
    onBlur: () => void
    ref: (element: any) => void
  }
  fieldState: {
    error: string | undefined
    touched: boolean
    dirty: boolean
    invalid: boolean
    validating: boolean
  }
  formState: FormState<any>
}

/**
 * Controller component for custom inputs
 * @param props - Controller props
 */
export function Controller({
  name,
  rules,
  defaultValue,
  render,
}: ControllerProps): ReactElement {
  const form = useFormContext()
  const field = useField(name, rules)

  const renderProps: ControllerRenderProps = {
    field: {
      name,
      value: field.value ?? defaultValue,
      onChange: (value: any) => {
        form.setValue(name as any, value, { shouldValidate: true })
      },
      onBlur: () => {
        form.setTouched(name as any, true)
      },
      ref: () => {
        // Store ref if needed
      },
    },
    fieldState: {
      error: field.error,
      touched: field.touched,
      dirty: field.dirty,
      invalid: field.invalid,
      validating: field.validating,
    },
    formState: {
      values: form.getValues(),
      errors: form.getErrors(),
      touched: form.getTouched(),
      dirty: form.getDirty(),
      isValid: form.isValid(),
      isSubmitting: form.isSubmitting(),
      isSubmitSuccessful: form.isSubmitSuccessful(),
      submitCount: form.getSubmitCount(),
    },
  }

  return render(renderProps)
}
