# FormKeeper - Implementation Tasks

**Version:** 1.0.0
**Date:** 2025-12-28
**Author:** Ersin KOÇ
**Status:** Ready for Implementation

---

## Task Organization

Tasks are organized into phases with clear dependencies. Each task must be completed in order, and all tests must pass before moving to the next task.

**Legend:**
- 🔵 Phase (group of related tasks)
- ✅ Task (actionable item)
- 📦 Deliverable
- ⚠️ Critical requirement
- 🧪 Test requirement

---

## 🔵 Phase 1: Project Setup (Foundation)

**Goal:** Set up project structure, tooling, and configuration

### Task 1.1: Initialize Project Structure
**Duration:** 30 minutes
**Dependencies:** None

**Actions:**
1. Create directory structure:
   ```
   formkeeper/
   ├── src/
   │   ├── kernel/
   │   ├── plugins/
   │   │   ├── core/
   │   │   └── optional/
   │   ├── adapters/
   │   │   ├── react/
   │   │   ├── vue/
   │   │   └── svelte/
   │   └── utils/
   ├── tests/
   │   ├── unit/
   │   └── integration/
   ├── examples/
   └── website/
   ```

2. Create initial files:
   - `package.json`
   - `tsconfig.json`
   - `tsup.config.ts`
   - `vitest.config.ts`
   - `.gitignore`
   - `LICENSE` (MIT)
   - `README.md` (placeholder)

**📦 Deliverables:**
- Complete directory structure
- All config files created

**🧪 Tests:**
- [ ] Project builds without errors
- [ ] TypeScript compilation succeeds

---

### Task 1.2: Configure package.json
**Duration:** 20 minutes
**Dependencies:** Task 1.1

**Actions:**
1. Set package metadata:
   ```json
   {
     "name": "@oxog/formkeeper",
     "version": "1.0.0",
     "description": "Zero-dependency headless form state manager",
     "author": "Ersin KOÇ",
     "license": "MIT",
     "repository": "github:ersinkoc/formkeeper",
     "keywords": ["form", "validation", "react", "vue", "svelte"]
   }
   ```

2. Configure exports:
   ```json
   {
     "exports": {
       ".": {
         "import": "./dist/index.js",
         "require": "./dist/index.cjs",
         "types": "./dist/index.d.ts"
       },
       "./plugins": { ... },
       "./react": { ... },
       "./vue": { ... },
       "./svelte": { ... }
     }
   }
   ```

3. Add scripts:
   ```json
   {
     "scripts": {
       "dev": "tsup --watch",
       "build": "tsup",
       "test": "vitest",
       "test:coverage": "vitest --coverage",
       "typecheck": "tsc --noEmit"
     }
   }
   ```

4. Add devDependencies:
   - typescript@^5.3.0
   - tsup@^8.0.0
   - vitest@^1.0.0
   - @vitest/coverage-v8@^1.0.0

5. ⚠️ **CRITICAL:** `dependencies` must remain empty

**📦 Deliverables:**
- Configured package.json
- Zero runtime dependencies

**🧪 Tests:**
- [ ] `npm install` succeeds
- [ ] `dependencies` object is empty

---

### Task 1.3: Configure TypeScript
**Duration:** 15 minutes
**Dependencies:** Task 1.2

**Actions:**
1. Create `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "ESNext",
       "lib": ["ES2020", "DOM"],
       "moduleResolution": "bundler",
       "strict": true,
       "noUncheckedIndexedAccess": true,
       "noImplicitOverride": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "declaration": true,
       "declarationMap": true,
       "sourceMap": true,
       "outDir": "./dist",
       "rootDir": "./src"
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist", "tests"]
   }
   ```

2. ⚠️ **CRITICAL:** Strict mode MUST be enabled

**📦 Deliverables:**
- tsconfig.json with strict mode

**🧪 Tests:**
- [ ] `npm run typecheck` succeeds
- [ ] Strict mode enabled

---

### Task 1.4: Configure Build System (tsup)
**Duration:** 20 minutes
**Dependencies:** Task 1.3

**Actions:**
1. Create `tsup.config.ts`:
   ```typescript
   import { defineConfig } from 'tsup'

   export default defineConfig({
     entry: {
       index: 'src/index.ts',
       'plugins/index': 'src/plugins/index.ts',
       'react/index': 'src/adapters/react/index.ts',
       'vue/index': 'src/adapters/vue/index.ts',
       'svelte/index': 'src/adapters/svelte/index.ts',
     },
     format: ['esm', 'cjs'],
     dts: true,
     clean: true,
     minify: true,
     treeshake: true,
     sourcemap: true,
     external: ['react', 'react-dom', 'vue', 'svelte'],
   })
   ```

**📦 Deliverables:**
- tsup.config.ts

**🧪 Tests:**
- [ ] `npm run build` succeeds
- [ ] Generates ESM and CJS formats
- [ ] Generates type declarations

---

### Task 1.5: Configure Testing (Vitest)
**Duration:** 20 minutes
**Dependencies:** Task 1.3

**Actions:**
1. Create `vitest.config.ts`:
   ```typescript
   import { defineConfig } from 'vitest/config'

   export default defineConfig({
     test: {
       environment: 'jsdom',
       coverage: {
         provider: 'v8',
         reporter: ['text', 'html', 'lcov'],
         exclude: ['tests/**', '**/*.test.ts'],
         lines: 100,
         functions: 100,
         branches: 100,
         statements: 100,
       },
     },
   })
   ```

