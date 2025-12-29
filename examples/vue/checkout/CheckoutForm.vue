<script setup lang="ts">
/**
 * Vue Checkout Form Example
 *
 * This example demonstrates a comprehensive checkout form with:
 * - Multiple sections (shipping, billing, payment)
 * - Conditional fields (same as shipping checkbox)
 * - Field arrays for order items
 * - Computed totals
 */

import { ref, computed } from 'vue'
import { useForm, useField, useFieldArray, useWatch } from '@oxog/formkeeper/vue'

interface CheckoutValues {
  // Shipping
  shippingName: string
  shippingStreet: string
  shippingCity: string
  shippingZip: string
  shippingCountry: string
  // Billing
  sameAsShipping: boolean
  billingName: string
  billingStreet: string
  billingCity: string
  billingZip: string
  billingCountry: string
  // Payment
  cardNumber: string
  cardName: string
  expiry: string
  cvv: string
  // Order
  items: Array<{ name: string; quantity: number; price: number }>
}

const form = useForm<CheckoutValues>({
  initialValues: {
    shippingName: '',
    shippingStreet: '',
    shippingCity: '',
    shippingZip: '',
    shippingCountry: 'US',
    sameAsShipping: true,
    billingName: '',
    billingStreet: '',
    billingCity: '',
    billingZip: '',
    billingCountry: 'US',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    items: [
      { name: 'Product A', quantity: 2, price: 29.99 },
      { name: 'Product B', quantity: 1, price: 49.99 },
    ],
  },
  onSubmit: async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log('Order submitted:', values)
    alert('Order placed successfully!')
  },
})

// Shipping fields
const shippingName = useField('shippingName', { required: 'Name is required' })
const shippingStreet = useField('shippingStreet', { required: 'Street is required' })
const shippingCity = useField('shippingCity', { required: 'City is required' })
const shippingZip = useField('shippingZip', { required: 'ZIP code is required' })
const shippingCountry = useField('shippingCountry', { required: 'Country is required' })

// Same as shipping checkbox
const sameAsShipping = useField('sameAsShipping')
const isSameAsShipping = useWatch('sameAsShipping')

// Billing fields
const billingName = useField('billingName', {
  validate: (value, formValues) => {
    if (!formValues.sameAsShipping && !value) return 'Name is required'
    return true
  },
})
const billingStreet = useField('billingStreet')
const billingCity = useField('billingCity')
const billingZip = useField('billingZip')
const billingCountry = useField('billingCountry')

// Payment fields
const cardNumber = useField('cardNumber', {
  required: 'Card number is required',
  pattern: {
    value: /^\d{16}$/,
    message: 'Please enter a valid 16-digit card number',
  },
})
const cardName = useField('cardName', { required: 'Name on card is required' })
const expiry = useField('expiry', {
  required: 'Expiry date is required',
  pattern: {
    value: /^\d{2}\/\d{2}$/,
    message: 'Please use MM/YY format',
  },
})
const cvv = useField('cvv', {
  required: 'CVV is required',
  pattern: {
    value: /^\d{3,4}$/,
    message: 'Please enter a valid CVV',
  },
})

// Order items
const itemsArray = useFieldArray('items')
const items = useWatch('items') as CheckoutValues['items']

// Computed totals
const subtotal = computed(() => {
  return (items || []).reduce((sum, item) => {
    return sum + item.quantity * item.price
  }, 0)
})

const shipping = computed(() => (subtotal.value > 100 ? 0 : 9.99))
const tax = computed(() => subtotal.value * 0.08)
const total = computed(() => subtotal.value + shipping.value + tax.value)

// Countries
const countries = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
]

// Format card number
function formatCardNumber(e: Event) {
  const input = e.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '').slice(0, 16)
  cardNumber.setValue(value)
}
</script>

