import { BreadCrumb } from '@/components/breadcrumb'
import Table from '@/features/form/ui/table'
const breadcrumbItems = [
  { title: 'داشبورد', link: '/dashboard' },
  { title: 'فرم ها', link: '/dashboard/forms' },
]

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
