/**
 * React Registration Form Example
 *
 * This example demonstrates a comprehensive registration form with:
 * - Multiple field types (text, email, password, select)
 * - Custom validation functions
 * - Async validation (email availability check)
 * - Password confirmation
 * - Terms acceptance
 */

import React from 'react'
import { useForm, useField, FormProvider, useWatch } from '@oxog/formkeeper/react'

interface RegistrationValues {
  username: string
  email: string
  password: string
  confirmPassword: string
  role: string
  acceptTerms: boolean
}

// Simulate async email check
async function checkEmailAvailability(email: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  const takenEmails = ['admin@example.com', 'test@example.com', 'user@example.com']
  return !takenEmails.includes(email.toLowerCase())
}

export function RegistrationForm() {
  const form = useForm<RegistrationValues>({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      acceptTerms: false,
    },
    mode: 'onBlur',
    onSubmit: async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log('Registration submitted:', values)
      alert('Account created successfully!')
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit} className="registration-form">
        <h1>Create Account</h1>

        <UsernameField />
        <EmailField />
        <PasswordField />
        <ConfirmPasswordField />
        <RoleField />
        <TermsField />

        <button
          type="submit"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
          className="submit-button"
        >
          {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </FormProvider>
  )
}

function UsernameField() {
  const { register, error, touched, validating } = useField('username', {
    required: 'Username is required',
    minLength: { value: 3, message: 'Username must be at least 3 characters' },
    maxLength: { value: 20, message: 'Username cannot exceed 20 characters' },
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message: 'Username can only contain letters, numbers, and underscores',
    },
  })

  return (
    <div className="form-group">
      <label htmlFor="username">Username</label>
      <input
        {...register()}
        type="text"
        id="username"
        placeholder="Choose a username"
        className={touched && error ? 'error' : ''}
      />
      {validating && <span className="hint">Checking...</span>}
      {touched && error && <span className="error-message">{error}</span>}
    </div>
  )
}

function EmailField() {
  const { register, error, touched, validating } = useField('email', {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
    validate: async (value) => {
      if (!value) return true
      const available = await checkEmailAvailability(value)
      return available || 'This email is already registered'
    },
  })

  return (
    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input
        {...register()}
        type="email"
        id="email"
        placeholder="Enter your email"
        className={touched && error ? 'error' : ''}
      />
      {validating && <span className="hint">Checking availability...</span>}
      {touched && error && <span className="error-message">{error}</span>}
    </div>
  )
}

function PasswordField() {
  const { register, error, touched, value } = useField('password', {
    required: 'Password is required',
    minLength: { value: 8, message: 'Password must be at least 8 characters' },
    validate: (value) => {
      if (!value) return true
      if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter'
      if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter'
      if (!/[0-9]/.test(value)) return 'Password must contain a number'
      return true
    },
  })

  const getStrength = (password: string) => {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[!@#$%^&*]/.test(password)) score++
    return score
  }

  const strength = getStrength(value || '')
  const strengthLabel = strength <= 2 ? 'Weak' : strength <= 4 ? 'Medium' : 'Strong'
  const strengthColor = strength <= 2 ? 'red' : strength <= 4 ? 'orange' : 'green'

  return (
    <div className="form-group">
      <label htmlFor="password">Password</label>
      <input
        {...register()}
        type="password"
        id="password"
        placeholder="Create a password"
        className={touched && error ? 'error' : ''}
      />
      {value && (
        <div className="password-strength">
          <div
            className="strength-bar"
            style={{
              width: `${(strength / 5) * 100}%`,
              backgroundColor: strengthColor,
            }}
          />
          <span className="strength-label">{strengthLabel}</span>
        </div>
      )}
      {touched && error && <span className="error-message">{error}</span>}
    </div>
  )
}

function ConfirmPasswordField() {
  const password = useWatch('password')
  const { register, error, touched } = useField('confirmPassword', {
    required: 'Please confirm your password',
    validate: (value) => {
      return value === password || 'Passwords do not match'
    },
    deps: ['password'],
  })

  return (
    <div className="form-group">
      <label htmlFor="confirmPassword">Confirm Password</label>
      <input
        {...register()}
        type="password"
        id="confirmPassword"
        placeholder="Confirm your password"
        className={touched && error ? 'error' : ''}
      />
      {touched && error && <span className="error-message">{error}</span>}
    </div>
  )
}

function RoleField() {
  const { register, error, touched } = useField('role', {
    required: 'Please select a role',
  })

  return (
    <div className="form-group">
      <label htmlFor="role">Role</label>
      <select
        {...register()}
        id="role"
        className={touched && error ? 'error' : ''}
      >
        <option value="">Select a role...</option>
        <option value="developer">Developer</option>
        <option value="designer">Designer</option>
        <option value="manager">Manager</option>
        <option value="other">Other</option>
      </select>
      {touched && error && <span className="error-message">{error}</span>}
    </div>
  )
}

function TermsField() {
  const { register, error, touched } = useField('acceptTerms', {
    validate: (value) => value === true || 'You must accept the terms and conditions',
  })

  return (
    <div className="form-group checkbox">
      <label>
        <input {...register()} type="checkbox" />
        I accept the <a href="/terms">terms and conditions</a>
      </label>
      {touched && error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default RegistrationForm
