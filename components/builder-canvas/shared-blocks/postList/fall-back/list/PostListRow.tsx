// کامپوننت نمایشی بلاک
import React from 'react'
import { Option } from '@/types'
import { ArrowLeft } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { FastLink } from '@/components/FastLink'
import SelectableTagsFallBack from '../SelectableTagsFallback'
import PostItemsFallBack from '../../designs/card/skeleton/PostItemsFallBack'

type PostListProps = {
  randomMap: boolean[]
  searchParams?: any
  showMoreHref: string
  filters?: object
  blockData: {
    id: string
    type: 'postList'
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
  }
}

export const PostListRowFallback = ({
  showMoreHref,
  blockData,
  searchParams = {},
  randomMap,
  filters = {},
  ...props
}: PostListProps) => {
  const { id, content, settings } = blockData
  console.log('--- PostListRow Rendered --- settings:', settings)
  props.className = props?.className
    ? `${props?.className} w-full h-auto max-w-full`
    : 'w-full h-auto max-w-full'

  let queryParamLS = content?.tags || []
  if (settings?.showNewest == true)
    queryParamLS = [{ label: 'تازه‌ها', value: '' }, ...queryParamLS]
  return (
    <div
      className=" relative w-full min-h-10  overflow-hidden "
      // {...(onClick ? { onClick } : {})}
    >
      <div className="flex flex-row justify-between pb-2 ">
        {content?.title && (
          <div className=" py-4">
            <span className="block px-4 border-r-4 border-primary">
              {content?.title}
            </span>
          </div>
        )}
        <FastLink
          href={showMoreHref}
          className="text-xs text-gray-600 dark:text-gray-300 font-normal flex flex-row items-center gap-2 w-fit text-center justify-center p-4"
        >
          <span>مشاهده همه</span>
          <ArrowLeft size={20} className="text-primary" />
        </FastLink>
      </div>
      <div>
        <SelectableTagsFallBack items={queryParamLS} className="p-2" />
        <div className={`mt-2 `}>
          <ScrollArea className="">
            <div className="flex flex-row w-full gap-4 pb-4">
              <PostItemsFallBack blockData={blockData} randomMap={randomMap} />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default PostListRowFallback
