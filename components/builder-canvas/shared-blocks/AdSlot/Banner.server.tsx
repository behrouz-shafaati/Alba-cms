// 'use client'
// کامپوننت نمایشی بلاک
import React from 'react'
import { AdSlotWidgetProps } from './type'
import { BannerData } from '@/lib/bannerManager'
import Image from 'next/image'
import Link from 'next/link'

type BannerProps = {
  banner: BannerData
  banerSlotId: string
} & AdSlotWidgetProps &
  React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

const defaultAspect = '4/1'
export const BannerServer = ({
  banner,
  blockData,
  banerSlotId: id,
  ...props
}: BannerProps) => {
  const locale = 'fa'
  const { content, settings } = blockData

  // const [banner, setBanner] = useState<BannerData | null | 'loading'>('loading')
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const manager = BannerManager.getInstance()
  //     // register callback
  //     const cb = (data: BannerData | null) => {
  //       console.log('#23408273490 in banner data: ', data)
  //       if (!data) {
  //         setBanner(null)
  //       } else {
  //         setBanner(data)
  //       }
  //     }
  //     manager.register({
  //       id,
  //       aspect: settings?.aspect || defaultAspect,
  //       placement: settings?.placement || 'all',
  //       linkedCampaign: content?.linkedCampaign || 'none',
  //       fallbackBehavior: settings?.fallbackBehavior || 'random',
  //       cb,
  //     })

  //     return () => {
  //       manager.unregister(id)
  //     }
  //   }
  //   fetchData()
  // }, [id])

  const linkClickHandler = async () => {
    try {
      if (banner !== 'loading' && banner?.campaignId)
        console.log(' فراخوانی متریک کلیک (سمت API)')
      // فراخوانی متریک کلیک (سمت API)
      fetch('/api/banners/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: banner?.campaignId,
          slotId: id,
          locale,
        }),
      })
    } catch (err) {
      console.warn('Failed to track banner click:', err)
    }
  }

  // Render logic: if banner has html prefer that (dangerouslySetInnerHTML), else image

  if (!banner) {
    // no banner available
    return (
      <div
        className={` rounded bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs text-gray-500 ${
          blockData?.classNames?.manualInputs || ''
        }`}
        style={{ aspectRatio: settings?.aspect || defaultAspect, flex: 1 }}
        aria-hidden="true"
      >
        no banner
      </div>
    )
  }

  if (banner.html) {
    return (
      <div
        className={blockData?.classNames?.manualInputs || ''}
        style={{ aspectRatio: settings?.aspect || defaultAspect, flex: 1 }}
        dangerouslySetInnerHTML={{ __html: banner.html }}
        aria-label={`banner-${id}`}
      />
    )
  }

  if (banner.file) {
    const BannerImage = (
      <Image
        src={banner.file?.srcLarge}
        sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, 1280px"
        alt={banner.file?.alt || 'تبلیغ'}
        fill
        className="object-cover w-full h-full"
      />
    )
    if (banner?.targetUrl)
      return (
        <div
          className={`relative ${blockData?.classNames?.manualInputs || ''}`}
          style={{ aspectRatio: settings?.aspect || defaultAspect, flex: 1 }}
          aria-label={`banner-${id}`}
        >
          <Link
            href={banner?.targetUrl}
            className="w-full h-full"
            // onClick={linkClickHandler}
          >
            {BannerImage}
          </Link>
        </div>
      )
    return (
      <div
        className={`relative ${blockData?.classNames?.manualInputs || ''}`}
        style={{ aspectRatio: settings?.aspect || defaultAspect, flex: 1 }}
        aria-label={`banner-${id}`}
      >
        {BannerImage}
      </div>
    )
  }
  return <></>
}
