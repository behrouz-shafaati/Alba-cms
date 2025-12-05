'use server'
// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../types'
import { AdSlotWidgetProps } from './type'
import BannerGroupServer from './BannerGroup.server'

type AdSlotBlockProps = AdSlotWidgetProps &
  Block &
  React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default async function AdSlotBlockServer({
  widgetName,
  blockData,
  pageSlug = null,
  categorySlug = null,
  ...props
}: AdSlotBlockProps) {
  const { onClick, ...restProps } = props
  return (
    <BannerGroupServer
      blockData={blockData}
      widgetName={widgetName}
      pageSlug={pageSlug}
      categorySlug={categorySlug}
      {...restProps}
    />
  )
}
