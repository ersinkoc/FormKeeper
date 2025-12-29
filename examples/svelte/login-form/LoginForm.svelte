<!--
  Svelte Login Form Example

  This example demonstrates a basic login form with FormKeeper's Svelte adapter.

  Features:
  - Store-based form state
  - Field registration with validation rules
  - Reactive error display
  - Form submission handling
-->

<script lang="ts">
  import { createFormStore, fieldStore } from '@oxog/formkeeper/svelte'

  interface LoginValues {
    email: string
    password: string
    remember: boolean
  }

  // Create form store
  const form = createFormStore<LoginValues>({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },
    onSubmit: async (values) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Login submitted:', values)
      alert('Login successful!')
    },
  })

  // Create field stores
  const email = fieldStore(form, 'email', {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
  })

  const password = fieldStore(form, 'password', {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters',
    },
  })

  const remember = fieldStore(form, 'remember')

  // Handle form submission
  async function handleSubmit(e: Event) {
    e.preventDefault()
    await form.handleSubmit()
  }
</script>

<form on:submit={handleSubmit} class="login-form">
  <h1>Login</h1>

  <!-- Email Field -->
  <div class="form-group">
    <label for="email">Email</label>
    <input
      {...$email.register()}
      type="email"
      id="email"
      placeholder="Enter your email"
      class:error={$email.touched && $email.error}
    />
    {#if $email.touched && $email.error}
      <span class="error-message">{$email.error}</span>
    {/if}
  </div>

  <!-- Password Field -->
  <div class="form-group">
    <label for="password">Password</label>
    <input
      {...$password.register()}
      type="password"
      id="password"
      placeholder="Enter your password"
      class:error={$password.touched && $password.error}
    />
    {#if $password.touched && $password.error}
      <span class="error-message">{$password.error}</span>
    {/if}
  </div>

  <!-- Remember Me -->
  <div class="form-group checkbox">
    <label>
      <input {...$remember.register()} type="checkbox" />
      Remember me
    </label>
  </div>

  <!-- Submit Button -->
  <button type="submit" disabled={$form.isSubmitting} class="submit-button">
    {$form.isSubmitting ? 'Logging in...' : 'Login'}
  </button>

  <p class="signup-link">
    Don't have an account? <a href="/signup">Sign up</a>
  </p>

  <!-- Debug: Form State -->
  <details class="debug">
    <summary>Form State</summary>
    <pre>{JSON.stringify($form, null, 2)}</pre>
  </details>
</form>

<style>
  .login-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, sans-serif;
  }

  h1 {
    margin-bottom: 1.5rem;
    text-align: center;
    color: #fafafa;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: #fafafa;
  }

  input[type='email'],
  input[type='password'] {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #27272a;
    border-radius: 0.5rem;
    background: #18181b;
    color: #fafafa;
    box-sizing: border-box;
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
    color: #fafafa;
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

  .debug {
    margin-top: 2rem;
    padding: 1rem;
    background: #18181b;
    border-radius: 0.5rem;
    color: #a1a1aa;
  }

  .debug summary {
    cursor: pointer;
    color: #fafafa;
  }

  .debug pre {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    overflow-x: auto;
  }
</style>
