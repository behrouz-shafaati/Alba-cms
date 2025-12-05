// کامپوننت نمایشی بلاک
'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Block } from '../../../builder-canvas/types'
import Form from './Form'
import EmptyBlock from '../../../builder-canvas/components/EmptyBlock'
import { getForms } from '@/features/form/actions'
import { useSession } from '@/components/context/SessionContext'
import { FormTranslationSchema } from '@/features/form/interface'
import RendererRows from '../../../builder-canvas/pageRenderer/RenderRows'

type FormBlockProps = {
  widgetName: string
  blockData: {
    content: { formId: string }
    type: 'form'
    settings: {}
  } & Block
  locale?: string
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const FormBlockEditor = ({
  locale = 'fa',
  widgetName,
  blockData,
  ...props
}: FormBlockProps) => {
  const { user } = useSession()
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { content } = blockData

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getForms({ filters: { id: content.formId } })
        const forms = result?.data || []
        setForm(forms[0] || null)
      } catch (error) {
        console.error('Error loading form:', error)
        setForm(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [content])

  if (!content?.formId) return <EmptyBlock widgetName={widgetName} {...props} />

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        در حال بارگذاری فرم...
      </div>
    )
  }

  if (!form) {
    return (
      <EmptyBlock
        widgetName={widgetName}
        message="فرم یافت نشد یا حذف شده است"
        {...props}
      />
    )
  }

  const translation: FormTranslationSchema =
    form?.translations?.find((t: FormTranslationSchema) => t.lang === locale) ||
    form?.translations?.[0] ||
    {}

  const formContent = form?.content?.rows ? (
    <RendererRows rows={form?.content?.rows} editroMode={true} {...props} />
  ) : null

  return (
    <Form
      user={user}
      form={form}
      {...props}
      blockData={blockData}
      formContent={formContent}
    />
  )
}
