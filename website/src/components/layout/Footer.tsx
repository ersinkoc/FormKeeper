import { Link } from 'react-router-dom'
import { Github, Twitter } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { SITE_CONFIG } from '@/lib/constants'

const footerLinks = {
  docs: [
    { label: 'Getting Started', href: '/docs' },
    { label: 'Installation', href: '/docs/installation' },
    { label: 'API Reference', href: '/docs/api' },
    { label: 'Examples', href: '/examples' },
  ],
  resources: [
    { label: 'Playground', href: '/playground' },
    { label: 'GitHub', href: SITE_CONFIG.github, external: true },
    { label: 'npm', href: SITE_CONFIG.npm, external: true },
    { label: 'Changelog', href: `${SITE_CONFIG.github}/blob/main/CHANGELOG.md`, external: true },
  ],
  frameworks: [
    { label: 'React', href: '/docs/frameworks/react' },
    { label: 'Vue', href: '/docs/frameworks/vue' },
    { label: 'Svelte', href: '/docs/frameworks/svelte' },
    { label: 'Vanilla JS', href: '/docs/frameworks/vanilla' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-zinc-950/50">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <Logo className="mb-4" />
            <p className="text-sm text-muted-foreground max-w-xs">
              Zero-dependency headless form state manager with micro-kernel
              plugin architecture.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href={SITE_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/ersinkoc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Documentation */}
          <div>
            <h3 className="font-semibold mb-3">Documentation</h3>
            <ul className="space-y-2">
              {footerLinks.docs.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) =>
                link.external ? (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Frameworks */}
          <div>
            <h3 className="font-semibold mb-3">Frameworks</h3>
            <ul className="space-y-2">
              {footerLinks.frameworks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            MIT License. Built by{' '}
            <a
              href="https://github.com/ersinkoc"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Ersin KOC
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            FormKeeper v1.0.1
          </p>
        </div>
      </div>
    </footer>
  )
}
