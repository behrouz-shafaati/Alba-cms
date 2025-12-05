'use client'
import dynamic from 'next/dynamic'
import PostRowImageCardFallback from '../../fall-back/PostRowImageCardFallback'

// کاملاً خارج از باندل اولیه
const PostListRow = dynamic(() => import('./PostListRow'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => <PostRowImageCardFallback />,
})

export default function PostListRowLazy(props) {
  return <PostListRow {...props} />
}
