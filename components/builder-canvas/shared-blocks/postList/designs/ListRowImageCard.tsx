'use client'
// کامپوننت نمایشی بلاک
import React, { useState } from 'react'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { ArrowLeft } from 'lucide-react'
import { Block } from '@/components/builder-canvas/types'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import SelectableTags from '@/components/builder-canvas/shared-blocks/postList/SelectableTags'
import { getPosts } from '@/features/post/actions'
import { getTagAction } from '@/features/tag/actions'
import { FastLink } from '@/components/FastLink'
import PostImageCardSkeltone from './card/skeleton/ImageCardSkeleton'
import PostImageCard from './card/ImageCard'
import AdSlotBlock from '../../AdSlot/AdSlotBlock'

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

export const PostListRowImageCard = ({
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

  const advertisingAfter = blockData?.settings?.advertisingAfter || 0
  let adIndex = 0

  props.className = props?.className
    ? `${props?.className} w-full h-auto max-w-full`
    : 'w-full h-auto max-w-full'

  // const router = useRouter()
  // const pathname = usePathname()
  // const [isPending, startTransition] = useTransition()

  // const handleTagChange = (tagSlug: string) => {
  //   startTransition(() => {
  //     // URL رو تغییر بده و Next.js خودش Server Component رو دوباره render میکنه
  //     const params = new URLSearchParams(searchParams)

  //     if (tagSlug) {
  //       params.set('tag', tagSlug)
  //     } else {
  //       params.delete('tag')
  //     }

  //     router.push(`${pathname}?${params.toString()}`, { scroll: false })
  //   })
  // }
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState(initialPosts)

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

  let queryParamLS = content?.tags || []
  if (settings?.showNewest == true)
    queryParamLS = [{ label: 'تازه‌ها', value: '' }, ...queryParamLS]

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
        <FastLink
          href={showMoreHref}
          className="text-xs text-gray-600 dark:text-gray-300 font-normal flex flex-row items-center gap-2 w-fit text-center justify-center p-4"
        >
          <span>مشاهده همه</span>
          <ArrowLeft size={20} className="text-primary" />
        </FastLink>
      </div>
      <div>
        <SelectableTags
          items={queryParamLS}
          onTagChange={onTagChange}
          className="p-2"
        />
        {/* <QueryParamLinks
          items={queryParamLS}
          className="p-2"
          paramKey="tag"
          onTagSelect={handleTagChange} // به جای setSelectedTag
          selectedTag={searchParams?.tag || ''}
        /> */}
        <div className={`mt-2 `}>
          <ScrollArea className="">
            <div className="flex flex-row w-full gap-4 pb-4">
              <>
                {!loading && posts.length == 0 ? (
                  <div className="w-full p-24 items-start text-center">
                    داده ای وجود ندارد
                  </div>
                ) : (
                  (loading
                    ? new Array(settings?.countOfPosts || 6).fill({})
                    : posts
                  ).map((post, index) => {
                    console.log('#index im map:', index)
                    console.table([
                      {
                        src: post?.image?.srcMedium,
                        isLCP: index == 0,
                      },
                    ])

                    adIndex += 1
                    let flgShowBanner = false
                    if (advertisingAfter == adIndex) {
                      flgShowBanner = true
                      adIndex = 0
                    }

                    const flgShowVertical =
                      randomMap?.[index] === true ? true : false
                    return (
                      <React.Fragment key={post.id}>
                        {loading ? (
                          <PostImageCardSkeltone />
                        ) : (
                          <PostImageCard
                            key={post.id}
                            post={post}
                            options={settings}
                            isLCP={index == 0}
                          />
                        )}
                        {flgShowBanner && (
                          <AdSlotBlock
                            blockData={{
                              id: `${id}${index}`,
                              settings: { aspect: '4/1', countOfBanners: 1 },
                            }}
                          />
                        )}
                      </React.Fragment>
                    )
                  })
                )}
              </>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default PostListRowImageCard
