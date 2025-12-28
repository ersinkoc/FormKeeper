import { createForm } from '@/create-form'

describe('Final Edge Cases for 100% Coverage', () => {
  describe('Submit Handler Exception Handling', () => {
    it('should handle exception in onSubmit callback', async () => {
      const errorHandler = vi.fn()

      const form = createForm({
        initialValues: { email: 'test@example.com' },
        onSubmit: async () => {
          throw new Error('Submission failed')
        },
      })

      form.on('error', errorHandler)

      await form.submit()

      expect(errorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(Error),
          context: 'submit',
        })
      )
    })

    it('should reset isSubmitting after exception', async () => {
      const form = createForm({
        initialValues: { email: 'test@example.com' },
        onSubmit: async () => {
          throw new Error('Test error')
        },
      })

      await form.submit()

      expect(form.isSubmitting()).toBe(false)
    })

    it('should not set isSubmitSuccessful after exception', async () => {
      const form = createForm({
        initialValues: { email: 'test@example.com' },
        onSubmit: async () => {
          throw new Error('Test error')
        },
      })

      await form.submit()

      expect(form.isSubmitSuccessful()).toBe(false)
    })
  })

  describe('Validation Edge Cases', () => {
    it('should handle pattern validation with default message', async () => {
      const form = createForm({
        initialValues: { code: 'invalid' },
        onSubmit: vi.fn(),
      })

      // RegExp without custom message
      form.register('code', {
        pattern: /^\d+$/,
      })

      await form.validate()

      expect(form.getError('code')).toBe('Invalid format')
    })

    it('should handle minLength with number instead of object', async () => {
      const form = createForm({
        initialValues: { username: 'ab' },
        onSubmit: vi.fn(),
      })

      form.register('username', {
        minLength: 5,
      })

      await form.validate()

      expect(form.getError('username')).toBe('Must be at least 5 characters')
    })

    it('should handle maxLength with number instead of object', async () => {
      const form = createForm({
        initialValues: { username: 'verylongusername' },
        onSubmit: vi.fn(),
      })

      form.register('username', {
        maxLength: 10,
      })

      await form.validate()

      expect(form.getError('username')).toBe('Must be at most 10 characters')
    })

    it('should handle min with number instead of object', async () => {
      const form = createForm({
        initialValues: { age: 10 },
        onSubmit: vi.fn(),
      })

      form.register('age', {
        min: 18,
      })

      await form.validate()

      expect(form.getError('age')).toBe('Value must be at least 18')
    })

    it('should handle max with number instead of object', async () => {
      const form = createForm({
        initialValues: { score: 150 },
        onSubmit: vi.fn(),
      })

      form.register('score', {
        max: 100,
      })

      await form.validate()

      expect(form.getError('score')).toBe('Value must be at most 100')
    })

    it('should handle required as boolean true', async () => {
      const form = createForm({
        initialValues: { email: '' },
        onSubmit: vi.fn(),
      })

      form.register('email', {
        required: true,
      })

      await form.validate()

      expect(form.getError('email')).toBe('This field is required')
    })

    it('should handle empty array in required validation', async () => {
      const form = createForm({
        initialValues: { items: [] },
        onSubmit: vi.fn(),
      })

      form.register('items', {
        required: 'Items are required',
      })

      await form.validate()

      expect(form.getError('items')).toBe('Items are required')
    })

    it('should handle pattern validation on non-string value', async () => {
      const form = createForm({
        initialValues: { value: 123 as any },
        onSubmit: vi.fn(),
      })

      form.register('value', {
        pattern: /^\d+$/,
      })

      await form.validate()

      // Pattern validation only works on strings
      expect(form.isValid()).toBe(true)
    })

    it('should handle minLength on non-string/array value', async () => {
      const form = createForm({
        initialValues: { value: 123 as any },
        onSubmit: vi.fn(),
      })

      form.register('value', {
        minLength: { value: 5, message: 'Too short' },
      })

      await form.validate()

      // minLength only works on strings/arrays
      expect(form.getError('value')).toBe('Too short')
    })

    it('should handle min on non-number value', async () => {
      const form = createForm({
        initialValues: { value: 'string' as any },
        onSubmit: vi.fn(),
      })

      form.register('value', {
        min: { value: 10, message: 'Too low' },
      })

      await form.validate()

      // min only works on numbers
      expect(form.isValid()).toBe(true)
    })

    it('should handle custom validator returning undefined', async () => {
      const form = createForm({
        initialValues: { value: 'test' },
        onSubmit: vi.fn(),
      })

      form.register('value', {
        validate: () => undefined,
      })

      await form.validate()

      expect(form.isValid()).toBe(true)
    })

    it('should handle array in minLength validation', async () => {
      const form = createForm({
        initialValues: { items: [1, 2] },
        onSubmit: vi.fn(),
      })

      form.register('items', {
        minLength: { value: 5, message: 'Need more items' },
      })

      await form.validate()

      expect(form.getError('items')).toBe('Need more items')
    })

    it('should handle array in maxLength validation', async () => {
      const form = createForm({
        initialValues: { items: [1, 2, 3, 4, 5] },
        onSubmit: vi.fn(),
      })

      form.register('items', {
        maxLength: { value: 3, message: 'Too many items' },
      })

      await form.validate()

      expect(form.getError('items')).toBe('Too many items')
    })
  })

  describe('Field Registry Edge Cases', () => {
    it('should handle onChange with missing field', () => {
      const form = createForm({
        initialValues: {},
        onSubmit: vi.fn(),
      })

      const registration = form.register('missing')

      // Should not throw
      expect(() => registration.onChange('value')).not.toThrow()
    })

    it('should handle onBlur with missing field', () => {
      const form = createForm({
        initialValues: {},
        onSubmit: vi.fn(),
      })

      const registration = form.register('missing')

      // Should not throw
      expect(() => registration.onBlur()).not.toThrow()
    })

    it('should handle textarea input type', () => {
      const changeHandler = vi.fn()

      const form = createForm({
        initialValues: { description: '' },
        onSubmit: vi.fn(),
      })

      form.on('change', changeHandler)

      const registration = form.register('description')

      const event = {
        target: {
          type: 'textarea',
          value: 'Long description',
        },
      }

      registration.onChange(event)

      expect(changeHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 'Long description',
        })
      )
    })

    it('should handle select input type', () => {
      const changeHandler = vi.fn()

      const form = createForm({
        initialValues: { country: '' },
        onSubmit: vi.fn(),
      })

      form.on('change', changeHandler)

      const registration = form.register('country')

      const event = {
        target: {
          type: 'select-one',
          value: 'US',
        },
      }

      registration.onChange(event)

      expect(changeHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 'US',
        })
      )
    })
  })

  describe('State Manager Edge Cases', () => {
    it('should handle hasAnyDirty with null value', () => {
      const form = createForm({
        initialValues: { value: null as any },
        onSubmit: vi.fn(),
      })

      expect(form.isDirty()).toBe(false)
    })

    it('should handle hasAnyDirty with non-boolean primitive', () => {
      const form = createForm({
        initialValues: { value: 'string' },
        onSubmit: vi.fn(),
      })

      form.setValue('value', 'changed')

      expect(form.isDirty()).toBe(true)
    })
  })

  describe('Array Fields Edge Cases', () => {
    it('should handle initialization with non-array value', () => {
      const form = createForm({
        initialValues: { items: 'not-an-array' as any },
        onSubmit: vi.fn(),
      })

      const fieldArray = form.useFieldArray('items')

      expect(fieldArray.fields).toHaveLength(0)
    })
  })

  describe('Submit Error Focus Edge Cases', () => {
    it('should handle nested error object without string value', async () => {
      const form = createForm({
        initialValues: {
          nested: {
            deep: {
              field: '',
            },
          },
        },
        onSubmit: vi.fn(),
        shouldFocusError: true,
      })

      const element = document.createElement('input')
      element.focus = vi.fn()
      element.scrollIntoView = vi.fn()

      const reg = form.register('nested.deep.field', { required: 'Required' })
      reg.ref(element)

      await form.submit()

      expect(element.focus).toHaveBeenCalled()
    })

    it('should handle error object without findable field', async () => {
      const form = createForm({
        initialValues: { field: '' },
        onSubmit: vi.fn(),
        shouldFocusError: true,
      })

      form.register('field', { required: 'Required' })
      // Don't set ref

      // Should not throw
      await expect(form.submit()).resolves.not.toThrow()
    })
  })
})
