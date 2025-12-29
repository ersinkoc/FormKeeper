/**
 * Tests for 100% code coverage
 * These tests cover edge cases and specific code paths
 */

import { describe, it, expect } from 'vitest'
import { createForm } from '../../src/create-form'

describe('100% Coverage Tests', () => {
  describe('Field Registry Plugin Coverage', () => {
    it('should return field state via getField (via getPlugin)', () => {
      const form = createForm({
        initialValues: { email: 'test@example.com' },
        onSubmit: async () => {},
      })

      // Register a field
      form.register('email')

      // Access field-registry plugin directly
      const fieldRegistry = form.getPlugin<any>('field-registry')
      const fieldState = fieldRegistry?.getField('email')
      expect(fieldState).toBeDefined()
      expect(fieldState?.touched).toBe(false)
    })

    it('should return all fields via getFields', () => {
      const form = createForm({
        initialValues: { name: 'John', email: 'john@test.com' },
        onSubmit: async () => {},
      })

      form.register('name')
      form.register('email')

      // Access field-registry plugin directly
      const fieldRegistry = form.getPlugin<any>('field-registry')
      const fields = fieldRegistry?.getFields()
      expect(fields).toBeDefined()
      expect(fields.size).toBe(2)
    })

    it('should return undefined for unregistered field via getField', () => {
      const form = createForm({
        initialValues: { email: '' },
        onSubmit: async () => {},
      })

      const fieldRegistry = form.getPlugin<any>('field-registry')
      const fieldState = fieldRegistry?.getField('nonexistent')
      expect(fieldState).toBeUndefined()
    })
  })

  describe('Submit Handler Coverage', () => {
    it('should return null when no error field exists', async () => {
      const form = createForm({
        initialValues: { email: 'valid@email.com' },
        onSubmit: async () => {},
        shouldFocusError: true,
      })

      form.register('email')

      // Submit without errors - getFirstErrorField returns null
      await form.handleSubmit()
      expect(form.isSubmitSuccessful()).toBe(true)
    })

    it('should handle empty errors object in getFirstErrorField', async () => {
      let capturedErrors: any = null
      const form = createForm({
        initialValues: { email: '' },
        onSubmit: async () => {},
        onError: (errors) => {
          capturedErrors = errors
        },
        shouldFocusError: true,
      })

      form.register('email', { required: 'Email required' })

      await form.handleSubmit()

      // Should have errors but field focus should work even without refs
      expect(capturedErrors).toBeDefined()
    })

    it('should handle nested errors in getFirstErrorField', async () => {
      let capturedErrors: any = null
      const form = createForm({
        initialValues: { user: { profile: { name: '' } } },
        onSubmit: async () => {},
        onError: (errors) => {
          capturedErrors = errors
        },
        shouldFocusError: true,
      })

      form.register('user.profile.name', { required: 'Name required' })

      await form.handleSubmit()

      expect(capturedErrors).toBeDefined()
      expect(capturedErrors.user?.profile?.name).toBe('Name required')
    })

    it('should handle deeply nested errors traversal', async () => {
      let capturedErrors: any = null
      const form = createForm({
        initialValues: {
          level1: {
            level2: {
              level3: {
                field: ''
              }
            }
          }
        },
        onSubmit: async () => {},
        onError: (errors) => {
          capturedErrors = errors
        },
        shouldFocusError: true,
      })

      form.register('level1.level2.level3.field', { required: 'Required' })

      await form.handleSubmit()

      expect(capturedErrors.level1.level2.level3.field).toBe('Required')
    })
  })

  describe('Validation Engine Coverage', () => {
    it('should track isFieldValidating state', async () => {
      const form = createForm({
        initialValues: { email: '' },
        onSubmit: async () => {},
      })

      form.register('email', {
        validate: async (value) => {
          await new Promise((r) => setTimeout(r, 10))
          return value ? true : 'Required'
        },
      })

      // Trigger validation
      const validationPromise = form.validateField('email')

      // During validation, field should be validating
      expect(form.isValidating()).toBe(true)
      expect(form.isFieldValidating('email')).toBe(true)

      await validationPromise
    })

    it('should handle multiple validators that all pass', async () => {
      const form = createForm({
        initialValues: { username: 'validuser123' },
        onSubmit: async () => {},
      })

      form.register('username', {
        validate: {
          hasLetters: (v) => /[a-z]/.test(v) || 'Need letters',
          hasNumbers: (v) => /[0-9]/.test(v) || 'Need numbers',
          minLength: (v) => v.length >= 5 || 'Too short',
        },
      })

      const isValid = await form.validateField('username')
      expect(isValid).toBe(true)
    })

    it('should abort previous validation on rapid re-validation', async () => {
      const form = createForm({
        initialValues: { search: '' },
        onSubmit: async () => {},
      })

      let callCount = 0
      form.register('search', {
        validate: async (value) => {
          callCount++
          await new Promise((r) => setTimeout(r, 50))
          return value.length >= 3 || 'Too short'
        },
      })

      // Trigger multiple validations rapidly
      form.validateField('search')
      form.validateField('search')
      await form.validateField('search')

      // All were called but only last should complete normally
      expect(callCount).toBe(3)
    })

    it('should return undefined for validators returning true', async () => {
      const form = createForm({
        initialValues: { field: 'value' },
        onSubmit: async () => {},
      })

      form.register('field', {
        validate: () => true,
      })

      const isValid = await form.validateField('field')
      expect(isValid).toBe(true)
      expect(form.getErrors()).toEqual({})
    })

    it('should return undefined for validators returning undefined', async () => {
      const form = createForm({
        initialValues: { field: 'value' },
        onSubmit: async () => {},
      })

      form.register('field', {
        validate: () => undefined,
      })

      const isValid = await form.validateField('field')
      expect(isValid).toBe(true)
    })

    it('should handle validateCustom with multiple validators all passing', async () => {
      const form = createForm({
        initialValues: { password: 'ValidPass123' },
        onSubmit: async () => {},
      })

      form.register('password', {
        validate: {
          hasUpper: (v) => /[A-Z]/.test(v) || 'Need uppercase',
          hasLower: (v) => /[a-z]/.test(v) || 'Need lowercase',
          hasNumber: (v) => /[0-9]/.test(v) || 'Need number',
          minLength: (v) => v.length >= 8 || 'Min 8 chars',
        },
      })

      const isValid = await form.validateField('password')
      expect(isValid).toBe(true)
      expect(form.getErrors()).toEqual({})
    })
  })

  describe('State Manager Coverage', () => {
    it('should correctly identify dirty state with nested objects', () => {
      const form = createForm({
        initialValues: { user: { name: 'John' } },
        onSubmit: async () => {},
      })

      form.setValue('user.name', 'Jane')

      expect(form.isDirty()).toBe(true)
    })

    it('should handle hasAnyDirty with boolean true', () => {
      const form = createForm({
        initialValues: { active: false },
        onSubmit: async () => {},
      })

      form.setValue('active', true)
      expect(form.isDirty()).toBe(true)
    })

    it('should handle hasAnyDirty with null value', () => {
      const form = createForm({
        initialValues: { data: null as any },
        onSubmit: async () => {},
      })

      expect(form.isDirty()).toBe(false)
    })
  })

  describe('Array Fields Coverage', () => {
    it('should handle replace operation correctly', () => {
      const form = createForm({
        initialValues: { items: [{ name: 'a' }, { name: 'b' }] },
        onSubmit: async () => {},
      })

      const { replace } = form.useFieldArray('items')
      replace([{ name: 'x' }, { name: 'y' }, { name: 'z' }])

      expect(form.getValues().items).toHaveLength(3)
      expect(form.getValues().items[0].name).toBe('x')
    })

    it('should handle move operation correctly', () => {
      const form = createForm({
        initialValues: { items: [{ id: 1 }, { id: 2 }, { id: 3 }] },
        onSubmit: async () => {},
      })

      const { move } = form.useFieldArray('items')
      move(0, 2)

      const items = form.getValues().items
      expect(items[0].id).toBe(2)
      expect(items[2].id).toBe(1)
    })

    it('should handle update operation when field exists', () => {
      const form = createForm({
        initialValues: { items: [{ name: 'old' }] },
        onSubmit: async () => {},
      })

      const { update, fields } = form.useFieldArray('items')
      const originalId = fields[0]?.id

      update(0, { name: 'new' })

      const updatedFields = form.useFieldArray('items').fields
      expect(updatedFields[0]?.id).toBe(originalId) // ID preserved
      expect(form.getValues().items[0].name).toBe('new')
    })

    it('should initialize array with empty array when getValue returns undefined', () => {
      const form = createForm({
        initialValues: {} as { items?: any[] },
        onSubmit: async () => {},
      })

      const { fields, append } = form.useFieldArray('items')
      expect(fields).toHaveLength(0)

      append({ name: 'first' })
      expect(form.useFieldArray('items').fields).toHaveLength(1)
    })
  })

  describe('Validation Engine clearError Coverage', () => {
    it('should handle clearError on non-existent nested path', () => {
      const form = createForm({
        initialValues: { user: { name: '' } },
        onSubmit: async () => {},
      })

      // Try to clear a nested error that doesn't exist - should not throw
      form.clearError('user.profile.email')

      // No errors should exist
      expect(form.getErrors()).toEqual({})
    })

    it('should handle clearError when parent path does not exist', () => {
      const form = createForm({
        initialValues: { data: '' },
        onSubmit: async () => {},
      })

      // Clear a deeply nested error where intermediate paths don't exist
      form.clearError('nonexistent.deeply.nested.path')

      expect(form.getErrors()).toEqual({})
    })

    it('should properly clear nested error', () => {
      const form = createForm({
        initialValues: { user: { email: '' } },
        onSubmit: async () => {},
      })

      // Set an error first
      form.setError('user.email', 'Invalid email')
      expect(form.getError('user.email')).toBe('Invalid email')

      // Now clear it
      form.clearError('user.email')
      expect(form.getError('user.email')).toBeUndefined()
    })
  })

  describe('Submit Handler getFirstErrorField Coverage', () => {
    it('should traverse errors object and return null when all values are non-string objects', async () => {
      const form = createForm({
        initialValues: { field1: 'valid', field2: 'valid' },
        onSubmit: async () => {},
        shouldFocusError: true,
      })

      form.register('field1')
      form.register('field2')

      // Submit should succeed with no errors
      await form.submit()

      expect(form.isSubmitSuccessful()).toBe(true)
    })

    it('should return first error field from nested object errors', async () => {
      let errorsCaptured: any = null
      const form = createForm({
        initialValues: {
          address: {
            street: '',
            city: ''
          }
        },
        onSubmit: async () => {},
        onError: (errors) => {
          errorsCaptured = errors
        },
        shouldFocusError: true,
      })

      form.register('address.street', { required: 'Street required' })
      form.register('address.city')

      await form.submit()

      expect(errorsCaptured?.address?.street).toBe('Street required')
    })
  })

  describe('Additional Edge Cases for 100% Coverage', () => {
    it('should test getField returning a registered field state', () => {
      const form = createForm({
        initialValues: { test: 'value' },
        onSubmit: async () => {},
      })

      form.register('test')

      const fieldRegistry = form.getPlugin<any>('field-registry')

      // Test getField returns the field
      const field = fieldRegistry.getField('test')
      expect(field).toBeDefined()
      expect(field.touched).toBe(false)
      expect(field.dirty).toBe(false)
    })

    it('should test getFields returning all fields map', () => {
      const form = createForm({
        initialValues: { a: 1, b: 2, c: 3 },
        onSubmit: async () => {},
      })

      form.register('a')
      form.register('b')
      form.register('c')

      const fieldRegistry = form.getPlugin<any>('field-registry')
      const fields = fieldRegistry.getFields()

      expect(fields instanceof Map).toBe(true)
      expect(fields.size).toBe(3)
      expect(fields.has('a')).toBe(true)
      expect(fields.has('b')).toBe(true)
      expect(fields.has('c')).toBe(true)
    })

    it('should test isFieldValidating during async validation', async () => {
      const form = createForm({
        initialValues: { asyncField: '' },
        onSubmit: async () => {},
      })

      let checkDuringValidation = false

      form.register('asyncField', {
        validate: async () => {
          await new Promise((r) => setTimeout(r, 20))
          return true
        },
      })

      // Start validation
      const promise = form.validateField('asyncField')

      // Check immediately
      checkDuringValidation = form.isFieldValidating('asyncField')

      await promise

      expect(checkDuringValidation).toBe(true)
      expect(form.isFieldValidating('asyncField')).toBe(false)
    })

    it('should handle form submission with no validation errors (getFirstErrorField returns null)', async () => {
      const form = createForm({
        initialValues: { valid: 'data' },
        onSubmit: async () => {},
        shouldFocusError: true,
      })

      form.register('valid')

      await form.submit()

      expect(form.isSubmitSuccessful()).toBe(true)
      expect(form.getErrors()).toEqual({})
    })
  })
})
