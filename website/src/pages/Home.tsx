import { Hero } from '@/components/home/Hero'
import { InstallCommand } from '@/components/home/InstallCommand'
import { Features } from '@/components/home/Features'
import { CodePreview } from '@/components/home/CodePreview'
import { Stats } from '@/components/home/Stats'
import { FrameworkShowcase } from '@/components/home/FrameworkShowcase'
import { Comparison } from '@/components/home/Comparison'
import { CTA } from '@/components/home/CTA'

export function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <InstallCommand />
      <Features />
      <CodePreview />
      <Stats />
      <FrameworkShowcase />
      <Comparison />
      <CTA />
    </div>
  )
}
