// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '@/components/builder-canvas/types'
import { computedStyles } from '@/components/builder-canvas/utils/styleUtils'
import { PostTags } from '@/components/post/tags'
import { Tag } from '@/features/tag/interface'

type ContentBlockProps = {
  content: {
    tags: Tag[]
  }
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_tags'
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
    <div
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
    >
      <PostTags tags={content?.tags || []} />
    </div>
  )
}
