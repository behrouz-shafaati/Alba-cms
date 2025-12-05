'use client'
import dynamic from 'next/dynamic'
import PostRowImageCardFallback from '../../postList/fall-back/PostRowImageCardFallback'

// کاملاً خارج از باندل اولیه
const BlogPostSliderSimple = dynamic(() => import('./BlogPostSliderSimple'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => <PostRowImageCardFallback />,
})

export default function BlogPostSliderSimpleLazy(props) {
  return <BlogPostSliderSimple {...props} />
}
