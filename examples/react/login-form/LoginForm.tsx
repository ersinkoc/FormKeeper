/**
 * React Login Form Example
 *
 * This example demonstrates a basic login form with FormKeeper's React adapter.
 *
 * Features:
 * - Field registration with validation rules
 * - Error display on blur
 * - Form submission handling
 * - Loading state during submit
 */

import React from 'react'
import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'

interface LoginValues {
  email: string
  password: string
  remember: boolean
}

export function LoginForm() {
  const form = useForm<LoginValues>({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },
    mode: 'onBlur',
    onSubmit: async (values) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Login submitted:', values)
      alert('Login successful!')
    },
  })

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit} className="login-form">
        <h1>Login</h1>

        <EmailField />
        <PasswordField />
        <RememberField />

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="submit-button"
        >
          {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </FormProvider>
  )
}

function EmailField() {
  const { register, error, touched } = useField('email', {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
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
      {touched && error && <span className="error-message">{error}</span>}
    </div>
  )
}

function PasswordField() {
  const { register, error, touched } = useField('password', {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters',
    },
  })

  return (
    <div className="form-group">
      <label htmlFor="password">Password</label>
      <input
        {...register()}
        type="password"
        id="password"
        placeholder="Enter your password"
        className={touched && error ? 'error' : ''}
      />
      {touched && error && <span className="error-message">{error}</span>}
    </div>
  )
}

function RememberField() {
  const { register } = useField('remember')

  return (
    <div className="form-group checkbox">
      <label>
        <input {...register()} type="checkbox" />
        Remember me
      </label>
    </div>
  )
}

export default LoginForm
