'use client'
// کامپوننت نمایشی بلاک

import React, { useEffect } from 'react'
import { Block } from '../../types'
import { Option } from '@/types'
import { getPosts } from '@/features/post/actions'
import EmptyBlock from '../../components/EmptyBlock'
import VideoEmbedPlaylist from '@/components/video-playlist/VideoEmbedPlaylist'
import { getTranslation } from '@/lib/utils'

type BlockProps = {
  widgetName: string
  blockData: {
    content: {
      button: string
    }
    type: 'button'
    settings: {
      label: string
      href: string
      variant?: string
      size?: string
    }
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const BlockInEditor = ({
  widgetName,
  blockData,
  ...props
}: BlockProps) => {
  const locale = 'fa'
  const { content, settings } = blockData
  const { className, ...resProps } = props
  const [videos, setVideos] = React.useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const tagIds = content?.tags?.map((tag: Option) => tag.value) ?? []
      const categoryIds =
        content?.categories?.map((tag: Option) => tag.value) ?? []

      let filters
      if (tagIds.length === 0 && categoryIds.length === 0) {
        filters = {}
      } else {
        filters = { tags: tagIds }
      }

      if (categoryIds?.length > 0)
        filters = { categories: categoryIds, ...filters }
      filters = { ...filters, type: 'video' }
      const [result] = await Promise.all([
        getPosts({
          filters: { ...filters, type: 'video' },
          pagination: { page: 1, perPage: settings?.countOfPosts || 6 },
          projection: {
            image: 1,
            'translations.title': 1,
            'translations.lang': 1,
            primaryVideoEmbedUrl: 1,
          },
        }),
      ])

      const r = result.data
      setVideos(r)
    }

    fetchData()
  }, [content, settings?.countOfPosts])
  if (videos?.length == 0)
    return <EmptyBlock widgetName={widgetName} {...props} />
  const videoList = videos.map((video) => {
    const translation = getTranslation({
      translations: video.translations,
      locale,
    })
    return {
      id: video.id,
      title: translation.title,
      thumbnail: video?.image?.srcMedium || null,
      src: video.primaryVideoEmbedUrl,
    }
  })
  return (
    <div className={`py-4 ${className}`} {...resProps}>
      <div className=" py-2">
        <span className="block px-4 border-r-4 border-primary">
          {content?.title}
        </span>
      </div>
      <VideoEmbedPlaylist videos={videoList} />
    </div>
  )
}
