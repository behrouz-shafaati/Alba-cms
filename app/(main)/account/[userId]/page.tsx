import React from 'react'
import userCtrl from '@/features/user/controller'
import { notFound } from 'next/navigation'
import postCtrl from '@/features/post/controller'
import { getSettings } from '@/features/settings/controller'
import templateCtrl from '@/features/template/controller'
import { UserAccount } from '@/features/user/ui/UserAccount'
import { getSession } from '@/lib/auth'
import RendererTemplate from '@/components/builder-canvas/templateRender/RenderTemplate.server'

interface PageProps {
  params: Promise<{ userId: string }>
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}
export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const { userId } = resolvedParams
  const lodginedUser = await getSession()
  const resolvedSearchParams = await searchParams
  const { query = '', page = '1' } = resolvedSearchParams

  let pageBreadCrumb = [
    {
      title: 'تنظیمات',
      link: '/dashboard',
    },
  ]

  const [user] = await Promise.all([userCtrl.findById({ id: userId })])
  if (!user) {
    notFound()
  }

  const [siteSettings, template, postResult] = await Promise.all([
    getSettings(),
    templateCtrl.getTemplate({ slug: 'account' }),
    postCtrl.find({
      filters: { author: user.id },
      pagination: { page: Number(page), perPage: 6 },
    }),
  ])
  if (template) {
    return (
      <>
        <RendererTemplate
          template={template}
          siteSettings={siteSettings}
          editroMode={false}
          content_all={
            <UserAccount user={user} lodginedUser={lodginedUser.user} />
          }
        />
      </>
    )
  }
  return <UserAccount user={user} lodginedUser={lodginedUser.user} />
}
