// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '@/components/builder-canvas/types'
import { computedStyles } from '@/components/builder-canvas/utils/styleUtils'
import { CommentsHeader } from '@/components/post/comments-header'

type ContentBlockProps = {
  content: {}
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_comments_header'
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
      <CommentsHeader />
    </div>
  )
}
