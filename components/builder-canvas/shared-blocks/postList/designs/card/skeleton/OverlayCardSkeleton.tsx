import { Skeleton } from '@/components/ui/skeleton'

type Props = {
  direction?: 'row' | 'column'
  options?: {
    showExcerpt?: boolean
    showCreatedAt?: boolean
    titleClasses?: string
    aspectRatio?: string
    isLCP?: boolean
  }
}

const PostOverlayCardSkeleton = ({ direction = 'row', options }: Props) => {
  const {
    showExcerpt = true,
    showCreatedAt = true,
    titleClasses = '',
    aspectRatio = '3 / 2',
  } = options || {}

  return (
    <div
      className={`group relative block overflow-hidden rounded-lg shadow-md transition-all duration-500 ${
        direction === 'row'
          ? 'basis-[85vw] sm:basis-[45vw] md:basis-[30vw] xl:basis-[23vw] h-56 flex-shrink-0 snap-start'
          : ''
      }`}
      style={direction === 'column' ? { aspectRatio: aspectRatio } : undefined}
    >
      {/* ماسک تیره */}
      <div className="absolute inset-0 bg-black/60 transition-all duration-500 group-hover:bg-black/40" />

      {/* محتوای کارت */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4 text-white transition-all duration-500">
        <h3
          className={`text-xl font-semibold leading-8 mb-2 line-clamp-2 group-hover:text-white/90 ${titleClasses} py-2`}
        >
          <Skeleton className="h-6 w-60" />
        </h3>

        {showExcerpt && <Skeleton className="h-4 w-[200px] mb-2" />}

        <div className="flex items-center gap-4 text-[11px] text-gray-300 group-hover:text-gray-200">
          {/* {post?.commentsCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageCircleMore width={14} /> {post.commentsCount}
            </div>
          )} */}
          {showCreatedAt && <Skeleton className="h-4 w-24" />}
        </div>
      </div>
    </div>
  )
}

export default PostOverlayCardSkeleton