2. Install additional test deps:
   - jsdom@^23.0.0
   - @testing-library/react@^14.0.0
   - @testing-library/vue@^8.0.0
   - @testing-library/svelte@^4.0.0

3. ⚠️ **CRITICAL:** Coverage thresholds set to 100%

**📦 Deliverables:**
- vitest.config.ts
- Test environment ready

**🧪 Tests:**
- [ ] `npm test` runs (no tests yet)
- [ ] Coverage config correct

---

## 🔵 Phase 2: Type System

**Goal:** Implement complete type definitions

### Task 2.1: Create Core Types
**Duration:** 45 minutes
**Dependencies:** Task 1.5

**Actions:**
1. Create `src/types.ts`
2. Define base types:
   - `FieldValues`
   - `FieldPath<T>`
   - `FieldPathValue<T, P>`
   - `DeepPartial<T>`
3. Define field types:
   - `FieldRegistration`
   - `FieldState`
   - `FormErrors<T>`
   - `TouchedFields<T>`
   - `DirtyFields<T>`
4. Define option types:
   - `FormOptions<T>`
   - `SetValueOptions`
   - `ResetOptions`
   - `ValidationRules`
5. Define event types:
   - `EventType`
   - `FormEvent<T>`
   - `EventHandler<E, T>`
6. Define plugin types:
   - `Plugin<T>`
   - `PluginInfo`

**📦 Deliverables:**
- `src/types.ts` with all type definitions

**🧪 Tests:**
- [ ] TypeScript compilation succeeds
- [ ] No `any` types without justification
- [ ] All exports are properly typed

---

## 🔵 Phase 3: Utility Functions

**Goal:** Implement zero-dependency utility functions

### Task 3.1: Path Utilities
**Duration:** 1 hour
**Dependencies:** Task 2.1

**Actions:**
1. Create `src/utils/path.ts`
2. Implement `parsePath(path: string): string[]`
   - Support dot notation: `'user.name'`
   - Support bracket notation: `'items[0]'`
3. Implement `deepGet(obj: any, path: string): any`
4. Implement `deepSet(obj: any, path: string, value: any): void`

**📦 Deliverables:**
- `src/utils/path.ts`

**🧪 Tests:**
```typescript
// tests/unit/utils/path.test.ts
describe('path utilities', () => {
  test('parsePath with dot notation', () => {
    expect(parsePath('user.profile.name')).toEqual(['user', 'profile', 'name'])
  })

  test('parsePath with bracket notation', () => {
    expect(parsePath('items[0].name')).toEqual(['items', '0', 'name'])
  })

  test('deepGet retrieves nested value', () => {
    const obj = { user: { profile: { name: 'John' } } }
    expect(deepGet(obj, 'user.profile.name')).toBe('John')
  })

  test('deepGet returns undefined for missing path', () => {
    expect(deepGet({}, 'missing.path')).toBeUndefined()
  })

  test('deepSet creates nested structure', () => {
    const obj = {}
    deepSet(obj, 'user.profile.name', 'John')
    expect(obj).toEqual({ user: { profile: { name: 'John' } } })
  })
})
```

**⚠️ Test Coverage Required:** 100%

---

### Task 3.2: Deep Clone
**Duration:** 30 minutes
**Dependencies:** Task 2.1

**Actions:**
1. Create `src/utils/deep-clone.ts`
2. Implement `deepClone<T>(value: T): T`
   - Handle primitives
   - Handle Date
   - Handle RegExp
   - Handle Arrays
   - Handle Objects
   - Handle circular references (throw error)

**📦 Deliverables:**
- `src/utils/deep-clone.ts`

**🧪 Tests:**
```typescript
// tests/unit/utils/deep-clone.test.ts
describe('deepClone', () => {
  test('clones primitives', () => {
    expect(deepClone(42)).toBe(42)
    expect(deepClone('hello')).toBe('hello')
    expect(deepClone(true)).toBe(true)
  })

  test('clones Date', () => {
    const date = new Date()
    const cloned = deepClone(date)
    expect(cloned).toEqual(date)
    expect(cloned).not.toBe(date)
  })

  test('clones arrays', () => {
    const arr = [1, 2, [3, 4]]
    const cloned = deepClone(arr)
    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
    expect(cloned[2]).not.toBe(arr[2])
  })

  test('clones objects', () => {
    const obj = { a: 1, b: { c: 2 } }
    const cloned = deepClone(obj)
    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj)
    expect(cloned.b).not.toBe(obj.b)
  })
})
```

**⚠️ Test Coverage Required:** 100%

---

### Task 3.3: Deep Equal
**Duration:** 30 minutes
**Dependencies:** Task 2.1

**Actions:**
1. Create `src/utils/deep-equal.ts`
2. Implement `deepEqual(a: any, b: any): boolean`

**📦 Deliverables:**
- `src/utils/deep-equal.ts`

**🧪 Tests:**
```typescript
describe('deepEqual', () => {
  test('compares primitives', () => {
    expect(deepEqual(1, 1)).toBe(true)
    expect(deepEqual(1, 2)).toBe(false)
  })

  test('compares objects', () => {
    expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true)
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false)
  })

  test('compares nested objects', () => {
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true)
  })

  test('compares arrays', () => {
    expect(deepEqual([1, 2], [1, 2])).toBe(true)
    expect(deepEqual([1, 2], [2, 1])).toBe(false)
  })
})
```

**⚠️ Test Coverage Required:** 100%

---

### Task 3.4: UID Generator
**Duration:** 15 minutes
**Dependencies:** Task 2.1

