import { BreadCrumb } from '@/components/breadcrumb'

import MenuTable from '@/features/menu/ui/table'
const breadcrumbItems = [{ title: 'فهرست ها', link: '/dashboard/menus' }]

interface PageProps {
  searchParams: Promise<{
    query?: string
    page?: number
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const { query = '', page = 1 } = resolvedSearchParams

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <MenuTable query={query} page={page} />
    </div>
  )
}
