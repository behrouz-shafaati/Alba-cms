import React from 'react'
import pageCtrl from '@/features/page/controller'
import { SettingsForm } from '@/features/settings/ui/settings-form'
import settingsCtrl from '@/features/settings/controller'
import { BreadCrumb } from '@/components/breadcrumb'
import headerCtrl from '@/features/template/controller'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
  let settings = null,
    allPages,
    allHeaders
  let pageBreadCrumb = [
    {
      title: 'تنظیمات',
      link: '/dashboard',
    },
  ]

  ;[settings, allPages, allHeaders] = await Promise.all([
    settingsCtrl.findOne({ filters: { type: 'site-settings' } }),
    pageCtrl.findAll({}),
    headerCtrl.findAll({}),
  ])

  return (
    <div className="">
      <BreadCrumb items={pageBreadCrumb} />
      <SettingsForm settings={settings} allPages={allPages.data} />
    </div>
  )
}