**Actions:**
1. Create `src/utils/uid.ts`
2. Implement `generateId(): string`
   - Format: `fk-{timestamp}-{counter}`
   - Ensure uniqueness

**📦 Deliverables:**
- `src/utils/uid.ts`

**🧪 Tests:**
```typescript
describe('generateId', () => {
  test('generates unique IDs', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })

  test('ID format is correct', () => {
    const id = generateId()
    expect(id).toMatch(/^fk-\d+-\d+$/)
  })
})
```

**⚠️ Test Coverage Required:** 100%

---

### Task 3.5: Debounce
**Duration:** 20 minutes
**Dependencies:** Task 2.1

**Actions:**
1. Create `src/utils/debounce.ts`
2. Implement `debounce<T>(fn: T, delay: number): T`

**📦 Deliverables:**
- `src/utils/debounce.ts`

**🧪 Tests:**
```typescript
describe('debounce', () => {
  test('delays function execution', async () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    await new Promise(resolve => setTimeout(resolve, 150))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('cancels previous call', async () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    debounced()
    debounced()

    await new Promise(resolve => setTimeout(resolve, 150))
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
```

**⚠️ Test Coverage Required:** 100%

---

### Task 3.6: Utils Index
**Duration:** 10 minutes
**Dependencies:** Tasks 3.1-3.5

**Actions:**
1. Create `src/utils/index.ts`
2. Re-export all utilities

**📦 Deliverables:**
- `src/utils/index.ts`

---

## 🔵 Phase 4: Kernel Implementation

**Goal:** Build the micro-kernel core

### Task 4.1: Event Bus
**Duration:** 1 hour
**Dependencies:** Task 3.6

**Actions:**
1. Create `src/kernel/event-bus.ts`
2. Implement `EventBus<TValues>` class:
   - `on<E>(eventType, handler): Unsubscribe`
   - `off<E>(eventType, handler): void`
   - `emit(event): void`
   - `clear(): void`

**📦 Deliverables:**
- `src/kernel/event-bus.ts`

**🧪 Tests:**
```typescript
describe('EventBus', () => {
  test('subscribes to events', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    bus.on('change', handler)
    bus.emit({ type: 'change', name: 'email', value: 'test', prevValue: '' })

    expect(handler).toHaveBeenCalled()
  })

  test('unsubscribes from events', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    const unsubscribe = bus.on('change', handler)
    unsubscribe()

    bus.emit({ type: 'change', name: 'email', value: 'test', prevValue: '' })
    expect(handler).not.toHaveBeenCalled()
  })

  test('handles errors in handlers', () => {
    const bus = new EventBus()
    const errorHandler = vi.fn(() => { throw new Error('test') })
    const normalHandler = vi.fn()

    bus.on('change', errorHandler)
    bus.on('change', normalHandler)

    expect(() => bus.emit({ type: 'change', name: 'test', value: 1, prevValue: 0 }))
      .not.toThrow()

    expect(normalHandler).toHaveBeenCalled()
  })
})
```

**⚠️ Test Coverage Required:** 100%

---

### Task 4.2: Plugin Registry
**Duration:** 1 hour
**Dependencies:** Task 4.1

**Actions:**
1. Create `src/kernel/plugin-registry.ts`
2. Implement `PluginRegistry<TValues>` class:
   - `register(plugin): void`
   - `unregister(name): void`
   - `unregisterAll(): void`
   - `get(name): Plugin | undefined`
   - `list(): PluginInfo[]`
   - `registerHooks(plugin): void` (private)

**📦 Deliverables:**
- `src/kernel/plugin-registry.ts`

**🧪 Tests:**
```typescript
describe('PluginRegistry', () => {
  test('registers plugin', () => {
    const registry = new PluginRegistry(eventBus)
    const plugin = createMockPlugin('test')

    registry.register(plugin)
    expect(registry.get('test')).toBe(plugin)
  })

  test('throws on duplicate registration', () => {
    const registry = new PluginRegistry(eventBus)
    const plugin = createMockPlugin('test')

    registry.register(plugin)
    expect(() => registry.register(plugin)).toThrow()
  })

  test('unregisters plugin', () => {
    const registry = new PluginRegistry(eventBus)
    const plugin = createMockPlugin('test')

    registry.register(plugin)
    registry.unregister('test')

    expect(registry.get('test')).toBeUndefined()
  })

  test('lists all plugins', () => {
    const registry = new PluginRegistry(eventBus)
    registry.register(createMockPlugin('p1'))
    registry.register(createMockPlugin('p2'))

    const list = registry.list()
    expect(list).toHaveLength(2)
  })
})
```

**⚠️ Test Coverage Required:** 100%

---

### Task 4.3: Kernel Class
**Duration:** 2 hours
**Dependencies:** Task 4.2

**Actions:**
1. Create `src/kernel/kernel.ts`
2. Implement `Kernel<TValues>` class:
   - Constructor
   - `installCorePlugins(): void` (private)
   - `registerPlugin(plugin): void`
   - `unregisterPlugin(name): void`
   - `getPlugin<P>(name): P | undefined`
   - `emit(event): void`
   - `on(eventType, handler): Unsubscribe`
   - `off(eventType, handler): void`
   - `destroy(): void`
   - `getOptions(): FormOptions<TValues>`

**📦 Deliverables:**
- `src/kernel/kernel.ts`

