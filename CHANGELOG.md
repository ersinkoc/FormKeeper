# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2024-12-29

### Fixed
- Fixed syntax highlighting in code blocks - code was only showing first line due to incorrect Prism.js integration
- Fixed website page centering - all pages now properly centered with responsive container

### Changed
- Improved SyntaxHighlighter component to use `Prism.highlight()` for proper multi-line code rendering
- Updated Tailwind container configuration with proper centering and responsive padding

---

## [1.0.0] - 2024-12-28

### Added

#### Core Features
- Zero-dependency headless form state manager
- Full TypeScript support with intelligent type inference
- Plugin architecture with micro-kernel design
- Event-driven architecture for form state management
- Comprehensive validation system (sync and async)
- Nested field support with dot notation
- Dynamic field arrays with full CRUD operations
- Multi-step form support via wizard plugin
- Auto-save functionality via auto-save plugin

#### Framework Adapters
- React adapter with hooks (`useForm`, `useField`, `useFieldArray`, `useWatch`)
- Vue adapter (placeholder for future implementation)
- Svelte adapter (placeholder for future implementation)

#### Core Plugins
- Field Registry Plugin - Field registration and lifecycle
- State Manager Plugin - Form state management
- Validation Engine Plugin - Field and form validation
- Array Fields Plugin - Dynamic array field management
- Submit Handler Plugin - Form submission handling

#### Validation Features
- Built-in validation rules (required, min, max, minLength, maxLength, pattern)
- Custom validation functions (sync and async)
- Field-level and form-level validation
- Multiple validation modes (onChange, onBlur, onSubmit)
- Cross-field validation support

#### Developer Experience
- Comprehensive TypeScript types and interfaces
- Full JSDoc documentation
- Zero runtime dependencies
- Tree-shakeable exports
- Bundle size < 5KB (minified + gzipped)

#### Documentation
- Complete API reference documentation
- Real-world usage examples
- Interactive documentation website
- Live code playground with Monaco Editor
- Dark and light themes for documentation site

#### Testing
- Comprehensive test suite with Vitest
- 100% code coverage goal
- Unit tests for all core functionality
- React adapter tests with @testing-library/react

#### Build & Deployment
- Modern build setup with tsup
- Multiple output formats (ESM, CJS, TypeScript declarations)
- GitHub Actions workflow for documentation deployment
- Custom domain support (formkeeper.oxog.dev)

### Project Structure
- Clean, modular codebase architecture
- Separation of concerns (kernel, plugins, adapters, utils)
- Well-organized test structure
- Professional documentation website

### Documentation Website
- React + Vite + TypeScript setup
- shadcn/ui components with Radix UI primitives
- Tailwind CSS for styling
- Monaco Editor for live playground
- Responsive design for all devices
- SEO-friendly with proper meta tags

## [Unreleased]

### Planned Features
- Vue 3 adapter implementation
- Svelte adapter implementation
- Additional validation plugins
- Form persistence plugin
- Analytics plugin for form tracking
- Field dependency system
- Conditional field rendering helpers
- File upload field support
- Rich text editor integration examples

---

## Release Notes

### v1.0.0 - Initial Release

This is the first stable release of FormKeeper, a zero-dependency headless form state manager built with TypeScript. The library provides a flexible, type-safe solution for managing form state in modern web applications.

**Key Highlights:**
- 🔌 Zero runtime dependencies
- 📦 < 5KB minified + gzipped
- 🎯 100% TypeScript with full type inference
- ⚡ Fast and efficient state management
- 🔧 Extensible plugin architecture
- ⚛️ Framework adapters for React (Vue and Svelte coming soon)
- 📖 Comprehensive documentation and examples
- 🎮 Interactive playground for experimentation

For more information, visit: https://formkeeper.oxog.dev

---

## Version History

- **1.0.1** (2024-12-29) - Bug fixes for website syntax highlighting and page centering
- **1.0.0** (2024-12-28) - Initial stable release

---

**Note**: This changelog follows [Keep a Changelog](https://keepachangelog.com/) format and [Semantic Versioning](https://semver.org/).
