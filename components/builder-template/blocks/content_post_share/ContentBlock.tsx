// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '@/components/builder-canvas/types'
import { computedStyles } from '@/components/builder-canvas/utils/styleUtils'
import ShareButtons from '@/components/share/share-buttons'

type ContentBlockProps = {
  content: {
    url: string
    title?: string
  }
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_share'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ContentBlock = ({
  blockData,
  content,
  ...props
}: ContentBlockProps) => {
  const locale = 'fa'
  const { settings } = blockData
  return (
    <div
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
    >
      <ShareButtons url={content?.url || '#'} title={content?.title ?? ''} />
    </div>
  )
}