**🧪 Tests:**
```typescript
describe('Kernel', () => {
  test('creates kernel instance', () => {
    const kernel = new Kernel({
      initialValues: {},
      onSubmit: vi.fn(),
    })

    expect(kernel).toBeDefined()
  })

  test('registers plugins', () => {
    const kernel = new Kernel({ initialValues: {}, onSubmit: vi.fn() })
    const plugin = createMockPlugin('test')

    kernel.registerPlugin(plugin)
    expect(kernel.getPlugin('test')).toBeDefined()
  })

  test('emits events', () => {
    const kernel = new Kernel({ initialValues: {}, onSubmit: vi.fn() })
    const handler = vi.fn()

    kernel.on('change', handler)
    kernel.emit({ type: 'change', name: 'test', value: 1, prevValue: 0 })

    expect(handler).toHaveBeenCalled()
  })

  test('destroys kernel', () => {
    const kernel = new Kernel({ initialValues: {}, onSubmit: vi.fn() })
    const plugin = createMockPlugin('test')

    kernel.registerPlugin(plugin)
    kernel.destroy()

    expect(kernel.getPlugin('test')).toBeUndefined()
  })
})
```

**⚠️ Test Coverage Required:** 100%

---

### Task 4.4: Kernel Index
**Duration:** 10 minutes
**Dependencies:** Task 4.3

**Actions:**
1. Create `src/kernel/index.ts`
2. Export Kernel, EventBus, PluginRegistry

**📦 Deliverables:**
- `src/kernel/index.ts`

---

## 🔵 Phase 5: Core Plugins (5 plugins)

### Task 5.1: field-registry Plugin
**Duration:** 2 hours
**Dependencies:** Task 4.4

**Actions:**
1. Create `src/plugins/core/field-registry.ts`
2. Implement field registry plugin with API:
   - `register(name, rules): FieldRegistration`
   - `unregister(name): void`
   - `getField(name): FieldState`
   - `isRegistered(name): boolean`
   - `setRef(name, element): void`
   - `getRef(name): HTMLElement | null`

**📦 Deliverables:**
- `src/plugins/core/field-registry.ts`

**🧪 Tests:**
```typescript
describe('field-registry plugin', () => {
  test('registers field', () => {
    const kernel = createKernel()
    const registration = kernel.register('email')

    expect(registration.name).toBe('email')
    expect(typeof registration.onChange).toBe('function')
  })

  test('handles change event', () => {
    const kernel = createKernel()
    const registration = kernel.register('email')

    const event = { target: { value: 'test@example.com' } }
    registration.onChange(event)

    // Verify change event was emitted
  })

  test('stores field ref', () => {
    const kernel = createKernel()
    const registration = kernel.register('email')
    const element = document.createElement('input')

    registration.ref(element)
    // Verify ref was stored
  })
})
```

**⚠️ Test Coverage Required:** 100%

---

### Task 5.2: state-manager Plugin
**Duration:** 2.5 hours
**Dependencies:** Task 5.1

**Actions:**
1. Create `src/plugins/core/state-manager.ts`
2. Implement state manager plugin with API:
   - `getValues(): TValues`
   - `getValue(name): any`
   - `setValue(name, value, options): void`
   - `setValues(values, options): void`
   - `getTouched(): TouchedFields`
   - `isTouched(name): boolean`
   - `setTouched(name, touched): void`
   - `getDirty(): DirtyFields`
   - `isDirty(name?): boolean`
   - `reset(values?, options?): void`
   - `resetField(name, options?): void`

**📦 Deliverables:**
- `src/plugins/core/state-manager.ts`

**🧪 Tests:**
```typescript
describe('state-manager plugin', () => {
  test('gets initial values', () => {
    const kernel = createKernel({ initialValues: { email: 'test@example.com' } })
    expect(kernel.getValues()).toEqual({ email: 'test@example.com' })
  })

  test('sets value', () => {
    const kernel = createKernel({ initialValues: { email: '' } })
    kernel.setValue('email', 'new@example.com')
    expect(kernel.getValues('email')).toBe('new@example.com')
  })

  test('tracks dirty state', () => {
    const kernel = createKernel({ initialValues: { email: '' } })
    expect(kernel.isDirty()).toBe(false)

    kernel.setValue('email', 'test@example.com')
    expect(kernel.isDirty()).toBe(true)
    expect(kernel.isDirty('email')).toBe(true)
  })

  test('tracks touched state', () => {
    const kernel = createKernel({ initialValues: { email: '' } })
    expect(kernel.isTouched('email')).toBe(false)

    kernel.setTouched('email', true)
    expect(kernel.isTouched('email')).toBe(true)
  })

  test('resets form', () => {
    const kernel = createKernel({ initialValues: { email: '' } })

    kernel.setValue('email', 'test@example.com')
    kernel.setTouched('email', true)

    kernel.reset()

    expect(kernel.getValues()).toEqual({ email: '' })
    expect(kernel.isTouched('email')).toBe(false)
  })

  test('supports nested values', () => {
    const kernel = createKernel({
      initialValues: { user: { profile: { name: '' } } }
    })

    kernel.setValue('user.profile.name', 'John')
    expect(kernel.getValue('user.profile.name')).toBe('John')
  })
})
```

**⚠️ Test Coverage Required:** 100%

---

### Task 5.3: validation-engine Plugin
**Duration:** 3 hours
**Dependencies:** Task 5.2

**Actions:**
1. Create `src/plugins/core/validation-engine.ts`
2. Implement validation engine with API:
   - `validate(): Promise<boolean>`
   - `validateField(name): Promise<boolean>`
   - `getErrors(): FormErrors`
   - `getError(name): string | undefined`
   - `setError(name, error): void`
   - `clearError(name): void`
   - `clearErrors(): void`
   - `isValid(): boolean`
   - `isValidating(): boolean`

