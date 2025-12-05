import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import PostCtrl from '@/features/post/controller'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { QueryResponse } from '@/lib/entity/core/interface'
import GroupAction from './group-action'
import { Post } from '../../interface'
import { postUrl } from '../../utils'
import { getSession } from '@/lib/auth'
import { User } from '@/features/user/interface'
import { can } from '@/lib/utils/can.server'

interface PostTableProps {
  filters: {
    query?: string
  }
  page: number
}

export default async function PostTable({ filters, page }: PostTableProps) {
  const user = (await getSession())?.user as User
  if (!(await can(user.roles, 'post.view.any', false))) {
    filters = { ...filters, author: user.id }
  }

  const canCreate = await can(user.roles, 'post.create', false)

  const findResult: QueryResponse<Post> = await PostCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`مطالب (${findResult?.totalDocuments || 0})`}
          description="مدیریت مطالب"
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/posts/create"
          >
            <Plus className="ml-2 h-4 w-4" /> افزودن مطلب
          </LinkButton>
        )}
      </div>
      <DataTable
        searchTitle="جستجو ..."
        columns={columns}
        response={findResult}
        refetchDataUrl={postUrl}
        groupAction={GroupAction}
      />
    </>
  )
}
