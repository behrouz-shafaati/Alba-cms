'use server'
// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../types'
import { AdSlotWidgetProps } from './type'
import { X } from 'lucide-react'
import campaignCtrl from '@/features/campaign/controller'
import { BannerServer } from './Banner.server'
// import { RequestStorage } from '@/lib/requestStorage.server'

type BannerGroupProps = AdSlotWidgetProps &
  Block &
  React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default async function BannerGroupServer({
  blockData,
  widgetName,
  pageSlug = null,
  categorySlug = null,
  ...props
}: BannerGroupProps) {
  const locale = 'fa'
  const defaultAspect = '4/1'
  const { id, content, settings } = blockData
  const count = settings?.countOfBanners || 1

  // const visibility = blockData?.styles?.visibility || {
  //   desktop: true,
  //   tablet: true,
  //   mobile: true,
  // }

  // const device = useDeviceType()
  // const isVisible = visibility[device]

  // const [countDontHaveBanner, setCountDontHaveBanner] = useState(0)
  // const [show, setShow] = useState(true)+
  let show = true
  let countDontHaveBanner = 0

  let slots: any[] = []
  for (let i = 0; i < count; i++) {
    const bannerSlotId = `${id}${i}`
    slots[bannerSlotId] = {
      aspect: settings?.aspect || defaultAspect,
      placement: settings?.placement || 'all',
      linkedCampaign: content?.linkedCampaign || 'none',
      fallbackBehavior: settings?.fallbackBehavior || 'random',
    }
  }

  const results = await campaignCtrl.getBanners({
    adSlots: slots,
    originPostSlug: pageSlug,
    sendedAlready: [], // RequestStorage.getDisplayedCampaigns(),
    locale: 'fa',
  })

  // RequestStorage.addDisplayedCampaign(results.sendedAlready || [])
  // map by id
  const map = new Map(results.banners.map((b) => [b.slotId, b]))

  //  اگر قرار نیست نمایش داده شود → کاملاً رندر نشود
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
          // onClick={() => setShow(false)}
          className="absolute top-0 right-0 bg-red-700 z-20 p-0 opacity-70"
        >
          <X className="w-4 h-4 text-white" />
        </button>
        {Array.from({ length: count || 1 }).map((_, i) => {
          const slotId = `${id}${i}`
          return (
            <BannerServer
              key={i}
              banerSlotId={slotId}
              blockData={blockData}
              banner={map.get(slotId)}
              {...props}
            />
          )
        })}
      </div>
    </div>
  )
}