3. Implement built-in rules:
   - required
   - min/max
   - minLength/maxLength
   - pattern

4. Support custom validators
5. Handle async validation with abort

**📦 Deliverables:**
- `src/plugins/core/validation-engine.ts`

**🧪 Tests:**
```typescript
describe('validation-engine plugin', () => {
  test('validates required field', async () => {
    const kernel = createKernel({ initialValues: { email: '' } })
    kernel.register('email', { required: 'Email is required' })

    const isValid = await kernel.validateField('email')
    expect(isValid).toBe(false)
    expect(kernel.getError('email')).toBe('Email is required')
  })

  test('validates pattern', async () => {
    const kernel = createKernel({ initialValues: { email: 'invalid' } })
    kernel.register('email', {
      pattern: { value: /^\\S+@\\S+$/, message: 'Invalid email' }
    })

    const isValid = await kernel.validateField('email')
    expect(isValid).toBe(false)
  })

  test('validates min/max', async () => {
    const kernel = createKernel({ initialValues: { age: 5 } })
    kernel.register('age', { min: 18 })

    const isValid = await kernel.validateField('age')
    expect(isValid).toBe(false)
  })

  test('validates custom function', async () => {
    const kernel = createKernel({ initialValues: { password: '123' } })
    kernel.register('password', {
      validate: (value) => value.length >= 8 || 'Min 8 chars'
    })

    const isValid = await kernel.validateField('password')
    expect(isValid).toBe(false)
  })

  test('aborts previous async validation', async () => {
    const kernel = createKernel({ initialValues: { email: '' } })
    const validator = vi.fn(async (value) => {
      await new Promise(r => setTimeout(r, 100))
      return true
    })

    kernel.register('email', { validate: validator })

    kernel.validateField('email')
    kernel.validateField('email')

    await new Promise(r => setTimeout(r, 150))
    expect(validator).toHaveBeenCalledTimes(2)
  })
})
```

**⚠️ Test Coverage Required:** 100%

---

### Task 5.4: array-fields Plugin
**Duration:** 2.5 hours
**Dependencies:** Task 5.3

**Actions:**
1. Create `src/plugins/core/array-fields.ts`
2. Implement array fields plugin
3. Implement methods:
   - `append(value, options)`
   - `prepend(value, options)`
   - `insert(index, value, options)`
   - `remove(index)`
   - `swap(indexA, indexB)`
   - `move(from, to)`
   - `update(index, value)`
   - `replace(values)`

**📦 Deliverables:**
- `src/plugins/core/array-fields.ts`

**🧪 Tests:**
```typescript
describe('array-fields plugin', () => {
  test('appends item', () => {
    const kernel = createKernel({ initialValues: { items: [] } })
    const { append } = kernel.useFieldArray('items')

    append({ name: 'Item 1' })
    expect(kernel.getValue('items')).toHaveLength(1)
  })

  test('removes item', () => {
    const kernel = createKernel({ initialValues: { items: [{ name: 'A' }, { name: 'B' }] } })
    const { remove } = kernel.useFieldArray('items')

    remove(0)
    expect(kernel.getValue('items')).toHaveLength(1)
    expect(kernel.getValue('items.0.name')).toBe('B')
  })

  test('swaps items', () => {
    const kernel = createKernel({ initialValues: { items: [{ name: 'A' }, { name: 'B' }] } })
    const { swap } = kernel.useFieldArray('items')

    swap(0, 1)
    expect(kernel.getValue('items.0.name')).toBe('B')
    expect(kernel.getValue('items.1.name')).toBe('A')
  })

  test('generates unique IDs', () => {
    const kernel = createKernel({ initialValues: { items: [] } })
    const { fields, append } = kernel.useFieldArray('items')

    append({ name: 'A' })
    append({ name: 'B' })

    expect(fields[0].id).not.toBe(fields[1].id)
  })
})
```

**⚠️ Test Coverage Required:** 100%

---

### Task 5.5: submit-handler Plugin
**Duration:** 2 hours
**Dependencies:** Task 5.4

**Actions:**
1. Create `src/plugins/core/submit-handler.ts`
2. Implement submit handler with API:
   - `submit(): Promise<void>`
   - `handleSubmit(e?): Promise<void>`
   - `isSubmitting(): boolean`
   - `isSubmitSuccessful(): boolean`
   - `getSubmitCount(): number`

**📦 Deliverables:**
- `src/plugins/core/submit-handler.ts`

**🧪 Tests:**
```typescript
describe('submit-handler plugin', () => {
  test('validates before submit', async () => {
    const onSubmit = vi.fn()
    const kernel = createKernel({
      initialValues: { email: '' },
      onSubmit,
    })

    kernel.register('email', { required: true })

    await kernel.submit()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  test('calls onSubmit when valid', async () => {
    const onSubmit = vi.fn()
    const kernel = createKernel({
      initialValues: { email: 'test@example.com' },
      onSubmit,
    })

    await kernel.submit()
    expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' })
  })

  test('tracks submit state', async () => {
    const kernel = createKernel({
      initialValues: { email: 'test@example.com' },
      onSubmit: async () => {
        expect(kernel.isSubmitting()).toBe(true)
      },
    })

    expect(kernel.isSubmitting()).toBe(false)
    await kernel.submit()
    expect(kernel.isSubmitting()).toBe(false)
    expect(kernel.isSubmitSuccessful()).toBe(true)
  })

  test('increments submit count', async () => {
    const kernel = createKernel({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    expect(kernel.getSubmitCount()).toBe(0)

    await kernel.submit()
    expect(kernel.getSubmitCount()).toBe(1)

    await kernel.submit()
    expect(kernel.getSubmitCount()).toBe(2)
  })
})
```

