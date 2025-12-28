import { createForm } from '@/create-form'

describe('State Manager Edge Cases', () => {
  it('should check if specific field is dirty', () => {
    const form = createForm({
      initialValues: { email: '', password: '' },
      onSubmit: vi.fn(),
    })

    form.setValue('email', 'test@example.com')

    expect(form.isDirty('email')).toBe(true)
    expect(form.isDirty('password')).toBe(false)
  })

  it('should check if any field is dirty', () => {
    const form = createForm({
      initialValues: { email: '', password: '', username: '' },
      onSubmit: vi.fn(),
    })

    expect(form.isDirty()).toBe(false)

    form.setValue('username', 'john')

    expect(form.isDirty()).toBe(true)
  })

  it('should handle nested dirty state', () => {
    const form = createForm({
      initialValues: {
        user: {
          profile: {
            email: '',
            name: '',
          },
        },
      },
      onSubmit: vi.fn(),
    })

    form.setValue('user.profile.email', 'test@example.com')

    expect(form.isDirty('user.profile.email')).toBe(true)
    expect(form.isDirty()).toBe(true)
  })

  it('should handle deeply nested dirty checking', () => {
    const form = createForm({
      initialValues: {
        level1: {
          level2: {
            level3: {
              value: '',
            },
          },
        },
      },
      onSubmit: vi.fn(),
    })

    form.setValue('level1.level2.level3.value', 'changed')

    expect(form.isDirty()).toBe(true)
  })

  it('should reset keeps correct state with multiple options', () => {
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit: vi.fn(),
    })

    form.setValue('email', 'changed@example.com')
    form.setTouched('email', true)

    form.reset(undefined, { keepValues: true, keepTouched: true })

    expect(form.getValues()).toEqual({ email: 'changed@example.com' })
    expect(form.isTouched('email')).toBe(true)
    expect(form.isDirty()).toBe(false)
  })

  it('should reset field with keepValues option', () => {
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit: vi.fn(),
    })

    form.setValue('email', 'changed@example.com')

    form.resetField('email', { keepValues: true })

    expect(form.getValues('email')).toBe('changed@example.com')
  })

  it('should reset field with keepTouched option', () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.setTouched('email', true)

    form.resetField('email', { keepTouched: true })

    expect(form.isTouched('email')).toBe(true)
  })

  it('should reset field with keepDirty option', () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.setValue('email', 'test@example.com')

    form.resetField('email', { keepDirty: true })

    expect(form.isDirty('email')).toBe(true)
  })

  it('should handle setValue with shouldTouch option', () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.setValue('email', 'test@example.com', { shouldTouch: true })

    expect(form.isTouched('email')).toBe(true)
  })

  it('should handle setValues for multiple fields', () => {
    const form = createForm({
      initialValues: { email: '', password: '', username: '' },
      onSubmit: vi.fn(),
    })

    form.setValues({
      email: 'test@example.com',
      username: 'john',
    })

    expect(form.getValues('email')).toBe('test@example.com')
    expect(form.getValues('username')).toBe('john')
    expect(form.getValues('password')).toBe('')
  })

  it('should handle setValues with options', () => {
    const form = createForm({
      initialValues: { email: '', password: '' },
      onSubmit: vi.fn(),
    })

    form.setValues(
      {
        email: 'test@example.com',
        password: 'secret',
      },
      { shouldTouch: true }
    )

    expect(form.isTouched('email')).toBe(true)
    expect(form.isTouched('password')).toBe(true)
  })

  it('should skip undefined values in setValues', () => {
    const form = createForm({
      initialValues: { email: 'original@example.com', password: 'original' },
      onSubmit: vi.fn(),
    })

    form.setValues({
      email: undefined,
      password: 'changed',
    })

    expect(form.getValues('email')).toBe('original@example.com')
    expect(form.getValues('password')).toBe('changed')
  })

  it('should handle null values', () => {
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit: vi.fn(),
    })

    form.setValue('email', null as any)

    expect(form.getValues('email')).toBe(null)
  })

  it('should handle undefined values', () => {
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit: vi.fn(),
    })

    form.setValue('email', undefined as any)

    expect(form.getValues('email')).toBe(undefined)
  })

  it('should reset to new values and update defaults', () => {
    const form = createForm({
      initialValues: { email: 'old@example.com' },
      onSubmit: vi.fn(),
    })

    form.setValue('email', 'changed@example.com')

    form.reset({ email: 'new@example.com' })

    expect(form.getValues('email')).toBe('new@example.com')
    expect(form.isDirty('email')).toBe(false)
  })

  it('should handle reset with keepDefaultValues option', () => {
    const form = createForm({
      initialValues: { email: 'original@example.com' },
      onSubmit: vi.fn(),
    })

    form.reset({ email: 'new@example.com' }, { keepDefaultValues: true })

    expect(form.getValues('email')).toBe('new@example.com')

    // Reset again without values should go back to original defaults
    form.reset()

    expect(form.getValues('email')).toBe('original@example.com')
  })

  it('should handle array field dirty state', () => {
    const form = createForm({
      initialValues: { items: ['a', 'b'] },
      onSubmit: vi.fn(),
    })

    form.setValue('items[0]', 'changed')

    expect(form.isDirty()).toBe(true)
  })

  it('should track touched state for nested fields', () => {
    const form = createForm({
      initialValues: {
        user: {
          address: {
            street: '',
          },
        },
      },
      onSubmit: vi.fn(),
    })

    form.setTouched('user.address.street', true)

    expect(form.isTouched('user.address.street')).toBe(true)
  })

  it('should handle empty object dirty state', () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    expect(form.isDirty()).toBe(false)
    expect(form.getDirty()).toEqual({})
  })
})
