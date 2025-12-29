<!--
  Svelte Survey Form Example

  This example demonstrates a dynamic survey form with:
  - Multiple question types (text, select, checkbox, radio, scale)
  - Conditional questions
  - Progress tracking
  - Form validation
-->

<script lang="ts">
  import { createFormStore, fieldStore } from '@oxog/formkeeper/svelte'

  interface SurveyValues {
    satisfaction: number
    recommend: string
    improvements: string[]
    feedback: string
    email: string
    contactMe: boolean
  }

  // Create form store
  const form = createFormStore<SurveyValues>({
    initialValues: {
      satisfaction: 0,
      recommend: '',
      improvements: [],
      feedback: '',
      email: '',
      contactMe: false,
    },
    onSubmit: async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Survey submitted:', values)
      alert('Thank you for your feedback!')
    },
  })

  // Create field stores
  const satisfaction = fieldStore(form, 'satisfaction', {
    required: 'Please rate your satisfaction',
    min: { value: 1, message: 'Please select a rating' },
  })

  const recommend = fieldStore(form, 'recommend', {
    required: 'Please select an option',
  })

  const improvements = fieldStore(form, 'improvements')

  const feedback = fieldStore(form, 'feedback', {
    minLength: { value: 10, message: 'Please provide at least 10 characters' },
  })

  const email = fieldStore(form, 'email', {
    validate: (value, formValues) => {
      if (formValues.contactMe && !value) {
        return 'Email is required if you want us to contact you'
      }
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address'
      }
      return true
    },
  })

  const contactMe = fieldStore(form, 'contactMe')

  // Questions data
  const satisfactionLabels = ['Very Unsatisfied', 'Unsatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']

  const recommendOptions = [
    { value: 'definitely', label: 'Definitely' },
    { value: 'probably', label: 'Probably' },
    { value: 'not-sure', label: 'Not Sure' },
    { value: 'probably-not', label: 'Probably Not' },
    { value: 'definitely-not', label: 'Definitely Not' },
  ]

  const improvementOptions = [
    { value: 'performance', label: 'Performance' },
    { value: 'design', label: 'Design' },
    { value: 'features', label: 'Features' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'support', label: 'Customer Support' },
    { value: 'pricing', label: 'Pricing' },
  ]

  // Calculate progress
  $: progress = calculateProgress($form.values)

  function calculateProgress(values: SurveyValues): number {
    let filled = 0
    let total = 4 // Required questions

    if (values.satisfaction > 0) filled++
    if (values.recommend) filled++
    if (values.improvements.length > 0) filled++
    if (values.feedback) filled++

    return Math.round((filled / total) * 100)
  }

  // Handle checkbox array
  function toggleImprovement(value: string) {
    const current = $improvements.value || []
    const newValue = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value]
    improvements.setValue(newValue)
  }

  // Handle form submission
  async function handleSubmit(e: Event) {
    e.preventDefault()
    await form.handleSubmit()
  }
</script>

