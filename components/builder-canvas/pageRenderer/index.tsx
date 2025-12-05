'use server'
// رندر کردن بلاک‌ها از روی JSON

import React from 'react'
import { Page } from '@/features/page/interface'
import RendererRows from './RenderRows'
import templateCtrl from '@/features/template/controller'
import { getSettings } from '@/features/settings/controller'
import RendererTemplate from '../templateRender/RenderTemplate.server'

type Props = {
  locale: string
  page: Page
  searchParams?: any
}

export const PageRenderer = async ({
  page,
  locale = 'fa',
  searchParams = {},
}: Props) => {
  const translation: any =
    page?.translations?.find((t: any) => t.lang === locale) ||
    page?.translations[0] ||
    {}
  const { template: templateId } = translation.content

  const [siteSettings] = await Promise.all([getSettings()])

  if (templateId && templateId !== 'none') {
    const [template] = await Promise.all([
      templateCtrl.findById({ id: templateId }),
    ])
    return (
      <RendererTemplate
        template={template}
        pageSlug={page?.slug}
        siteSettings={siteSettings}
        searchParams={searchParams}
        rows={template.content.rows}
        editroMode={false}
        content_all={
          <RendererRows
            rows={translation?.content.rows}
            editroMode={false}
            siteSettings={siteSettings}
            searchParams={searchParams}
          />
        }
      />
    )
  }

  return (
    <>
      <RendererRows
        siteSettings={siteSettings}
        rows={translation?.content.rows}
        editroMode={false}
        searchParams={searchParams}
      />
    </>
  )
}
