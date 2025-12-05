import { BreadCrumb } from '@/components/breadcrumb'
import Table from '@/features/template-part/ui/table'
const breadcrumbItems = [{ title: 'سربرگ ها', link: '/dashboard/pages' }]

interface Props {
  searchParams: Promise<{
    query?: string
    page?: number
  }>
}

export default async function Page({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams
  const { query = '', page = 1 } = resolvedSearchParams

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Table query={query} page={page} />
    </div>
  )
}
