'use client'
// کامپوننت نمایشی بلاک
import React, { Suspense, useEffect, useState } from 'react'
import { Block } from '../../types'
import { AdSlotWidgetProps } from './type'
import { BannerGroupFallback } from './BannerGroupFallback'
import BannerGroup from './BannerGroup'

type AdSlotBlockProps = AdSlotWidgetProps &
  Block &
  React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default function AdSlotBlock({
  widgetName,
  blockData,
  ...props
}: AdSlotBlockProps) {
  const [loadin, setloading] = useState<boolean>(true)
  const { content, settings } = blockData
  useEffect(() => {
    setloading(false)
  }, [])
  if (loadin)
    return (
      <BannerGroupFallback
        blockData={blockData}
        widgetName={widgetName}
        {...props}
      />
    )

  return (
    <BannerGroup blockData={blockData} widgetName={widgetName} {...props} />
  )
}
