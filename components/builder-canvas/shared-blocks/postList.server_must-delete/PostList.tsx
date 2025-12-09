'use server'
// کامپوننت نمایشی بلاک
import React, { useMemo } from 'react'
import { Block } from '../../types'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { PostListColumn } from './designs/list/PostListColumn'
import { buildUrlFromFilters } from '@/lib/utils'
import { PostListRow } from './designs/list/PostListRow'
import PostImageCard from './designs/card/ImageCard'
import PostOverlayCard from './designs/card/OverlayCard'
import PostHorizontalCard from './designs/card/ArticalHorizontalCard'
import { PostListHeroVertical } from './designs/list/PostListHeroVertical'
import { PostListSpotlight } from './designs/list/PostListSpotlight'
import { PostListHeroHorizontal } from './designs/list/PostListHeroHorizontal'
import VerticalPostCard from '@/components/post/vertical-card'
// import AdSlotBlockServer from '../AdSlot/AdSlotBlock.server'
import PostHorizontalSmallCard from './designs/card/PostHorizontalSmallCard'
import PostImageCardSkeltone from './designs/card/skeleton/ImageCardSkeleton'
import ArticalHorizontalCardSkeleton from './designs/card/skeleton/ArticalHorizontalCardSkeleton'
import VerticalPostCardSkeleton from '@/components/post/skeleton/vertical-card-skeleton'
import AdSlotBlock from '../AdSlot/AdSlotBlock'

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

  const bannerSettings = useMemo(() => ({ settings: { aspect: '4/1' } }), [])

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

  // showMoreHref = showMoreHref + `?page=1&perPage=${showMoreHref.length || 6}`
  // selectedTag از نوار آدرس مرورگر خوانده میشود
  // showMoreHref =
  //   selectedTag != ''
  //     ? showMoreHref + '/' + buildUrlFromFilters({ tags: [selectedTag] })
  //     : showMoreHref

  const postItemsFun = () => {
    if (!loading && posts.length == 0)
      return (
        <div className="w-full p-24 items-center text-center">
          داده ای وجود ندارد
        </div>
      )

    const advertisingAfter = blockData?.settings?.advertisingAfter || 0
    let adIndex = 0
    return (
      loading ? new Array(settings?.countOfPosts || 6).fill({}) : posts
    ).map((post, index) => {
      adIndex += 1
      let flgShowBanner = false
      if (advertisingAfter == adIndex) {
        flgShowBanner = true
        adIndex = 0
      }

      const flgShowVertical = randomMap[index]

      switch (blockData?.settings?.cardDesign) {
        case 'overly-card':
          return (
            <React.Fragment key={post.id}>
              <PostOverlayCard
                key={post.id}
                post={post}
                options={settings}
                direction={settings?.listDesign}
              />
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
        case 'horizontal-card':
          return (
            <React.Fragment key={post.id}>
              {flgShowVertical ? (
                loading ? (
                  <VerticalPostCardSkeleton />
                ) : (
                  <VerticalPostCard
                    key={post.id}
                    post={post}
                    options={{ showExcerpt: false }}
                    className="border-b"
                  />
                )
              ) : loading ? (
                <ArticalHorizontalCardSkeleton />
              ) : (
                <PostHorizontalCard
                  key={post.id}
                  post={post}
                  options={settings}
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
        case 'horizontal-card-small':
          return (
            <React.Fragment key={post.id}>
              <PostHorizontalSmallCard
                key={post.id}
                post={post}
                options={settings}
              />
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
        default:
          return (
            <React.Fragment key={post.id}>
              {loading ? (
                <PostImageCardSkeltone />
              ) : (
                <PostImageCard key={post.id} post={post} options={settings} />
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
      }
    })
  }

  const postItems = postItemsFun()
  switch (settings?.listDesign) {
    case 'column':
      return (
        <PostListColumn
          posts={posts}
          postItems={postItems}
          blockData={blockData}
          showMoreHref={showMoreHref}
          searchParams={searchParams}
          {...props}
        />
      )
    case 'heroVertical':
      return (
        <PostListHeroVertical
          posts={posts}
          postItems={postItems}
          blockData={blockData}
          showMoreHref={showMoreHref}
          {...props}
        />
      )
    case 'heroHorizontal':
      return (
        <PostListHeroHorizontal
          posts={posts}
          postItems={postItems}
          blockData={blockData}
          showMoreHref={showMoreHref}
          {...props}
        />
      )
    case 'spotlight':
      return (
        <PostListSpotlight
          posts={posts}
          postItems={postItems}
          blockData={blockData}
          showMoreHref={showMoreHref}
          {...props}
        />
      )
    default: // case 'row':
      return (
        <PostListRow
          posts={posts}
          postItems={postItems}
          blockData={blockData}
          showMoreHref={showMoreHref}
          searchParams={searchParams}
          {...props}
        />
      )
  }
}

export default PostList
