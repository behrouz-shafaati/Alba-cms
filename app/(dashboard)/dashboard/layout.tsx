export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { Session } from '@/types'
import { SessionProvider } from '@/components/context/SessionContext'
import { Providers } from '../../providers'
import { getSession } from '@/lib/auth/get-session'
import { can } from '@/lib/utils/can.server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'داشبورد',
  description: 'داشبورد',
}
export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = (await getSession()) as Session
  const user = session?.user
  const haveDashboardAccess = await can(user.roles, 'dashboard.view.any', false)
  if (!haveDashboardAccess) {
    redirect('/login')
  }

  return (
    <Providers>
      <SessionProvider session={session}>{children}</SessionProvider>
    </Providers>
  )
}
