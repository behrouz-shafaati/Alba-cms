'use client'
import dynamic from 'next/dynamic'
import PostRowImageCardFallback from '../../fall-back/PostRowImageCardFallback'

// کاملاً خارج از باندل اولیه
const PostListColumn = dynamic(() => import('./PostListColumn'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => <p>Lazy loading colu,m</p>,
})

export default function PostListColumnLazy(props) {
  return <PostListColumn {...props} />
}
