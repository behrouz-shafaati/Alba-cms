import React from 'react'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { Block } from '@/components/builder-canvas/types'
import PostOverlayCard from '../card/OverlayCard'
import VerticalPostCard from '@/components/post/vertical-card'

type PostListProps = {
  posts: Post[]
  showMoreHref: string
  postItems: any
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
  } & Block
} & React.HTMLAttributes<HTMLDivElement>

export const PostListHeroHorizontal = ({
  posts,
  showMoreHref,
  postItems,
  blockData,
  ...props
}: PostListProps) => {
  const { settings } = blockData
  const firstPost = posts[0]

  return (
    <div className="container mx-auto p-4" {...props}>
      {/* Layout: desktop: 2col | mobile: stacked */}
      <div className="flex flex-col">
        {/* Right column — active item */}
        <div className=" w-full h-fit overflow-hidden">
          <PostOverlayCard
            key={firstPost.id}
            post={firstPost}
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
            {posts.slice(1, 5).map((post) => (
              <VerticalPostCard
                key={post.id}
                post={post}
                options={{
                  showExcerpt: settings?.showExcerpt == true ? true : false,
                }}
                className={'shadow'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
