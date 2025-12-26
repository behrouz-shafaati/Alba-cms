import React, { memo } from 'react'
import VerticalPostCardSkeleton from '@/components/post/skeleton/vertical-card-skeleton'
import PostOverlayCardSkeleton from './OverlayCardSkeleton'
import { BannerGroupFallback } from '@/components/builder-canvas/shared-blocks/AdSlot/BannerGroupFallback'
import PostHorizontalCardSkeleton from './PostHorizontalCardSkeleton'
import PostHorizontalSmallCardSkeleton from './PostHorizontalSmallCardSkeleton'
import PostImageCardSkeltone from './ImageCardSkeleton'

type Props = {
  blockData: any
  randomMap?: boolean[]
}

const PostItemsFallback = ({ blockData, randomMap = [] }: Props) => {
  const { id, content, settings } = blockData

  const advertisingAfter = blockData?.settings?.advertisingAfter || 0
  let adIndex = 0

  return (
    <>
      {new Array(settings?.countOfPosts || 6).fill({}).map((_, index) => {
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
              <React.Fragment key={index}>
                <PostOverlayCardSkeleton
                  options={{ ...settings }}
                  direction={settings?.listDesign}
                />
                {flgShowBanner && (
                  <BannerGroupFallback
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
              <React.Fragment key={index}>
                {flgShowVertical ? (
                  <VerticalPostCardSkeleton />
                ) : (
                  <PostHorizontalCardSkeleton />
                )}
                {flgShowBanner && (
                  <BannerGroupFallback
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
              <React.Fragment key={index}>
                <PostHorizontalSmallCardSkeleton />

                {flgShowBanner && (
                  <BannerGroupFallback
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
              <React.Fragment key={index}>
                <PostImageCardSkeltone />

                {flgShowBanner && (
                  <BannerGroupFallback
                    blockData={{
                      id: `${id}${index}`,
                      settings: { aspect: '4/1', countOfBanners: 1 },
                    }}
                  />
                )}
              </React.Fragment>
            )
        }
      })}
    </>
  )
}

export default memo(PostItemsFallback)
