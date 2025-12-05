'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { getTranslation } from '@/lib/utils'
import { Block } from '@/components/builder-canvas/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PostCover } from '@/components/post/cover'
import { PostTitle } from '@/components/post/title'
import PostHorizontalCard from '../card/ArticalHorizontalCard'
import { PostExcerpt } from '@/components/post/excerpt'
import { useDeviceType } from '@/hooks/use-device-type'
import Link from 'next/link'

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

export const PostListHeroVertical = ({
  posts,
  showMoreHref,
  postItems,
  blockData,
  ...props
}: PostListProps) => {
  const mainRef = useRef<HTMLDivElement>(null)
  const [loadingHeight, setLoadingHeight] = useState<boolean>(true)
  const [mainHeight, setMainHeight] = useState<number | null>(0)
  const device = useDeviceType({ initial: 'mobile' })
  const { settings } = blockData

  useEffect(() => {
    if (mainRef.current) {
      const height = mainRef.current.offsetHeight
      setMainHeight(height)
      setLoadingHeight(false)
    }
  }, [mainRef])

  const countOfPosts = posts.length
  const firstPost = posts[0]
  const firstPostTranslation = getTranslation({
    translations: firstPost.translations,
  })

  return (
    <div className="container mx-auto p-4" {...props}>
      {/* Layout: desktop: 2col | mobile: stacked */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Right column — active item */}
        <div ref={mainRef} className="md:w-2/3 w-full h-fit overflow-hidden">
          <Link href={firstPost?.href} className="w-full h-fit">
            <PostCover
              file={firstPost.image}
              postType={firstPost.type}
              primaryVideoEmbedUrl={firstPost.primaryVideoEmbedUrl}
              zoomable={false}
            />
            <PostTitle title={firstPostTranslation.title} />
            <PostExcerpt content={firstPostTranslation.excerpt} />
          </Link>
        </div>

        {/* Left column — playlist list */}
        <div
          className={`${
            countOfPosts > 4 ? `h-96` : ``
          } md:w-1/3 w-full  overflow-hidden`}
          style={{
            ...(device !== 'mobile' && {
              height: mainHeight ? `${mainHeight}px` : 'auto',
            }),
          }}
        >
          <ScrollArea className="h-full">
            <div className="divide-y divide-border">
              {(loadingHeight ? posts.slice(1, 5) : posts.slice(1)).map(
                (post) => (
                  <PostHorizontalCard
                    key={post.id}
                    post={post}
                    options={{
                      showExcerpt: settings?.showExcerpt == true ? true : false,
                    }}
                  />
                )
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
