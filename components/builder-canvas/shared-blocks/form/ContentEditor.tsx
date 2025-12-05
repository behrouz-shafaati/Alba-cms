// پنل تنظیمات برای این بلاک
'use client'
import React, { useEffect, useState } from 'react'
import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'
import { getAllForms } from '@/features/form/actions'
import { Option } from '@/types'
import { Form, FormTranslationSchema } from '@/features/form/interface'
import Combobox from '@/components/form-fields/combobox'

type Props = {
  initialData: any
  savePage: () => void
}

export const ContentEditor = ({ initialData, savePage }: Props) => {
  const locale = 'fa'
  const { selectedBlock, update } = useBuilderStore()
  const [formOptions, setFormOptions] = useState<Option[]>([])
  useEffect(() => {
    const fetchData = async () => {
      const [allForms] = await Promise.all([getAllForms()])
      const formOptions: Option[] = allForms.data.map((form: Form) => {
        const translation: FormTranslationSchema =
          form?.translations?.find(
            (t: FormTranslationSchema) => t.lang === locale
          ) ||
          form?.translations[0] ||
          {}
        return {
          value: String(form.id),
          label: form?.title,
        }
      })
      setFormOptions(formOptions)
    }

    fetchData()
  }, [])
  console.log(
    '#selectedBlock?.content?.formIdwsr :',
    selectedBlock?.content?.formId
  )
  return (
    <>
      <Combobox
        key={`form-block-${formOptions.length}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
        title="فرم"
        name="formId"
        defaultValue={selectedBlock?.content?.formId || ''}
        options={formOptions}
        placeholder="انتخاب فرم"
        onChange={(e) =>
          update(selectedBlock?.id as string, 'content', {
            ...selectedBlock?.content,
            formId: e.target.value,
          })
        }
      />
    </>
  )
}
