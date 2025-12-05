// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../types'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { buildUrlFromFilters } from '@/lib/utils'
import { PostListHeroVertical } from './designs/list/PostListHeroVertical'
import { PostListSpotlight } from './designs/list/PostListSpotlight'
import { PostListHeroHorizontal } from './designs/list/PostListHeroHorizontal'
// import PostListRowLazy from './designs/list/PostListRowLazy'
// import PostListColumnLazy from './designs/list/PostListColumnLazy'
import PostListRow from './designs/list/PostListRow'
import PostListColumn from './designs/list/PostListColumn'

type PostListProps = {
  posts: Post[]
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
  randomMap: boolean[]
  searchParams?: any
  filters?: Object
  loading?: boolean
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostList = async ({
  posts: posts,
  randomMap,
  blockData,
  searchParams = {},
  filters,
  loading = false,
  ...props
}: PostListProps) => {
  const locale = 'fa'
  const { categorySlug } = props ? props : { categorySlug: null }
  const { id, content, settings } = blockData

  const bannerSettings = { settings: { aspect: '4/1' } }

  let queryParams = content?.tags || []
  if (settings?.showNewest == true)
    queryParams = [{ label: 'تازه‌ها', slug: '' }, ...queryParams]

  const tagSlugs = content?.tags?.map((tag: Option) => tag.slug) || []
  const categorySlugs =
    content?.categories?.map((category: Option) => category.slug) || []
  let showMoreHref = '/archive'

  if (tagSlugs.length > 0)
    showMoreHref = showMoreHref + '/' + buildUrlFromFilters({ tags: tagSlugs })

  if (content?.usePageCategory && categorySlug) {
    showMoreHref =
      showMoreHref + '/' + buildUrlFromFilters({ categories: [categorySlug] })
  } else {
    if (categorySlugs.length > 0)
      showMoreHref =
        showMoreHref + '/' + buildUrlFromFilters({ categories: categorySlugs })
  }

  switch (settings?.listDesign) {
    case 'column':
      return (
        <PostListColumn
          posts={posts}
          blockData={blockData}
          showMoreHref={showMoreHref}
          searchParams={searchParams}
          randomMap={randomMap}
          filters={filters}
          {...props}
        />
      )
    case 'heroVertical':
      return (
        <PostListHeroVertical
          posts={posts}
          blockData={blockData}
          showMoreHref={showMoreHref}
          {...props}
        />
      )
    case 'heroHorizontal':
      return (
        <PostListHeroHorizontal
          posts={posts}
          blockData={blockData}
          showMoreHref={showMoreHref}
          {...props}
        />
      )
    case 'spotlight':
      return (
        <PostListSpotlight
          posts={posts}
          blockData={blockData}
          showMoreHref={showMoreHref}
          {...props}
        />
      )
    default: // case 'row':
      return (
        <PostListRow
          posts={posts}
          blockData={blockData}
          showMoreHref={showMoreHref}
          searchParams={searchParams}
          randomMap={randomMap}
          filters={filters}
          {...props}
        />
      )
  }
}

export default PostList
