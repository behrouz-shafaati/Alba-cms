import { Skeleton } from '@/components/ui/skeleton'

const PostHorizontalSmallCardSkeleton = () => {
  const locale = 'fa'
  return (
    <div className="grid grid-cols-[72px_1fr] items-center md:items-start py-2 gap-2">
      {/* تصویر */}
      <div className="relative w-full h-full  aspect-square md:aspect-[4/3] overflow-hidden rounded-sm">
        <Skeleton className="w-full h-full" />
      </div>

      {/* عنوان */}
      <div className="ps-1 flex items-center md:items-start">
        <Skeleton className="w-[70%] h-6" />
      </div>

      {/* اطلاعات پایین (تاریخ و دیدگاه) */}
      {/* <div className="flex text-xs h-full text-gray-400 gap-4 md:col-start-1 md:self-end px-2">
          {post?.commentsCount && (
            <>
              <div className="flex items-center gap-1">
                {/* <MessageCircleMore width={14} /> {post.commentsCount} * /}
                {post?.commentsCount} دیدگاه
              </div>
              <Separator orientation="vertical" />
            </>
          )}
          <div className="flex items-center gap-1">
            {/* <CalendarPlus width={14} /> حدود {timeAgo(post?.createdAt)} * / }
            حدود {timeAgo(post?.createdAt)}
          </div>
        </div> */}
    </div>
  )
}

export default PostHorizontalSmallCardSkeleton
