/**
 * React Context for Form
 * Provides form instance to child components
 */

import { createContext, useContext, type ReactNode } from 'react'
import type { Form } from '../../create-form'
import type { FieldValues } from '../../types'

/**
 * Form context
 */
const FormContext = createContext<Form<any> | null>(null)

/**
 * Form provider props
 */
export interface FormProviderProps<TValues extends FieldValues> {
  form: Form<TValues>
  children: ReactNode
}

/**
 * Form provider component
 * @param props - Provider props
 */
export function FormProvider<TValues extends FieldValues = FieldValues>({
  form,
  children,
}: FormProviderProps<TValues>) {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>
}

/**
 * Use form context hook
 * @returns Form instance from context
 */
export function useFormContext<TValues extends FieldValues = FieldValues>(): Form<TValues> {
  const form = useContext(FormContext)

  if (!form) {
    throw new Error('useFormContext must be used within a FormProvider')
  }

  return form as Form<TValues>
}
