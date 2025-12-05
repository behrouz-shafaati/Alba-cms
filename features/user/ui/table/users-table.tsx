import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import userCtrl from '@/features/user/controller'
import { User } from '@/features/user/interface'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { QueryResponse } from '@/lib/entity/core/interface'
import GroupAction from './group-action'
import { getSession } from '@/lib/auth'
import { can } from '@/lib/utils/can.server'

interface UsersTableProps {
  query: string
  page: number
}

export default async function UsersTable({ query, page }: UsersTableProps) {
  let filters = { query }
  const user = (await getSession())?.user as User
  if (!(await can(user.roles, 'user.view.any', false))) {
    filters = { ...filters, id: user.id }
  }

  const canCreate = await can(user.roles, 'user.create', false)

  const findResult: QueryResponse<User> = await userCtrl.find({
    filters: filters,
    pagination: { page, perPage: 6 },
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`کاربران (${findResult?.totalDocuments || 0})`}
          description="مدیریت کاربران"
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/users/create"
          >
            <Plus className="ml-2 h-4 w-4" /> افزودن کاربر
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
