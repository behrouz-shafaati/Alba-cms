import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import PostCommentCtrl from '@/features/post-comment/controller'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { QueryResponse } from '@/lib/entity/core/interface'
import GroupAction from './group-action'
import { PostComment } from '../../interface'
import { commentsUrl } from '../../utils'
import { getSession } from '@/lib/auth'
import { User } from '@/features/user/interface'
import { can } from '@/lib/utils/can.server'

interface PostCommentTableProps {
  filters: {
    query?: string
    post?: string
  }
  page?: number
}

export default async function PostCommentTable({
  filters,
  page = 1,
}: PostCommentTableProps) {
  const user = (await getSession())?.user as User
  if (!(await can(user.roles, 'postComment.view.any', false))) {
    filters = { ...filters, author: user.id }
  }

  const findResult: QueryResponse<PostComment> = await PostCommentCtrl.find(
    {
      filters,
      pagination: { page, perPage: 6 },
    },
    false
  )

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`دیدگاه ها (${findResult?.totalDocuments || 0})`}
          description="مدیریت مطالب"
        />
        {/* <LinkButton
          className="text-xs md:text-sm"
          href="/dashboard/post-comments/create"
        >
          <Plus className="ml-2 h-4 w-4" /> افزودن دیدگاه
        </LinkButton> */}
      </div>
      <DataTable
        searchTitle="جستجو ..."
        columns={columns}
        response={findResult}
        refetchDataUrl={commentsUrl}
        groupAction={GroupAction}
      />
    </>
  )
}
