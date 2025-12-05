// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block as BlockType } from '@/components/builder-canvas/types'
import SubmitButtonLazy from '@/components/form-fields/submit-buttonLazy'

type BlockProps = {
  content: React.ReactNode
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_title'
    settings: {}
  } & BlockType
  locale: 'fa'
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const Block = ({
  locale = 'fa',
  blockData,
  content,
  ...props
}: BlockProps) => {
  const { id, settings } = blockData
  const { className, ...restProps } = props
  return (
    <SubmitButtonLazy
      className="w-full"
      text={settings?.label?.[locale] || 'ارسال'}
    />
  )
}
