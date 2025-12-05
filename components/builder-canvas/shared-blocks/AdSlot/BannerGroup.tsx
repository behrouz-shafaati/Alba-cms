'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useState } from 'react'
import { Block } from '../../types'
import { AdSlotWidgetProps } from './type'
import { Banner } from './Banner'
import { useDeviceType } from '@/hooks/use-device-type'
import { X } from 'lucide-react'
import { BannerData, BannerManager } from '@/lib/bannerManager'

type BannerGroupProps = AdSlotWidgetProps &
  Block &
  React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default function BannerGroup({
  blockData,
  widgetName,
  ...props
}: BannerGroupProps) {
  const locale = 'fa'
  const defaultAspect = '4/1'
  const { id, content, settings } = blockData
  const count = settings?.countOfBanners || 1

  const visibility = blockData?.styles?.visibility || {
    desktop: true,
    tablet: true,
    mobile: true,
  }

  const device = useDeviceType()
  const isVisible = visibility[device]

  const [countDontHaveBanner, setCountDontHaveBanner] = useState(0)
  const [show, setShow] = useState(true)

  //  ساخت object اولیه برای جلوگیری از undefined access
  const initial = React.useMemo(() => {
    const obj: Record<string, BannerData | null | 'loading'> = {}
    for (let i = 0; i < count; i++) {
      obj[`${id}${i}`] = 'loading'
    }
    return obj
  }, [id, count])

  const [banners, setBanners] =
    useState<Record<string, BannerData | null | 'loading'>>(initial)

  useEffect(() => {
    const manager = BannerManager.getInstance()
    const unregisterList: Array<() => void> = []

    for (let i = 0; i < count; i++) {
      const bannerSlotId = `${id}${i}`

      const cb = (data: BannerData | null) => {
        setBanners((prev) => ({
          ...prev,
          [bannerSlotId]: data || null,
        }))

        if (!data?.file) {
          setCountDontHaveBanner((prev) => prev + 1)
        }
      }

      manager.register({
        id: bannerSlotId,
        aspect: settings?.aspect || defaultAspect,
        placement: settings?.placement || 'all',
        linkedCampaign: content?.linkedCampaign || 'none',
        fallbackBehavior: settings?.fallbackBehavior || 'random',
        cb,
      })

      // ذخیره unregister
      unregisterList.push(() => manager.unregister(bannerSlotId))
    }
    return () => {
      unregisterList.forEach((fn) => fn())
    }
  }, [])

  //  اگر قرار نیست نمایش داده شود → کاملاً رندر نشود
  if (!isVisible) return null
  if (countDontHaveBanner === count) return null
  return (
    <div {...props}>
      <div
        className="relative"
        style={{
          display: show ? 'flex' : 'none',
          flexDirection: settings?.direction || 'row',
          gap: '8px', // اختیاری، فقط برای فاصله بین بنرها
        }}
      >
        <button
          onClick={() => setShow(false)}
          className="absolute top-0 right-0 bg-red-700 z-20 p-0 opacity-70"
        >
          <X className="w-4 h-4 text-white" />
        </button>
        {Array.from({ length: count || 1 }).map((_, i) => {
          const slotId = `${id}${i}`
          return (
            <Banner
              key={i}
              banerSlotId={slotId}
              blockData={blockData}
              banner={banners?.[slotId]}
              {...props}
            />
          )
        })}
      </div>
    </div>
  )
}
