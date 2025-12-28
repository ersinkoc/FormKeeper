# FormKeeper Website

Official website for FormKeeper - Zero-dependency headless form state manager.

🌐 **Live Site**: [formkeeper.oxog.dev](https://formkeeper.oxog.dev)

## Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **TypeScript 5** - Type safety
- **Tailwind CSS 3.4** - Styling
- **shadcn/ui** - UI components
- **React Router 6** - Client-side routing
- **Framer Motion** - Animations
- **Prism.js** - Syntax highlighting
- **Playwright** - E2E testing

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# View test report
npm run test:report
```

## Project Structure

```
website/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── shared/          # Shared components (Theme)
│   │   ├── code/            # Code display components
│   │   └── layout/          # Layout components
│   ├── pages/               # Route pages
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities
│   └── styles/              # CSS files
├── tests/                   # Playwright tests
├── public/                  # Static assets
└── dist/                    # Build output
```

## Testing

This project uses Playwright for end-to-end testing. Tests cover:

- ✅ Home page rendering
- ✅ Navigation between pages
- ✅ Theme toggle functionality
- ✅ Code block features (copy, line numbers, syntax highlighting)
- ✅ IDE window components
- ✅ 404 page handling

Run tests:
```bash
npm run test              # Headless mode
npm run test:ui           # Interactive UI mode
npm run test:headed       # Headed mode (see browser)
npm run test:report       # View HTML report
```

## Deployment

The website is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### GitHub Actions Workflows

1. **Test Workflow** (`.github/workflows/test.yml`)
   - Runs on every push and pull request
   - Executes Playwright tests
   - Uploads test reports

2. **Deploy Workflow** (`.github/workflows/deploy-website.yml`)
   - Runs on push to `main` branch
   - Builds the website
   - Deploys to GitHub Pages
   - Available at: https://formkeeper.oxog.dev

## Design System

### Colors
- **Primary**: Zinc scale for dark theme
- **Accent**: Purple/Pink gradients for CTAs
- **Code**: Custom Prism.js theme with zinc palette

### Typography
- **Body**: Inter (Google Fonts)
- **Code**: JetBrains Mono (Google Fonts)

### Components
- All code blocks have line numbers
- Copy button on all code examples
- IDE-style windows with macOS traffic lights
- Dark/Light/System theme support

## Features

- 🎨 Modern, responsive design
- 🌓 Dark/Light theme with system preference support
- 💻 IDE-style code windows
- 📱 Mobile-friendly navigation
- ⚡ Fast build times with Vite
- 🧪 Comprehensive E2E test coverage
- 🚀 Automatic GitHub Pages deployment

## License

MIT © Ersin KOÇ
