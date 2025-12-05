'use client'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const PostCommentList = dynamic(() => import('./index'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => (
    <div className="mx-1">
      PostCommentList87
      <Skeleton className="h-12 w-full rounded-md" />
    </div>
  ),
})

export default function PostCommentListLazy(props) {
  return <PostCommentList {...props} />
}
