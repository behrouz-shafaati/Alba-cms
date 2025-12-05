'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { ArrowLeft } from 'lucide-react'
import { Block } from '@/components/builder-canvas/types'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import PostItems from '../card/PostItems'
import { getPosts } from '@/features/post/actions'
import { getTagAction } from '@/features/tag/actions'
// import SelectableTags from '@/components/builder-canvas/components/SelectableTags'
import QueryParamLinks from '@/components/builder-canvas/components/QueryParamLinks'

type PostListProps = {
  posts: Post[]
  randomMap?: boolean[]
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
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostListRow = ({
  posts: initialPosts,
  showMoreHref,
  blockData,
  searchParams = {},
  randomMap,
  filters = {},
  ...props
}: PostListProps) => {
  const locale = 'fa'
  const { id, content, settings } = blockData
  props.className = props?.className
    ? `${props?.className} w-full h-auto max-w-full`
    : 'w-full h-auto max-w-full'

  const firstLoad = useRef(true)
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState(initialPosts)
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (firstLoad.current === true) {
        firstLoad.current = false
        return
      }
      setLoading(true)
      let _filters
      if (selectedTag != '') {
        const tag = await getTagAction({ slug: selectedTag })
        _filters = { ...filters, tags: [tag.id] }
      } else {
        _filters = filters
      }
      const [result] = await Promise.all([
        getPosts({
          filters: _filters,
          pagination: { page: 1, perPage: settings?.countOfPosts || 6 },
        }),
      ])
      const posts = result.data
      setPosts(posts)
      setLoading(false)
    }
    fetchData()
  }, [selectedTag])

  let queryParamLS = content?.tags || []
  if (settings?.showNewest == true)
    queryParamLS = [{ label: 'تازه‌ها', slug: '' }, ...queryParamLS]
  return (
    <div
      className=" relative w-full min-h-10  overflow-hidden "
      // {...(onClick ? { onClick } : {})}
    >
      <div className="flex flex-row justify-between pb-2 ">
        <div className=" py-4">
          <span className="block px-4 border-r-4 border-primary">
            {content?.title}
          </span>
        </div>
        <Link
          href={showMoreHref}
          className="text-xs text-gray-600 dark:text-gray-300 font-normal flex flex-row items-center gap-2 w-fit text-center justify-center p-4"
        >
          <span>مشاهده همه</span>
          <ArrowLeft size={20} className="text-primary" />
        </Link>
      </div>
      <div>
        {/* <SelectableTags
          items={queryParamLS}
          setSelectedTag={setSelectedTag}
          className="p-2"
        /> */}
        <QueryParamLinks items={queryParamLS} className="p-2" paramKey="tag" />
        <div className={`mt-2 `}>
          <ScrollArea className="">
            <div className="flex flex-row w-full gap-4 pb-4">
              <PostItems
                posts={posts}
                blockData={blockData}
                randomMap={randomMap}
                loading={loading}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default PostListRow
