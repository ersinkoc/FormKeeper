import { createForm } from '@/create-form'

describe('Field Event Handling', () => {
  it('should handle text input onChange', () => {
    const changeHandler = vi.fn()

    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.on('change', changeHandler)

    const registration = form.register('email')

    const event = {
      target: {
        type: 'text',
        value: 'test@example.com',
      },
    }

    registration.onChange(event)

    expect(changeHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'email',
        value: 'test@example.com',
      })
    )
  })

  it('should handle checkbox input onChange', () => {
    const changeHandler = vi.fn()

    const form = createForm({
      initialValues: { agree: false },
      onSubmit: vi.fn(),
    })

    form.on('change', changeHandler)

    const registration = form.register('agree')

    const event = {
      target: {
        type: 'checkbox',
        checked: true,
      },
    }

    registration.onChange(event)

    expect(changeHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'agree',
        value: true,
      })
    )
  })

  it('should handle number input onChange', () => {
    const changeHandler = vi.fn()

    const form = createForm({
      initialValues: { age: 0 },
      onSubmit: vi.fn(),
    })

    form.on('change', changeHandler)

    const registration = form.register('age')

    const event = {
      target: {
        type: 'number',
        valueAsNumber: 25,
      },
    }

    registration.onChange(event)

    expect(changeHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'age',
        value: 25,
      })
    )
  })

  it('should handle range input onChange', () => {
    const changeHandler = vi.fn()

    const form = createForm({
      initialValues: { volume: 50 },
      onSubmit: vi.fn(),
    })

    form.on('change', changeHandler)

    const registration = form.register('volume')

    const event = {
      target: {
        type: 'range',
        valueAsNumber: 75,
      },
    }

    registration.onChange(event)

    expect(changeHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'volume',
        value: 75,
      })
    )
  })

  it('should handle file input onChange', () => {
    const changeHandler = vi.fn()

    const form = createForm({
      initialValues: { document: null },
      onSubmit: vi.fn(),
    })

    form.on('change', changeHandler)

    const registration = form.register('document')

    const mockFiles = { length: 1 } as any

    const event = {
      target: {
        type: 'file',
        files: mockFiles,
      },
    }

    registration.onChange(event)

    expect(changeHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'document',
        value: mockFiles,
      })
    )
  })

  it('should handle direct value in onChange', () => {
    const changeHandler = vi.fn()

    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.on('change', changeHandler)

    const registration = form.register('email')

    // Controlled component passing value directly
    registration.onChange('direct-value@example.com')

    expect(changeHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'email',
        value: 'direct-value@example.com',
      })
    )
  })

  it('should emit onChange event with prev value', () => {
    const changeHandler = vi.fn()

    const form = createForm({
      initialValues: { email: 'old@example.com' },
      onSubmit: vi.fn(),
    })

    const registration = form.register('email')

    // First change
    registration.onChange('first@example.com')

    form.on('change', changeHandler)

    // Second change
    registration.onChange('second@example.com')

    expect(changeHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'second@example.com',
        prevValue: 'first@example.com',
      })
    )
  })

  it('should handle onBlur event', () => {
    const blurHandler = vi.fn()

    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.on('blur', blurHandler)

    const registration = form.register('email')

    registration.onBlur()

    expect(blurHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'email',
      })
    )
  })

  it('should handle onFocus event', () => {
    const focusHandler = vi.fn()

    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.on('focus', focusHandler)

    const registration = form.register('email')

    registration.onFocus()

    expect(focusHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'email',
      })
    )
  })

  it('should emit register event on field registration', () => {
    const registerHandler = vi.fn()

    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.on('register', registerHandler)

    form.register('email', { required: 'Required' })

    expect(registerHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'email',
        rules: { required: 'Required' },
      })
    )
  })

  it('should emit unregister event on field unregistration', () => {
    const unregisterHandler = vi.fn()

    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.register('email')

    form.on('unregister', unregisterHandler)

    form.unregister('email')

    expect(unregisterHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'email',
      })
    )
  })

  it('should handle ref callback', () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    const registration = form.register('email')

    const element = document.createElement('input')

    registration.ref(element)

    expect(form.getPlugin('field-registry')).toBeDefined()
  })

  it('should handle null ref', () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    const registration = form.register('email')

    registration.ref(null)

    // Should not throw
    expect(true).toBe(true)
  })

  it('should handle multiple onChange events', () => {
    const changeHandler = vi.fn()

    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    form.on('change', changeHandler)

    const registration = form.register('email')

    registration.onChange('first@example.com')
    registration.onChange('second@example.com')
    registration.onChange('third@example.com')

    expect(changeHandler).toHaveBeenCalledTimes(3)
  })

  it('should handle onChange without event object', () => {
    const changeHandler = vi.fn()

    const form = createForm({
      initialValues: { count: 0 },
      onSubmit: vi.fn(),
    })

    form.on('change', changeHandler)

    const registration = form.register('count')

    // Pass a number directly
    registration.onChange(42)

    expect(changeHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 42,
      })
    )
  })

  it('should handle onChange with undefined value', () => {
    const changeHandler = vi.fn()

    const form = createForm({
      initialValues: { optional: 'value' },
      onSubmit: vi.fn(),
    })

    form.on('change', changeHandler)

    const registration = form.register('optional')

    registration.onChange(undefined)

    expect(changeHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        value: undefined,
      })
    )
  })

  it('should handle onChange with null value', () => {
    const changeHandler = vi.fn()

    const form = createForm({
      initialValues: { nullable: 'value' },
      onSubmit: vi.fn(),
    })

    form.on('change', changeHandler)

    const registration = form.register('nullable')

    registration.onChange(null)

    expect(changeHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        value: null,
      })
    )
  })
})
