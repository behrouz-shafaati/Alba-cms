'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useState } from 'react'
import { Block } from '../../types'
import { BlogPostSlider } from './BlogPostSlider'
import { Option } from '@/types'
import { getPosts } from '@/features/post/actions'
import EmptyBlock from '../../components/EmptyBlock'
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
      showArrows: boolean
      loop: boolean
      autoplay: boolean
      autoplayDelay: number
    }
  } & Block
  pageSlug: string | null
  categorySlug: string | null
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default function BlogPostSliderBlockEditor({
  widgetName,
  blockData,
  pageSlug,
  categorySlug,
  ...props
}: BlogPostSliderBlockProps) {
  const [posts, setPosts] = useState([])
  const { content } = blockData

  useEffect(() => {
    const fetchData = async () => {
      let filters
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
      setPosts(posts)
      console.log('#89782345 posts:', posts)
    }

    fetchData()
  }, [content])
  if (posts.length == 0)
    return <EmptyBlock widgetName={widgetName} {...props} />
  return <BlogPostSlider posts={posts} blockData={blockData} {...props} />
}
