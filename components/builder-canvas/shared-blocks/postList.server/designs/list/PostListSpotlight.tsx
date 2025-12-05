import React from 'react'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { getTranslation } from '@/lib/utils'
import { Block } from '@/components/builder-canvas/types'
import PostOverlayCard from '../card/OverlayCard'

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

export const PostListSpotlight = ({
  posts,
  showMoreHref,
  postItems,
  blockData,
  ...props
}: PostListProps) => {
  if (!posts?.length) return null
  const { settings, content } = blockData
  const firstPost = posts[0]
  const otherPosts = posts.slice(1)

  return (
    <div {...props}>
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
        <PostOverlayCard
          post={firstPost}
          direction="column"
          options={settings}
        />

        {/* ---- Grid پایین ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {otherPosts.map((post) => {
            const t = getTranslation({ translations: post.translations })
            return (
              <PostOverlayCard
                key={post.id}
                post={post}
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
