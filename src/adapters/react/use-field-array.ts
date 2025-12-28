/**
 * React useFieldArray Hook
 * Manage dynamic array fields
 */

import { useSyncExternalStore, useCallback } from 'react'
import { useFormContext } from './context'
import type { FieldArrayReturn } from '../../types'

/**
 * Manage an array field
 * @param name - Array field name
 * @returns Array field methods and state
 */
export function useFieldArray(name: string): FieldArrayReturn<any, any> {
  const form = useFormContext()
  const arrayField = form.useFieldArray(name)

  // Subscribe to changes
  const subscribe = useCallback(
    (callback: () => void) => {
      return form.on('change', (event: any) => {
        if (event.name.startsWith(name)) {
          callback()
        }
      })
    },
    [form, name]
  )

  const getSnapshot = useCallback(() => arrayField.fields, [arrayField])

  // Use sync external store to track fields
  const fields = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return {
    fields,
    append: arrayField.append,
    prepend: arrayField.prepend,
    insert: arrayField.insert,
    remove: arrayField.remove,
    swap: arrayField.swap,
    move: arrayField.move,
    update: arrayField.update,
    replace: arrayField.replace,
  }
}
