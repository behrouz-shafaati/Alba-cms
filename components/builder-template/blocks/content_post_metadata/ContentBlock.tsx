// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '@/components/builder-canvas/types'

import { User } from '@/features/user/interface'
import { PostMetaData } from '@/components/post/meta-data'
import computedStyles from '@/components/builder-canvas/utils/computedStyles'

type ContentBlockProps = {
  content: { author: User; createdAt: string; readingDuration: number }
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_metadata'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ContentBlock = ({
  blockData,
  content,
  ...props
}: ContentBlockProps) => {
  const locale = 'fa'
  const { author, createdAt, readingDuration } = content
  const { settings } = blockData
  return content ? (
    <PostMetaData
      author={author}
      createdAt={createdAt}
      readingDuration={readingDuration}
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
    />
  ) : (
    <></>
  )
}
