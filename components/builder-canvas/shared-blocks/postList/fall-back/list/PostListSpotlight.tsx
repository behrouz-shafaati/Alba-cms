import React from 'react'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { getTranslation } from '@/lib/utils'
import { Block } from '@/components/builder-canvas/types'
import PostOverlayCard from '../card/OverlayCard'
import { Skeleton } from '@/components/ui/skeleton'
import PostOverlayCardSkeleton from '../../designs/card/skeleton/OverlayCardSkeleton'

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

const PostListSpotlightFallback = ({ blockData }: PostListProps) => {
  const { settings, content } = blockData

  return (
    <div>
      {content?.title && (
        <div className="flex flex-row justify-between pb-2 ">
          <div className="py-4">
            <span className="block px-4 border-r-4 border-primary">
              {content?.title}
            </span>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col gap-6 ">
        {/* ---- Featured (اولی) ---- */}
        <PostOverlayCardSkeleton direction="column" options={settings} />

        {/* ---- Grid پایین ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {new Array(settings?.countOfPosts - 1 || 6)
            .fill({})
            .map((_, index) => {
              return (
                <PostOverlayCardSkeleton
                  key={index}
                  direction="column"
                  options={settings}
                />
              )
            })}
        </div>
      </div>
    </div>
  )
}
export default PostListSpotlightFallback
