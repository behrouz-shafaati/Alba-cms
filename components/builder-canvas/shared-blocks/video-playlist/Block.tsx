// کامپوننت نمایشی بلاک

import React from 'react'
import { Block as BlockType } from '../../types'
import { Option } from '@/types'
import { getPosts } from '@/features/post/actions'
import getTranslation from '@/lib/utils/getTranslation'
// import VideoEmbedPlaylistLazy from '@/components/video-playlist/VideoEmbedPlaylistLazy'
import VideoEmbedPlaylist from '@/components/video-playlist/VideoEmbedPlaylist'

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
  } & BlockType
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const Block = async ({
  widgetName,
  blockData,
  ...props
}: BlockProps) => {
  const locale = 'fa'
  const { content, settings } = blockData
  const { className, ...resProps } = props
  const tagIds = content?.tags?.map((tag: Option) => tag.value) ?? []
  const categoryIds = content?.categories?.map((tag: Option) => tag.value) ?? []

  let filters
  if (tagIds.length === 0 && categoryIds.length === 0) {
    filters = {}
  } else {
    filters = { tags: tagIds }
  }

  if (categoryIds?.length > 0) filters = { categories: categoryIds, ...filters }
  filters = { ...filters, type: 'video' }

  const [result] = await Promise.all([
    getPosts({
      filters,
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
  if (r?.length == 0) return null
  const videos = r.map((video: any) => {
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
      <VideoEmbedPlaylist videos={videos} />
    </div>
  )
}