**⚠️ Test Coverage Required:** 100%

---

### Task 5.6: Core Plugins Index
**Duration:** 15 minutes
**Dependencies:** Tasks 5.1-5.5

**Actions:**
1. Create `src/plugins/core/index.ts`
2. Export all core plugins

**📦 Deliverables:**
- `src/plugins/core/index.ts`

---

## 🔵 Phase 6: Main API Surface

### Task 6.1: createForm Factory
**Duration:** 1.5 hours
**Dependencies:** Task 5.6

**Actions:**
1. Create `src/create-form.ts`
2. Implement `createForm<TValues>(options): Form<TValues>`
3. Create Kernel instance
4. Install all core plugins
5. Expose unified API surface

**📦 Deliverables:**
- `src/create-form.ts`

**🧪 Tests:**
```typescript
describe('createForm', () => {
  test('creates form instance', () => {
    const form = createForm({
      initialValues: { email: '' },
      onSubmit: vi.fn(),
    })

    expect(form).toBeDefined()
    expect(typeof form.register).toBe('function')
    expect(typeof form.submit).toBe('function')
  })

  test('integrates all core plugins', () => {
    const form = createForm({
      initialValues: { items: [] },
      onSubmit: vi.fn(),
    })

    // Test field-registry
    const registration = form.register('email')
    expect(registration).toBeDefined()

    // Test state-manager
    form.setValue('email', 'test')
    expect(form.getValues('email')).toBe('test')

    // Test validation-engine
    expect(form.isValid()).toBe(true)

    // Test array-fields
    const arrayApi = form.useFieldArray('items')
    expect(arrayApi).toBeDefined()

    // Test submit-handler
    expect(form.isSubmitting()).toBe(false)
  })
})
```

**⚠️ Test Coverage Required:** 100%

---

### Task 6.2: Main Index
**Duration:** 20 minutes
**Dependencies:** Task 6.1

**Actions:**
1. Create `src/index.ts`
2. Export `createForm`
3. Export all types from `types.ts`
4. Export plugin utilities

**📦 Deliverables:**
- `src/index.ts`

**🧪 Tests:**
- [ ] All exports available
- [ ] TypeScript types work correctly

---

## 🔵 Phase 7: Optional Plugins (6 plugins)

### Task 7.1: wizard Plugin
**Duration:** 3 hours
**Dependencies:** Task 6.2

**Actions:**
1. Create `src/plugins/optional/wizard.ts`
2. Implement wizard plugin
3. Implement API (see SPECIFICATION.md)

**📦 Deliverables:**
- `src/plugins/optional/wizard.ts`

**🧪 Tests:** 100% coverage

---

### Task 7.2: autosave Plugin
**Duration:** 2.5 hours
**Dependencies:** Task 6.2

**Actions:**
1. Create `src/plugins/optional/autosave.ts`
2. Implement autosave plugin
3. Support localStorage/sessionStorage
4. Debounce save operations

**📦 Deliverables:**
- `src/plugins/optional/autosave.ts`

**🧪 Tests:** 100% coverage

---

### Task 7.3: persist Plugin
**Duration:** 2 hours
**Dependencies:** Task 6.2

**Actions:**
1. Create `src/plugins/optional/persist.ts`
2. Implement persist plugin

**📦 Deliverables:**
- `src/plugins/optional/persist.ts`

**🧪 Tests:** 100% coverage

---

### Task 7.4: schema Plugin
**Duration:** 3 hours
**Dependencies:** Task 6.2

**Actions:**
1. Create `src/plugins/optional/schema.ts`
2. Implement schema plugin
3. Create adapters for Zod, Yup, Joi

**📦 Deliverables:**
- `src/plugins/optional/schema.ts`

**🧪 Tests:** 100% coverage

---

### Task 7.5: focus-manager Plugin
**Duration:** 2 hours
**Dependencies:** Task 6.2

**Actions:**
1. Create `src/plugins/optional/focus-manager.ts`
2. Implement focus manager plugin

**📦 Deliverables:**
- `src/plugins/optional/focus-manager.ts`

**🧪 Tests:** 100% coverage

---

### Task 7.6: form-devtools Plugin
**Duration:** 4 hours
**Dependencies:** Task 6.2

**Actions:**
1. Create `src/plugins/optional/form-devtools/`
2. Implement devtools plugin
3. Create visual panel component
4. Use Shadow DOM for isolation

**📦 Deliverables:**
- `src/plugins/optional/form-devtools/`

**🧪 Tests:** 100% coverage

---

### Task 7.7: Optional Plugins Index
**Duration:** 15 minutes
**Dependencies:** Tasks 7.1-7.6

**Actions:**
1. Create `src/plugins/index.ts`
2. Export all optional plugins

**📦 Deliverables:**
- `src/plugins/index.ts`

---

## 🔵 Phase 8: React Adapter

### Task 8.1: useForm Hook
**Duration:** 2 hours
**Dependencies:** Task 6.2

**Actions:**
1. Create `src/adapters/react/use-form.ts`
2. Use `useSyncExternalStore`
3. Return form instance + reactive state

**📦 Deliverables:**
- `src/adapters/react/use-form.ts`

**🧪 Tests:** 100% coverage with React Testing Library

---

### Task 8.2: useField Hook
**Duration:** 1.5 hours
**Dependencies:** Task 8.1

**Actions:**
1. Create `src/adapters/react/use-field.ts`
2. Subscribe to field changes
3. Auto-register/unregister

