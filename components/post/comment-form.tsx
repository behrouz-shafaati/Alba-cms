import { Post } from '@/features/post/interface'
import React from 'react'
import { PostCommentFormLazy } from './comment-form-lazy'

type PostCoverProps = {
  post: Post
  styles?: any
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostCommentForm = (props: PostCoverProps) => {
  return (
    <>
      <PostCommentFormLazy {...props} />
    </>
  )
}
