import { createForm } from '@/create-form'

describe('Submit Handler Plugin', () => {
  it('should call onSubmit when form is valid', async () => {
    const onSubmit = vi.fn()
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit,
    })

    form.register('email', { required: 'Required' })

    await form.submit()

    expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' })
  })

  it('should not call onSubmit when form is invalid', async () => {
    const onSubmit = vi.fn()
    const form = createForm({
      initialValues: { email: '' },
      onSubmit,
    })

    form.register('email', { required: 'Email is required' })

    await form.submit()

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should validate before submitting', async () => {
    const onSubmit = vi.fn()
    const form = createForm({
      initialValues: { email: '' },
      onSubmit,
    })

    form.register('email', { required: 'Email is required' })

    await form.submit()

    expect(form.getError('email')).toBe('Email is required')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should set isSubmitting during submission', async () => {
    const onSubmit = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
    })
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit,
    })

    expect(form.isSubmitting()).toBe(false)

    const submitPromise = form.submit()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(form.isSubmitting()).toBe(true)

    await submitPromise

    expect(form.isSubmitting()).toBe(false)
  })

  it('should set isSubmitSuccessful after successful submission', async () => {
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit: vi.fn(),
    })

    expect(form.isSubmitSuccessful()).toBe(false)

    await form.submit()

    expect(form.isSubmitSuccessful()).toBe(true)
  })

  it('should not set isSubmitSuccessful when validation fails', async () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.register('email', { required: 'Required' })

    await form.submit()

    expect(form.isSubmitSuccessful()).toBe(false)
  })

  it('should increment submit count', async () => {
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit: vi.fn(),
    })

    expect(form.getSubmitCount()).toBe(0)

    await form.submit()

    expect(form.getSubmitCount()).toBe(1)

    await form.submit()

    expect(form.getSubmitCount()).toBe(2)
  })

  it('should increment submit count even when validation fails', async () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.register('email', { required: 'Required' })

    await form.submit()
    await form.submit()

    expect(form.getSubmitCount()).toBe(2)
  })

  it('should call onError when validation fails', async () => {
    const onError = vi.fn()
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
      onError,
    })

    form.register('email', { required: 'Email is required' })

    await form.submit()

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'Email is required' })
    )
  })

  it('should emit submit event', async () => {
    const submitHandler = vi.fn()
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit: vi.fn(),
    })

    form.on('submit', submitHandler)

    await form.submit()

    expect(submitHandler).toHaveBeenCalled()
  })

  it('should emit submit-success event', async () => {
    const successHandler = vi.fn()
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit: vi.fn(),
    })

    form.on('submit-success', successHandler)

    await form.submit()

    expect(successHandler).toHaveBeenCalled()
  })

  it('should emit submit-error event on validation failure', async () => {
    const errorHandler = vi.fn()
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.on('submit-error', errorHandler)
    form.register('email', { required: 'Email is required' })

    await form.submit()

    expect(errorHandler).toHaveBeenCalled()
  })

  it('should handle submission with multiple fields', async () => {
    const onSubmit = vi.fn()
    const form = createForm({
      initialValues: { email: 'test@example.com', password: 'secret123' },
      onSubmit,
    })

    await form.submit()

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'secret123',
    })
  })

  it('should handleSubmit with event', async () => {
    const onSubmit = vi.fn()
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit,
    })

    const event = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as any

    await form.handleSubmit(event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(event.stopPropagation).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalled()
  })

  it('should handleSubmit without event', async () => {
    const onSubmit = vi.fn()
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit,
    })

    await form.handleSubmit()

    expect(onSubmit).toHaveBeenCalled()
  })

  it('should reset isSubmitSuccessful on new submission attempt', async () => {
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit: vi.fn(),
    })

    await form.submit()
    expect(form.isSubmitSuccessful()).toBe(true)

    // Change value to make invalid
    form.setValue('email', '')
    form.register('email', { required: 'Required' })

    await form.submit()

    expect(form.isSubmitSuccessful()).toBe(false)
  })

  it('should not submit while already submitting', async () => {
    const onSubmit = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
    })
    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit,
    })

    // Start first submission
    const promise1 = form.submit()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Try to submit again while first is in progress
    await form.submit()

    await promise1

    // Should only call once
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })
})
