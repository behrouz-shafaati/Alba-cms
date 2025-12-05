import Authorization from '@/components/HOC/authorization'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'مطالب',
  description: 'مدیریت مطالب ',
}

interface CategoriesLayoutProps {
  children: React.ReactNode
}

const CategoriesLayout: React.FC<CategoriesLayoutProps> = ({ children }) => {
  return <>{children}</>
}

const Layout: React.FC<CategoriesLayoutProps> = (props) => {
  return (
    <Authorization routeSlug="categories">
      <CategoriesLayout>{props.children}</CategoriesLayout>
    </Authorization>
  )
}

export default Layout
