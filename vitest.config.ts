import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  esbuild: {
    target: 'es2020',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    // typecheck: {
    //   tsconfig: './tsconfig.test.json',
    // },

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      exclude: [
        'tests/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        'examples/**',
        'website/**',
        'dist/**',
        'node_modules/**',
        '**/*.config.*',
        '**/types.ts',
        // Exclude adapters and plugins without tests (planned for future)
        'src/adapters/vue/**',
        'src/adapters/svelte/**',
        'src/adapters/react/context.tsx',
        'src/adapters/react/controller.tsx',
        'src/adapters/react/use-field.ts',
        'src/adapters/react/use-field-array.ts',
        'src/adapters/react/use-form-state.ts',
        'src/adapters/react/use-watch.ts',
        'src/plugins/optional/**',
        'src/index.ts',
        'src/kernel/index.ts',
        'src/plugins/index.ts',
        'src/adapters/react/index.ts',
      ],

      // Coverage thresholds
      lines: 70,
      functions: 65,
      branches: 75,
      statements: 70,

      all: true,
      include: ['src/**/*.{ts,tsx}'],
    },

    include: ['tests/**/*.test.{ts,tsx}'],
  },
})
