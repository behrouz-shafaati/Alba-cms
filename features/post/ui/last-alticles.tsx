import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import PostCtrl from '@/features/post/controller'
import { Plus } from 'lucide-react'
import { columns } from './table/columns'
import { QueryResponse } from '@/lib/entity/core/interface'
import { Post } from '../interface'

interface PostTableProps {
  query: string
  page: number
}

export default async function LastPosts({ query, page }: PostTableProps) {
  const findResult: QueryResponse<Post> = await PostCtrl.find({
    filters: { query },
    pagination: { page, perPage: 6 },
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`آخرین مطالب`} description="" />
        <LinkButton
          className="text-xs md:text-sm"
          href="/dashboard/posts/create"
        >
          <Plus className="ml-2 h-4 w-4" /> افزودن مطلب
        </LinkButton>
      </div>
      <DataTable
        searchTitle="جستجو ..."
        columns={columns}
        response={findResult}
        showFilters={false}
        showPagination={false}
        showSearch={false}
        showGroupAction={false}
      />
    </>
  )
}
