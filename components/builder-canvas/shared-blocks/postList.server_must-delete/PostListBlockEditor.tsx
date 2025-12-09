'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useState } from 'react'
import { Block } from '../../types'
import { PostList } from './PostList'
import { Option } from '@/types'
import { getPosts } from '@/features/post/actions'
import EmptyBlock from '../../components/EmptyBlock'
import { getCategoryAction } from '@/features/category/actions'

type PostListBlockProps = {
  widgetName: string
  blockData: {
    id: string
    type: 'postList'
    content: {
      usePageCategory: boolean
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

export default function PostListBlockEditor({
  widgetName,
  blockData,
  pageSlug,
  categorySlug,
  ...props
}: PostListBlockProps) {
  const [posts, setPosts] = useState([])
  const { content, settings } = blockData
  useEffect(() => {
    const fetchData = async () => {
      const tagIds = content?.tags?.map((tag: Option) => tag.value)
      const categoryIds = content?.categories?.map((tag: Option) => tag.value)

      let filters
      if (settings?.showNewest == true) {
        filters = {}
      } else {
        filters = { tags: tagIds?.[0] ?? {} }
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
          pagination: { page: 1, perPage: settings?.countOfPosts || 6 },
        }),
      ])

      const posts = result.data
      setPosts(posts)
    }

    fetchData()
  }, [content, settings?.countOfPosts, settings?.showNewest])
  const randomMap = posts.map(() => Math.random() < 0.1)
  if (posts?.length == 0)
    return <EmptyBlock widgetName={widgetName} {...props} />
  return <div {...props}>لیست مطالب</div>
  // return (
  //   <PostList
  //     posts={posts}
  //     blockData={blockData}
  //     pageSlug={pageSlug}
  //     categorySlug={categorySlug}
  //     randomMap={randomMap}
  //     {...props}
  //   />
  // )
}
