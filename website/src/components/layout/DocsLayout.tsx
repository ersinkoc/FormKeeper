import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function DocsLayout() {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <Sidebar />
      <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px]">
        <div className="mx-auto w-full min-w-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
