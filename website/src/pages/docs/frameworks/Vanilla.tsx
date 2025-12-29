import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'

export function VanillaFramework() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Vanilla JavaScript</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Use FormKeeper without any framework. The core API works directly with
        the DOM and provides a clean, observable-based interface.
      </p>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <CodeBlock
          code="npm install @oxog/formkeeper"
          language="bash"
          showLineNumbers={false}
        />
      </section>

      {/* Basic Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock
          code={`import { createForm } from '@oxog/formkeeper'

const form = createForm({
  initialValues: {
    email: '',
    password: '',
  },
  onSubmit: async (values) => {
    console.log('Submitted:', values)
  },
})

// Get DOM elements
const formEl = document.getElementById('login-form')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const submitBtn = document.getElementById('submit-btn')

// Register fields
const emailField = form.registerField('email', {
  required: 'Email is required',
  pattern: { value: /^\\S+@\\S+$/, message: 'Invalid email' },
})

const passwordField = form.registerField('password', {
  required: 'Password is required',
  minLength: { value: 8, message: 'Min 8 characters' },
})

// Bind to DOM
emailInput.value = emailField.getValue()
emailInput.addEventListener('input', (e) => {
  emailField.setValue(e.target.value)
})
emailInput.addEventListener('blur', () => {
  emailField.setTouched()
})

passwordInput.value = passwordField.getValue()
passwordInput.addEventListener('input', (e) => {
  passwordField.setValue(e.target.value)
})
passwordInput.addEventListener('blur', () => {
  passwordField.setTouched()
})

// Handle submit
formEl.addEventListener('submit', (e) => {
  e.preventDefault()
  form.handleSubmit()
})`}
          language="typescript"
          filename="login-form.ts"
        />
      </section>

      {/* Subscribing to Changes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Subscribing to Changes</h2>
        <p className="text-muted-foreground mb-4">
          Use subscriptions to react to state changes:
        </p>

        <CodeBlock
          code={`// Subscribe to field changes
emailField.subscribe((state) => {
  // Update UI based on state
  const errorEl = document.getElementById('email-error')

  if (state.touched && state.error) {
    errorEl.textContent = state.error
    errorEl.style.display = 'block'
    emailInput.classList.add('error')
  } else {
    errorEl.style.display = 'none'
    emailInput.classList.remove('error')
  }
})

// Subscribe to form state
form.formState.subscribe((state) => {
  submitBtn.disabled = state.isSubmitting

  if (state.isSubmitting) {
    submitBtn.textContent = 'Submitting...'
  } else {
    submitBtn.textContent = 'Submit'
  }
})

// Watch specific values
form.watch('email', (value, prevValue) => {
  console.log('Email changed:', prevValue, '->', value)
})`}
          language="typescript"
        />
      </section>

      {/* Field Array */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Dynamic Arrays</h2>
        <CodeBlock
          code={`const form = createForm({
  initialValues: {
    items: [{ name: '' }],
  },
  onSubmit: (values) => console.log(values),
})

const itemsArray = form.registerFieldArray('items')

// Render initial items
function renderItems() {
  const container = document.getElementById('items-container')
  container.replaceChildren() // Clear safely

  itemsArray.getFields().forEach((field, index) => {
    const div = document.createElement('div')
    div.className = 'item-row'

    // Create input element safely
    const input = document.createElement('input')
    input.type = 'text'
    input.id = 'item-' + index

    // Create remove button safely
    const removeBtn = document.createElement('button')
    removeBtn.type = 'button'
    removeBtn.textContent = 'Remove'
    removeBtn.dataset.index = String(index)

    div.appendChild(input)
    div.appendChild(removeBtn)
    container.appendChild(div)

    // Bind input
    const fieldState = form.registerField('items.' + index + '.name')
    input.value = fieldState.getValue()
    input.addEventListener('input', (e) => {
      fieldState.setValue(e.target.value)
    })

    // Bind remove button
    removeBtn.addEventListener('click', () => {
      itemsArray.remove(index)
      renderItems()
    })
  })
}

// Add item button
document.getElementById('add-item').addEventListener('click', () => {
  itemsArray.append({ name: '' })
  renderItems()
})

renderItems()`}
          language="typescript"
        />
      </section>

      {/* Complete Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Complete Example</h2>
        <CodeBlock
          code={`<!-- contact-form.html -->
<form id="contact-form">
  <div>
    <label for="name">Name</label>
    <input type="text" id="name" />
    <span id="name-error" class="error-message hidden"></span>
  </div>

  <div>
    <label for="email">Email</label>
    <input type="email" id="email" />
    <span id="email-error" class="error-message hidden"></span>
  </div>

  <div>
    <label for="message">Message</label>
    <textarea id="message" rows="4"></textarea>
    <span id="message-error" class="error-message hidden"></span>
  </div>

  <button type="submit" id="submit-btn">Send Message</button>
</form>`}
          language="html"
          filename="contact-form.html"
        />

        <CodeBlock
          code={`// contact-form.ts
import { createForm } from '@oxog/formkeeper'

const form = createForm({
  initialValues: {
    name: '',
    email: '',
    message: '',
  },
  onSubmit: async (values) => {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    alert('Message sent!')
    form.reset()
  },
})

// Helper to bind field
function bindField(name, validation) {
  const input = document.getElementById(name)
  const errorEl = document.getElementById(name + '-error')
  const field = form.registerField(name, validation)

  input.value = field.getValue()

  input.addEventListener('input', (e) => {
    field.setValue(e.target.value)
  })

  input.addEventListener('blur', () => {
    field.setTouched()
  })

  field.subscribe((state) => {
    if (state.touched && state.error) {
      input.classList.add('error')
      errorEl.textContent = state.error
      errorEl.classList.remove('hidden')
    } else {
      input.classList.remove('error')
      errorEl.classList.add('hidden')
    }
  })
}

// Bind all fields
bindField('name', {
  required: 'Name is required',
  minLength: { value: 2, message: 'Min 2 characters' },
})

bindField('email', {
  required: 'Email is required',
  pattern: { value: /^\\S+@\\S+$/, message: 'Invalid email' },
})

bindField('message', {
  required: 'Message is required',
  minLength: { value: 10, message: 'Min 10 characters' },
})

// Bind form submit
const formEl = document.getElementById('contact-form')
const submitBtn = document.getElementById('submit-btn')

formEl.addEventListener('submit', (e) => {
  e.preventDefault()
  form.handleSubmit()
})

// Update button state
form.formState.subscribe((state) => {
  submitBtn.disabled = state.isSubmitting
  submitBtn.textContent = state.isSubmitting
    ? 'Sending...'
    : 'Send Message'
})`}
          language="typescript"
          filename="contact-form.ts"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/docs/frameworks/react">
              React Guide
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/docs/api/create-form">API Reference</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
