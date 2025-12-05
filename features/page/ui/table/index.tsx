import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import PageCtrl from '@/features/page/controller'
import { Page } from '@/features/page/interface'
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

export default async function PageTable({ query, page }: CategoriesTableProps) {
  let filters = { query }
  const user = (await getSession())?.user as User
  if (!(await can(user.roles, 'page.view.any', false))) {
    filters = { ...filters, user: user.id }
  }

  const canCreate = await can(user.roles, 'page.create', false)
  const findResult: QueryResponse<Page> = await PageCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`برگه ها (${findResult?.totalDocuments || 0})`}
          description="مدیریت برگه ها"
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/pages/create"
          >
            <Plus className="ml-2 h-4 w-4" /> افزودن برگه
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
