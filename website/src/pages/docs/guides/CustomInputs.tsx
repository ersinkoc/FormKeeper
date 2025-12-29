import { CodeBlock } from '@/components/code/CodeBlock'

export default function CustomInputs() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Custom Inputs</h1>
      <p className="lead">
        Integrate custom components, third-party libraries, and controlled inputs with FormKeeper.
      </p>

      <h2>Using Controller</h2>
      <p>
        The <code>Controller</code> component wraps controlled components:
      </p>

      <CodeBlock language="tsx">{`import { Controller } from '@oxog/formkeeper/react'
import DatePicker from 'react-datepicker'
import Select from 'react-select'

function CustomDateField() {
  return (
    <Controller
      name="birthDate"
      rules={{ required: 'Date is required' }}
      render={({ field, fieldState }) => (
        <div className="form-group">
          <label>Birth Date</label>
          <DatePicker
            selected={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            dateFormat="yyyy-MM-dd"
            className={fieldState.error ? 'input-error' : ''}
          />
          {fieldState.error && (
            <span className="error">{fieldState.error}</span>
          )}
        </div>
      )}
    />
  )
}

function CustomSelectField() {
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
        <div className="form-group">
          <label>Framework</label>
          <Select
            options={options}
            value={options.find(o => o.value === field.value)}
            onChange={(option) => field.onChange(option?.value)}
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

      <h2>Building Custom Input Components</h2>

      <h3>Star Rating</h3>
      <CodeBlock language="tsx">{`interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  onBlur?: () => void
  max?: number
}

