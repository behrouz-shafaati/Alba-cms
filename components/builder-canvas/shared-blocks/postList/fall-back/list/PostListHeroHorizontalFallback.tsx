import React from 'react'
import { Option } from '@/types'
import PostOverlayCardSkeleton from '../../designs/card/skeleton/OverlayCardSkeleton'
import VerticalPostCardSkeleton from '@/components/post/skeleton/vertical-card-skeleton'

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

const PostListHeroHorizontalFallback = ({ blockData }: PostListProps) => {
  const { settings } = blockData

  return (
    <div className="container mx-auto p-4">
      {/* Layout: desktop: 2col | mobile: stacked */}
      <div className="flex flex-col">
        {/* Right column — active item */}
        <div className=" w-full h-fit overflow-hidden">
          <PostOverlayCardSkeleton
            options={{
              showExcerpt: false,
              titleClasses: '!text-4xl',
              aspectRatio: '16 / 9',
            }}
            direction={'column'}
          />
        </div>

        {/* Left column — playlist list */}
        <div className={`relative w-[95%]  p-4 -mt-14 m-auto z-10 round`}>
          {/* پس‌زمینه شیشه‌ای */}
          <div
            className="absolute inset-0 bg-white/10 backdrop-blur-md"
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)',
              maskImage:
                'linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)',
            }}
          ></div>
          <div className="relative flex flex-col md:flex-row gap-2 justify-center ">
            {Array.from({ length: 4 }).map((_, index) => (
              <VerticalPostCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostListHeroHorizontalFallback
