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
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [],
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },

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
      ],

      // CRITICAL: 100% coverage required
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,

      all: true,
      include: ['src/**/*.{ts,tsx}'],
    },

    include: ['tests/**/*.test.{ts,tsx}'],
  },
})
