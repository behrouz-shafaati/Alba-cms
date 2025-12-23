'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useState, useTransition } from 'react'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { MoveLeft } from 'lucide-react'
import { Block } from '@/components/builder-canvas/types'
import PostItems from '../card/PostItems'
import SelectableTags from '@/components/builder-canvas/components/SelectableTags'
import { getPosts } from '@/features/post/actions'
import { FastLink } from '@/components/FastLink'

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

const INITIAL_COUNT = 6
const STEP = 5

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
  const [loading, setLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const [posts, setPosts] = useState(initialPosts)
  const [isPending, startTransition] = useTransition()

  // -------------------------------
  // 1️⃣ فیلتر سمت سرور
  const onTagChange = async (tagId: string) => {
    setLoading(true)
    let _filters
    if (tagId != '') {
      _filters = { ...filters, tags: [tagId] }
    } else {
      _filters = filters
    }
    const [result] = await Promise.all([
      getPosts({
        filters: _filters,
        pagination: { page: 1, perPage: settings?.countOfPosts || 5 },
      }),
    ])
    const posts = result.data
    setPosts(posts)
    setLoading(false)
  }

  // -------------------------------
  // 2️⃣ Load More خودکار (idle + scroll)
  useEffect(() => {
    if (visibleCount >= posts.length) return

    const loadMore = () => {
      startTransition(() => {
        setVisibleCount((v) => Math.min(v + STEP, posts.length))
      })
    }

    // idle callback
    let idleId: number | null = null
    if ('requestIdleCallback' in window) {
      idleId = requestIdleCallback(loadMore)
    }

    // scroll fallback
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY > document.body.offsetHeight - 300
      if (nearBottom) loadMore()
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      if (idleId) cancelIdleCallback(idleId)
      window.removeEventListener('scroll', onScroll)
    }
  }, [visibleCount, posts.length])

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
        <SelectableTags
          items={queryParamLS}
          onTagChange={onTagChange}
          className="p-2"
        />
        <div className={`mt-2 `}>
          <div className="grid grid-cols-1 gap-2">
            <PostItems
              posts={posts.slice(0, visibleCount)}
              blockData={blockData}
              randomMap={randomMap}
              loading={loading}
            />
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

export default PostListColumn
