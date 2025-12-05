import { BreadCrumb } from '@/components/breadcrumb'
import PageTable from '@/features/page/ui/table'
const breadcrumbItems = [{ title: 'برگه ها', link: '/dashboard/pages' }]

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
      <PageTable query={query} page={page} />
    </div>
  )
}
