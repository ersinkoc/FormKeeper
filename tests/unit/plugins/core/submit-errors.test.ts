import { createForm } from '@/create-form'

describe('Submit Error Handling', () => {
  it('should call onError when validation fails', async () => {
    const onError = vi.fn()

    const form = createForm({
      initialValues: { email: '', password: '' },
      onSubmit: vi.fn(),
      onError,
    })

    form.register('email', { required: 'Email is required' })
    form.register('password', { required: 'Password is required' })

    await form.submit()

    expect(onError).toHaveBeenCalledWith({
      email: 'Email is required',
      password: 'Password is required',
    })
  })

  it('should focus first error field when shouldFocusError is true', async () => {
    const form = createForm({
      initialValues: { email: '', password: '' },
      onSubmit: vi.fn(),
      shouldFocusError: true,
    })

    // Create mock elements
    const emailElement = document.createElement('input')
    const passwordElement = document.createElement('input')

    emailElement.focus = vi.fn()
    passwordElement.focus = vi.fn()
    emailElement.scrollIntoView = vi.fn()

    const emailReg = form.register('email', { required: 'Email is required' })
    const passwordReg = form.register('password', { required: 'Password is required' })

    emailReg.ref(emailElement)
    passwordReg.ref(passwordElement)

    await form.submit()

    expect(emailElement.focus).toHaveBeenCalled()
    expect(emailElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    })
  })

  it('should not focus when shouldFocusError is false', async () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
      shouldFocusError: false,
    })

    const emailElement = document.createElement('input')
    emailElement.focus = vi.fn()

    const emailReg = form.register('email', { required: 'Email is required' })
    emailReg.ref(emailElement)

    await form.submit()

    expect(emailElement.focus).not.toHaveBeenCalled()
  })

  it('should focus first error in nested object', async () => {
    const form = createForm({
      initialValues: {
        user: {
          profile: {
            email: '',
          },
        },
      },
      onSubmit: vi.fn(),
      shouldFocusError: true,
    })

    const emailElement = document.createElement('input')
    emailElement.focus = vi.fn()
    emailElement.scrollIntoView = vi.fn()

    const registration = form.register('user.profile.email', { required: 'Email is required' })
    registration.ref(emailElement)

    await form.submit()

    expect(emailElement.focus).toHaveBeenCalled()
  })

  it('should handle missing element ref gracefully', async () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
      shouldFocusError: true,
    })

    form.register('email', { required: 'Email is required' })

    // Don't set ref, should not throw error
    await expect(form.submit()).resolves.not.toThrow()
  })

  it('should handle element without focus method', async () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
      shouldFocusError: true,
    })

    const emailElement = document.createElement('div') // div doesn't have focus
    const registration = form.register('email', { required: 'Email is required' })
    registration.ref(emailElement as any)

    await expect(form.submit()).resolves.not.toThrow()
  })

  it('should handle element without scrollIntoView method', async () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
      shouldFocusError: true,
    })

    const emailElement = {
      focus: vi.fn(),
      // no scrollIntoView
    } as any

    const registration = form.register('email', { required: 'Email is required' })
    registration.ref(emailElement)

    await form.submit()

    expect(emailElement.focus).toHaveBeenCalled()
  })

  it('should emit submit-error event', async () => {
    const errorHandler = vi.fn()

    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.on('submit-error', errorHandler)
    form.register('email', { required: 'Email is required' })

    await form.submit()

    expect(errorHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: { email: 'Email is required' },
      })
    )
  })

  it('should not call onSubmit when validation fails', async () => {
    const onSubmit = vi.fn()

    const form = createForm({
      initialValues: { email: '' },
      onSubmit,
    })

    form.register('email', { required: 'Email is required' })

    await form.submit()

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should handle submit with async validation errors', async () => {
    const onError = vi.fn()

    const form = createForm({
      initialValues: { username: 'taken' },
      onSubmit: vi.fn(),
      onError,
    })

    form.register('username', {
      validate: async (value) => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return value !== 'taken' || 'Username is taken'
      },
    })

    await form.submit()

    expect(onError).toHaveBeenCalledWith({
      username: 'Username is taken',
    })
  })

  it('should handle multiple nested errors', async () => {
    const onError = vi.fn()

    const form = createForm({
      initialValues: {
        user: {
          profile: {
            email: '',
            phone: '',
          },
        },
      },
      onSubmit: vi.fn(),
      onError,
      shouldFocusError: true,
    })

    const emailElement = document.createElement('input')
    emailElement.focus = vi.fn()
    emailElement.scrollIntoView = vi.fn()

    const emailReg = form.register('user.profile.email', { required: 'Email is required' })
    form.register('user.profile.phone', { required: 'Phone is required' })

    emailReg.ref(emailElement)

    await form.submit()

    expect(onError).toHaveBeenCalled()
    expect(emailElement.focus).toHaveBeenCalled()
  })

  it('should handle array field errors', async () => {
    const onError = vi.fn()

    const form = createForm({
      initialValues: {
        items: [{ name: '' }, { name: 'valid' }],
      },
      onSubmit: vi.fn(),
      onError,
    })

    form.register('items[0].name', { required: 'Name is required' })

    await form.submit()

    expect(onError).toHaveBeenCalled()
  })
})