**📦 Deliverables:**
- `src/adapters/react/use-field.ts`

**🧪 Tests:** 100% coverage

---

### Task 8.3: FormProvider & useFormContext
**Duration:** 1 hour
**Dependencies:** Task 8.1

**Actions:**
1. Create `src/adapters/react/context.ts`
2. Implement FormProvider
3. Implement useFormContext

**📦 Deliverables:**
- `src/adapters/react/context.ts`

**🧪 Tests:** 100% coverage

---

### Task 8.4: Controller Component
**Duration:** 1.5 hours
**Dependencies:** Task 8.2

**Actions:**
1. Create `src/adapters/react/controller.tsx`
2. Implement Controller for custom inputs

**📦 Deliverables:**
- `src/adapters/react/controller.tsx`

**🧪 Tests:** 100% coverage

---

### Task 8.5: useFieldArray Hook
**Duration:** 1 hour
**Dependencies:** Task 8.2

**Actions:**
1. Create `src/adapters/react/use-field-array.ts`

**📦 Deliverables:**
- `src/adapters/react/use-field-array.ts`

**🧪 Tests:** 100% coverage

---

### Task 8.6: useWatch Hook
**Duration:** 1 hour
**Dependencies:** Task 8.2

**Actions:**
1. Create `src/adapters/react/use-watch.ts`

**📦 Deliverables:**
- `src/adapters/react/use-watch.ts`

**🧪 Tests:** 100% coverage

---

### Task 8.7: useFormState Hook
**Duration:** 45 minutes
**Dependencies:** Task 8.1

**Actions:**
1. Create `src/adapters/react/use-form-state.ts`

**📦 Deliverables:**
- `src/adapters/react/use-form-state.ts`

**🧪 Tests:** 100% coverage

---

### Task 8.8: React Adapter Index
**Duration:** 15 minutes
**Dependencies:** Tasks 8.1-8.7

**Actions:**
1. Create `src/adapters/react/index.ts`
2. Export all React hooks/components

**📦 Deliverables:**
- `src/adapters/react/index.ts`

---

## 🔵 Phase 9: Vue Adapter

### Task 9.1: useForm Composable
**Duration:** 2 hours
**Dependencies:** Task 6.2

**Actions:**
1. Create `src/adapters/vue/use-form.ts`
2. Use `ref()` and `computed()`

**📦 Deliverables:**
- `src/adapters/vue/use-form.ts`

**🧪 Tests:** 100% coverage with Vue Testing Library

---

### Task 9.2: useField Composable
**Duration:** 1.5 hours
**Dependencies:** Task 9.1

**Actions:**
1. Create `src/adapters/vue/use-field.ts`

**📦 Deliverables:**
- `src/adapters/vue/use-field.ts`

**🧪 Tests:** 100% coverage

---

### Task 9.3: Provide/Inject Pattern
**Duration:** 1 hour
**Dependencies:** Task 9.1

**Actions:**
1. Create `src/adapters/vue/provide-inject.ts`

**📦 Deliverables:**
- `src/adapters/vue/provide-inject.ts`

**🧪 Tests:** 100% coverage

---

### Task 9.4: Other Vue Composables
**Duration:** 2 hours
**Dependencies:** Task 9.2

**Actions:**
1. Create `use-field-array.ts`
2. Create `use-watch.ts`
3. Create `use-form-state.ts`

**📦 Deliverables:**
- Vue composables

**🧪 Tests:** 100% coverage

---

### Task 9.5: Vue Adapter Index
**Duration:** 15 minutes
**Dependencies:** Tasks 9.1-9.4

**Actions:**
1. Create `src/adapters/vue/index.ts`

**📦 Deliverables:**
- `src/adapters/vue/index.ts`

---

## 🔵 Phase 10: Svelte Adapter

### Task 10.1: Form Store
**Duration:** 2 hours
**Dependencies:** Task 6.2

**Actions:**
1. Create `src/adapters/svelte/form-store.ts`
2. Implement Writable store

**📦 Deliverables:**
- `src/adapters/svelte/form-store.ts`

**🧪 Tests:** 100% coverage with Svelte Testing Library

---

### Task 10.2: Field Store
**Duration:** 1.5 hours
**Dependencies:** Task 10.1

**Actions:**
1. Create `src/adapters/svelte/field-store.ts`

**📦 Deliverables:**
- `src/adapters/svelte/field-store.ts`

**🧪 Tests:** 100% coverage

---

### Task 10.3: Svelte Adapter Index
**Duration:** 15 minutes
**Dependencies:** Tasks 10.1-10.2

**Actions:**
1. Create `src/adapters/svelte/index.ts`

**📦 Deliverables:**
- `src/adapters/svelte/index.ts`

---

## 🔵 Phase 11: Documentation & Examples

### Task 11.1: Write README.md
**Duration:** 1 hour
**Dependencies:** Task 10.3

**Actions:**
1. Update README.md with:
   - Features
   - Installation
   - Quick start examples
   - Comparison table
   - Links to docs

**📦 Deliverables:**
- Complete README.md

---

### Task 11.2: Create Examples
**Duration:** 3 hours
**Dependencies:** Task 10.3

**Actions:**
1. Create vanilla JS examples
2. Create React examples
3. Create Vue examples
4. Create Svelte examples

**📦 Deliverables:**
- `examples/` directory with working code

---

### Task 11.3: Initialize CHANGELOG
**Duration:** 30 minutes
**Dependencies:** Task 11.1

**Actions:**
1. Create CHANGELOG.md
2. Document v1.0.0 release

