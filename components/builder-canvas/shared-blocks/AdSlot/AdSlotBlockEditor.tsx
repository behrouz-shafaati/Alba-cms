'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useState } from 'react'
import { Block } from '../../types'
import { AdSlotWidgetProps } from './type'

type PostListBlockProps = AdSlotWidgetProps &
  Block &
  React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default function AdSlotBlockEditor({
  widgetName,
  blockData,
  ...props
}: PostListBlockProps) {
  const [campaigns, setCampaigns] = useState([])
  const { content, settings } = blockData

  useEffect(() => {
    const fetchData = async () => {}

    fetchData()
  }, [])
  return (
    <div
      {...props}
      style={{
        display: 'flex',
        flexDirection: settings?.direction || 'row',
        gap: '8px', // اختیاری، فقط برای فاصله بین بنرها
      }}
    >
      {Array.from({ length: settings?.countOfBanners || 1 }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-300 dark:bg-gray-700 rounded"
          style={{
            aspectRatio: settings?.aspect || '4 / 1',
            flex: 1,
          }}
        />
      ))}
    </div>
  )
}
