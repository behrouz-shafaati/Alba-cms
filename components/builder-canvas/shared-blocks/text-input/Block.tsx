// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block as BlockType } from '@/components/builder-canvas/types'
import Text from '@/components/form-fields/text'
import IconRenderer from '@/components/builder-canvas/components/IconRenderer'
import computedStyles from '../../utils/computedStyles'

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
  blockData,
  content,
  locale = 'fa',
  ...props
}: BlockProps) => {
  const { id, settings } = blockData
  const { className, ...restProps } = props

  console.log(settings?.title?.[locale] || settings.title?.fa || '')
  return (
    <Text
      style={{
        ...computedStyles(blockData?.styles),
      }}
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
      required={settings?.required || false}
      className={className}
      readOnly={settings?.readOnly || false}
      defaultValue={settings?.defaultValue?.[locale] || ''}
      {...restProps}
    />
  )
}
