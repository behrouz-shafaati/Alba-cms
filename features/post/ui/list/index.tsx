import PostCtrl from '@/features/post/controller'
import { QueryResponse } from '@/lib/entity/core/interface'
import { Post } from '../../interface'
import PostCard from '../card'
import Pagination from '@/components/ui/pagination'

interface PostTableProps {
  query: string
  page: number
}

export default async function PostList({ query, page }: PostTableProps) {
  const findResult: QueryResponse<Post> = await PostCtrl.find({
    filters: { query },
    pagination: { page, perPage: 6 },
  })
  console.log('#276 findResult:', findResult)
  return (
    <>
      <div className="columns-1 sm:columns-5 md:columns-5 gap-4 space-y-4 m-4">
        {findResult.data.map((post: Post) => {
          return <PostCard key={post.id} post={post} />
        })}
      </div>
      <div className="space-x-reverse space-x-2 text-center my-4">
        <Pagination totalPages={findResult.totalPages} />
      </div>
    </>
  )
}
