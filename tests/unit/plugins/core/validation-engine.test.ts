import { createForm } from '@/create-form'

describe('Validation Engine Plugin', () => {
  it('should validate required field', async () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.register('email', { required: 'Email is required' })
    const isValid = await form.validate()

    expect(isValid).toBe(false)
    expect(form.getError('email')).toBe('Email is required')
  })

  it('should pass required validation when field has value', async () => {
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit: vi.fn(),
    })

    form.register('email', { required: 'Email is required' })
    const isValid = await form.validate()

    expect(isValid).toBe(true)
  })

  it('should validate minLength', async () => {
    const form = createForm({
      initialValues: { password: '123' },
      onSubmit: vi.fn(),
    })

    form.register('password', {
      minLength: { value: 8, message: 'Too short' },
    })

    const isValid = await form.validate()

    expect(isValid).toBe(false)
    expect(form.getError('password')).toBe('Too short')
  })

  it('should validate maxLength', async () => {
    const form = createForm({
      initialValues: { username: '12345678901' },
      onSubmit: vi.fn(),
    })

    form.register('username', {
      maxLength: { value: 10, message: 'Too long' },
    })

    const isValid = await form.validate()

    expect(isValid).toBe(false)
    expect(form.getError('username')).toBe('Too long')
  })

  it('should validate min value', async () => {
    const form = createForm({
      initialValues: { age: 5 },
      onSubmit: vi.fn(),
    })

    form.register('age', {
      min: { value: 18, message: 'Must be at least 18' },
    })

    const isValid = await form.validate()

    expect(isValid).toBe(false)
    expect(form.getError('age')).toBe('Must be at least 18')
  })

  it('should validate max value', async () => {
    const form = createForm({
      initialValues: { score: 150 },
      onSubmit: vi.fn(),
    })

    form.register('score', {
      max: { value: 100, message: 'Cannot exceed 100' },
    })

    const isValid = await form.validate()

    expect(isValid).toBe(false)
    expect(form.getError('score')).toBe('Cannot exceed 100')
  })

  it('should validate pattern', async () => {
    const form = createForm({
      initialValues: { email: 'invalid-email' },
      onSubmit: vi.fn(),
    })

    form.register('email', {
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Invalid email',
      },
    })

    const isValid = await form.validate()

    expect(isValid).toBe(false)
    expect(form.getError('email')).toBe('Invalid email')
  })

  it('should validate with custom function', async () => {
    const form = createForm({
      initialValues: { password: 'weak' },
      onSubmit: vi.fn(),
    })

    form.register('password', {
      validate: (value) => {
        return value.length >= 8 || 'Password must be at least 8 characters'
      },
    })

    const isValid = await form.validate()

    expect(isValid).toBe(false)
    expect(form.getError('password')).toBe('Password must be at least 8 characters')
  })

  it('should validate with async custom function', async () => {
    const form = createForm({
      initialValues: { username: 'taken' },
      onSubmit: vi.fn(),
    })

    form.register('username', {
      validate: async (value) => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return value !== 'taken' || 'Username already taken'
      },
    })

    const isValid = await form.validate()

    expect(isValid).toBe(false)
    expect(form.getError('username')).toBe('Username already taken')
  })

  it('should clear error when field becomes valid', async () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.register('email', { required: 'Email is required' })

    await form.validate()
    expect(form.getError('email')).toBe('Email is required')

    form.setValue('email', 'test@example.com')
    await form.validate()

    expect(form.getError('email')).toBeUndefined()
  })

  it('should validate specific field only', async () => {
    const form = createForm({
      initialValues: { email: '', password: '' },
      onSubmit: vi.fn(),
    })

    form.register('email', { required: 'Email is required' })
    form.register('password', { required: 'Password is required' })

    await form.validateField('email')

    expect(form.getError('email')).toBe('Email is required')
    expect(form.getError('password')).toBeUndefined()
  })

  it('should validate all fields', async () => {
    const form = createForm({
      initialValues: { email: '', password: '' },
      onSubmit: vi.fn(),
    })

    form.register('email', { required: 'Email is required' })
    form.register('password', { required: 'Password is required' })

    const isValid = await form.validate()

    expect(isValid).toBe(false)
    expect(form.getError('email')).toBe('Email is required')
    expect(form.getError('password')).toBe('Password is required')
  })

  it('should return true when form is valid', async () => {
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit: vi.fn(),
    })

    form.register('email', { required: 'Email is required' })

    const isValid = await form.validate()

    expect(isValid).toBe(true)
  })

  it('should get all errors', async () => {
    const form = createForm({
      initialValues: { email: '', password: '' },
      onSubmit: vi.fn(),
    })

    form.register('email', { required: 'Email is required' })
    form.register('password', { required: 'Password is required' })

    await form.validate()

    const errors = form.getErrors()
    expect(errors).toHaveProperty('email', 'Email is required')
    expect(errors).toHaveProperty('password', 'Password is required')
  })

  it('should set custom error', () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.setError('email', 'Custom error')

    expect(form.getError('email')).toBe('Custom error')
    expect(form.isValid()).toBe(false)
  })

  it('should clear specific error', () => {
    const form = createForm({
      initialValues: { email: '', password: '' },
      onSubmit: vi.fn(),
    })

    form.setError('email', 'Email error')
    form.setError('password', 'Password error')

    form.clearError('email')

    expect(form.getError('email')).toBeUndefined()
    expect(form.getError('password')).toBe('Password error')
  })

  it('should clear all errors', () => {
    const form = createForm({
      initialValues: { email: '', password: '' },
      onSubmit: vi.fn(),
    })

    form.setError('email', 'Email error')
    form.setError('password', 'Password error')

    form.clearErrors()

    expect(form.getErrors()).toEqual({})
    expect(form.isValid()).toBe(true)
  })

  it('should check if form is valid', async () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    expect(form.isValid()).toBe(true)

    form.setError('email', 'Error')

    expect(form.isValid()).toBe(false)

    form.clearErrors()

    expect(form.isValid()).toBe(true)
  })

  it('should handle multiple validation rules', async () => {
    const form = createForm({
      initialValues: { password: 'abc' },
      onSubmit: vi.fn(),
    })

    form.register('password', {
      required: 'Password is required',
      minLength: { value: 8, message: 'Too short' },
      pattern: { value: /[A-Z]/, message: 'Must contain uppercase' },
    })

    const isValid = await form.validate()

    expect(isValid).toBe(false)
    // Should fail on first rule that fails (minLength)
    expect(form.getError('password')).toBeDefined()
  })

  it('should handle nested field errors', async () => {
    const form = createForm({
      initialValues: {
        user: {
          profile: {
            email: '',
          },
        },
      },
      onSubmit: vi.fn(),
    })

    form.register('user.profile.email', { required: 'Email is required' })

    await form.validate()

    expect(form.getError('user.profile.email')).toBe('Email is required')
  })

  it('should emit validate event', async () => {
    const validateHandler = vi.fn()
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit: vi.fn(),
    })

    form.on('validate', validateHandler)
    form.register('email', { required: 'Required' })

    await form.validate()

    expect(validateHandler).toHaveBeenCalled()
  })

  it('should handle undefined value in required validation', async () => {
    const form = createForm({
      initialValues: { email: undefined as any },
      onSubmit: vi.fn(),
    })

    form.register('email', { required: 'Email is required' })

    const isValid = await form.validate()

    expect(isValid).toBe(false)
    expect(form.getError('email')).toBe('Email is required')
  })

  it('should handle null value in required validation', async () => {
    const form = createForm({
      initialValues: { email: null as any },
      onSubmit: vi.fn(),
    })

    form.register('email', { required: 'Email is required' })

    const isValid = await form.validate()

    expect(isValid).toBe(false)
    expect(form.getError('email')).toBe('Email is required')
  })

  it('should handle custom validation returning true', async () => {
    const form = createForm({
      initialValues: { email: 'valid@example.com' },
      onSubmit: vi.fn(),
    })

    form.register('email', {
      validate: (value) => value.includes('@') || 'Invalid email',
    })

    const isValid = await form.validate()

    expect(isValid).toBe(true)
    expect(form.getError('email')).toBeUndefined()
  })
})
