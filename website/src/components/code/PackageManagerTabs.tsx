import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TerminalWindow } from './TerminalWindow'

interface PackageManagerTabsProps {
  packageName?: string
  className?: string
}

export function PackageManagerTabs({
  packageName = '@oxog/formkeeper',
  className,
}: PackageManagerTabsProps) {
  const commands = {
    npm: `npm install ${packageName}`,
    yarn: `yarn add ${packageName}`,
    pnpm: `pnpm add ${packageName}`,
    bun: `bun add ${packageName}`,
  }

  return (
    <Tabs defaultValue="npm" className={className}>
      <TabsList className="bg-zinc-900 border border-zinc-800">
        <TabsTrigger value="npm" className="data-[state=active]:bg-zinc-800">
          npm
        </TabsTrigger>
        <TabsTrigger value="yarn" className="data-[state=active]:bg-zinc-800">
          yarn
        </TabsTrigger>
        <TabsTrigger value="pnpm" className="data-[state=active]:bg-zinc-800">
          pnpm
        </TabsTrigger>
        <TabsTrigger value="bun" className="data-[state=active]:bg-zinc-800">
          bun
        </TabsTrigger>
      </TabsList>
      {Object.entries(commands).map(([manager, command]) => (
        <TabsContent key={manager} value={manager} className="mt-4">
          <TerminalWindow command={command} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
