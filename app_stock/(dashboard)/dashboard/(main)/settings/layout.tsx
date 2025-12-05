import Authorization from '@/components/HOC/authorization'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'دسته بندی ها',
  description: 'مدیریت دسته بندی های فروشگاه',
}

interface SettingsLayoutProps {
  children: React.ReactNode
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  return <>{children}</>
}

const Layout: React.FC<SettingsLayoutProps> = (props) => {
  return (
    <Authorization routeSlug="settings">
      <SettingsLayout>{props.children}</SettingsLayout>
    </Authorization>
  )
}

export default Layout
