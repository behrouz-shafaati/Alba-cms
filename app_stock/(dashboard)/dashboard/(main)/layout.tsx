import Authorization from '@/components/HOC/authorization'
import Header from '@/components/layout/dashboard/header'
import Sidebar from '@/components/layout/dashboard/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getSettings } from '@/features/settings/controller'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn',
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()
  return (
    <>
      <Header siteSettings={settings} />
      <div className="flex md:h-screen auto-rows-max">
        <ScrollArea>
          <Sidebar />
        </ScrollArea>
        <ScrollArea className="w-full mt-[54px]">{children}</ScrollArea>
      </div>
    </>
  )
}

const Layout: React.FC<DashboardLayoutProps> = (props) => {
  return (
    <Authorization routeSlug="dashboard">
      <DashboardLayout>{props.children}</DashboardLayout>
    </Authorization>
  )
}
