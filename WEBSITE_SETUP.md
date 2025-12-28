# FormKeeper Website Setup Guide

Complete guide for setting up and deploying the FormKeeper documentation website.

## Overview

The FormKeeper website is a comprehensive documentation and playground platform featuring:

- 📖 **Documentation** - Complete guides, tutorials, and getting started content
- 🔍 **API Reference** - Detailed API documentation with search
- 💡 **Examples** - Real-world usage examples with code snippets
- 🎮 **Playground** - Live code editor with Monaco Editor
- 🌓 **Dark/Light Themes** - Beautiful themes with JetBrains Mono font
- 📱 **Responsive Design** - Works perfectly on all devices
- 🚀 **GitHub Pages Deployment** - Automatic deployment with GitHub Actions

## Quick Start

### 1. Install Dependencies

```bash
# From project root
npm run website:install

# Or manually
cd website
npm install
```

### 2. Start Development Server

```bash
# From project root
npm run website:dev

# Or manually
cd website
npm run dev
```

The website will be available at `http://localhost:5173`

### 3. Build for Production

```bash
# From project root
npm run website:build

# Or manually
cd website
npm run build
```

## Technology Stack

### Core Technologies

- **React 18** - UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Router v6** - Client-side routing

### UI & Styling

- **shadcn/ui** - High-quality UI components built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible components
- **Lucide Icons** - Beautiful icon set
- **Framer Motion** - Smooth animations

### Code & Documentation

- **Monaco Editor** - VS Code editor for playground
- **react-syntax-highlighter** - Syntax highlighting for code blocks
- **Prism** - Syntax highlighting themes

### Fonts

- **Inter** - Primary sans-serif font
- **JetBrains Mono** - Monospace font for code

## Project Structure

```
website/
├── public/
│   ├── favicon.svg              # Website icon
│   └── CNAME                    # Custom domain configuration
│
├── src/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── scroll-area.tsx
│   │   ├── layout/
│   │   │   ├── header.tsx       # Main navigation header
│   │   │   └── footer.tsx       # Site footer
│   │   ├── code-block.tsx       # Code snippet display
│   │   ├── theme-provider.tsx   # Theme management
│   │   └── theme-toggle.tsx     # Dark/light toggle
│   │
│   ├── pages/
│   │   ├── home.tsx             # Landing page
│   │   ├── docs/
│   │   │   └── index.tsx        # Documentation page
│   │   ├── api/
│   │   │   └── index.tsx        # API reference page
│   │   ├── examples/
│   │   │   └── index.tsx        # Examples showcase
│   │   └── playground/
│   │       └── index.tsx        # Live code playground
│   │
│   ├── lib/
│   │   └── utils.ts             # Utility functions (cn)
│   │
│   ├── styles/
│   │   └── globals.css          # Global styles & themes
│   │
│   ├── App.tsx                  # Root component
│   └── main.tsx                 # Application entry point
│
├── index.html                   # HTML template
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
└── README.md                    # Website documentation
```

## Features

### 1. Home Page (`/`)

- Hero section with call-to-action
- Feature highlights
- Code example showcase
- Library comparison table
- Getting started links

### 2. Documentation (`/docs`)

Comprehensive documentation including:
- Getting started guide
- Installation instructions
- Core concepts
- Validation guide
- Nested fields
- Dynamic arrays
- Plugin system
- Advanced patterns

### 3. API Reference (`/api`)

Complete API documentation with:
- Searchable sidebar
- Core API methods
- React hooks
- Type definitions
- Code examples
- Parameter tables

### 4. Examples (`/examples`)

Real-world examples:
- Login forms
- Registration forms
- Dynamic lists
- Multi-step wizards
- Async validation
- Nested forms
- Conditional fields

### 5. Playground (`/playground`)

Interactive code editor featuring:
- Monaco Editor (VS Code editor)
- Template quick starts
- Live code execution preview
- Console output
- Code download
- IDE-style interface

## Themes

### Dark Mode

- Rich dark colors
- High contrast
- Easy on eyes
- IDE-inspired

### Light Mode

- Clean white background
- Excellent readability
- Professional look

### Theme System

Themes use CSS custom properties:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... more colors */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... more colors */
}
```

## Deployment

### GitHub Actions Workflow

The website deploys automatically via GitHub Actions:

**File**: `.github/workflows/deploy.yml`

**Trigger**: Push to `main` branch

**Steps**:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build website
5. Upload to GitHub Pages
6. Deploy

### Custom Domain Setup

#### 1. DNS Configuration

Add a CNAME record:
```
formkeeper.oxog.dev → <username>.github.io
```

#### 2. GitHub Repository Settings

1. Go to repository Settings
2. Navigate to Pages
3. Set source to "GitHub Actions"
4. Add custom domain: `formkeeper.oxog.dev`
5. Enable "Enforce HTTPS"

#### 3. CNAME File

The `website/public/CNAME` file contains:
```
formkeeper.oxog.dev
```

This file is automatically included in the build.

### Manual Deployment

If needed, you can deploy manually:

```bash
# Build the website
cd website
npm run build

# The dist/ folder contains the static site
# Upload contents to your hosting provider
```

## Development

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route to `App.tsx`
3. Update navigation in `Header.tsx`

Example:
```tsx
// src/pages/blog/index.tsx
export function BlogPage() {
  return <div>Blog content</div>
}

// App.tsx
import { BlogPage } from '@/pages/blog'

<Routes>
  <Route path="/blog" element={<BlogPage />} />
</Routes>
```

### Adding UI Components

Use shadcn/ui CLI (or copy component code):

```bash
npx shadcn-ui@latest add [component-name]
```

### Styling Guidelines

- Use Tailwind utility classes
- Follow existing component patterns
- Maintain responsive design
- Test both themes

### Code Formatting

```bash
npm run lint    # Check linting
npm run format  # Format code
```

## Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Lint code
npm run typecheck        # Check types

# From project root
npm run website:dev      # Start website dev server
npm run website:build    # Build website
npm run website:preview  # Preview website build
npm run website:install  # Install website deps
```

## Environment Variables

No environment variables required. All configuration is in:
- `vite.config.ts` - Build configuration
- `tailwind.config.js` - Styling configuration
- `tsconfig.json` - TypeScript configuration

## Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use

```bash
# Vite uses port 5173 by default
# Change in vite.config.ts or use:
npm run dev -- --port 3000
```

### TypeScript Errors

```bash
# Check types
npm run typecheck
```

### Monaco Editor Not Loading

Ensure `@monaco-editor/react` is properly installed:
```bash
npm install @monaco-editor/react
```

## Performance Optimization

### Build Optimizations

- Code splitting with dynamic imports
- Tree shaking
- Minification
- Asset optimization

### Loading Performance

- Lazy load routes
- Preload critical fonts
- Optimize images
- Use CDN for fonts

### Runtime Performance

- React.memo for expensive components
- Debounce heavy operations
- Virtual scrolling for long lists

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Android

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Color contrast (WCAG AA)

## SEO

- Meta tags in `index.html`
- Semantic heading structure
- Descriptive page titles
- Open Graph tags (add if needed)

## Future Enhancements

Potential additions:
- Blog section
- Video tutorials
- Interactive playground improvements
- Search functionality
- Version switcher
- Changelog page
- Community showcase

## Support

For issues or questions:
- GitHub Issues: [FormKeeper Issues](https://github.com/ersinkoc/formkeeper/issues)
- Documentation: [formkeeper.oxog.dev](https://formkeeper.oxog.dev)

## License

MIT © [Ersin KOÇ](https://github.com/ersinkoc)
