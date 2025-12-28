import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useForm } from '@/adapters/react/use-form'

describe('useForm', () => {
  it('should create a form instance', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '' },
        onSubmit: vi.fn(),
      })
    )

    expect(result.current).toBeDefined()
    expect(typeof result.current.register).toBe('function')
    expect(result.current.formState).toBeDefined()
  })

  it('should have initial form state', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '', password: '' },
        onSubmit: vi.fn(),
      })
    )

    expect(result.current.formState.values).toEqual({
      email: '',
      password: '',
    })
    expect(result.current.formState.errors).toEqual({})
    expect(result.current.formState.isValid).toBe(true)
    expect(result.current.formState.isSubmitting).toBe(false)
  })

  it('should update form state on value change', async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '' },
        onSubmit: vi.fn(),
      })
    )

    act(() => {
      result.current.setValue('email', 'test@example.com')
    })

    await waitFor(() => {
      expect(result.current.formState.values.email).toBe('test@example.com')
    })
  })

  it('should update form state on validation', async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '' },
        onSubmit: vi.fn(),
      })
    )

    act(() => {
      result.current.register('email', {
        required: 'Email is required',
      })
    })

    await act(async () => {
      await result.current.validate()
    })

    await waitFor(() => {
      expect(result.current.formState.isValid).toBe(false)
      expect(result.current.formState.errors.email).toBe('Email is required')
    })
  })

  it('should update form state on submit', async () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: 'test@example.com' },
        onSubmit,
      })
    )

    await act(async () => {
      await result.current.submit()
    })

    await waitFor(() => {
      expect(result.current.formState.isSubmitSuccessful).toBe(true)
      expect(result.current.formState.submitCount).toBe(1)
    })
  })

  it('should track submitting state', async () => {
    const onSubmit = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '' },
        onSubmit,
      })
    )

    expect(result.current.formState.isSubmitting).toBe(false)

    act(() => {
      result.current.submit()
    })

    await waitFor(() => {
      expect(result.current.formState.isSubmitting).toBe(true)
    })

    await waitFor(
      () => {
        expect(result.current.formState.isSubmitting).toBe(false)
      },
      { timeout: 200 }
    )
  })

  it('should cleanup on unmount', () => {
    const { result, unmount } = renderHook(() =>
      useForm({
        initialValues: { email: '' },
        onSubmit: vi.fn(),
      })
    )

    const destroySpy = vi.spyOn(result.current, 'destroy')

    unmount()

    expect(destroySpy).toHaveBeenCalled()
  })

  it('should preserve form instance across re-renders', () => {
    const { result, rerender } = renderHook(() =>
      useForm({
        initialValues: { email: '' },
        onSubmit: vi.fn(),
      })
    )

    const firstInstance = result.current

    rerender()

    expect(result.current).toBe(firstInstance)
  })

  it('should handle field registration', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '' },
        onSubmit: vi.fn(),
      })
    )

    act(() => {
      const registration = result.current.register('email', {
        required: 'Email is required',
      })

      expect(registration).toBeDefined()
      expect(typeof registration.onChange).toBe('function')
      expect(typeof registration.onBlur).toBe('function')
    })
  })

  it('should handle reset', async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '' },
        onSubmit: vi.fn(),
      })
    )

    act(() => {
      result.current.setValue('email', 'test@example.com')
    })

    await waitFor(() => {
      expect(result.current.formState.values.email).toBe('test@example.com')
    })

    act(() => {
      result.current.reset()
    })

    await waitFor(() => {
      expect(result.current.formState.values.email).toBe('')
    })
  })

  it('should handle validation mode', async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '' },
        validationMode: 'onChange',
        onSubmit: vi.fn(),
      })
    )

    act(() => {
      result.current.register('email', {
        required: 'Email is required',
      })
    })

    // Validation should trigger automatically on change in onChange mode
    act(() => {
      result.current.setValue('email', 'test')
    })

    await waitFor(() => {
      expect(result.current.formState.isValid).toBe(true)
    })
  })

  it('should expose all form methods', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '' },
        onSubmit: vi.fn(),
      })
    )

    // Check that all methods are available
    expect(typeof result.current.register).toBe('function')
    expect(typeof result.current.unregister).toBe('function')
    expect(typeof result.current.getValues).toBe('function')
    expect(typeof result.current.setValue).toBe('function')
    expect(typeof result.current.setValues).toBe('function')
    expect(typeof result.current.getErrors).toBe('function')
    expect(typeof result.current.setError).toBe('function')
    expect(typeof result.current.clearError).toBe('function')
    expect(typeof result.current.clearErrors).toBe('function')
    expect(typeof result.current.validate).toBe('function')
    expect(typeof result.current.validateField).toBe('function')
    expect(typeof result.current.submit).toBe('function')
    expect(typeof result.current.handleSubmit).toBe('function')
    expect(typeof result.current.reset).toBe('function')
    expect(typeof result.current.watch).toBe('function')
  })

  it('should handle touched state', async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '' },
        onSubmit: vi.fn(),
      })
    )

    act(() => {
      result.current.setTouched('email', true)
    })

    await waitFor(() => {
      expect(result.current.formState.touched.email).toBe(true)
    })
  })

  it('should handle dirty state', async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '' },
        onSubmit: vi.fn(),
      })
    )

    expect(result.current.formState.dirty).toEqual({})

    act(() => {
      result.current.setValue('email', 'test@example.com')
    })

    await waitFor(() => {
      expect(result.current.formState.dirty.email).toBe(true)
    })
  })
})
