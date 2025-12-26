// کامپوننت نمایشی بلاک
import React from 'react'
import { Option } from '@/types'
import { MoveLeft } from 'lucide-react'
import { FastLink } from '@/components/FastLink'
import SelectableTagsFallBack from '../SelectableTagsFallback'
import PostItemsFallBack from '../../designs/card/skeleton/PostItemsFallBack'
import { buildUrlFromFilters } from '@/lib/utils/buildUrlFromFilters'

type PostListProps = {
  randomMap: boolean[]
  blockData: {
    id: string
    type: 'postList'
    content: {
      title: string
      tags: Option[]
      categories: Option[]
    }
    settings: {
      showNewest: boolean
      showArrows: boolean
      loop: boolean
      autoplay: boolean
      autoplayDelay: number
    }
  }
}

const PostListColumnFallback = ({ blockData, randomMap }: PostListProps) => {
  const { id, content, settings } = blockData

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
  return (
    <div
      className=" relative w-full min-h-10  overflow-hidden "
      // {...(onClick ? { onClick } : {})}
    >
      <div className="flex flex-row justify-between pb-2 ">
        <div className="py-4">
          <span className="block px-4 border-r-4 border-primary">
            {content.title}
          </span>
        </div>
      </div>
      <div className="px-2">
        <SelectableTagsFallBack items={queryParamLS} className="p-2" />
        <div className={`mt-2 `}>
          <div className="grid grid-cols-1 gap-2">
            <PostItemsFallBack blockData={blockData} randomMap={randomMap} />
          </div>
          <FastLink
            href={showMoreHref}
            className="text-xs text-gray-600 dark:text-gray-300 font-normal flex flex-row items-center gap-2 w-full text-center justify-center p-4"
          >
            <span>مشاهده مطالب بیشتر</span>
            <MoveLeft size={20} className="text-primary" />
          </FastLink>
        </div>
      </div>
    </div>
  )
}

export default PostListColumnFallback
