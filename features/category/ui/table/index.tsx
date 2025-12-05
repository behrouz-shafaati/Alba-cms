import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import CategoryCtrl from '../../controller'
import { Category } from '../../interface'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { QueryResponse } from '@/lib/entity/core/interface'
import GroupAction from './group-action'
import { getSession } from '@/lib/auth'
import { User } from '@/features/user/interface'
import { can } from '@/lib/utils/can.server'

interface CategoriesTableProps {
  query: string
  page: number
}

export default async function CategoryTable({
  query,
  page,
}: CategoriesTableProps) {
  let filters = { query }
  const user = (await getSession())?.user as User
  if (!(await can(user.roles, 'category.view.any', false))) {
    filters = { ...filters, user: user.id }
  }

  const canCreate = await can(user.roles, 'category.create', false)

  const findResult: QueryResponse<Category> = await CategoryCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`دسته بندی ها (${findResult?.totalDocuments || 0})`}
          description="مدیریت دسته بندی ها"
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/categories/create"
          >
            <Plus className="ml-2 h-4 w-4" /> افزودن دسته بندی
          </LinkButton>
        )}
      </div>
      <DataTable
        searchTitle="جستجو ..."
        columns={columns}
        response={findResult}
        groupAction={GroupAction}
      />
    </>
  )
}
