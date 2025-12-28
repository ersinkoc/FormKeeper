# FormKeeper Examples

Comprehensive examples demonstrating FormKeeper's capabilities.

## Table of Contents

1. [Basic Forms](#basic-forms)
2. [Validation](#validation)
3. [Dynamic Forms](#dynamic-forms)
4. [Multi-Step Forms](#multi-step-forms)
5. [Advanced Patterns](#advanced-patterns)

## Basic Forms

### Simple Login Form

```tsx
import { useForm } from '@oxog/formkeeper/react'

function LoginForm() {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(values),
      })
      if (response.ok) {
        console.log('Login successful!')
      }
    },
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <div>
        <label>Email</label>
        <input
          {...form.register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/,
              message: 'Invalid email',
            },
          })}
        />
        {form.errors.email && <span>{form.errors.email}</span>}
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          {...form.register('password', {
            required: 'Password is required',
          })}
        />
        {form.errors.password && <span>{form.errors.password}</span>}
      </div>

      <button type="submit" disabled={form.formState.isSubmitting}>
        Login
      </button>
    </form>
  )
}
```

### Contact Form

```tsx
function ContactForm() {
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    onSubmit: async (values) => {
      await sendEmail(values)
    },
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.register('name', { required: true })} placeholder="Name" />
      <input {...form.register('email', { required: true })} placeholder="Email" />
      <input {...form.register('subject', { required: true })} placeholder="Subject" />
      <textarea {...form.register('message', { required: true })} placeholder="Message" />
      <button type="submit">Send</button>
    </form>
  )
}
```

## Validation

### Complex Validation Rules

```tsx
function RegistrationForm() {
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        {...form.register('username', {
          required: 'Username is required',
          minLength: {
            value: 3,
            message: 'At least 3 characters',
          },
          validate: {
            noSpaces: (value) => !value.includes(' ') || 'No spaces allowed',
            noAdmin: (value) => value !== 'admin' || 'Reserved username',
          },
        })}
      />

      <input
        type="password"
        {...form.register('password', {
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'At least 8 characters',
          },
          validate: {
            hasNumber: (value) => /\d/.test(value) || 'Must contain a number',
            hasUpper: (value) => /[A-Z]/.test(value) || 'Must contain uppercase',
            hasLower: (value) => /[a-z]/.test(value) || 'Must contain lowercase',
          },
        })}
      />

      <input
        type="password"
        {...form.register('confirmPassword', {
          validate: (value) =>
            value === form.values.password || 'Passwords must match',
        })}
      />
    </form>
  )
}
```

### Async Validation

```tsx
function UsernameForm() {
  const form = useForm({
    initialValues: { username: '' },
    validationMode: 'onBlur',
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        {...form.register('username', {
          required: 'Username is required',
          validate: async (value) => {
            const response = await fetch(`/api/check-username?username=${value}`)
            const { available } = await response.json()
            return available || 'Username already taken'
          },
        })}
      />
    </form>
  )
}
```

## Dynamic Forms

### Todo List with Field Array

```tsx
import { useFieldArray } from '@oxog/formkeeper/react'

function TodoList() {
  const form = useForm({
    initialValues: {
      todos: [{ text: 'Learn FormKeeper', done: false }],
    },
  })

  const { fields, append, remove, move } = useFieldArray({
    form,
    name: 'todos',
  })

  return (
    <form onSubmit={form.handleSubmit}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input
            type="checkbox"
            {...form.register(`todos.${index}.done`)}
          />
          <input
            {...form.register(`todos.${index}.text`, {
              required: 'Todo text is required',
            })}
          />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
          {index > 0 && (
            <button type="button" onClick={() => move(index, index - 1)}>
              Move Up
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={() => append({ text: '', done: false })}>
        Add Todo
      </button>
    </form>
  )
}
```

### Dynamic Form Fields

```tsx
function DynamicFieldsForm() {
  const form = useForm({
    initialValues: {
      contacts: [{ name: '', email: '', phone: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    form,
    name: 'contacts',
  })

  return (
    <form onSubmit={form.handleSubmit}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <h3>Contact {index + 1}</h3>
          <input
            {...form.register(`contacts.${index}.name`, {
              required: 'Name is required',
            })}
            placeholder="Name"
          />
          <input
            {...form.register(`contacts.${index}.email`, {
              required: 'Email is required',
            })}
            placeholder="Email"
          />
          <input
            {...form.register(`contacts.${index}.phone`)}
            placeholder="Phone"
          />
          <button type="button" onClick={() => remove(index)}>
            Remove Contact
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ name: '', email: '', phone: '' })}
      >
        Add Contact
      </button>
    </form>
  )
}
```

## Multi-Step Forms

### Wizard Form

```tsx
import { wizardPlugin } from '@oxog/formkeeper/plugins'

function WizardForm() {
  const form = useForm({
    initialValues: {
      personal: { name: '', email: '' },
      address: { street: '', city: '', zip: '' },
      preferences: { newsletter: false, theme: 'light' },
    },
    plugins: [
      wizardPlugin({
        steps: ['personal', 'address', 'preferences'],
      }),
    ],
    onSubmit: async (values) => {
      console.log('Form submitted:', values)
    },
  })

  const { currentStep, isFirstStep, isLastStep, next, previous, goTo } =
    form.wizard

  return (
    <div>
      {/* Step Indicator */}
      <div className="steps">
        {['Personal Info', 'Address', 'Preferences'].map((label, index) => (
          <button
            key={label}
            onClick={() => goTo(index)}
            className={currentStep === index ? 'active' : ''}
          >
            {index + 1}. {label}
          </button>
        ))}
      </div>

      <form onSubmit={form.handleSubmit}>
        {/* Step 1: Personal Info */}
        {currentStep === 0 && (
          <div>
            <h2>Personal Information</h2>
            <input
              {...form.register('personal.name', {
                required: 'Name is required',
              })}
              placeholder="Full Name"
            />
            <input
              {...form.register('personal.email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/,
                  message: 'Invalid email',
                },
              })}
              placeholder="Email"
            />
          </div>
        )}

        {/* Step 2: Address */}
        {currentStep === 1 && (
          <div>
            <h2>Address</h2>
            <input
              {...form.register('address.street')}
              placeholder="Street"
            />
            <input {...form.register('address.city')} placeholder="City" />
            <input {...form.register('address.zip')} placeholder="ZIP Code" />
          </div>
        )}

        {/* Step 3: Preferences */}
        {currentStep === 2 && (
          <div>
            <h2>Preferences</h2>
            <label>
              <input
                type="checkbox"
                {...form.register('preferences.newsletter')}
              />
              Subscribe to newsletter
            </label>
            <select {...form.register('preferences.theme')}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        )}

        {/* Navigation */}
        <div className="navigation">
          <button
            type="button"
            onClick={previous}
            disabled={isFirstStep}
          >
            Previous
          </button>

          {isLastStep ? (
            <button type="submit">Submit</button>
          ) : (
            <button type="button" onClick={next}>
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
```

## Advanced Patterns

### Form with Auto-Save

```tsx
import { autoSavePlugin } from '@oxog/formkeeper/plugins'

function AutoSaveForm() {
  const form = useForm({
    initialValues: { title: '', content: '' },
    plugins: [
      autoSavePlugin({
        key: 'draft-post',
        debounce: 1000,
        storage: 'localStorage',
      }),
    ],
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.register('title')} placeholder="Title" />
      <textarea {...form.register('content')} placeholder="Content" />
      {form.formState.isDirty && <span>Autosaving...</span>}
    </form>
  )
}
```

### Conditional Fields

```tsx
function ConditionalForm() {
  const form = useForm({
    initialValues: {
      accountType: 'personal',
      companyName: '',
      taxId: '',
    },
  })

  const accountType = form.watch('accountType')

  return (
    <form onSubmit={form.handleSubmit}>
      <select {...form.register('accountType')}>
        <option value="personal">Personal</option>
        <option value="business">Business</option>
      </select>

      {accountType === 'business' && (
        <>
          <input
            {...form.register('companyName', {
              required: 'Company name is required',
            })}
            placeholder="Company Name"
          />
          <input
            {...form.register('taxId', {
              required: 'Tax ID is required',
            })}
            placeholder="Tax ID"
          />
        </>
      )}
    </form>
  )
}
```

### Nested Forms

```tsx
function ProfileForm() {
  const form = useForm({
    initialValues: {
      user: {
        personal: {
          firstName: '',
          lastName: '',
          birthDate: '',
        },
        contact: {
          email: '',
          phone: '',
        },
        address: {
          street: '',
          city: '',
          country: '',
        },
      },
    },
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <fieldset>
        <legend>Personal Information</legend>
        <input {...form.register('user.personal.firstName')} />
        <input {...form.register('user.personal.lastName')} />
        <input {...form.register('user.personal.birthDate')} type="date" />
      </fieldset>

      <fieldset>
        <legend>Contact</legend>
        <input {...form.register('user.contact.email')} type="email" />
        <input {...form.register('user.contact.phone')} type="tel" />
      </fieldset>

      <fieldset>
        <legend>Address</legend>
        <input {...form.register('user.address.street')} />
        <input {...form.register('user.address.city')} />
        <input {...form.register('user.address.country')} />
      </fieldset>
    </form>
  )
}
```

## More Examples

For more examples and interactive demonstrations, visit:

**[FormKeeper Examples](https://formkeeper.oxog.dev/examples)**

Or try them live in the:

**[FormKeeper Playground](https://formkeeper.oxog.dev/playground)**
