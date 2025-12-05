'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useState } from 'react'
import { Block } from '../../../builder-canvas/types'
import { TemplatePart } from './Template'
import { getTemplatePart } from '@/features/template-part/actions'
import EmptyBlock from '@/components/builder-canvas/components/EmptyBlock'

type TemplateBlockEditorProps = {
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

export default function TemplateBlockEditor({
  widgetName,
  blockData,
  pageSlug,
  categorySlug,
  ...props
}: TemplateBlockEditorProps) {
  const [template, setTemplate] = useState({ title: '', content: { rows: [] } })
  const { content } = blockData
  useEffect(() => {
    const fetchData = async () => {
      const [template] = await Promise.all([
        getTemplatePart(content?.templateId),
      ])
      setTemplate(template)
    }

    fetchData()
  }, [content])

  if (!content?.templateId)
    return <EmptyBlock widgetName={widgetName} {...props} />
  return (
    <div {...props} className="p-4 text-center">
      قطعه قالب {template?.title}
    </div>
  )

  //====> چون کامپوننت زیر تمام سروری شده است دیرگ نمیتواتنیم از ان استفاده کنیم
  // return (
  //   <TemplatePart
  //     template={template}
  //     blockData={blockData}
  //     {...props}
  //     editroMode={true}
  //     pageSlug={pageSlug}
  //     categorySlug={categorySlug}
  //   />
  // )
}
