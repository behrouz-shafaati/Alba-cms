import React from 'react'
import { BreadCrumb } from '@/components/breadcrumb'
import Form from '@/features/settings/ui/form'

interface PageProps {
  params: { tab: 'general' | 'appearance' | 'email' | 'validation' | 'sms' }
}
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { tab } = resolvedParams

  let pageBreadCrumb = [
    {
      title: 'تنظیمات',
      link: '/dashboard',
    },
  ]

  return (
    <div className="py-8 px-2">
      <BreadCrumb items={pageBreadCrumb} />
      <Form tab={tab} />
    </div>
  )
}