<form on:submit={handleSubmit} class="survey-form">
  <header>
    <h1>Customer Feedback Survey</h1>
    <p class="subtitle">Help us improve by sharing your experience</p>

    <!-- Progress Bar -->
    <div class="progress">
      <div class="progress-bar" style="width: {progress}%"></div>
    </div>
    <span class="progress-label">{progress}% Complete</span>
  </header>

  <!-- Question 1: Satisfaction -->
  <div class="question">
    <h2>1. How satisfied are you with our product?</h2>

    <div class="scale-rating">
      {#each [1, 2, 3, 4, 5] as rating}
        <button
          type="button"
          class="rating-btn"
          class:selected={$satisfaction.value === rating}
          on:click={() => satisfaction.setValue(rating)}
        >
          {rating}
        </button>
      {/each}
    </div>

    <div class="scale-labels">
      <span>Very Unsatisfied</span>
      <span>Very Satisfied</span>
    </div>

    {#if $satisfaction.touched && $satisfaction.error}
      <span class="error-message">{$satisfaction.error}</span>
    {/if}
  </div>

  <!-- Question 2: Recommend -->
  <div class="question">
    <h2>2. Would you recommend us to a friend?</h2>

    <div class="radio-group">
      {#each recommendOptions as option}
        <label class="radio-option">
          <input
            type="radio"
            name="recommend"
            value={option.value}
            checked={$recommend.value === option.value}
            on:change={() => recommend.setValue(option.value)}
          />
          <span class="radio-label">{option.label}</span>
        </label>
      {/each}
    </div>

    {#if $recommend.touched && $recommend.error}
      <span class="error-message">{$recommend.error}</span>
    {/if}
  </div>

  <!-- Question 3: Improvements -->
  <div class="question">
    <h2>3. What areas could we improve? (Select all that apply)</h2>

    <div class="checkbox-group">
      {#each improvementOptions as option}
        <label class="checkbox-option">
          <input
            type="checkbox"
            checked={($improvements.value || []).includes(option.value)}
            on:change={() => toggleImprovement(option.value)}
          />
          <span class="checkbox-label">{option.label}</span>
        </label>
      {/each}
    </div>
  </div>

  <!-- Question 4: Feedback -->
  <div class="question">
    <h2>4. Please share any additional feedback</h2>

    <textarea
      placeholder="Tell us what you think..."
      rows="4"
      on:input={(e) => feedback.setValue(e.currentTarget.value)}
      on:blur={() => feedback.setTouched(true)}
      class:error={$feedback.touched && $feedback.error}
    >{$feedback.value}</textarea>

    {#if $feedback.touched && $feedback.error}
      <span class="error-message">{$feedback.error}</span>
    {/if}
  </div>

  <!-- Optional: Contact -->
  <div class="question contact-section">
    <label class="checkbox-option">
      <input
        type="checkbox"
        checked={$contactMe.value}
        on:change={(e) => contactMe.setValue(e.currentTarget.checked)}
      />
      <span class="checkbox-label">I'd like to be contacted about my feedback</span>
    </label>

    {#if $contactMe.value}
      <div class="form-group" style="margin-top: 1rem;">
        <label for="email">Email Address</label>
        <input
          type="email"
          id="email"
          placeholder="your@email.com"
          value={$email.value}
          on:input={(e) => email.setValue(e.currentTarget.value)}
          on:blur={() => email.setTouched(true)}
          class:error={$email.touched && $email.error}
        />
        {#if $email.touched && $email.error}
          <span class="error-message">{$email.error}</span>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Submit -->
  <div class="submit-section">
    <button type="submit" disabled={$form.isSubmitting} class="submit-button">
      {$form.isSubmitting ? 'Submitting...' : 'Submit Survey'}
    </button>
  </div>
</form>

<style>
  .survey-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, sans-serif;
    color: #fafafa;
  }

  header {
    text-align: center;
    margin-bottom: 2rem;
  }

  h1 {
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: #a1a1aa;
    margin-bottom: 1.5rem;
  }

  .progress {
    height: 8px;
    background: #27272a;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background: #3b82f6;
    transition: width 0.3s ease;
  }

  .progress-label {
    display: block;
    text-align: center;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #a1a1aa;
  }

  .question {
    background: #18181b;
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1rem;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .scale-rating {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  .rating-btn {
    width: 48px;
    height: 48px;
    border: 2px solid #27272a;
    border-radius: 50%;
    background: transparent;
    color: #fafafa;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .rating-btn:hover {
    border-color: #3b82f6;
  }

  .rating-btn.selected {
    background: #3b82f6;
    border-color: #3b82f6;
  }

  .scale-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #a1a1aa;
  }

  .radio-group,
  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .radio-option,
  .checkbox-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #09090b;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .radio-option:hover,
  .checkbox-option:hover {
    background: #27272a;
  }

  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #27272a;
    border-radius: 0.5rem;
    background: #09090b;
    color: #fafafa;
    resize: vertical;
    font-family: inherit;
    box-sizing: border-box;
  }

  textarea:focus {
    outline: none;
    border-color: #3b82f6;
  }

  textarea.error {
    border-color: #ef4444;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }

  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #27272a;
    border-radius: 0.5rem;
    background: #09090b;
    color: #fafafa;
    box-sizing: border-box;
  }

  .form-group input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .form-group input.error {
    border-color: #ef4444;
  }

  .error-message {
    color: #ef4444;
    font-size: 0.75rem;
    margin-top: 0.5rem;
    display: block;
  }

  .contact-section {
    background: #27272a;
  }

  .submit-section {
    text-align: center;
  }

  .submit-button {
    padding: 1rem 3rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
  }

  .submit-button:hover {
    background: #2563eb;
  }

  .submit-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
