'use client'
// کامپوننت نمایشی بلاک
import React from 'react'
import { AdSlotWidgetProps } from './type'
import { BannerData } from '@/lib/bannerManager'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
// import Link from 'next/link'

type BannerProps = {
  banner: BannerData
  banerSlotId: string
} & AdSlotWidgetProps &
  React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

const defaultAspect = '4/1'
export const Banner = ({
  banner,
  blockData,
  banerSlotId: id,
  ...props
}: BannerProps) => {
  const locale = 'fa'
  const { content, settings } = blockData
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
  if (banner === 'loading') {
    console.log(`banner ${id} is loading.`)
    return (
      <Skeleton
        className={` bg-gray-200 dark:bg-gray-800 animate-pulse ${
          blockData?.classNames?.manualInputs || ''
        }`}
        style={{ aspectRatio: settings?.aspect || defaultAspect, flex: 1 }}
        aria-busy="true"
        aria-label={`banner-${id}-loading`}
      />
    )
  }

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
        priority={content?.isLCP || false} // برای تصویر LCP
        loading={content?.isLCP ? 'eager' : 'lazy'}
      />
    )
    if (banner?.targetUrl)
      return (
        <div
          className={`relative ${blockData?.classNames?.manualInputs || ''}`}
          style={{ aspectRatio: settings?.aspect || defaultAspect, flex: 1 }}
          aria-label={`banner-${id}`}
        >
          <a
            href={banner?.targetUrl}
            className="w-full h-full"
            onClick={linkClickHandler}
          >
            {BannerImage}
          </a>
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
