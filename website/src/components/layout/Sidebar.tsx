import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { docsConfig } from '@/lib/docs-config'
import { ScrollArea } from '@/components/ui/scroll-area'

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
      <ScrollArea className="h-full py-6 pr-6 lg:py-8">
        <nav className="w-full">
          {docsConfig.map((section) => (
            <div key={section.title} className="pb-8">
              <h4 className="mb-2 px-2 text-sm font-semibold tracking-tight">
                {section.title}
              </h4>
              <div className="grid grid-flow-row auto-rows-max text-sm">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline',
                      location.pathname === item.href
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
}
