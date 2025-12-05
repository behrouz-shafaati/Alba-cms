import React from 'react'
import postCtrl from '@/features/post/controller'
import { getSettings } from '@/features/settings/controller'
import templateCtrl from '@/features/template/controller'
import SearchPage from '@/features/post/ui/page/search'
import RendererTemplate from '@/components/builder-canvas/templateRender/RenderTemplate.server'

interface PageProps {
  searchParams: Promise<{
    query?: string
    page?: string
    perPage?: string
  }>
}
export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const { query = '', page = '1', perPage = '6' } = resolvedSearchParams

  let pageBreadCrumb = [
    {
      title: 'تنظیمات',
      link: '/dashboard',
    },
  ]

  const [siteSettings, template, postResult] = await Promise.all([
    getSettings(),
    templateCtrl.getTemplate({ slug: 'search' }),
    postCtrl.find({
      filters: { query },
      pagination: { page: Number(page), perPage: Number(perPage) },
    }),
  ])
  if (template) {
    return (
      <>
        <RendererTemplate
          template={template}
          pageSlug={'search'}
          siteSettings={siteSettings}
          rows={template.content.rows}
          editroMode={false}
          content_all={<SearchPage postResult={postResult} query={query} />}
        />
      </>
    )
  }
  return <SearchPage postResult={postResult} query={query} />
}
