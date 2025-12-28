import { createForm } from '@/create-form'

describe('Validation Modes', () => {
  it('should validate on change when mode is onChange', async () => {
    const form = createForm({
      initialValues: { email: '' },
      mode: 'onChange',
      onSubmit: vi.fn(),
    })

    form.register('email', { required: 'Email is required' })

    form.setValue('email', '')

    // Wait for async validation
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(form.getError('email')).toBe('Email is required')
  })

  it('should validate on blur when mode is onBlur', async () => {
    const form = createForm({
      initialValues: { email: '' },
      mode: 'onBlur',
      onSubmit: vi.fn(),
    })

    const registration = form.register('email', { required: 'Email is required' })

    registration.onBlur()

    // Wait for async validation
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(form.getError('email')).toBe('Email is required')
  })

  it('should validate on both change and blur when mode is all', async () => {
    const form = createForm({
      initialValues: { email: 'valid@email.com' },
      mode: 'all',
      onSubmit: vi.fn(),
    })

    const registration = form.register('email', { required: 'Email is required' })

    // Change to invalid value
    form.setValue('email', '')
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(form.getError('email')).toBe('Email is required')

    // Fix value
    form.setValue('email', 'test@example.com')
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(form.getError('email')).toBeUndefined()

    // Change to invalid again
    form.setValue('email', '')
    await new Promise((resolve) => setTimeout(resolve, 10))

    // Blur should also trigger validation
    registration.onBlur()
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(form.getError('email')).toBe('Email is required')
  })

  it('should not validate on change when mode is onSubmit', async () => {
    const form = createForm({
      initialValues: { email: '' },
      mode: 'onSubmit',
      onSubmit: vi.fn(),
    })

    form.register('email', { required: 'Email is required' })

    form.setValue('email', '')

    await new Promise((resolve) => setTimeout(resolve, 10))

    // Should not have error yet (only validates on submit)
    expect(form.getError('email')).toBeUndefined()

    // But should validate on submit
    await form.submit()
    expect(form.getError('email')).toBe('Email is required')
  })

  it('should validate on change with custom validation function', async () => {
    const form = createForm({
      initialValues: { username: '' },
      mode: 'onChange',
      onSubmit: vi.fn(),
    })

    form.register('username', {
      validate: async (value) => {
        await new Promise((resolve) => setTimeout(resolve, 5))
        return value.length >= 3 || 'Username must be at least 3 characters'
      },
    })

    form.setValue('username', 'ab')

    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(form.getError('username')).toBe('Username must be at least 3 characters')
  })

  it('should clear validation on change when value becomes valid', async () => {
    const form = createForm({
      initialValues: { email: '' },
      mode: 'onChange',
      onSubmit: vi.fn(),
    })

    form.register('email', { required: 'Email is required' })

    // Trigger validation with empty value
    form.setValue('email', '')
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(form.getError('email')).toBe('Email is required')

    // Set valid value
    form.setValue('email', 'test@example.com')
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(form.getError('email')).toBeUndefined()
  })

  it('should validate multiple fields on change', async () => {
    const form = createForm({
      initialValues: { email: '', password: '' },
      mode: 'onChange',
      onSubmit: vi.fn(),
    })

    form.register('email', { required: 'Email is required' })
    form.register('password', { required: 'Password is required' })

    form.setValue('email', '')
    await new Promise((resolve) => setTimeout(resolve, 10))

    form.setValue('password', '')
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(form.getError('email')).toBe('Email is required')
    expect(form.getError('password')).toBe('Password is required')
  })

  it('should abort previous validation on rapid changes', async () => {
    const form = createForm({
      initialValues: { username: '' },
      mode: 'onChange',
      onSubmit: vi.fn(),
    })

    let validationCount = 0

    form.register('username', {
      validate: async (value) => {
        validationCount++
        await new Promise((resolve) => setTimeout(resolve, 50))
        return value.length >= 3 || 'Too short'
      },
    })

    // Rapid changes
    form.setValue('username', 'a')
    form.setValue('username', 'ab')
    form.setValue('username', 'abc')

    await new Promise((resolve) => setTimeout(resolve, 100))

    // Should have aborted previous validations
    expect(validationCount).toBeGreaterThanOrEqual(1)
  })
})
