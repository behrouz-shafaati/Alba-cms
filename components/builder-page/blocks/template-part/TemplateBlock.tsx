// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../../builder-canvas/types'
import { TemplatePart } from './Template'
import { getTemplatePart } from '@/features/template-part/actions'

type Props = {
  widgetName: string
  blockData: {
    id: string
    type: 'templatePart'
    content: {
      templateId: string
    }
    settings: {
      stickyTemplate: boolean
    }
  } & Block
  pageSlug: string | null
  categorySlug: string | null
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default async function TemplateBlock({
  widgetName,
  blockData,
  ...props
}: Props) {
  const { content } = blockData
  const [template] = await Promise.all([getTemplatePart(content?.templateId)])
  return (
    <TemplatePart
      template={template}
      blockData={blockData}
      {...props}
      editroMode={false}
      pageSlug={props.pageSlug}
      categorySlug={props.categorySlug}
    />
  )
}
