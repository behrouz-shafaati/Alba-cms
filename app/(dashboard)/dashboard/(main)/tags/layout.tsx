import Authorization from '@/components/HOC/authorization'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'دسته بندی ها',
  description: 'مدیریت دسته بندی های فروشگاه',
}

interface TagsLayoutProps {
  children: React.ReactNode
}

const TagsLayout: React.FC<TagsLayoutProps> = ({ children }) => {
  return <>{children}</>
}

const Layout: React.FC<TagsLayoutProps> = (props) => {
  return (
    <Authorization routeSlug="tags">
      <TagsLayout>{props.children}</TagsLayout>
    </Authorization>
  )
}

export default Layout
