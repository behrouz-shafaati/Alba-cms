// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../types'
import { AdSlotWidgetProps } from './type'
import { Skeleton } from '@/components/ui/skeleton'

type BannerGroupProps = AdSlotWidgetProps &
  Block & {
    pageSlug: string | null
    categorySlug: string | null
  } & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

const defaultAspect = '4/1'
export const BannerGroupFallback = ({
  blockData,
  widgetName,
  ...props
}: BannerGroupProps) => {
  const locale = 'fa'
  const { id, content, settings } = blockData
  const { pageSlug, categorySlug, ...restProps } = props
  return (
    <div {...restProps}>
      <div
        style={{
          display: 'flex',
          flexDirection: settings?.direction || 'row',
          gap: '8px', // اختیاری، فقط برای فاصله بین بنرها
        }}
      >
        {Array.from({ length: settings?.countOfBanners || 1 }).map((_, i) => {
          return (
            <Skeleton
              key={i}
              className={` bg-gray-200 dark:bg-gray-800 animate-pulse ${
                blockData?.classNames?.manualInputs || ''
              }`}
              style={{
                aspectRatio: settings?.aspect || defaultAspect,
                flex: 1,
              }}
              aria-busy="true"
              aria-label={`banner-${id}-loading`}
            />
          )
        })}
      </div>
    </div>
  )
}
