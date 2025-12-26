// کامپوننت نمایشی بلاک
import React from 'react'
import { Option } from '@/types'
import { ListDesigns } from '../type'
import { PostListHeroVerticalFallback } from './list/PostListHeroVerticalFallback'
import PostListColumnFallback from './list/PostListColumnFallback'
import PostListHeroHorizontalFallback from './list/PostListHeroHorizontalFallback'
import PostListSpotlightFallback from './list/PostListSpotlight'
import PostListRowFallback from './list/PostListRow'
import { buildUrlFromFilters } from '@/lib/utils/buildUrlFromFilters'
// import PostListColumnLazy from './designs/list/PostListColumnLazy'

type Props = {
  randomMap: boolean[]
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
      listDesign: ListDesigns
    }
  }
} // ✅ اجازه‌ی دادن onclick, className و ...

export const PostListFallback = ({ blockData, randomMap }: Props) => {
  const { content, settings } = blockData

  const tagSlugs = content?.tags?.map((tag: Option) => tag.slug) || []
  const categorySlugs =
    content?.categories?.map((category: Option) => category.slug) || []
  let showMoreHref = '/archive'

  if (tagSlugs.length > 0)
    showMoreHref = showMoreHref + '/' + buildUrlFromFilters({ tags: tagSlugs })

  if (content?.usePageCategory) {
    showMoreHref = showMoreHref + '/' + buildUrlFromFilters({ categories: [] })
  } else {
    if (categorySlugs.length > 0)
      showMoreHref =
        showMoreHref + '/' + buildUrlFromFilters({ categories: categorySlugs })
  }

  let queryParamLS = content?.tags || []
  if (settings?.showNewest == true)
    queryParamLS = [{ label: 'تازه‌ها', value: '' }, ...queryParamLS]

  switch (settings?.listDesign) {
    case 'column':
      return (
        <PostListColumnFallback blockData={blockData} randomMap={randomMap} />
      )
    case 'heroVertical':
      return <PostListHeroVerticalFallback blockData={blockData} />
    case 'heroHorizontal':
      return <PostListHeroHorizontalFallback blockData={blockData} />
    case 'spotlight':
      return <PostListSpotlightFallback blockData={blockData} />
    default: // case 'row':
      return (
        <PostListRowFallback
          blockData={blockData}
          randomMap={randomMap}
          showMoreHref={showMoreHref}
          searchParams={queryParamLS}
        />
      )
  }
}

export default PostListFallback
