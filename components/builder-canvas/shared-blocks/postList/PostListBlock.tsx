// کامپوننت نمایشی بلاک
import React, { Suspense } from 'react'
import { Block } from '../../types'
import { Option } from '@/types'
import { getCategoryAction } from '@/features/category/actions'
import PostList from './PostList'
import PostListFallback from './fall-back/PostListFallback'
import { getSlimPostsForPostListAction } from '@/features/post/actions'

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

  console.log('#234897 in list block render')

  // tggs
  // ----------------------------
  // 1️⃣ تعیین selectedTagId
  // ----------------------------
  // اگر searchParams.tag موجود باشد → از آن استفاده می‌کنیم
  // در غیر این صورت:
  //   - اگر showNewest فعال باشد → رشته خالی
  //   - در غیر این صورت → از اولین tag موجود در content استفاده می‌کنیم
  const selectedTagId = searchParams?.tag
    ? searchParams.tag
    : settings?.showNewest
    ? ''
    : content?.tags?.[0]?.value || ''

  // ----------------------------
  // 3️⃣ ایجاد filters اولیه
  // ----------------------------
  let filters: any = {} // مقدار اولیه خالی
  let tagExistsInWidget = false
  tagExistsInWidget = content?.tags?.some((tag) => tag.value === selectedTagId)
  // ======== tag filter ========
  // اگر searchParams.tag موجود باشد → فیلتر بر اساس آن
  if (searchParams?.tag && tagExistsInWidget) {
    filters = { tags: [searchParams.tag] }

    // در غیر این صورت اگر content.tags حداقل یک tag داشته باشد
  } else if (content?.tags?.[0]?.value && tagExistsInWidget) {
    // بررسی می‌کنیم selectedTagId در content.tags موجود باشد
    filters = { tags: [selectedTagId] }
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

  /*======== Fetch posts ========*/
  // const params = new URLSearchParams()

  // filters?.tags?.forEach((tagId) => {
  //   params.append('tagIds', tagId)
  // })

  // filters?.categories?.forEach((categoryId) => {
  //   params.append('categoryIds', categoryId)
  // })

  // params.set('page', String(1))
  // params.set('perPage', String(settings?.countOfPosts || 5))
  // const url = `${
  //   process.env.NEXT_PUBLIC_SITE_URL
  // }/api/posts?${params.toString()}`
  // const res = await fetch(url, {
  //   next: { tags: ['posts'] },
  // })

  // const postResult = await res.json()

  const postResult = await getSlimPostsForPostListAction({
    payload: {
      filters,
      pagination: { page: 1, perPage: settings?.countOfPosts || 5 },
    },
  })

  // const [result] = await Promise.all([
  //   getPosts({
  //     filters,
  //     pagination: { page: 1, perPage: settings?.countOfPosts || 5 },
  //   }),
  // ])

  const posts = postResult?.data
  const randomMap = posts.map(() => Math.random() < 0.1)
  return (
    <Suspense
      fallback={
        <PostListFallback blockData={blockData} randomMap={randomMap} />
      }
    >
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
    </Suspense>
  )
}
