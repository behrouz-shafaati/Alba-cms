import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import templateCtrl from '@/features/template/controller'
import { Template } from '@/features/template/interface'
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

export default async function TemplateTable({
  query,
  page,
}: CategoriesTableProps) {
  let filters = { query }
  const user = (await getSession())?.user as User
  if (!(await can(user.roles, 'template.view.any', false))) {
    filters = { ...filters, user: user.id }
  }

  const canCreate = await can(user.roles, 'template.create', false)
  const findResult: QueryResponse<Template> = await templateCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`قالب ها (${findResult?.totalDocuments || 0})`}
          description="مدیریت قالب ها"
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/templates/create"
          >
            <Plus className="ml-2 h-4 w-4" /> افزودن قالب
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
