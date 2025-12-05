import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@/features/user/interface'
import { getTranslation } from '@/lib/utils'
import { Post } from '../../interface'
import Pagination from '@/components/ui/pagination'
import PostHorizontalCard from '@/components/builder-canvas/shared-blocks/postList/designs/card/ArticalHorizontalCard'

type Props = {
  user: User
  postResult: {
    data: Post[]
    totalPages: number
  }
}

export default function AuthorPage({ user, postResult }: Props) {
  const translation = getTranslation({ translations: user.translations })
  console.log('dsfdf sdfpostResult', postResult)
  const postItems = postResult.data.map((post) => {
    return (
      <PostHorizontalCard
        key={post.id}
        post={post}
        options={{ showExcerpt: true }}
      />
    )
  })

  return (
    <div className="flex flex-col">
      {/* <BreadCrumb items={pageBreadCrumb} /> */}
      <div className="flex flex-col items-center gap-4 border-b bg-slate-200 dark:bg-slate-800">
        <div className="flex flex-col items-center gap-4 p-16 ">
          <Avatar className="size-16 ring-background  ring-2">
            <AvatarImage
              alt={user?.name || ''}
              src={user?.image?.srcSmall || ''}
            />
            <AvatarFallback>{user?.name[0] || '?'}</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-semibold m-0">{user?.name}</h1>
          <span className="font-light">{translation?.about}</span>
        </div>
        <span className="font-light p-2 dark:text-gray-100 text-gray-900">
          مطالب
        </span>
      </div>
      <div className="p-2 col-span-4 md:col-span-3 ">
        <div className=" flex flex-col m-auto justify-center w-full md:w-2/6">
          {postItems}
        </div>
        <div className="p-4 flex justify-center items-center">
          <Pagination totalPages={postResult.totalPages} />
        </div>
      </div>
    </div>
  )
}
