import { CodeBlock } from '@/components/code/CodeBlock'
import { PropsTable } from '@/components/code/PropsTable'

export default function Controller() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Controller</h1>
      <p className="lead">
        Component for integrating controlled components and custom inputs with FormKeeper.
      </p>

      <h2>Import</h2>
      <CodeBlock language="typescript">{`import { Controller } from '@oxog/formkeeper/react'`}</CodeBlock>

      <h2>When to Use</h2>
      <p>
        Use <code>Controller</code> when working with:
      </p>
      <ul>
        <li>UI libraries (Material UI, Ant Design, etc.)</li>
        <li>Custom controlled components</li>
        <li>Third-party inputs (date pickers, rich text editors)</li>
        <li>Components that don't expose a ref or standard input API</li>
      </ul>

      <h2>Basic Usage</h2>
      <CodeBlock language="tsx">{`import { Controller } from '@oxog/formkeeper/react'
import { DatePicker } from 'some-ui-library'

function DateField() {
  return (
    <Controller
      name="birthDate"
      rules={{ required: 'Date is required' }}
      render={({ field, fieldState }) => (
        <div>
          <DatePicker
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
          {fieldState.error && (
            <span className="error">{fieldState.error}</span>
          )}
        </div>
      )}
    />
  )
}`}</CodeBlock>

      <h2>Props</h2>
      <PropsTable
        props={[
          { name: 'name', type: 'string', required: true, description: 'Field name (supports dot notation)' },
          { name: 'rules', type: 'ValidationRules', description: 'Validation rules' },
          { name: 'defaultValue', type: 'any', description: 'Default value for the field' },
          { name: 'render', type: '(props: ControllerRenderProps) => ReactElement', required: true, description: 'Render function for the controlled component' },
        ]}
      />

      <h2>Render Props</h2>
      <h3>field</h3>
      <PropsTable
        props={[
          { name: 'name', type: 'string', description: 'Field name' },
          { name: 'value', type: 'any', description: 'Current field value' },
          { name: 'onChange', type: '(value: any) => void', description: 'Value change handler' },
          { name: 'onBlur', type: '() => void', description: 'Blur handler' },
          { name: 'ref', type: 'React.Ref<any>', description: 'Ref for focus management' },
        ]}
      />

      <h3>fieldState</h3>
      <PropsTable
        props={[
          { name: 'error', type: 'string | undefined', description: 'Current error message' },
          { name: 'touched', type: 'boolean', description: 'Whether field has been blurred' },
          { name: 'dirty', type: 'boolean', description: 'Whether value differs from initial' },
          { name: 'invalid', type: 'boolean', description: 'Whether field has error' },
        ]}
      />

      <h3>formState</h3>
      <PropsTable
        props={[
          { name: 'isSubmitting', type: 'boolean', description: 'Form submission in progress' },
          { name: 'isValid', type: 'boolean', description: 'Form has no errors' },
          { name: 'submitCount', type: 'number', description: 'Number of submit attempts' },
        ]}
      />

      <h2>With Material UI</h2>
      <CodeBlock language="tsx">{`import { Controller } from '@oxog/formkeeper/react'
import { TextField, Slider, Autocomplete } from '@mui/material'

function MuiTextField() {
  return (
    <Controller
      name="email"
      rules={{
        required: 'Email is required',
        pattern: {
          value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
          message: 'Invalid email'
        }
      }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label="Email"
          error={!!fieldState.error}
          helperText={fieldState.error}
          fullWidth
        />
      )}
    />
  )
}

function MuiSlider() {
  return (
    <Controller
      name="volume"
      defaultValue={50}
      render={({ field }) => (
        <Slider
          value={field.value}
          onChange={(_, value) => field.onChange(value)}
          min={0}
          max={100}
        />
      )}
    />
  )
}

function MuiAutocomplete() {
  return (
    <Controller
      name="country"
      rules={{ required: 'Country is required' }}
      render={({ field, fieldState }) => (
        <Autocomplete
          options={countries}
          value={field.value}
          onChange={(_, value) => field.onChange(value)}
          onBlur={field.onBlur}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Country"
              error={!!fieldState.error}
              helperText={fieldState.error}
            />
          )}
        />
      )}
    />
  )
}`}</CodeBlock>

      <h2>With React Select</h2>
      <CodeBlock language="tsx">{`import { Controller } from '@oxog/formkeeper/react'
import Select from 'react-select'

function ReactSelectField() {
  const options = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' }
  ]

  return (
    <Controller
      name="framework"
      rules={{ required: 'Please select a framework' }}
      render={({ field, fieldState }) => (
        <div>
          <Select
            options={options}
            value={options.find(o => o.value === field.value)}
            onChange={(option) => field.onChange(option?.value)}
            onBlur={field.onBlur}
            isClearable
          />
          {fieldState.error && (
            <span className="error">{fieldState.error}</span>
          )}
        </div>
      )}
    />
  )
}`}</CodeBlock>

      <h2>Custom Rating Component</h2>
      <CodeBlock language="tsx">{`import { Controller } from '@oxog/formkeeper/react'

function StarRating({ value, onChange, onBlur }) {
  return (
    <div className="star-rating" onBlur={onBlur}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={star <= value ? 'filled' : 'empty'}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function RatingField() {
  return (
    <Controller
      name="rating"
      rules={{
        required: 'Please rate your experience',
        min: { value: 1, message: 'Minimum 1 star' }
      }}
      render={({ field, fieldState }) => (
        <div>
          <label>Your Rating</label>
          <StarRating
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
          {fieldState.error && (
            <span className="error">{fieldState.error}</span>
          )}
        </div>
      )}
    />
  )
}`}</CodeBlock>

      <h2>With Date Picker</h2>
      <CodeBlock language="tsx">{`import { Controller } from '@oxog/formkeeper/react'
import DatePicker from 'react-datepicker'

function DateField() {
  return (
    <Controller
      name="startDate"
      rules={{ required: 'Start date is required' }}
      render={({ field, fieldState }) => (
        <div>
          <DatePicker
            selected={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
            className={fieldState.error ? 'input-error' : ''}
          />
          {fieldState.error && (
            <span className="error">{fieldState.error}</span>
          )}
        </div>
      )}
    />
  )
}`}</CodeBlock>

      <h2>Transforming Values</h2>
      <CodeBlock language="tsx">{`function CurrencyField() {
  return (
    <Controller
      name="price"
      render={({ field }) => (
        <input
          type="text"
          // Display formatted value
          value={formatCurrency(field.value)}
          // Parse input to number
          onChange={(e) => {
            const numericValue = parseCurrency(e.target.value)
            field.onChange(numericValue)
          }}
          onBlur={field.onBlur}
        />
      )}
    />
  )
}`}</CodeBlock>
    </div>
  )
}
