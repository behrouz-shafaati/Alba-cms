// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../types'
import { Option } from '@/types'
import { getPosts } from '@/features/post/actions'
import { getCategoryAction } from '@/features/category/actions'
import PostList from './PostList'
import { getTagAction } from '@/features/tag/actions'

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
      design: 'simple' | 'parallax'
      showArrows: boolean
      loop: boolean
      autoplay: boolean
      autoplayDelay: number
    }
  } & Block
  pageSlug: string | null
  categorySlug: string | null
  searchParams?: any
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default async function PostListBlock({
  widgetName,
  blockData,
  pageSlug,
  categorySlug,
  searchParams = {},
  ...props
}: PostListBlockProps) {
  const { content, settings } = blockData

  // const selectedTag = searchParams?.tag
  const selectedTag = settings?.showNewest ? '' : content?.tags?.[0].slug || ''
  const flgSelectedTagExistInBlock = Array.isArray(content?.tags)

  let filters = {}
    ? /*======== tag filter ========*/
      searchParams?.tag
    : settings?.showNewest == true
    ? ''
    : content?.tags?.[0]?.slug || ''
    ? content.tags.some((tag) => tag.slug === selectedTag)
    : false
  if (selectedTag != '' && flgSelectedTagExistInBlock) {
    const tag = await getTagAction({ slug: selectedTag })

    filters = { ...filters, tags: [tag.id] }
  }

  /*======== category filter ========*/
  const categoryIds =
    content?.categories?.map((category: Option) => category.value) || {}
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
  const randomMap = posts.map(() => Math.random() < 0.1)
  return (
    <PostList
      posts={posts}
      blockData={blockData}
      pageSlug={pageSlug}
      categorySlug={categorySlug}
      randomMap={randomMap}
      searchParams={searchParams}
      filters={filters}
      {...props}
    />
  )
}
