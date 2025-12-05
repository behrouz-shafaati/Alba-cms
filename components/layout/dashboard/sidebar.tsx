import { DashboardNav } from '@/components/dashboard-nav'
import { navItems } from './navItems'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  return (
    <nav
      className={cn(`relative hidden h-screen border-l lg:block w-72 mt-12`)}
    >
      <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
        {/* Overview */}
      </h2>
      <DashboardNav items={navItems} />
    </nav>
  )
}
