import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import templatePartCtrl from '@/features/template-part/controller'
import { TemplatePart } from '@/features/template-part/interface'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { QueryResponse } from '@/lib/entity/core/interface'
import GroupAction from './group-action'
import { getSession } from '@/lib/auth'
import { User } from '@/features/user/interface'
import { can } from '@/lib/utils/can.client'

interface CategoriesTableProps {
  query: string
  page: number
}

export default async function TemplatePartTable({
  query,
  page,
}: CategoriesTableProps) {
  let filters = { query }
  const user = (await getSession())?.user as User
  if (!(await can(user.roles, 'template.view.any', false))) {
    filters = { ...filters, user: user.id }
  }
  const canCreate = await can(user.roles, 'template.create', false)
  const findResult: QueryResponse<TemplatePart> = await templatePartCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`قطعه قالب‌ها (${findResult?.totalDocuments || 0})`}
          description="مدیریت قالب ها"
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/template-parts/create"
          >
            <Plus className="ml-2 h-4 w-4" /> افزودن قطعه قالب
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
