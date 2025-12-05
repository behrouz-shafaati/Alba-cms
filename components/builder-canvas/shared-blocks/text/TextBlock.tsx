// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block } from '../../types'
import { combineClassNames, computedStyles } from '../../utils/styleUtils'

type TextBlockProps = {
  widgetName: string
  blockData: {
    content: {
      text: string
    }
    type: 'text'
    settings: {
      fontSize?: string
      fontWeight?: string
      textAlign?: 'left' | 'right' | 'center' | 'justify'
      color?: string
      text?: string
    }
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const TextBlock = ({
  widgetName,
  blockData,
  ...props
}: TextBlockProps) => {
  const { content, settings } = blockData

  const tagMap: Record<string, ElementType> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    p: 'p',
    div: 'div',
    span: 'span',
    // هر تگ دیگه‌ای که بخوای اضافه کن
  }

  const Tag: ElementType = tagMap[settings.tag] || 'div'
  return (
    <Tag
      style={{
        fontSize: `${settings.fontSize || '16'}px `,
        fontWeight: settings.fontWeight || 'normal',
        textAlign: settings.textAlign || 'left',
        ...computedStyles(blockData.styles),
      }}
      {...props}
    >
      {content.text || 'متن پیش‌فرض'}
    </Tag>
  )
}
