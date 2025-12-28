# FormKeeper Project Structure

Clean and organized project structure for FormKeeper.

## 📁 Directory Structure

```
FormKeeper/
├── .github/              # GitHub Actions workflows
│   └── workflows/
│       └── deploy.yml    # Website deployment
│
├── .project/             # Internal project planning docs (not in git/npm)
│   ├── README.md
│   ├── PROJECT.md        # Project vision and goals
│   ├── SPECIFICATION.md  # Technical specifications
│   ├── IMPLEMENTATION.md # Implementation details
│   ├── TASKS.md          # Task breakdown
│   ├── PROGRESS.md       # Development progress
│   ├── STATUS.md         # Current status
│   └── ...              # Other planning documents
│
├── docs/                 # User documentation
│   ├── README.md         # Documentation index
│   ├── DOCS.md           # Complete API documentation
│   ├── EXAMPLES.md       # Code examples
│   └── WEBSITE_SETUP.md  # Website development guide
│
├── src/                  # Source code
│   ├── kernel/           # Core kernel
│   ├── plugins/          # Plugin system
│   ├── adapters/         # Framework adapters
│   ├── utils/            # Utility functions
│   └── types.ts          # TypeScript type definitions
│
├── tests/                # Test files
│   └── unit/             # Unit tests
│       ├── kernel/
│       ├── adapters/
│       └── utils/
│
├── website/              # Documentation website
│   ├── src/              # Website source
│   │   ├── components/   # UI components
│   │   ├── pages/        # Route pages
│   │   ├── lib/          # Utilities
│   │   └── styles/       # Global styles
│   ├── public/           # Static assets
│   ├── dist/             # Built website (gitignored)
│   └── package.json      # Website dependencies
│
├── dist/                 # Built library (gitignored)
├── coverage/             # Test coverage (gitignored)
│
├── .gitignore            # Git ignore rules
├── .npmignore            # npm publish ignore rules
├── CHANGELOG.md          # Version history
├── LICENSE               # MIT license
├── README.md             # Main readme
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript config
├── tsconfig.test.json    # Test TypeScript config
├── tsup.config.ts        # Build configuration
└── vitest.config.ts      # Test configuration
```

## 📝 File Organization

### Root Level (Clean & Minimal)
Only essential files are kept in the root:
- `README.md` - Project overview
- `CHANGELOG.md` - Version history
- `LICENSE` - MIT license
- `package.json` - Dependencies and scripts
- Config files (`tsconfig.json`, `vitest.config.ts`, etc.)

### Documentation (`docs/`)
User-facing documentation:
- Complete API reference
- Usage examples
- Setup guides
- Best practices

### Project Planning (`.project/`)
Internal development documents:
- **Excluded from git** (`.gitignore`)
- **Excluded from npm** (`.npmignore`)
- Project specifications
- Implementation notes
- Progress tracking
- Status updates

### Source Code (`src/`)
Organized by concern:
- `kernel/` - Core form engine
- `plugins/` - Plugin system
- `adapters/` - Framework integrations
- `utils/` - Helper functions
- `types.ts` - Type definitions

### Tests (`tests/`)
Comprehensive test suite:
- Unit tests for all modules
- Integration tests
- Test utilities
- 100% coverage goal

### Website (`website/`)
Documentation and playground:
- React + Vite + TypeScript
- shadcn/ui components
- Monaco Editor playground
- Dark/Light themes
- Responsive design

## 🚫 Ignored Files

### Git (`.gitignore`)
- `node_modules/` - Dependencies
- `dist/` - Build output
- `coverage/` - Test coverage
- `.project/` - Internal planning docs
- `.claude/` - AI assistant workspace
- IDE and OS files

### npm (`.npmignore`)
- `src/` - Source files (dist/ is published)
- `tests/` - Test files
- `website/` - Documentation site
- `docs/` - Documentation (available online)
- `.project/` - Planning docs
- Config files
- Development files

## 📦 npm Package Contents

When published to npm, the package includes:
- `dist/` - Built library files
- `README.md` - Package readme
- `LICENSE` - License file
- `CHANGELOG.md` - Version history
- `package.json` - Package manifest

Users can access documentation at: https://formkeeper.oxog.dev

## 🔧 Development Workflow

### Adding New Features
1. Update specs in `.project/SPECIFICATION.md`
2. Implement in `src/`
3. Add tests in `tests/`
4. Update `docs/DOCS.md`
5. Add examples to `docs/EXAMPLES.md`
6. Update `CHANGELOG.md`

### Building
```bash
npm run build        # Build library
npm run website:build # Build website
```

### Testing
```bash
npm test            # Run tests
npm run test:coverage # Coverage report
```

### Documentation
```bash
npm run website:dev  # Start docs website
```

## 📊 Project Metrics

- **Source Files**: ~30 TypeScript files
- **Test Files**: ~10 test files
- **Documentation**: 4 main docs
- **Website Pages**: 5 major pages
- **Total Size**: < 5KB (library, minified + gzipped)

## 🎯 Design Principles

1. **Clean Root** - Minimal files in root directory
2. **Clear Separation** - Docs, source, tests, website separated
3. **Git Clean** - Planning docs excluded from version control
4. **npm Clean** - Only essential files in package
5. **Documentation** - Comprehensive and accessible
6. **Type Safety** - Full TypeScript coverage
7. **Testing** - 100% code coverage goal

## 🔗 Related Resources

- **Online Documentation**: https://formkeeper.oxog.dev
- **GitHub Repository**: https://github.com/ersinkoc/formkeeper
- **npm Package**: https://www.npmjs.com/package/@oxog/formkeeper

---

**Note**: This structure follows best practices for modern TypeScript libraries with comprehensive documentation and clean package distribution.
