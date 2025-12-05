// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '@/components/builder-canvas/types'
import { computedStyles } from '@/components/builder-canvas/utils/styleUtils'
import { User } from '@/features/user/interface'
import { PostAuthorCard } from '@/components/post/author-card'

type ContentBlockProps = {
  content: {
    author: User
  }
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_author_card'
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
      <PostAuthorCard author={content.author} />
    </div>
  )
}
