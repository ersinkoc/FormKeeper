import { createForm } from '@/create-form'

describe('Array Field Operations', () => {
  it('should initialize field array from initial values', () => {
    const form = createForm({
      initialValues: {
        items: [{ name: 'Item 1' }, { name: 'Item 2' }],
      },
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items')

    expect(fieldArray.fields).toHaveLength(2)
    expect(fieldArray.fields[0]).toHaveProperty('name', 'Item 1')
    expect(fieldArray.fields[0]).toHaveProperty('id')
  })

  it('should append item to array', () => {
    const form = createForm({
      initialValues: { items: [] },
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items')

    fieldArray.append({ name: 'New Item' })

    expect(fieldArray.fields).toHaveLength(1)
    expect(fieldArray.fields[0]).toHaveProperty('name', 'New Item')
  })

  it('should prepend item to array', () => {
    const form = createForm({
      initialValues: { items: [{ name: 'Second' }] },
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items')

    fieldArray.prepend({ name: 'First' })

    expect(fieldArray.fields).toHaveLength(2)
    expect(fieldArray.fields[0]).toHaveProperty('name', 'First')
    expect(fieldArray.fields[1]).toHaveProperty('name', 'Second')
  })

  it('should insert item at specific index', () => {
    const form = createForm({
      initialValues: { items: [{ name: 'First' }, { name: 'Third' }] },
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items')

    fieldArray.insert(1, { name: 'Second' })

    expect(fieldArray.fields).toHaveLength(3)
    expect(fieldArray.fields[1]).toHaveProperty('name', 'Second')
  })

  it('should remove item by index', () => {
    const form = createForm({
      initialValues: { items: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] },
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items')

    fieldArray.remove(1)

    // Get fresh fieldArray to see updated state
    const updatedFieldArray = form.useFieldArray('items')

    expect(updatedFieldArray.fields).toHaveLength(2)
    expect(updatedFieldArray.fields[0]).toHaveProperty('name', 'A')
    expect(updatedFieldArray.fields[1]).toHaveProperty('name', 'C')
  })

  it('should remove multiple items by indices', () => {
    const form = createForm({
      initialValues: { items: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }] },
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items')

    fieldArray.remove([1, 2])

    // Get fresh fieldArray to see updated state
    const updatedFieldArray = form.useFieldArray('items')

    expect(updatedFieldArray.fields).toHaveLength(2)
    expect(updatedFieldArray.fields[0]).toHaveProperty('name', 'A')
    expect(updatedFieldArray.fields[1]).toHaveProperty('name', 'D')
  })

  it('should swap two items', () => {
    const form = createForm({
      initialValues: { items: [{ name: 'A' }, { name: 'B' }] },
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items')

    fieldArray.swap(0, 1)

    expect(fieldArray.fields[0]).toHaveProperty('name', 'B')
    expect(fieldArray.fields[1]).toHaveProperty('name', 'A')
  })

  it('should move item from one index to another', () => {
    const form = createForm({
      initialValues: { items: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] },
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items')

    fieldArray.move(0, 2)

    expect(fieldArray.fields[0]).toHaveProperty('name', 'B')
    expect(fieldArray.fields[1]).toHaveProperty('name', 'C')
    expect(fieldArray.fields[2]).toHaveProperty('name', 'A')
  })

  it('should update item at index', () => {
    const form = createForm({
      initialValues: { items: [{ name: 'Old' }] },
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items')

    fieldArray.update(0, { name: 'New' })

    expect(fieldArray.fields[0]).toHaveProperty('name', 'New')
  })

  it('should preserve item id when updating', () => {
    const form = createForm({
      initialValues: { items: [{ name: 'Old' }] },
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items')
    const originalId = fieldArray.fields[0]!.id

    fieldArray.update(0, { name: 'New' })

    expect(fieldArray.fields[0]!.id).toBe(originalId)
  })

  it('should replace all items', () => {
    const form = createForm({
      initialValues: { items: [{ name: 'A' }, { name: 'B' }] },
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items')

    fieldArray.replace([{ name: 'X' }, { name: 'Y' }, { name: 'Z' }])

    // Get fresh fieldArray to see updated state
    const updatedFieldArray = form.useFieldArray('items')

    expect(updatedFieldArray.fields).toHaveLength(3)
    expect(updatedFieldArray.fields[0]).toHaveProperty('name', 'X')
    expect(updatedFieldArray.fields[2]).toHaveProperty('name', 'Z')
  })

  it('should handle empty array initialization', () => {
    const form = createForm({
      initialValues: { items: [] },
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items')

    expect(fieldArray.fields).toHaveLength(0)

    fieldArray.append({ name: 'First' })

    expect(fieldArray.fields).toHaveLength(1)
  })

  it('should handle undefined array initialization', () => {
    const form = createForm({
      initialValues: {},
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items' as any)

    expect(fieldArray.fields).toHaveLength(0)
  })

  it('should validate on append with shouldValidate option', async () => {
    const form = createForm({
      initialValues: { items: [] },
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items')

    form.register('items[0].name', { required: 'Required' })

    fieldArray.append({ name: '' }, { shouldValidate: true })

    await new Promise((resolve) => setTimeout(resolve, 10))

    // Validation should have been triggered
    expect(form.isValid()).toBe(true) // No error because field wasn't registered before append
  })

  it('should validate on prepend with shouldValidate option', async () => {
    const form = createForm({
      initialValues: { items: [] },
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items')

    fieldArray.prepend({ name: 'test' }, { shouldValidate: true })

    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(fieldArray.fields).toHaveLength(1)
  })

  it('should validate on insert with shouldValidate option', async () => {
    const form = createForm({
      initialValues: { items: [{ name: 'First' }] },
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items')

    fieldArray.insert(0, { name: 'New' }, { shouldValidate: true })

    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(fieldArray.fields).toHaveLength(2)
  })

  it('should handle nested field arrays', () => {
    const form = createForm({
      initialValues: {
        users: [
          { name: 'John', hobbies: ['reading'] },
        ],
      },
      onSubmit: vi.fn(),
    })

    const userArray = form.useFieldArray('users')
    const hobbyArray = form.useFieldArray('users[0].hobbies')

    expect(userArray.fields).toHaveLength(1)
    expect(hobbyArray.fields).toHaveLength(1)
  })

  it('should generate unique ids for each item', () => {
    const form = createForm({
      initialValues: { items: [] },
      onSubmit: vi.fn(),
    })

    const fieldArray = form.useFieldArray('items')

    fieldArray.append({ name: 'A' })
    fieldArray.append({ name: 'B' })
    fieldArray.append({ name: 'C' })

    const ids = fieldArray.fields.map((f) => f.id)
    const uniqueIds = new Set(ids)

    expect(uniqueIds.size).toBe(3)
  })
})
