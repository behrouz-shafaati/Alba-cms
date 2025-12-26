import { Option } from '@/types'
import PostHorizontalCardSkeleton from '../../designs/card/skeleton/PostHorizontalCardSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

type PostListProps = {
  blockData: {
    id: string
    type: 'postList'
    content: {
      tags: Option[]
      categories: Option[]
    }
    settings: {
      showArrows: boolean
      loop: boolean
      autoplay: boolean
      autoplayDelay: number
    }
  }
}

export const PostListHeroVerticalFallback = ({ blockData }: PostListProps) => {
  return (
    <div className="container mx-auto p-4">
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-[2fr_1fr]
          gap-4
        "
      >
        {/* ستون اصلی — همیشه ستون مرجع ارتفاع */}
        <div className="relative overflow-hidden rounded-xl  bg-card">
          <Skeleton style={{ aspectRatio: 16 / 9 }} className="rounded-xl" />
          <Skeleton className="h-6 w-72 my-4" />
          <Skeleton className="h-4 w-full my-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* ستون لیست — تطابق ارتفاع با چپ + اسکرول اگر بیشتر شد */}
        {/* <div
          className="
            rounded-xl
            border
            bg-card
            overflow-y-auto
          "
        > */}
        <div className="divide-y divide-border">
          {Array.from({ length: 4 }).map((_, index) => (
            <PostHorizontalCardSkeleton key={index} />
          ))}
        </div>
        {/* </div> */}
      </div>
    </div>
  )
}