<template>
  <form @submit.prevent="form.handleSubmit" class="checkout-form">
    <h1>Checkout</h1>

    <div class="checkout-grid">
      <!-- Left Column: Forms -->
      <div class="forms-column">
        <!-- Shipping Section -->
        <section class="form-section">
          <h2>Shipping Address</h2>

          <div class="form-group">
            <label for="shippingName">Full Name</label>
            <input
              v-bind="shippingName.register()"
              type="text"
              id="shippingName"
              :class="{ error: shippingName.touched && shippingName.error }"
            />
            <span v-if="shippingName.touched && shippingName.error" class="error-message">
              {{ shippingName.error }}
            </span>
          </div>

          <div class="form-group">
            <label for="shippingStreet">Street Address</label>
            <input
              v-bind="shippingStreet.register()"
              type="text"
              id="shippingStreet"
              :class="{ error: shippingStreet.touched && shippingStreet.error }"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="shippingCity">City</label>
              <input v-bind="shippingCity.register()" type="text" id="shippingCity" />
            </div>
            <div class="form-group">
              <label for="shippingZip">ZIP Code</label>
              <input v-bind="shippingZip.register()" type="text" id="shippingZip" />
            </div>
          </div>

          <div class="form-group">
            <label for="shippingCountry">Country</label>
            <select v-bind="shippingCountry.register()" id="shippingCountry">
              <option v-for="country in countries" :key="country.value" :value="country.value">
                {{ country.label }}
              </option>
            </select>
          </div>
        </section>

        <!-- Billing Section -->
        <section class="form-section">
          <h2>Billing Address</h2>

          <div class="form-group checkbox">
            <label>
              <input v-bind="sameAsShipping.register()" type="checkbox" />
              Same as shipping address
            </label>
          </div>

          <template v-if="!isSameAsShipping">
            <div class="form-group">
              <label for="billingName">Full Name</label>
              <input v-bind="billingName.register()" type="text" id="billingName" />
            </div>

            <div class="form-group">
              <label for="billingStreet">Street Address</label>
              <input v-bind="billingStreet.register()" type="text" id="billingStreet" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="billingCity">City</label>
                <input v-bind="billingCity.register()" type="text" id="billingCity" />
              </div>
              <div class="form-group">
                <label for="billingZip">ZIP Code</label>
                <input v-bind="billingZip.register()" type="text" id="billingZip" />
              </div>
            </div>

            <div class="form-group">
              <label for="billingCountry">Country</label>
              <select v-bind="billingCountry.register()" id="billingCountry">
                <option v-for="country in countries" :key="country.value" :value="country.value">
                  {{ country.label }}
                </option>
              </select>
            </div>
          </template>
        </section>

        <!-- Payment Section -->
        <section class="form-section">
          <h2>Payment Details</h2>

          <div class="form-group">
            <label for="cardNumber">Card Number</label>
            <input
              v-bind="cardNumber.register()"
              type="text"
              id="cardNumber"
              placeholder="1234567890123456"
              @input="formatCardNumber"
              maxlength="16"
              :class="{ error: cardNumber.touched && cardNumber.error }"
            />
            <span v-if="cardNumber.touched && cardNumber.error" class="error-message">
              {{ cardNumber.error }}
            </span>
          </div>

          <div class="form-group">
            <label for="cardName">Name on Card</label>
            <input
              v-bind="cardName.register()"
              type="text"
              id="cardName"
              :class="{ error: cardName.touched && cardName.error }"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="expiry">Expiry (MM/YY)</label>
              <input
                v-bind="expiry.register()"
                type="text"
                id="expiry"
                placeholder="MM/YY"
                maxlength="5"
                :class="{ error: expiry.touched && expiry.error }"
              />
            </div>
            <div class="form-group">
              <label for="cvv">CVV</label>
              <input
                v-bind="cvv.register()"
                type="password"
                id="cvv"
                maxlength="4"
                :class="{ error: cvv.touched && cvv.error }"
              />
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Order Summary -->
      <div class="summary-column">
        <section class="order-summary">
          <h2>Order Summary</h2>

          <div class="items-list">
            <div v-for="(item, index) in items" :key="index" class="item">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-qty">x{{ item.quantity }}</span>
              <span class="item-price">${{ (item.quantity * item.price).toFixed(2) }}</span>
            </div>
          </div>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="total-row">
              <span>Shipping</span>
              <span>{{ shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2) }}</span>
            </div>
            <div class="total-row">
              <span>Tax</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>
            <div class="total-row total-final">
              <span>Total</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>
          </div>

          <button
            type="submit"
            :disabled="form.isSubmitting"
            class="submit-button"
          >
            {{ form.isSubmitting ? 'Processing...' : `Pay $${total.toFixed(2)}` }}
          </button>

          <p class="secure-notice">
            <span class="lock">&#128274;</span>
            Your payment information is secure
          </p>
        </section>
      </div>
    </div>
  </form>
</template>

<style scoped>
.checkout-form {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

@media (max-width: 768px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}

.form-section {
  background: #18181b;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #27272a;
  border-radius: 0.5rem;
  background: #09090b;
  color: #fafafa;
}

input:focus,
select:focus {
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

.order-summary {
  background: #18181b;
  padding: 1.5rem;
  border-radius: 0.5rem;
  position: sticky;
  top: 2rem;
}

.items-list {
  margin-bottom: 1rem;
}

.item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #27272a;
}

.item-name {
  flex: 1;
}

.item-qty {
  color: #a1a1aa;
  margin: 0 1rem;
}

.totals {
  margin: 1rem 0;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.total-final {
  border-top: 1px solid #27272a;
  font-weight: bold;
  font-size: 1.25rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
}

.submit-button {
  width: 100%;
  padding: 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.submit-button:hover {
  background: #2563eb;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secure-notice {
  text-align: center;
  margin-top: 1rem;
  color: #a1a1aa;
  font-size: 0.875rem;
}

.lock {
  margin-right: 0.25rem;
}
</style>
