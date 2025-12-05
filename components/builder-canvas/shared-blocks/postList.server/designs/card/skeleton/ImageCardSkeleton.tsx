import { Skeleton } from '@/components/ui/skeleton'

const PostImageCardSkeltone = () => {
  return (
    <div className="flex-shrink-0 basis-[85vw] sm:basis-[45vw] md:basis-[23vw] xl:basis-[16vw] snap-start">
      <div className="rounded overflow-hidden shadow-lg bg-white dark:bg-gray-900">
        <div className="relative w-full h-52">
          <Skeleton className="w-full h-52" />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold mb-2 leading-5 min-h-[2.5rem] line-clamp-2">
            <Skeleton className="w-[70%] h-6" />
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            <Skeleton className="w-full h-6" />
          </p>
          <div className="flex mt-3 text-xs text-gray-400 gap-4">
            <div className="flex flex-row gap-1 items-center justify-between">
              <Skeleton className="w-6 h-6" />
            </div>
            <div className="flex flex-row gap-1 items-center">
              <Skeleton className="w-6 h-6" />
            </div>
          </div>
          {/* <div className="mt-3 text-xs text-gray-400">
              توسط {post.author?.name}
            </div> */}
        </div>
      </div>
    </div>
  )
}

export default PostImageCardSkeltone
