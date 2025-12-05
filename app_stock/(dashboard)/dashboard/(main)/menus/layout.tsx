import Authorization from '@/components/HOC/authorization'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'دسته بندی ها',
  description: 'مدیریت دسته بندی های فروشگاه',
}

interface MenusLayoutProps {
  children: React.ReactNode
}

const MenusLayout: React.FC<MenusLayoutProps> = ({ children }) => {
  return <>{children}</>
}

const Layout: React.FC<MenusLayoutProps> = (props) => {
  return (
    <Authorization routeSlug="menus">
      <MenusLayout>{props.children}</MenusLayout>
    </Authorization>
  )
}

export default Layout
