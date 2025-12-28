import { createForm } from '@/create-form'
import type { FormOptions } from '@/types'

describe('createForm', () => {
  let options: FormOptions<any>

  beforeEach(() => {
    options = {
      initialValues: { email: '', password: '' },
      onSubmit: vi.fn(),
    }
  })

  it('should create a form instance', () => {
    const form = createForm(options)

    expect(form).toBeDefined()
    expect(typeof form.register).toBe('function')
    expect(typeof form.getValues).toBe('function')
  })

  it('should initialize with initial values', () => {
    const form = createForm(options)

    expect(form.getValues()).toEqual({ email: '', password: '' })
  })

  it('should register fields', () => {
    const form = createForm(options)

    const registration = form.register('email', { required: true })

    expect(registration).toBeDefined()
    expect(typeof registration.onChange).toBe('function')
    expect(typeof registration.onBlur).toBe('function')
  })

  it('should set and get values', () => {
    const form = createForm(options)

    form.setValue('email', 'test@example.com')

    expect(form.getValues('email')).toBe('test@example.com')
    expect(form.getValues()).toEqual({
      email: 'test@example.com',
      password: '',
    })
  })

  it('should set multiple values', () => {
    const form = createForm(options)

    form.setValues({
      email: 'test@example.com',
      password: 'secret123',
    })

    expect(form.getValues()).toEqual({
      email: 'test@example.com',
      password: 'secret123',
    })
  })

  it('should handle validation errors', async () => {
    const form = createForm(options)

    form.register('email', {
      required: 'Email is required',
    })

    const isValid = await form.validate()

    expect(isValid).toBe(false)
    expect(form.getError('email')).toBe('Email is required')
  })

  it('should clear errors', async () => {
    const form = createForm(options)

    form.register('email', { required: 'Email is required' })
    await form.validate()

    expect(form.getError('email')).toBe('Email is required')

    form.clearError('email')
    expect(form.getError('email')).toBeUndefined()
  })

  it('should clear all errors', async () => {
    const form = createForm(options)

    form.register('email', { required: 'Email is required' })
    form.register('password', { required: 'Password is required' })
    await form.validate()

    expect(form.getErrors()).toHaveProperty('email')
    expect(form.getErrors()).toHaveProperty('password')

    form.clearErrors()
    expect(form.getErrors()).toEqual({})
  })

  it('should track touched fields', () => {
    const form = createForm(options)

    expect(form.isTouched('email')).toBe(false)

    form.setTouched('email', true)

    expect(form.isTouched('email')).toBe(true)
    expect(form.getTouched()).toHaveProperty('email', true)
  })

  it('should track dirty fields', () => {
    const form = createForm(options)

    expect(form.isDirty('email')).toBe(false)

    form.setValue('email', 'test@example.com')

    expect(form.isDirty('email')).toBe(true)
  })

  it('should reset form', () => {
    const form = createForm(options)

    form.setValue('email', 'test@example.com')
    form.setTouched('email', true)

    form.reset()

    expect(form.getValues()).toEqual({ email: '', password: '' })
    expect(form.isTouched('email')).toBe(false)
  })

  it('should reset to new values', () => {
    const form = createForm(options)

    form.reset({ email: 'new@example.com', password: 'newpass' })

    expect(form.getValues()).toEqual({
      email: 'new@example.com',
      password: 'newpass',
    })
  })

  it('should reset individual field', () => {
    const form = createForm(options)

    form.setValue('email', 'test@example.com')
    form.setValue('password', 'secret')

    form.resetField('email')

    expect(form.getValues('email')).toBe('')
    expect(form.getValues('password')).toBe('secret')
  })

  it('should handle submit', async () => {
    const onSubmit = vi.fn()
    const form = createForm({
      initialValues: { email: '' },
      onSubmit,
    })

    form.setValue('email', 'test@example.com')

    await form.submit()

    expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' })
  })

  it('should track submit state', async () => {
    const onSubmit = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    const form = createForm({
      initialValues: { email: '' },
      onSubmit,
    })

    expect(form.isSubmitting()).toBe(false)

    const submitPromise = form.submit()
    expect(form.isSubmitting()).toBe(true)

    await submitPromise
    expect(form.isSubmitting()).toBe(false)
    expect(form.isSubmitSuccessful()).toBe(true)
  })

  it('should track submit count', async () => {
    const form = createForm(options)

    expect(form.getSubmitCount()).toBe(0)

    await form.submit()
    expect(form.getSubmitCount()).toBe(1)

    await form.submit()
    expect(form.getSubmitCount()).toBe(2)
  })

  it('should emit events', () => {
    const form = createForm(options)
    const handler = vi.fn()

    form.on('change', handler)

    form.emit({
      type: 'change',
      name: 'email',
      value: 'test@example.com',
      prevValue: '',
    })

    expect(handler).toHaveBeenCalled()
  })

  it('should unsubscribe from events', () => {
    const form = createForm(options)
    const handler = vi.fn()

    const unsubscribe = form.on('change', handler)
    unsubscribe()

    form.emit({
      type: 'change',
      name: 'email',
      value: 'test@example.com',
      prevValue: '',
    })

    expect(handler).not.toHaveBeenCalled()
  })

  it('should watch field changes', () => {
    const form = createForm(options)
    const callback = vi.fn()

    form.watch('email', callback)
    form.setValue('email', 'test@example.com')

    expect(callback).toHaveBeenCalledWith('test@example.com', '')
  })

  it('should watch all changes', () => {
    const form = createForm(options)
    const callback = vi.fn()

    form.watch(callback)
    form.setValue('email', 'test@example.com')

    expect(callback).toHaveBeenCalled()
  })

  it('should manage plugins', () => {
    const form = createForm(options)

    const plugins = form.listPlugins()
    expect(plugins.length).toBeGreaterThan(0)

    // Core plugins should be installed
    expect(plugins.some((p) => p.name === 'field-registry')).toBe(true)
    expect(plugins.some((p) => p.name === 'state-manager')).toBe(true)
  })

  it('should unregister fields', () => {
    const form = createForm(options)

    form.register('email')
    form.setValue('email', 'test@example.com')

    form.unregister('email')

    // Field should still exist in values but registration is removed
    expect(form.getValues('email')).toBe('test@example.com')
  })

  it('should destroy form', () => {
    const form = createForm(options)

    expect(() => form.destroy()).not.toThrow()
  })

  it('should get form options', () => {
    const form = createForm(options)

    expect(form.getOptions()).toEqual(options)
  })

  it('should validate form successfully', async () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.register('email', {
      required: 'Email is required',
    })

    form.setValue('email', 'test@example.com')

    const isValid = await form.validate()

    expect(isValid).toBe(true)
    expect(form.isValid()).toBe(true)
  })

  it('should validate individual field', async () => {
    const form = createForm(options)

    form.register('email', {
      required: 'Email is required',
    })

    const isValid = await form.validateField('email')

    expect(isValid).toBe(false)
    expect(form.getError('email')).toBe('Email is required')
  })

  it('should handle async validation', async () => {
    const form = createForm({
      initialValues: { username: '' },
      onSubmit: vi.fn(),
    })

    form.register('username', {
      validate: async (value) => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return value === 'admin' ? 'Username taken' : undefined
      },
    })

    form.setValue('username', 'admin')

    expect(form.isValidating()).toBe(false)

    const validatePromise = form.validate()
    expect(form.isValidating()).toBe(true)

    await validatePromise

    expect(form.isValidating()).toBe(false)
    expect(form.getError('username')).toBe('Username taken')
  })

  it('should set errors manually', () => {
    const form = createForm(options)

    form.setError('email', 'Custom error')

    expect(form.getError('email')).toBe('Custom error')
    expect(form.isValid()).toBe(false)
  })

  it('should handle form with no initial values', () => {
    const form = createForm({
      initialValues: {},
      onSubmit: vi.fn(),
    })

    expect(form.getValues()).toEqual({})
  })
})
