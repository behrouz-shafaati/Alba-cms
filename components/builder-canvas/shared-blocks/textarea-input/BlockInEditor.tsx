// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block } from '@/components/builder-canvas/types'
import IconRenderer from '@/components/builder-canvas/components/IconRenderer'
import TextArea from '@/components/form-fields/textArea'
import computedStyles from '../../utils/computedStyles'

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
      <TextArea
        title={settings?.title?.[locale] || ''}
        placeholder={settings?.placeholder?.[locale] || ''}
        name={id}
        id={id}
        {...(settings?.icon
          ? {
              icon: <IconRenderer name={settings.icon} className={`w-5 h-5`} />,
            }
          : {})}
        description={settings?.description?.[locale] || ''}
        rows={settings?.rows || 4}
        required={settings?.required || false}
      />
    </div>
  )
}
