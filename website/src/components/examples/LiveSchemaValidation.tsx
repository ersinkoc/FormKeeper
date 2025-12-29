import { useForm, useField, FormProvider } from '@oxog/formkeeper/react'
import { useState } from 'react'
import { Shield } from 'lucide-react'

interface ProductValues {
  name: string
  price: string
  quantity: string
  category: string
  description: string
}

// Schema-like validation rules (simulating Zod/Yup behavior)
const productSchema = {
  name: {
    required: 'Product name is required',
    minLength: { value: 3, message: 'Name must be at least 3 characters' },
    maxLength: { value: 50, message: 'Name must be less than 50 characters' },
  },
  price: {
    required: 'Price is required',
    validate: (value: string) => {
      const num = parseFloat(value)
      if (isNaN(num)) return 'Must be a valid number'
      if (num <= 0) return 'Price must be greater than 0'
      if (num > 999999) return 'Price is too high'
      return true
    },
  },
  quantity: {
    required: 'Quantity is required',
    validate: (value: string) => {
      const num = parseInt(value, 10)
      if (isNaN(num)) return 'Must be a valid integer'
      if (num < 0) return 'Quantity cannot be negative'
      if (num > 10000) return 'Maximum quantity is 10,000'
      return true
    },
  },
  category: {
    required: 'Category is required',
  },
  description: {
    minLength: { value: 10, message: 'Description must be at least 10 characters' },
    maxLength: { value: 500, message: 'Description must be less than 500 characters' },
  },
}

export function LiveSchemaValidation() {
  const [result, setResult] = useState<string | null>(null)

  const form = useForm<ProductValues>({
    initialValues: {
      name: '',
      price: '',
      quantity: '',
      category: '',
      description: '',
    },
    onSubmit: async (values) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      // Transform values to proper types
      const product = {
        name: values.name,
        price: parseFloat(values.price),
        quantity: parseInt(values.quantity, 10),
        category: values.category,
        description: values.description,
      }
      setResult(JSON.stringify(product, null, 2))
    },
  })

  return (
    <FormProvider form={form}>
      <form
        onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}
        className="max-w-md mx-auto p-6 space-y-4"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <Shield className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold">Add Product</h2>
        </div>

        <p className="text-sm text-zinc-400 text-center mb-4">
          Schema-based validation ensures data integrity
        </p>

        <NameField />
        <div className="grid grid-cols-2 gap-4">
          <PriceField />
          <QuantityField />
        </div>
        <CategoryField />
        <DescriptionField />

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md
                     hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {form.formState.isSubmitting ? 'Adding...' : 'Add Product'}
        </button>

        {result && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
            <p className="text-sm text-green-400 font-medium mb-1">Product Added!</p>
            <pre className="text-xs text-green-300 overflow-auto">{result}</pre>
          </div>
        )}
      </form>
    </FormProvider>
  )
}

function NameField() {
  const { register, error, touched } = useField('name', productSchema.name)

  return (
    <div className="space-y-1">
      <label htmlFor="product-name" className="block text-sm font-medium">
        Product Name <span className="text-red-400">*</span>
      </label>
      <input
        {...register()}
        id="product-name"
        placeholder="e.g. Wireless Mouse"
        className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {touched && error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}

function PriceField() {
  const { register, error, touched } = useField('price', productSchema.price)

  return (
    <div className="space-y-1">
      <label htmlFor="product-price" className="block text-sm font-medium">
        Price ($) <span className="text-red-400">*</span>
      </label>
      <input
        {...register()}
        id="product-price"
        type="number"
        step="0.01"
        placeholder="29.99"
        className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {touched && error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

function QuantityField() {
  const { register, error, touched } = useField('quantity', productSchema.quantity)

  return (
    <div className="space-y-1">
      <label htmlFor="product-quantity" className="block text-sm font-medium">
        Quantity <span className="text-red-400">*</span>
      </label>
      <input
        {...register()}
        id="product-quantity"
        type="number"
        placeholder="100"
        className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {touched && error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

function CategoryField() {
  const { register, error, touched } = useField('category', productSchema.category)

  return (
    <div className="space-y-1">
      <label htmlFor="product-category" className="block text-sm font-medium">
        Category <span className="text-red-400">*</span>
      </label>
      <select
        {...register()}
        id="product-category"
        className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a category</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="books">Books</option>
        <option value="home">Home & Garden</option>
        <option value="toys">Toys</option>
      </select>
      {touched && error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}

function DescriptionField() {
  const { register, error, touched } = useField('description', productSchema.description)

  return (
    <div className="space-y-1">
      <label htmlFor="product-description" className="block text-sm font-medium">
        Description
      </label>
      <textarea
        {...register()}
        id="product-description"
        rows={3}
        placeholder="Describe your product..."
        className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800/50
                   focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      {touched && error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
