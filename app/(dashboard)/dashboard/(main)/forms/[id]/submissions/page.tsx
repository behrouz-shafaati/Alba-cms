import { BreadCrumb } from '@/components/breadcrumb'
import Table from '@/features/form-submission/ui/table'
import formCtrl from '@/features/form/controller'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    query?: string
    page?: number
  }>
}

export default async function Page({ searchParams, params }: Props) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const resolvedSearchParams = await searchParams
  const { query = '', page = 1 } = resolvedSearchParams

  const [form] = await Promise.all([formCtrl.findById({ id })])

  const breadcrumbItems = [
    { title: 'داشبورد', link: '/dashboard' },
    { title: 'فرم‌ها', link: '/dashboard/forms' },
    { title: form.title, link: `/dashboard/forms/${form.id}` },
    {
      title: 'پیام های دریافتی',
      link: `/dashboard/forms/${form.id}/submissions`,
    },
  ]
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Table query={query} page={page} formId={id} />
    </div>
  )
}
