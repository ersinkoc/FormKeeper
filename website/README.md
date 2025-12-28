# FormKeeper Documentation Website

This is the official documentation and playground website for FormKeeper, built with React, Vite, and shadcn/ui.

## Features

- 📖 **Comprehensive Documentation** - Complete guides and tutorials
- 🔍 **API Reference** - Detailed API documentation
- 💡 **Interactive Examples** - Real-world usage examples
- 🎮 **Live Playground** - Try FormKeeper in your browser with Monaco Editor and real form rendering
- 🌓 **Dark/Light Mode** - Beautiful themes with JetBrains Mono font
- 📱 **Responsive Design** - Works perfectly on all devices

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor
- **Syntax Highlighting**: react-syntax-highlighter
- **Routing**: React Router v6
- **Fonts**: Inter + JetBrains Mono

## Development

### Prerequisites

- Node.js >= 18.0.0
- npm, yarn, or pnpm

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The website will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
website/
├── public/              # Static assets
│   ├── favicon.svg
│   └── CNAME           # Custom domain configuration
├── src/
│   ├── components/     # Reusable components
│   │   ├── ui/        # shadcn/ui components
│   │   ├── layout/    # Header, Footer
│   │   ├── code-block.tsx
│   │   ├── code-runner.tsx
│   │   └── theme-provider.tsx
│   ├── pages/         # Route pages
│   │   ├── home.tsx
│   │   ├── docs/
│   │   ├── api/
│   │   ├── examples/
│   │   └── playground/
│   ├── lib/           # Utilities
│   │   └── utils.ts
│   ├── styles/        # Global styles
│   │   └── globals.css
│   ├── App.tsx        # Root component
│   └── main.tsx       # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Deployment

The website is automatically deployed to GitHub Pages via GitHub Actions on every push to the `main` branch.

**Live URL**: https://formkeeper.oxog.dev

### Custom Domain Setup

1. Add `CNAME` file in `public/` directory with your domain
2. Configure DNS records:
   - CNAME: `formkeeper.oxog.dev` → `<username>.github.io`
3. Enable GitHub Pages in repository settings
4. Configure custom domain in GitHub Pages settings

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Ersin KOÇ](https://github.com/ersinkoc)
