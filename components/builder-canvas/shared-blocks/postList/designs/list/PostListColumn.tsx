'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { MoveLeft } from 'lucide-react'
import { Block } from '@/components/builder-canvas/types'
import PostItems from '../card/PostItems'
import SelectableTags from '@/components/builder-canvas/components/SelectableTags'
import { getTagAction } from '@/features/tag/actions'
import { getPosts } from '@/features/post/actions'

type PostListProps = {
  posts: Post[]
  randomMap: boolean[]
  filters?: Object
  showMoreHref: string
  searchParams?: any
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
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

const PostListColumn = ({
  posts: initialPosts,
  showMoreHref,
  blockData,
  searchParams = {},
  filters = {},
  randomMap,
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
        <div className="py-4">
          <span className="block px-4 border-r-4 border-primary">
            {content.title}
          </span>
        </div>
      </div>
      <div className="px-2">
        <SelectableTags
          items={queryParamLS}
          setSelectedTag={setSelectedTag}
          className="p-2"
        />
        <div className={`mt-2 `}>
          <div className="grid grid-cols-1 gap-2">
            <PostItems
              posts={posts}
              blockData={blockData}
              randomMap={randomMap}
              loading={loading}
            />
          </div>
          <Link
            href={showMoreHref}
            className="text-xs text-gray-600 dark:text-gray-300 font-normal flex flex-row items-center gap-2 w-full text-center justify-center p-4"
          >
            <span>مشاهده مطالب بیشتر</span>
            <MoveLeft size={20} className="text-primary" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PostListColumn
