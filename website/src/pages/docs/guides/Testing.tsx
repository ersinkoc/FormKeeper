import { CodeBlock } from '@/components/code/CodeBlock'

export default function Testing() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Testing</h1>
      <p className="lead">
        Best practices for testing forms built with FormKeeper using Vitest and React Testing Library.
      </p>

      <h2>Setup</h2>
      <CodeBlock language="typescript">{`// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true
  }
})

// tests/setup.ts
import '@testing-library/jest-dom'`}</CodeBlock>

      <h2>Testing Form Initialization</h2>
      <CodeBlock language="tsx">{`import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useForm, FormProvider, useField } from '@oxog/formkeeper/react'

function TestForm({ initialValues, onSubmit }) {
  const form = useForm({ initialValues, onSubmit })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit}>
        <EmailField />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  )
}

function EmailField() {
  const { register, error, touched } = useField('email')
  return (
    <div>
      <input {...register()} data-testid="email-input" />
      {touched && error && <span data-testid="email-error">{error}</span>}
    </div>
  )
}

describe('Form Initialization', () => {
  it('should render with initial values', () => {
    render(
      <TestForm
        initialValues={{ email: 'test@example.com' }}
        onSubmit={() => {}}
      />
    )

    expect(screen.getByTestId('email-input')).toHaveValue('test@example.com')
  })

  it('should render with empty values', () => {
    render(
      <TestForm
        initialValues={{ email: '' }}
        onSubmit={() => {}}
      />
    )

    expect(screen.getByTestId('email-input')).toHaveValue('')
  })
})`}</CodeBlock>

      <h2>Testing User Interactions</h2>
      <CodeBlock language="tsx">{`import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

describe('User Interactions', () => {
  it('should update field value on input', async () => {
    const user = userEvent.setup()

    render(
      <TestForm initialValues={{ email: '' }} onSubmit={() => {}} />
    )

    const input = screen.getByTestId('email-input')
    await user.type(input, 'new@example.com')

    expect(input).toHaveValue('new@example.com')
  })

  it('should show error on blur with invalid value', async () => {
    const user = userEvent.setup()

    render(
      <TestForm initialValues={{ email: '' }} onSubmit={() => {}} />
    )

    const input = screen.getByTestId('email-input')
    await user.click(input)
    await user.tab() // Blur the field

    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toBeInTheDocument()
    })
  })

  it('should clear error when valid value is entered', async () => {
    const user = userEvent.setup()

    render(
      <TestForm initialValues={{ email: '' }} onSubmit={() => {}} />
    )

    const input = screen.getByTestId('email-input')

    // Trigger error
    await user.click(input)
    await user.tab()

    // Fix the error
    await user.type(input, 'valid@email.com')
    await user.tab()

    await waitFor(() => {
      expect(screen.queryByTestId('email-error')).not.toBeInTheDocument()
    })
  })
})`}</CodeBlock>

      <h2>Testing Form Submission</h2>
      <CodeBlock language="tsx">{`describe('Form Submission', () => {
  it('should call onSubmit with form values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm
        initialValues={{ email: '' }}
        onSubmit={onSubmit}
      />
    )

    await user.type(screen.getByTestId('email-input'), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com'
      })
    })
  })

  it('should not submit when validation fails', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TestForm
        initialValues={{ email: '' }}
        onSubmit={onSubmit}
      />
    )

    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(onSubmit).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toBeInTheDocument()
    })
  })

  it('should show loading state during submission', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(
      <TestForm
        initialValues={{ email: 'test@example.com' }}
        onSubmit={onSubmit}
      />
    )

    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(screen.getByRole('button')).toBeDisabled()
  })
})`}</CodeBlock>

      <h2>Testing Validation</h2>
      <CodeBlock language="tsx">{`import { createForm } from '@oxog/formkeeper'

describe('Validation Rules', () => {
  it('should validate required field', async () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: () => {}
    })

    form.register('email', { required: 'Email is required' })
    await form.validate()

    expect(form.getError('email')).toBe('Email is required')
  })

  it('should validate pattern', async () => {
    const form = createForm({
      initialValues: { email: 'invalid' },
      onSubmit: () => {}
    })

    form.register('email', {
      pattern: {
        value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
        message: 'Invalid email format'
      }
    })

    await form.validate()
    expect(form.getError('email')).toBe('Invalid email format')
  })

  it('should validate minLength', async () => {
    const form = createForm({
      initialValues: { password: 'abc' },
      onSubmit: () => {}
    })

    form.register('password', {
      minLength: { value: 8, message: 'Min 8 characters' }
    })

    await form.validate()
    expect(form.getError('password')).toBe('Min 8 characters')
  })

  it('should run custom validation', async () => {
    const form = createForm({
      initialValues: { age: 15 },
      onSubmit: () => {}
    })

    form.register('age', {
      validate: (value) => value >= 18 || 'Must be 18 or older'
    })

    await form.validate()
    expect(form.getError('age')).toBe('Must be 18 or older')
  })
})`}</CodeBlock>

      <h2>Testing Async Validation</h2>
      <CodeBlock language="tsx">{`describe('Async Validation', () => {
  it('should handle async validation', async () => {
    const checkEmail = vi.fn().mockResolvedValue(false) // Email taken

    const form = createForm({
      initialValues: { email: 'taken@example.com' },
      onSubmit: () => {}
    })

    form.register('email', {
      validate: async (value) => {
        const available = await checkEmail(value)
        return available || 'Email already taken'
      }
    })

    await form.validate()

    expect(checkEmail).toHaveBeenCalledWith('taken@example.com')
    expect(form.getError('email')).toBe('Email already taken')
  })

  it('should show validating state', async () => {
    const slowCheck = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(true), 100))
    )

    const form = createForm({
      initialValues: { email: 'test@example.com' },
      onSubmit: () => {}
    })

    form.register('email', {
      validate: async (value) => {
        const available = await slowCheck(value)
        return available || 'Email taken'
      }
    })

    const validatePromise = form.validateField('email')

    expect(form.isFieldValidating('email')).toBe(true)

    await validatePromise

    expect(form.isFieldValidating('email')).toBe(false)
  })
})`}</CodeBlock>

      <h2>Testing Field Arrays</h2>
      <CodeBlock language="tsx">{`describe('Field Arrays', () => {
  it('should add items to array', () => {
    const form = createForm({
      initialValues: { items: [] },
      onSubmit: () => {}
    })

    const { append } = form.useFieldArray('items')

    append({ name: 'Item 1' })
    append({ name: 'Item 2' })

    expect(form.getValues('items')).toHaveLength(2)
    expect(form.getValues('items')[0].name).toBe('Item 1')
  })

  it('should remove items from array', () => {
    const form = createForm({
      initialValues: { items: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] },
      onSubmit: () => {}
    })

    const { remove } = form.useFieldArray('items')

    remove(1) // Remove 'B'

    expect(form.getValues('items')).toHaveLength(2)
    expect(form.getValues('items').map(i => i.name)).toEqual(['A', 'C'])
  })

  it('should reorder items', () => {
    const form = createForm({
      initialValues: { items: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] },
      onSubmit: () => {}
    })

    const { move } = form.useFieldArray('items')

    move(0, 2) // Move A to end

    expect(form.getValues('items').map(i => i.name)).toEqual(['B', 'C', 'A'])
  })
})`}</CodeBlock>

      <h2>Testing Plugins</h2>
      <CodeBlock language="tsx">{`import { createWizardPlugin } from '@oxog/formkeeper/plugins'

describe('Wizard Plugin', () => {
  it('should navigate between steps', async () => {
    const form = createForm({
      initialValues: { name: 'John', email: 'john@example.com' },
      plugins: [
        createWizardPlugin({
          steps: [
            { id: 'step1', fields: ['name'] },
            { id: 'step2', fields: ['email'] }
          ]
        })
      ],
      onSubmit: () => {}
    })

    const wizard = form.getPlugin('wizard')

    expect(wizard.currentStep.id).toBe('step1')

    await wizard.next()
    expect(wizard.currentStep.id).toBe('step2')

    wizard.prev()
    expect(wizard.currentStep.id).toBe('step1')
  })

  it('should validate before step change', async () => {
    const form = createForm({
      initialValues: { name: '' },
      plugins: [
        createWizardPlugin({
          steps: [{ id: 'step1', fields: ['name'] }],
          validateOnStepChange: true
        })
      ],
      onSubmit: () => {}
    })

    form.register('name', { required: 'Name is required' })

    const wizard = form.getPlugin('wizard')
    const result = await wizard.next()

    expect(result).toBe(false) // Should not proceed
    expect(form.getError('name')).toBe('Name is required')
  })
})`}</CodeBlock>

      <h2>Integration Testing</h2>
      <CodeBlock language="tsx">{`describe('Complete Form Flow', () => {
  it('should complete multi-step form', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<CheckoutWizard onSubmit={onSubmit} />)

    // Step 1: Personal info
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.click(screen.getByRole('button', { name: /next/i }))

    // Step 2: Shipping
    await user.type(screen.getByLabelText(/address/i), '123 Main St')
    await user.type(screen.getByLabelText(/city/i), 'New York')
    await user.click(screen.getByRole('button', { name: /next/i }))

    // Step 3: Payment
    await user.type(screen.getByLabelText(/card/i), '4111111111111111')
    await user.click(screen.getByRole('button', { name: /complete/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
        city: 'New York',
        cardNumber: '4111111111111111'
      }))
    })
  })
})`}</CodeBlock>
    </div>
  )
}
