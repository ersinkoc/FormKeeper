<script setup lang="ts">
/**
 * Vue Login Form Example
 *
 * This example demonstrates a basic login form with FormKeeper's Vue adapter.
 *
 * Features:
 * - Field registration with validation rules
 * - Reactive form state
 * - Error display on blur
 * - Form submission handling
 */

import { useForm, useField } from '@oxog/formkeeper/vue'

interface LoginValues {
  email: string
  password: string
  remember: boolean
}

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

// Email field
const emailField = useField('email', {
  required: 'Email is required',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
})

// Password field
const passwordField = useField('password', {
  required: 'Password is required',
  minLength: {
    value: 6,
    message: 'Password must be at least 6 characters',
  },
})

// Remember me field
const rememberField = useField('remember')
</script>

<template>
  <form @submit.prevent="form.handleSubmit" class="login-form">
    <h1>Login</h1>

    <!-- Email Field -->
    <div class="form-group">
      <label for="email">Email</label>
      <input
        v-bind="emailField.register()"
        type="email"
        id="email"
        placeholder="Enter your email"
        :class="{ error: emailField.touched && emailField.error }"
      />
      <span v-if="emailField.touched && emailField.error" class="error-message">
        {{ emailField.error }}
      </span>
    </div>

    <!-- Password Field -->
    <div class="form-group">
      <label for="password">Password</label>
      <input
        v-bind="passwordField.register()"
        type="password"
        id="password"
        placeholder="Enter your password"
        :class="{ error: passwordField.touched && passwordField.error }"
      />
      <span v-if="passwordField.touched && passwordField.error" class="error-message">
        {{ passwordField.error }}
      </span>
    </div>

    <!-- Remember Me -->
    <div class="form-group checkbox">
      <label>
        <input v-bind="rememberField.register()" type="checkbox" />
        Remember me
      </label>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="form.isSubmitting"
      class="submit-button"
    >
      {{ form.isSubmitting ? 'Logging in...' : 'Login' }}
    </button>

    <p class="signup-link">
      Don't have an account? <a href="/signup">Sign up</a>
    </p>
  </form>
</template>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #27272a;
  border-radius: 0.5rem;
  background: #18181b;
  color: #fafafa;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
}

input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

.checkbox label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

.submit-button:hover {
  background: #2563eb;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  margin-top: 1rem;
  color: #a1a1aa;
}

.signup-link a {
  color: #3b82f6;
}
</style>
