// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../types'
import { Option } from '@/types'
import { getPosts } from '@/features/post/actions'
import { getCategoryAction } from '@/features/category/actions'
import PostList from './PostList'
import { getTagAction } from '@/features/tag/actions'
import { buildUrlFromFilters } from '@/lib/utils'

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

  const [result] = await Promise.all([
    getPosts({
      filters,
      pagination: { page: 1, perPage: settings?.countOfPosts || 5 },
    }),
  ])
  const posts = result.data
  const randomMap = posts.map(() => Math.random() < 0.1)

  // let queryParams = content?.tags || []
  // if (settings?.showNewest == true)
  //   queryParams = [{ label: 'تازه‌ها', slug: '' }, ...queryParams]

  // const tagSlugs = content?.tags?.map((tag: Option) => tag.slug) || []
  // const categorySlugs =
  //   content?.categories?.map((category: Option) => category.slug) || []
  // let showMoreHref = '/archive'

  // if (tagSlugs.length > 0)
  //   showMoreHref = showMoreHref + '/' + buildUrlFromFilters({ tags: tagSlugs })

  // if (content?.usePageCategory && categorySlug) {
  //   showMoreHref =
  //     showMoreHref + '/' + buildUrlFromFilters({ categories: [categorySlug] })
  // } else {
  //   if (categorySlugs.length > 0)
  //     showMoreHref =
  //       showMoreHref + '/' + buildUrlFromFilters({ categories: categorySlugs })
  // }

  // if (
  //   (!settings?.listDesign || settings?.listDesign == 'row') &&
  //   (!settings?.cardDesign || settings?.cardDesign == 'image-card')
  // ) {
  //   console.log('### Rendering ListRowImageCard design ###')
  //   const PostListRowImageCard = (await import('./designs/ListRowImageCard'))
  //     .default
  //   return (
  //     <PostListRowImageCard
  //       posts={posts}
  //       blockData={blockData}
  //       categorySlug={categorySlug}
  //       randomMap={randomMap}
  //       searchParams={searchParams}
  //       filters={filters}
  //       showMoreHref={showMoreHref}
  //       {...props}
  //     />
  //   )
  // }

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
