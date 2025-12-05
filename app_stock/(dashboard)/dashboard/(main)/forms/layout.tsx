import Authorization from '@/components/HOC/authorization'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'فرم‌ها',
  description: 'مدیریت فرم‌ها',
}

interface PagesLayoutProps {
  children: React.ReactNode
}

const PagesLayout: React.FC<PagesLayoutProps> = ({ children }) => {
  return <>{children}</>
}

const Layout: React.FC<PagesLayoutProps> = (props) => {
  return (
    <Authorization routeSlug="templates">
      <PagesLayout>{props.children}</PagesLayout>
    </Authorization>
  )
}

export default Layout