**📦 Deliverables:**
- CHANGELOG.md

---

## 🔵 Phase 12: Website Development

### Task 12.1: Website Setup
**Duration:** 2 hours
**Dependencies:** Task 11.3

**Actions:**
1. Initialize Vite + React project in `website/`
2. Install dependencies (Tailwind, shadcn/ui, etc.)
3. Configure routing
4. Set up basic layout

**📦 Deliverables:**
- `website/` directory initialized

---

### Task 12.2: Home Page
**Duration:** 4 hours
**Dependencies:** Task 12.1

**Actions:**
1. Create Hero component
2. Create Features section
3. Create Live Demo
4. Create CTA

**📦 Deliverables:**
- Home page complete

---

### Task 12.3: Documentation Pages
**Duration:** 8 hours
**Dependencies:** Task 12.2

**Actions:**
1. Create all doc pages (Getting Started, Concepts, API, etc.)
2. Add code examples
3. Add interactive demos
4. Add syntax highlighting

**📦 Deliverables:**
- All documentation pages

---

### Task 12.4: Examples Page
**Duration:** 3 hours
**Dependencies:** Task 12.3

**Actions:**
1. Create example viewer
2. Add all examples
3. Add live editing

**📦 Deliverables:**
- Examples page

---

### Task 12.5: Playground
**Duration:** 6 hours
**Dependencies:** Task 12.4

**Actions:**
1. Build form builder UI
2. Build schema editor
3. Build live preview
4. Add export code feature

**📦 Deliverables:**
- Interactive playground

---

### Task 12.6: Website Deployment
**Duration:** 2 hours
**Dependencies:** Task 12.5

**Actions:**
1. Create GitHub Actions workflow
2. Configure GitHub Pages
3. Set up CNAME (formkeeper.oxog.dev)
4. Deploy

**📦 Deliverables:**
- Live website at formkeeper.oxog.dev

---

## 🔵 Phase 13: Final Polish & Release

### Task 13.1: Bundle Size Optimization
**Duration:** 2 hours
**Dependencies:** Task 10.3

**Actions:**
1. Analyze bundle with esbuild metafile
2. Remove dead code
3. Optimize imports
4. Verify < 5KB core

**📦 Deliverables:**
- Optimized bundles
- Size report

**⚠️ Critical:** Core must be < 5KB

---

### Task 13.2: Final Testing
**Duration:** 3 hours
**Dependencies:** Task 13.1

**Actions:**
1. Run full test suite
2. Verify 100% coverage
3. Test all examples
4. Test in all frameworks
5. Test in different browsers

**📦 Deliverables:**
- All tests passing
- Coverage report (100%)

**⚠️ Critical:** 100% coverage required

---

### Task 13.3: Documentation Review
**Duration:** 2 hours
**Dependencies:** Task 12.6

**Actions:**
1. Review all documentation
2. Fix typos
3. Verify all links work
4. Test all code examples

**📦 Deliverables:**
- Polished documentation

---

### Task 13.4: NPM Package Preparation
**Duration:** 1 hour
**Dependencies:** Tasks 13.1, 13.2

**Actions:**
1. Verify package.json
2. Verify all exports
3. Test package locally with `npm link`
4. Create .npmignore

**📦 Deliverables:**
- Package ready for publish

---

### Task 13.5: GitHub Repository Setup
**Duration:** 1 hour
**Dependencies:** Task 13.4

**Actions:**
1. Create repository
2. Add LICENSE
3. Add README badges
4. Create GitHub release

**📦 Deliverables:**
- Public GitHub repository

---

### Task 13.6: NPM Publish
**Duration:** 30 minutes
**Dependencies:** Task 13.5

**Actions:**
1. Login to NPM
2. Publish package: `npm publish --access public`
3. Verify package on npmjs.com

**📦 Deliverables:**
- Published package on NPM

---

## Task Summary

**Total Tasks:** 83
**Estimated Total Time:** ~100-120 hours

**Critical Path:**
```
Setup (Phase 1)
  → Types (Phase 2)
  → Utils (Phase 3)
  → Kernel (Phase 4)
  → Core Plugins (Phase 5)
  → API (Phase 6)
  → Optional Plugins (Phase 7)
  → Framework Adapters (Phases 8-10)
  → Docs (Phase 11)
  → Website (Phase 12)
  → Release (Phase 13)
```

**Quality Gates:**
- ✅ All tests must pass before moving to next phase
- ✅ 100% coverage required for each component
- ✅ TypeScript strict mode must pass
- ✅ Bundle size < 5KB verified before release
- ✅ Zero runtime dependencies verified

---

## Daily Progress Tracking

Track your progress here:

### Week 1 (Foundation + Core)
- [ ] Phase 1: Project Setup
- [ ] Phase 2: Type System
- [ ] Phase 3: Utility Functions
- [ ] Phase 4: Kernel Implementation
- [ ] Phase 5: Core Plugins

### Week 2 (Plugins + Adapters)
- [ ] Phase 6: Main API
- [ ] Phase 7: Optional Plugins
- [ ] Phase 8: React Adapter
- [ ] Phase 9: Vue Adapter
- [ ] Phase 10: Svelte Adapter

### Week 3 (Documentation + Website)
- [ ] Phase 11: Documentation & Examples
- [ ] Phase 12: Website Development

### Week 4 (Polish + Release)
- [ ] Phase 13: Final Polish & Release

---

**Document Status:** ✅ COMPLETE
**Ready for Implementation:** ✅ YES
**Next Step:** Start with Task 1.1 - Initialize Project Structure
