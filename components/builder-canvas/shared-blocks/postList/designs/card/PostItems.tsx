import { Post } from '@/features/post/interface'
import React, { memo } from 'react'
import PostOverlayCard from './OverlayCard'
import AdSlotBlock from '../../../AdSlot/AdSlotBlock'
import VerticalPostCardSkeleton from '@/components/post/skeleton/vertical-card-skeleton'
import VerticalPostCard from '@/components/post/vertical-card'
import ArticalHorizontalCardSkeleton from './skeleton/PostHorizontalCardSkeleton'
import PostHorizontalCard from './ArticalHorizontalCard'
import PostHorizontalSmallCard from './PostHorizontalSmallCard'
import PostImageCardSkeltone from './skeleton/ImageCardSkeleton'
import PostImageCard from './ImageCard'
import PostHorizontalSmallCardSkeleton from './skeleton/PostHorizontalSmallCardSkeleton'

type Props = {
  posts: Post[]
  blockData: any
  randomMap?: boolean[]
  loading?: boolean
}

const PostItems = ({
  posts = [],
  blockData,
  randomMap = [],
  loading = false,
}: Props) => {
  const { id, content, settings } = blockData

  const advertisingAfter = blockData?.settings?.advertisingAfter || 0
  let adIndex = 0

  let queryParamLS = content?.tags || []
  if (settings?.showNewest == true)
    queryParamLS = [{ label: 'تازه‌ها', slug: '' }, ...queryParamLS]
  return (
    <>
      {!loading && posts.length == 0 ? (
        <div className="w-full p-24 items-start text-center">
          داده ای وجود ندارد
        </div>
      ) : (
        (loading ? new Array(settings?.countOfPosts || 6).fill({}) : posts).map(
          (post, index) => {
            const isLCP = index == 0 && settings?.isLCP
            adIndex += 1
            let flgShowBanner = false
            if (advertisingAfter == adIndex) {
              flgShowBanner = true
              adIndex = 0
            }

            const flgShowVertical = randomMap?.[index] === true ? true : false

            switch (blockData?.settings?.cardDesign) {
              case 'overly-card':
                return (
                  <React.Fragment key={post.id}>
                    <PostOverlayCard
                      key={post.id}
                      post={post}
                      options={{ ...settings, isLCP }}
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
                          isLCP={isLCP}
                        />
                      )
                    ) : loading ? (
                      <ArticalHorizontalCardSkeleton />
                    ) : (
                      <PostHorizontalCard
                        key={post.id}
                        post={post}
                        options={settings}
                        isLCP={isLCP}
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
                    {loading ? (
                      <PostHorizontalSmallCardSkeleton />
                    ) : (
                      <PostHorizontalSmallCard
                        key={post.id}
                        post={post}
                        options={settings}
                        isLCP={isLCP}
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
              default:
                return (
                  <React.Fragment key={post.id}>
                    {loading ? (
                      <PostImageCardSkeltone />
                    ) : (
                      <PostImageCard
                        key={post.id}
                        post={post}
                        options={settings}
                        isLCP={isLCP}
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
            }
          }
        )
      )}
    </>
  )
}

export default memo(PostItems)
