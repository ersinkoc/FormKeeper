/**
 * React useWatch Hook
 * Watch field value changes
 */

import { useEffect, useSyncExternalStore, useCallback } from 'react'
import { useFormContext } from './context'
import type { WatchCallback } from '../../types'

/**
 * Watch a field's value
 * Overload: watch specific field
 */
export function useWatch<TValue = any>(name: string): TValue

/**
 * Watch a field's value with callback
 * Overload: watch with callback
 */
export function useWatch<TValue = any>(
  name: string,
  callback: WatchCallback<TValue>
): void

/**
 * Watch all form values
 * Overload: watch all
 */
export function useWatch(): any

/**
 * Implementation
 */
export function useWatch<TValue = any>(
  nameOrCallback?: string | WatchCallback<TValue>,
  callback?: WatchCallback<TValue>
): TValue | void {
  const form = useFormContext()

  // useWatch('field') - return value
  if (typeof nameOrCallback === 'string' && !callback) {
    const name = nameOrCallback

    const subscribe = useCallback(
      (onStoreChange: () => void) => {
        return form.on('change', (event: any) => {
          if (event.name === name) {
            onStoreChange()
          }
        })
      },
      [form, name]
    )

    const getSnapshot = useCallback(() => {
      return form.getValues(name as any)
    }, [form, name])

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  }

  // useWatch('field', callback) - call callback on change
  if (typeof nameOrCallback === 'string' && callback) {
    const name = nameOrCallback

    useEffect(() => {
      return form.watch(name as any, callback)
    }, [form, name, callback])

    return
  }

  // useWatch() - return all values
  if (!nameOrCallback) {
    const subscribe = useCallback(
      (onStoreChange: () => void) => {
        return form.on('change', onStoreChange)
      },
      [form]
    )

    const getSnapshot = useCallback(() => {
      return form.getValues()
    }, [form])

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot) as any
  }

  // useWatch(callback) - call callback on any change
  if (typeof nameOrCallback === 'function') {
    useEffect(() => {
      return form.watch(nameOrCallback as any)
    }, [form, nameOrCallback])

    return
  }
}