function StarRating({ value, onChange, onBlur, max = 5 }: StarRatingProps) {
  return (
    <div className="star-rating" onBlur={onBlur} tabIndex={0}>
      {Array.from({ length: max }, (_, i) => i + 1).map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={star <= value ? 'filled' : 'empty'}
          aria-label={\`Rate \${star} stars\`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

// Usage with Controller
function RatingField() {
  return (
    <Controller
      name="rating"
      rules={{
        required: 'Please rate your experience',
        min: { value: 1, message: 'Minimum 1 star' }
      }}
      render={({ field, fieldState }) => (
        <div className="form-group">
          <label>Rating</label>
          <StarRating
            value={field.value || 0}
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

      <h3>Color Picker</h3>
      <CodeBlock language="tsx">{`const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']

function ColorPicker({ value, onChange, onBlur }) {
  return (
    <div className="color-picker" onBlur={onBlur} tabIndex={0}>
      {COLORS.map(color => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={\`color-swatch \${value === color ? 'selected' : ''}\`}
          style={{ backgroundColor: color }}
          aria-label={color}
        />
      ))}
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="custom-color"
      />
    </div>
  )
}

function ColorField() {
  return (
    <Controller
      name="brandColor"
      defaultValue="#3b82f6"
      render={({ field }) => (
        <div className="form-group">
          <label>Brand Color</label>
          <ColorPicker
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
          <span className="color-preview" style={{ color: field.value }}>
            Preview: {field.value}
          </span>
        </div>
      )}
    />
  )
}`}</CodeBlock>

      <h3>Tag Input</h3>
      <CodeBlock language="tsx">{`interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  onBlur?: () => void
  placeholder?: string
}

function TagInput({ value = [], onChange, onBlur, placeholder }: TagInputProps) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const tag = input.trim()
    if (tag && !value.includes(tag)) {
      onChange([...value, tag])
      setInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div className="tag-input" onBlur={onBlur}>
      <div className="tags">
        {value.map(tag => (
          <span key={tag} className="tag">
            {tag}
            <button type="button" onClick={() => removeTag(tag)}>×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  )
}

function TagsField() {
  return (
    <Controller
      name="tags"
      defaultValue={[]}
      rules={{
        validate: (tags) => tags.length >= 1 || 'Add at least one tag'
      }}
      render={({ field, fieldState }) => (
        <div className="form-group">
          <label>Tags</label>
          <TagInput
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            placeholder="Type and press Enter"
          />
          {fieldState.error && (
            <span className="error">{fieldState.error}</span>
          )}
        </div>
      )}
    />
  )
}`}</CodeBlock>

      <h2>Using useField Directly</h2>
      <p>
        For simpler cases, use <code>useField</code> with manual control:
      </p>

      <CodeBlock language="tsx">{`function ToggleField() {
  const { value, setValue, setTouched, error, touched } = useField('notifications')

  return (
    <div className="form-group">
      <label>Notifications</label>
      <button
        type="button"
        onClick={() => {
          setValue(!value)
          setTouched(true)
        }}
        className={\`toggle \${value ? 'on' : 'off'}\`}
      >
        {value ? 'ON' : 'OFF'}
      </button>
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}

function SliderField() {
  const { value, setValue, setTouched } = useField('volume', {
    min: { value: 0, message: 'Min 0' },
    max: { value: 100, message: 'Max 100' }
  })

  return (
    <div className="form-group">
      <label>Volume: {value || 0}%</label>
      <input
        type="range"
        min="0"
        max="100"
        value={value || 0}
        onChange={(e) => setValue(parseInt(e.target.value))}
        onBlur={() => setTouched(true)}
      />
    </div>
  )
}`}</CodeBlock>

      <h2>Rich Text Editor</h2>
      <CodeBlock language="tsx">{`import ReactQuill from 'react-quill'

function RichTextField() {
  return (
    <Controller
      name="content"
      rules={{
        required: 'Content is required',
        validate: (value) => {
          // Strip HTML to check actual content
          const text = value.replace(/<[^>]*>/g, '').trim()
          return text.length >= 10 || 'Minimum 10 characters'
        }
      }}
      render={({ field, fieldState }) => (
        <div className="form-group">
          <label>Content</label>
          <ReactQuill
            value={field.value || ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            className={fieldState.error ? 'ql-error' : ''}
          />
          {fieldState.error && (
            <span className="error">{fieldState.error}</span>
          )}
        </div>
      )}
    />
  )
}`}</CodeBlock>

      <h2>File Upload</h2>
      <CodeBlock language="tsx">{`function FileUploadField() {
  return (
    <Controller
      name="avatar"
      rules={{
        validate: (file) => {
          if (!file) return 'Please select a file'
          if (file.size > 5 * 1024 * 1024) return 'Max 5MB'
          if (!file.type.startsWith('image/')) return 'Images only'
          return true
        }
      }}
      render={({ field, fieldState }) => (
        <div className="form-group">
          <label>Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => field.onChange(e.target.files?.[0])}
            onBlur={field.onBlur}
          />
          {field.value && (
            <img
              src={URL.createObjectURL(field.value)}
              alt="Preview"
              className="avatar-preview"
            />
          )}
          {fieldState.error && (
            <span className="error">{fieldState.error}</span>
          )}
        </div>
      )}
    />
  )
}`}</CodeBlock>

      <h2>Wrapping UI Library Components</h2>
      <CodeBlock language="tsx">{`import { TextField, Checkbox, Select, MenuItem } from '@mui/material'

// Create reusable wrappers
function MuiTextField({ name, label, rules, ...props }) {
  return (
    <Controller
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...props}
          label={label}
          error={!!fieldState.error}
          helperText={fieldState.error}
          fullWidth
        />
      )}
    />
  )
}

function MuiSelect({ name, label, options, rules }) {
  return (
    <Controller
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          select
          label={label}
          error={!!fieldState.error}
          helperText={fieldState.error}
          fullWidth
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  )
}

// Usage
<MuiTextField
  name="email"
  label="Email"
  rules={{ required: 'Email is required' }}
  type="email"
/>

<MuiSelect
  name="country"
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' }
  ]}
  rules={{ required: 'Select a country' }}
/>`}</CodeBlock>
    </div>
  )
}
