'use server'
// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../types'
import { BlogPostSlider } from './BlogPostSlider'
import { Option } from '@/types'
import { getPosts } from '@/features/post/actions'
import { getCategoryAction } from '@/features/category/actions'

type BlogPostSliderBlockProps = {
  widgetName: string
  blockData: {
    id: string
    type: 'blogPostSlider'
    content: {
      tags: Option[]
      categories: Option[]
    }
    settings: {
      design: 'simple' | 'parallax'
      showArrows: boolean
      loop: boolean
      autoplay: boolean
      autoplayDelay: number
    }
  } & Block
  pageSlug: string | null
  categorySlug: string | null
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default async function BlogPostSliderBlock({
  widgetName,
  blockData,
  pageSlug,
  categorySlug,
  ...props
}: BlogPostSliderBlockProps) {
  let filters
  const { content } = blockData
  const tagIds = content?.tags?.map((tag: Option) => tag.value)
  const categoryIds = content?.categories?.map((tag: Option) => tag.value)

  if (tagIds?.length > 0) {
    filters = { tags: tagIds }
  }

  if (content?.usePageCategory && categorySlug) {
    // logic to handle usePageCategory and categorySlug
    const category = await getCategoryAction({ slug: categorySlug })
    if (category) filters = { categories: [category.id], ...filters }
  } else {
    if (categoryIds?.length > 0)
      filters = { categories: categoryIds, ...filters }
  }
  const [result] = await Promise.all([
    getPosts({
      filters,
    }),
  ])
  const posts = result.data
  if (posts.length == 0) return null
  return <BlogPostSlider posts={posts} blockData={blockData} {...props} />
}
