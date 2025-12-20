// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../../builder-canvas/types'
import Form from './Form'
import { getForms } from '@/features/form/actions'
import { getSession } from '@/lib/auth/get-session'
import RendererRows from '../../../builder-canvas/pageRenderer/RenderRows'
import { FormTranslationSchema } from '@/features/form/interface'

type FormBlockProps = {
  widgetName: string
  blockData: {
    content: { formId: string }
    type: 'form'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default async function FormBlock({
  widgetName,
  blockData,
  ...props
}: FormBlockProps) {
  const locale = 'fa'
  const { content } = blockData

  const result = await getForms({
    filters: { id: content.formId },
  })

  const form = result.data?.[0] ?? null

  const translation: FormTranslationSchema =
    form?.translations?.find((t: FormTranslationSchema) => t.lang === locale) ||
    form?.translations[0] ||
    {}

  const formContent = (
    <RendererRows rows={form?.content?.rows} editroMode={false} {...props} />
  )

  // فقط داده‌ی ساده به Form پاس بده
  return form ? (
    <Form
      form={form}
      {...props}
      blockData={blockData}
      widgetName={widgetName}
      formContent={formContent}
    />
  ) : null
}
