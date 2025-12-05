// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block } from '@/components/builder-canvas/types'
import { computedStyles } from '@/components/builder-canvas/utils/styleUtils'
import { PostCommentForm } from '@/components/post/comment-form'
import { Post } from '@/features/post/interface'

type ContentBlockProps = {
  post: Post
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_comment_form'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ContentBlock = ({
  blockData,
  post,
  ...props
}: ContentBlockProps) => {
  const { settings } = blockData
  return (
    <PostCommentForm
      style={{
        ...computedStyles(blockData.styles),
      }}
      post={props.content?.post}
    />
  )
}
