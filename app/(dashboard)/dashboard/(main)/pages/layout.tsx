import Authorization from '@/components/HOC/authorization'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'برگه ها',
  description: 'مدیریت برگه‌ها',
}

interface PagesLayoutProps {
  children: React.ReactNode
}

const PagesLayout: React.FC<PagesLayoutProps> = ({ children }) => {
  return <>{children}</>
}

const Layout: React.FC<PagesLayoutProps> = (props) => {
  return (
    <Authorization routeSlug="pages">
      <PagesLayout>{props.children}</PagesLayout>
    </Authorization>
  )
}

export default Layout
