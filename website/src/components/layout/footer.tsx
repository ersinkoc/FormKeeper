import { Github, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t py-12 mt-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold font-mono text-lg">FK</span>
              </div>
              <span className="font-bold text-xl font-mono">FormKeeper</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Zero-dependency headless form state manager with micro-kernel plugin architecture.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://github.com/ersinkoc/formkeeper"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/ersinkoc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Documentation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Getting Started
                </a>
              </li>
              <li>
                <a href="/docs/installation" className="text-muted-foreground hover:text-foreground transition-colors">
                  Installation
                </a>
              </li>
              <li>
                <a href="/api" className="text-muted-foreground hover:text-foreground transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="/examples" className="text-muted-foreground hover:text-foreground transition-colors">
                  Examples
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/playground" className="text-muted-foreground hover:text-foreground transition-colors">
                  Playground
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ersinkoc/formkeeper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/@oxog/formkeeper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  npm
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>
            Built with ❤️ by{' '}
            <a
              href="https://github.com/ersinkoc"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground transition-colors"
            >
              Ersin KOÇ
            </a>
            . MIT Licensed.
          </p>
        </div>
      </div>
    </footer>
  )
}
