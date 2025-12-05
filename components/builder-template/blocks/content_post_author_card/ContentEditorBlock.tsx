// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '@/components/builder-canvas/types'
import {
  combineClassNames,
  computedStyles,
} from '@/components/builder-canvas/utils/styleUtils'

type ContentBlockProps = {
  widgetName: string
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_author_card'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ContentEditorBlock = ({
  widgetName,
  blockData,
  ...props
}: ContentBlockProps) => {
  const { content, settings } = blockData

  return (
    <div
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
    >
      محل قرارگیری کارت نویسنده مطلب (مخصوص قالب نمایش مطلب)
    </div>
  )
}
