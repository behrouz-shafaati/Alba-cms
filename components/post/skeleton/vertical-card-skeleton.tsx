import { Skeleton } from '@/components/ui/skeleton'

export default function VerticalPostCardSkeleton() {
  const locale = 'fa'

  return (
    <div className="embla__slide flex-shrink-0 w-full grow-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4 px-2">
      <div className={`rounded overflow-hidden bg-white dark:bg-gray-900 `}>
        <div className="relative w-full" style={{ aspectRatio: 1.5 }}>
          <Skeleton className="w-full h-full" />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold mb-2 leading-5 min-h-[2.5rem] line-clamp-2">
            <Skeleton className="w-[70%] h-6" />
          </h3>
          <Skeleton className="w-full h-6" />
          <div className="flex mt-3 text-xs text-gray-400 gap-4">
            <div className="flex flex-row gap-1 items-center">
              <Skeleton className="w-6 h-6" />
              <Skeleton className="w-6 h-6 ps-4" />
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
