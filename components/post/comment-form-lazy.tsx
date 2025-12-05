'use client'
import dynamic from 'next/dynamic'
import { Post } from '@/features/post/interface'
import React from 'react'
import { Skeleton } from '../ui/skeleton'

// فقط وقتی که لازم شد، بارگذاری می‌شود
const CommentForm = dynamic(
  () => import('@/features/post-comment/ui/comment-form'),
  {
    ssr: false, // اگر کامپوننت فقط در کلاینت استفاده می‌شود
    loading: () => <Skeleton className="h-[7.5rem] w-full" />, // optional placeholder
  }
)

type PostCoverProps = {
  post: Post
  styles?: any
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostCommentFormLazy = ({
  post,
  styles = {},
  ...props
}: PostCoverProps) => {
  return (
    <div style={styles} {...props}>
      <CommentForm post={post} />
    </div>
  )
}
