// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '@/components/builder-canvas/types'
import {
  combineClassNames,
  computedStyles,
} from '@/components/builder-canvas/utils/styleUtils'
import SubmitButton from '@/components/form-fields/submit-button'

type BlockInEditorProps = {
  widgetName: string
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_title'
    settings: {}
  } & Block
  locale: 'fa'
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const BlockInEditor = ({
  locale = 'fa',
  widgetName,
  blockData,
  ...props
}: BlockInEditorProps) => {
  const { id, content, settings } = blockData

  return (
    <div
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
    >
      <SubmitButton
        className="w-full"
        text={settings?.label?.[locale] || 'ارسال'}
      />
    </div>
  )
}
