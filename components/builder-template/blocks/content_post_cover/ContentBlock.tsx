// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '@/components/builder-canvas/types'
import { computedStyles } from '@/components/builder-canvas/utils/styleUtils'
import { PostCover } from '@/components/post/cover'
import { File } from '@/lib/entity/file/interface'

type ContentBlockProps = {
  content: {
    postType: 'article' | 'video'
    primaryVideoEmbedUrl: string | null
    image: File
  }
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_title'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ContentBlock = ({
  blockData,
  content,
  ...props
}: ContentBlockProps) => {
  const locale = 'fa'
  const { settings } = blockData
  return (
    <PostCover
      postType={content?.postType ?? 'article'}
      primaryVideoEmbedUrl={content?.primaryVideoEmbedUrl ?? null}
      file={content?.image}
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
    />
  )
}
