# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FormKeeper is a zero-dependency headless form state manager for TypeScript/JavaScript. It uses a micro-kernel architecture with an extensible plugin system and provides adapters for React, Vue, and Svelte.

- **Package**: `@oxog/formkeeper`
- **Size**: < 5KB minified + gzipped
- **Node**: >= 18.0.0

## Commands

```bash
# Development
npm run dev              # Watch mode build
npm run build            # Production build (ESM + CJS)
npm run typecheck        # TypeScript type checking

# Testing
npm test                 # Vitest watch mode
npm run test:coverage    # Generate coverage report
npm run test:ui          # Vitest UI mode

# Code quality
npm run lint             # ESLint on src/
npm run format           # Prettier format

# Website (documentation)
npm run website:install  # Install website deps (run first)
npm run website:dev      # Start dev server
npm run website:build    # Production build
```

## Architecture

### Micro-Kernel Pattern

```
src/
├── kernel/              # Core engine
│   ├── kernel.ts        # Main Kernel class orchestrates everything
│   ├── event-bus.ts     # Pub/sub event system
│   └── plugin-registry.ts
├── plugins/
│   ├── core/            # Required plugins (bundled)
│   │   ├── field-registry.ts
│   │   ├── state-manager.ts
│   │   ├── validation-engine.ts
│   │   ├── array-fields.ts
│   │   └── submit-handler.ts
│   └── optional/        # Tree-shakeable plugins
│       ├── autosave.ts, persist.ts, wizard.ts
│       ├── focus-manager.ts, schema.ts, devtools.ts
├── adapters/            # Framework integrations
│   ├── react/           # useForm, useField, useFieldArray, etc.
│   ├── vue/             # Vue 3 composables
│   └── svelte/          # Svelte stores
├── utils/               # Helpers (debounce, deep-clone, path utils)
├── create-form.ts       # Main factory function
└── types.ts             # Type definitions
```

### Key Design Patterns

- **Event-driven**: All state changes emit events; plugins subscribe to react
- **Dot-notation paths**: Field names support nesting (e.g., `user.profile.name`)
- **Generic TypeScript**: APIs are generic over form values type `TValues`
- **Tree-shakeable**: Optional plugins only included when imported

### Package Exports

```
@oxog/formkeeper         # Core library
@oxog/formkeeper/plugins # Optional plugins
@oxog/formkeeper/react   # React hooks
@oxog/formkeeper/vue     # Vue composables
@oxog/formkeeper/svelte  # Svelte stores
```

## Testing

- **Framework**: Vitest with jsdom environment
- **Coverage thresholds**: 70% lines, 65% functions, 75% branches
- **Test location**: `tests/unit/` mirrors `src/` structure
- **Run single test**: `npm test -- tests/unit/kernel/kernel.test.ts`

## Build System

- **Tool**: tsup (esbuild-based)
- **Output**: ESM + CJS with TypeScript declarations
- **Private property mangling**: Properties prefixed with `_` are mangled in production

## Code Conventions

- Core functionality in `src/kernel/` and `src/plugins/core/`
- New optional features should be plugins in `src/plugins/optional/`
- React hooks follow naming: `use-*.ts` with corresponding tests
- Utils should be pure functions with no side effects
