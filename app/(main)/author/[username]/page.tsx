export const dynamic = 'force-dynamic'
import React from 'react'
import userCtrl from '@/features/user/controller'
import { notFound } from 'next/navigation'
import postCtrl from '@/features/post/controller'
import AuthorPage from '@/features/post/ui/page/author'
import { getSettings } from '@/features/settings/controller'
import templateCtrl from '@/features/template/controller'
import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'

interface PageProps {
  params: Promise<{ username: string }>
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}
export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const { username } = resolvedParams
  const resolvedSearchParams = await searchParams
  const { query = '', page = '1' } = resolvedSearchParams

  let pageBreadCrumb = [
    {
      title: 'تنظیمات',
      link: '/dashboard',
    },
  ]

  const [user] = await Promise.all([
    userCtrl.findOne({ filters: { userName: username } }),
  ])
  if (!user) {
    notFound()
  }

  const [siteSettings, template, postResult] = await Promise.all([
    getSettings(),
    templateCtrl.getTemplate({ slug: 'author' }),
    postCtrl.find({
      filters: { author: user.id },
      pagination: { page: Number(page), perPage: 6 },
    }),
  ])
  if (template) {
    return (
      <>
        <RendererRows
          siteSettings={siteSettings}
          rows={template.content.rows}
          editroMode={false}
          content_all={<AuthorPage user={user} postResult={postResult} />}
        />
      </>
    )
  }
  return <AuthorPage user={user} postResult={postResult} />
}
