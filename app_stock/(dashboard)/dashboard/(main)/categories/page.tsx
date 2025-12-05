import { BreadCrumb } from '@/components/breadcrumb'
import CategoryTable from '@/features/category/ui/table'
const breadcrumbItems = [
  { title: 'دسته بندی ها', link: '/dashboard/categories' },
]

interface PageProps {
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}

async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const { query = '', page = '1' } = resolvedSearchParams

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <CategoryTable query={query} page={Number(page)} />
    </div>
  )
}

export default Page
